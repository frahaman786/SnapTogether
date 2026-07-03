import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useMediaStream } from '../hooks/useMediaStream';
import { usePeerConnection } from '../hooks/usePeerConnection';
import { usePhotoCapture } from '../hooks/usePhotoCapture';

const BoothContext = createContext(null);

/**
 * Wraps the whole PhotoBooth feature. Combines three hooks
 * (camera, peer connection, capture pipeline) into one context so
 * child components (PairingCard, CameraViewport, ControlPanel, etc.)
 * don't need long prop chains.
 *
 * Note on wiring order: `usePeerConnection` needs a message handler before
 * `usePhotoCapture` (which produces that handler) can be created, because
 * the capture hook itself depends on peer state (hasPartner/sendMsg/role).
 * A ref breaks that circular dependency without re-instantiating hooks.
 */
export function BoothProvider({ children }) {
  const [stage, setStage] = useState('hostChoice'); // hostChoice | hostWaiting | guestJoining | booth
  const [copyLabel, setCopyLabel] = useState('Copy');

  const remoteVideoRef = useRef(null);
  const { videoRef, localStreamRef, getCamera } = useMediaStream();

  const handlePeerMessageRef = useRef(() => {});
  const handleIncomingData = useCallback((msg) => handlePeerMessageRef.current(msg), []);

  const peer = usePeerConnection({ localStreamRef, remoteVideoRef, onData: handleIncomingData });

  const isGuest = peer.role === 'guest';
  const capture = usePhotoCapture({
    videoRef,
    remoteVideoRef,
    hasPartner: peer.hasPartner,
    sendMsg: peer.sendMsg,
    isGuest,
  });

  useEffect(() => {
    handlePeerMessageRef.current = capture.handlePeerMessage;
  }, [capture.handlePeerMessage]);

  const showBooth = useCallback(() => {
    setStage('booth');
    capture.enableShutter();
  }, [capture]);

  const createSession = useCallback(async () => {
    try { await getCamera(); } catch (e) { alert('Camera access is needed to start a session.'); return; }
    setStage('hostWaiting');
    await peer.createSession({
      onReady: () => setTimeout(() => { showBooth(); capture.broadcastSettings(); }, 700),
    });
  }, [getCamera, peer, showBooth, capture]);

  const joinSession = useCallback(async (code) => {
    setStage('guestJoining');
    try { await getCamera(); } catch (e) { return; }
    await peer.joinSession(code, { onReady: () => setTimeout(showBooth, 500) });
  }, [getCamera, peer, showBooth]);

  const goSolo = useCallback(async () => {
    try { await getCamera(); } catch (e) { alert('Camera access is needed.'); return; }
    showBooth();
  }, [getCamera, showBooth]);

  const cancelWait = useCallback(() => {
    peer.cancelSession();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    setStage('hostChoice');
  }, [peer, localStreamRef]);

  const copyLink = useCallback(() => {
    navigator.clipboard?.writeText(peer.shareLink);
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy'), 1500);
  }, [peer.shareLink]);

  // Auto-join if the URL has a ?room= code (partner clicked a shared link).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get('room');
    if (roomCode) joinSession(roomCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    stage,
    videoRef, remoteVideoRef,
    copyLabel, copyLink,
    createSession, joinSession, goSolo, cancelWait,
    peer,
    capture,
    isGuest,
  };

  return <BoothContext.Provider value={value}>{children}</BoothContext.Provider>;
}

export function useBooth() {
  const ctx = useContext(BoothContext);
  if (!ctx) throw new Error('useBooth must be used inside a <BoothProvider>');
  return ctx;
}
