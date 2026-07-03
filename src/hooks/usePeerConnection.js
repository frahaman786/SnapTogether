import { useState, useRef, useCallback, useEffect } from 'react';
import { Peer } from 'peerjs';
import { roomIdFromCode, generateRoomCode, buildShareLink, clearRoomFromUrl } from '../services/peerService';

const hasTurnCreds = !!(import.meta.env.VITE_TURN_USERNAME && import.meta.env.VITE_TURN_CREDENTIAL);

if (!hasTurnCreds) {
  console.warn('[usePeerConnection] TURN credentials missing — falling back to STUN-only. Cross-network (e.g. laptop <-> mobile data) calls may fail one-way or entirely.');
}

const ICE_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.relay.metered.ca:80' },
    ...(hasTurnCreds ? [
      {
        urls: 'turn:global.relay.metered.ca:80',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
      {
        urls: 'turn:global.relay.metered.ca:80?transport=tcp',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
      {
        urls: 'turn:global.relay.metered.ca:443',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
      {
        urls: 'turns:global.relay.metered.ca:443?transport=tcp',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
    ] : []),
  ],
};

const RETRY_DELAYS = [1000, 2000, 4000]; // ms, exponential backoff
const STREAM_WAIT_INTERVAL = 100; // ms
const STREAM_WAIT_TIMEOUT = 4000; // ms

/**
 * Waits for a MutableRefObject to become non-null, polling at a fixed
 * interval. Used to guard against a call/answer racing ahead of the local
 * camera stream still initializing (getUserMedia is async).
 */
function waitForStream(streamRef, timeout = STREAM_WAIT_TIMEOUT) {
  return new Promise((resolve) => {
    if (streamRef.current) {
      resolve(streamRef.current);
      return;
    }
    let waited = 0;
    const interval = setInterval(() => {
      waited += STREAM_WAIT_INTERVAL;
      if (streamRef.current || waited >= timeout) {
        clearInterval(interval);
        resolve(streamRef.current); // may still be null if it timed out
      }
    }, STREAM_WAIT_INTERVAL);
  });
}

/**
 * Handles the "two people, one booth" pairing flow over PeerJS:
 * creating a session, joining one via a room code, and exchanging
 * data-channel messages with the partner.
 *
 * @param {Object} params
 * @param {React.MutableRefObject} params.localStreamRef - local camera stream ref
 * @param {React.MutableRefObject} params.remoteVideoRef - <video> element for the partner feed
 * @param {(msg: any) => void} params.onData - called whenever a data message arrives from the partner
 */
export function usePeerConnection({ localStreamRef, remoteVideoRef, onData }) {
  const [role, setRole] = useState('solo'); // 'host' | 'guest' | 'solo'
  const [hasPartner, setHasPartner] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [statusMsg, setStatusMsg] = useState('Waiting for them to open the link…');
  const [statusGood, setStatusGood] = useState(false);
  const [joinStatusMsg, setJoinStatusMsg] = useState('Connecting to your partner');

  const peerRef = useRef(null);
  const dataConnRef = useRef(null);
  const onDataRef = useRef(onData);
  useEffect(() => { onDataRef.current = onData; }, [onData]);

  // Keep last-used join args so we can retry a call after a reconnect.
  const joinArgsRef = useRef(null); // { code, onReady }
  const roomCodeRef = useRef(null); // host's own code, for logging/debugging
  const hasPartnerRef = useRef(hasPartner);
  useEffect(() => { hasPartnerRef.current = hasPartner; }, [hasPartner]);

  // Holds the raw MediaStream once it arrives, so the effect below can
  // attach it to the <video> element only once that element is guaranteed
  // to exist in the DOM (see the CameraViewport component, which mounts
  // the remote <video> conditionally on `hasPartner`).
  const remoteStreamRef = useRef(null);

  const sendMsg = useCallback((msg) => {
    const conn = dataConnRef.current;
    if (conn && conn.open) conn.send(msg);
  }, []);

  const attachDataHandlers = useCallback((conn) => {
    dataConnRef.current = conn;
    conn.on('data', (msg) => onDataRef.current && onDataRef.current(msg));
    conn.on('close', () => setHasPartner(false));
  }, []);

  const setPartnerConnected = useCallback((remoteStream) => {
    remoteStreamRef.current = remoteStream;
    setHasPartner(true);
  }, []);

  // Attaches the remote stream to the <video> element once React has
  // actually committed it to the DOM. Doing this in an effect (instead of
  // requestAnimationFrame right after setHasPartner) removes a race
  // condition where the element wasn't mounted yet — the previous
  // implementation silently failed on slower/mobile devices, leaving the
  // remote video permanently black even though the stream had arrived.
  useEffect(() => {
    if (hasPartner && remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
      remoteVideoRef.current.play().catch((err) => {
        console.error('[usePeerConnection] remote video.play() failed:', err);
      });
    }
  }, [hasPartner, remoteVideoRef]);

  // --- Generic reconnect wiring, shared by host + guest -------------------
  const attachResilienceHandlers = useCallback((peer, { isGuest } = {}) => {
    peer.on('disconnected', () => {
      // Signaling socket dropped (common on mobile tab backgrounding).
      // The peer object itself is still alive — reconnect the same ID.
      if (!peer.destroyed) {
        try {
          peer.reconnect();
        } catch (e) {
          // ignore — will retry again on next 'disconnected' or visibilitychange
        }
      }
      if (isGuest) {
        setJoinStatusMsg('Connection lost, reconnecting…');
      } else {
        setStatusMsg('Connection lost, reconnecting…');
        setStatusGood(false);
      }
    });

    peer.on('close', () => {
      setHasPartner(false);
    });
  }, []);

  // --- Guest call with retry/backoff --------------------------------------
  const attemptCall = useCallback(async (peer, hostId, onReady) => {
    const stream = await waitForStream(localStreamRef);
    if (!stream) {
      throw new Error('local-stream-unavailable');
    }

    return new Promise((resolve, reject) => {
      const call = peer.call(hostId, stream);
      if (!call) {
        reject(new Error('call-failed-to-init'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('timeout'));
      }, 6000);

      call.on('stream', (remoteStream) => {
        clearTimeout(timeout);
        setPartnerConnected(remoteStream);
        setJoinStatusMsg('Connected!');
        onReady && onReady();
        resolve(call);
      });

      call.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      call.on('close', () => {
        setHasPartner(false);
      });
    });
  }, [localStreamRef, setPartnerConnected]);

  const retryJoinCall = useCallback(async () => {
    if (!joinArgsRef.current || !peerRef.current || hasPartnerRef.current) return;
    const { code, onReady } = joinArgsRef.current;
    const hostId = roomIdFromCode(code);

    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        await attemptCall(peerRef.current, hostId, onReady);
        return; // success
      } catch (err) {
        if (attempt === RETRY_DELAYS.length) {
          setJoinStatusMsg('Could not connect (' + (err.type || err.message) + '). Ask your partner to resend the link.');
          return;
        }
        setJoinStatusMsg(`Retrying connection… (${attempt + 1}/${RETRY_DELAYS.length})`);
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
      }
    }
  }, [attemptCall]);

  // Visibility change: proactively reconnect signaling + retry a stalled join.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      const peer = peerRef.current;
      if (!peer || peer.destroyed) return;

      if (peer.disconnected) {
        peer.reconnect();
      }

      if (role === 'guest' && !hasPartnerRef.current && joinArgsRef.current) {
        retryJoinCall();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [role, retryJoinCall]);

  const createSession = useCallback(async ({ onReady } = {}) => {
    setRole('host');
    const code = generateRoomCode();
    roomCodeRef.current = code;
    const peer = new Peer(roomIdFromCode(code), { config: ICE_CONFIG });
    peerRef.current = peer;

    peer.on('open', () => setShareLink(buildShareLink(code)));

    peer.on('call', async (call) => {
      // Guard: the guest's call can arrive before our own getUserMedia()
      // has resolved. Answering with a null stream means the guest never
      // receives our video track — wait briefly instead.
      const stream = await waitForStream(localStreamRef);
      if (!stream) {
        console.error('[usePeerConnection] Host answering with no local stream — camera never became available.');
      }

      call.answer(stream);
      call.on('stream', (remoteStream) => {
        setPartnerConnected(remoteStream);
        setStatusMsg('Connected!');
        setStatusGood(true);
        onReady && onReady();
      });
      call.on('close', () => setHasPartner(false));
    });

    peer.on('connection', (conn) => attachDataHandlers(conn));
    peer.on('error', (err) => {
      // 'unavailable-id' etc. are fatal; transient network errors are
      // handled separately by the 'disconnected' handler below.
      setStatusMsg('Connection error: ' + err.type);
      setStatusGood(false);
    });

    attachResilienceHandlers(peer, { isGuest: false });
  }, [localStreamRef, setPartnerConnected, attachDataHandlers, attachResilienceHandlers]);

  const joinSession = useCallback(async (code, { onReady } = {}) => {
    setRole('guest');
    joinArgsRef.current = { code, onReady };
    const peer = new Peer(undefined, { config: ICE_CONFIG });
    peerRef.current = peer;

    peer.on('open', () => {
      setJoinStatusMsg('Connecting to your partner…');
      const hostId = roomIdFromCode(code);

      attemptCall(peer, hostId, onReady).catch(() => {
        // First attempt failed (host may not have registered yet, or
        // host's tab is mid-reconnect) — fall back to retry loop.
        retryJoinCall();
      });

      const conn = peer.connect(hostId);
      conn.on('open', () => attachDataHandlers(conn));
    });

    peer.on('error', (err) => {
      if (err.type === 'peer-unavailable') {
        // Host might still be registering, or just reconnected — retry
        // instead of giving up immediately.
        retryJoinCall();
      } else {
        setJoinStatusMsg('Could not connect (' + err.type + '). Ask your partner to resend the link.');
      }
    });

    attachResilienceHandlers(peer, { isGuest: true });
  }, [attachDataHandlers, attachResilienceHandlers, attemptCall, retryJoinCall]);

  const cancelSession = useCallback(() => {
    if (peerRef.current) peerRef.current.destroy();
    joinArgsRef.current = null;
    remoteStreamRef.current = null;
    clearRoomFromUrl();
    setRole('solo');
  }, []);

  useEffect(() => () => {
    if (peerRef.current) peerRef.current.destroy();
  }, []);

  return {
    role, setRole,
    hasPartner,
    shareLink,
    statusMsg, statusGood,
    joinStatusMsg,
    sendMsg,
    createSession,
    joinSession,
    cancelSession,
  };
}
