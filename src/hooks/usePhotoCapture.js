import { useState, useRef, useCallback, useEffect } from 'react';
import { FILTER_CSS } from '../utils/filters';
import {
  sleep, loadImage, drawCover, drawVideoCover, textColorFor,
  drawCaptionFooter, downloadCanvas,
} from '../utils/canvasUtils';
import { DEFAULT_BOOTH_SETTINGS } from '../utils/constants';

/**
 * Owns the booth's creative settings (filter/layout/color/caption) and the
 * entire capture → countdown → composite → download pipeline.
 *
 * @param {Object} params
 * @param {React.MutableRefObject} params.videoRef - local <video>
 * @param {React.MutableRefObject} params.remoteVideoRef - partner <video>
 * @param {boolean} params.hasPartner
 * @param {(msg: any) => void} params.sendMsg - broadcast a message to the partner
 * @param {boolean} params.isGuest - guests mirror settings but can't edit them
 */
export function usePhotoCapture({ videoRef, remoteVideoRef, hasPartner, sendMsg, isGuest }) {
  const [filter, setFilter] = useState(DEFAULT_BOOTH_SETTINGS.filter);
  const [layout, setLayout] = useState(DEFAULT_BOOTH_SETTINGS.layout);
  const [shots, setShots] = useState(DEFAULT_BOOTH_SETTINGS.shots);
  const [frameColor, setFrameColor] = useState(DEFAULT_BOOTH_SETTINGS.frameColor);
  const [caption, setCaption] = useState(DEFAULT_BOOTH_SETTINGS.caption);

  const [statusText, setStatusText] = useState('READY');
  const [shutterDisabled, setShutterDisabled] = useState(true);
  const [countdownN, setCountdownN] = useState(null);
  const [flashKey, setFlashKey] = useState(0);
  const [shotBadge, setShotBadge] = useState(null);
  const [thumbs, setThumbs] = useState(new Array(shots).fill(null));
  const [sessionActive, setSessionActive] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  const finalCanvasRef = useRef(null);
  const capturesRef = useRef(new Array(shots).fill(null));
  const hasPartnerRef = useRef(hasPartner);
  useEffect(() => { hasPartnerRef.current = hasPartner; }, [hasPartner]);

  const settingsRef = useRef({ filter, layout, shots, frameColor, caption });
  useEffect(() => {
    settingsRef.current = { filter, layout, shots, frameColor, caption };
  }, [filter, layout, shots, frameColor, caption]);

  const enableShutter = useCallback(() => setShutterDisabled(false), []);

  const broadcastSettings = useCallback(() => {
    const s = settingsRef.current;
    sendMsg({ type: 'settings', filter: s.filter, layout: s.layout, shots: s.shots, color: s.frameColor, caption: s.caption });
  }, [sendMsg]);

  // Returns true if a <video> element actually has decoded frame data
  // ready to draw. Guards against compositing a black frame if a capture
  // fires in the split-second before the remote stream starts flowing.
  const isVideoReady = (video) => !!video && video.readyState >= 2 && video.videoWidth > 0;

  // ---- capturing a single frame from the live video feed(s) ----
  const captureFrame = useCallback(() => {
    const partner = hasPartnerRef.current;
    const CW = partner ? 800 : 640, CH = 600;
    const canvas = document.createElement('canvas');
    canvas.width = CW; canvas.height = CH;
    const ctx = canvas.getContext('2d');
    ctx.filter = FILTER_CSS[settingsRef.current.filter];

    if (partner) {
      if (isVideoReady(videoRef.current)) {
        drawVideoCover(ctx, videoRef.current, 0, 0, CW / 2, CH, true);
      }
      if (isVideoReady(remoteVideoRef.current)) {
        drawVideoCover(ctx, remoteVideoRef.current, CW / 2, 0, CW / 2, CH, false);
      } else {
        console.warn('[usePhotoCapture] Remote video not ready at capture time — partner half may be blank.');
      }
      ctx.filter = 'none';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(CW / 2 - 1, 0, 2, CH);
    } else if (isVideoReady(videoRef.current)) {
      drawVideoCover(ctx, videoRef.current, 0, 0, CW, CH, true);
    }
    return canvas.toDataURL('image/png');
  }, [videoRef, remoteVideoRef]);

  // ---- compositing the final strip/grid/single image ----
  const composeFinal = useCallback(async () => {
    const shotsToUse = capturesRef.current.filter(Boolean);
    if (shotsToUse.length === 0) return;
    const imgs = await Promise.all(shotsToUse.map(loadImage));
    const s = settingsRef.current;
    const ink = textColorFor(s.frameColor);
    const captionText = (s.caption || 'Me & You').trim();
    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    // The canvas is always mounted (just hidden via CSS) so this ref is
    // guaranteed to exist here, regardless of which "stage" the UI is in.
    const canvas = finalCanvasRef.current;
    if (!canvas) return;
    const pad = 36;
    let width, height;

    if (s.layout === 'strip') {
      const photoW = 640, photoH = 480, gap = 20;
      width = photoW + pad * 2;
      height = pad + (photoH + gap) * imgs.length + 120;
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = s.frameColor; ctx.fillRect(0, 0, width, height);
      imgs.forEach((img, i) => {
        const y = pad + i * (photoH + gap);
        drawCover(ctx, img, pad, y, photoW, photoH);
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
        ctx.strokeRect(pad, y, photoW, photoH);
      });
      drawCaptionFooter(ctx, width, height - 90, ink, captionText, dateStr);
    } else if (s.layout === 'grid') {
      const cell = 480, gap = 20;
      width = cell * 2 + gap + pad * 2;
      height = cell * 2 + gap + pad + 110;
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = s.frameColor; ctx.fillRect(0, 0, width, height);
      const positions = [[0, 0], [1, 0], [0, 1], [1, 1]];
      imgs.forEach((img, i) => {
        const [cx, cy] = positions[i];
        const x = pad + cx * (cell + gap), y = pad + cy * (cell + gap);
        drawCover(ctx, img, x, y, cell, cell);
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cell, cell);
      });
      drawCaptionFooter(ctx, width, height - 80, ink, captionText, dateStr);
    } else {
      const photoW = 900, photoH = 700;
      width = photoW + pad * 2;
      height = photoH + pad + 130;
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = s.frameColor; ctx.fillRect(0, 0, width, height);
      drawCover(ctx, imgs[0], pad, pad, photoW, photoH);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
      ctx.strokeRect(pad, pad, photoW, photoH);
      drawCaptionFooter(ctx, width, height - 95, ink, captionText, dateStr);
    }
    setResultReady(true);
  }, []);

  const resetCaptures = useCallback((count) => {
    capturesRef.current = new Array(count).fill(null);
    setThumbs(new Array(count).fill(null));
  }, []);

  // ---- messages arriving from the partner (guest mirrors host's settings/actions) ----
  const handlePeerMessage = useCallback((msg) => {
    switch (msg.type) {
      case 'settings':
        setFilter(msg.filter);
        setLayout(msg.layout);
        setShots(msg.shots);
        setFrameColor(msg.color);
        setCaption(msg.caption);
        resetCaptures(msg.shots);
        break;
      case 'countdown':
        setShutterDisabled(true);
        setShotBadge(`SHOT ${msg.shot} / ${msg.total}`);
        setCountdownN(msg.n);
        setStatusText('GET READY');
        break;
      case 'capture': {
        setCountdownN(null);
        setFlashKey((k) => k + 1);
        setStatusText('CAPTURED');
        const dataUrl = captureFrame();
        capturesRef.current[msg.shot - 1] = dataUrl;
        setThumbs((prev) => { const next = [...prev]; next[msg.shot - 1] = dataUrl; return next; });
        break;
      }
      case 'session-end':
        setShotBadge(null);
        setStatusText('READY');
        setShutterDisabled(false);
        composeFinal();
        break;
      case 'reset':
        setResultReady(false);
        resetCaptures(settingsRef.current.shots);
        setStatusText('READY');
        break;
      default:
        break;
    }
  }, [captureFrame, composeFinal, resetCaptures]);

  // ---- local control handlers (host/solo only — guests mirror instead) ----
  const pickFilter = useCallback((id) => {
    if (isGuest) return;
    setFilter(id);
    setTimeout(broadcastSettings, 0);
  }, [isGuest, broadcastSettings]);

  const pickLayout = useCallback((layoutOption) => {
    if (isGuest) return;
    setLayout(layoutOption.id);
    setShots(layoutOption.shots);
    resetCaptures(layoutOption.shots);
    setTimeout(broadcastSettings, 0);
  }, [isGuest, broadcastSettings, resetCaptures]);

  const pickColor = useCallback((color) => {
    if (isGuest) return;
    setFrameColor(color);
    setTimeout(broadcastSettings, 0);
  }, [isGuest, broadcastSettings]);

  const updateCaption = useCallback((value) => {
    setCaption(value);
    if (!isGuest) setTimeout(broadcastSettings, 0);
  }, [isGuest, broadcastSettings]);

  // ---- running a full capture session (host or solo triggers; guest just mirrors visuals) ----
  const runSession = useCallback(async () => {
    if (sessionActive) return;
    setSessionActive(true);
    setShutterDisabled(true);
    resetCaptures(settingsRef.current.shots);
    broadcastSettings();
    await sleep(150);

    const total = settingsRef.current.shots;
    for (let shot = 1; shot <= total; shot++) {
      setShotBadge(`SHOT ${shot} / ${total}`);
      for (let n = 3; n >= 1; n--) {
        setCountdownN(n);
        setStatusText('GET READY');
        sendMsg({ type: 'countdown', shot, total, n });
        await sleep(700);
      }
      setCountdownN(null);
      setFlashKey((k) => k + 1);
      setStatusText('CAPTURED');
      sendMsg({ type: 'capture', shot });
      const dataUrl = captureFrame();
      capturesRef.current[shot - 1] = dataUrl;
      setThumbs((prev) => { const next = [...prev]; next[shot - 1] = dataUrl; return next; });
      await sleep(500);
    }
    setShotBadge(null);
    setStatusText('READY');
    setSessionActive(false);
    setShutterDisabled(false);
    sendMsg({ type: 'session-end' });
    await composeFinal();
  }, [sessionActive, resetCaptures, broadcastSettings, sendMsg, captureFrame, composeFinal]);

  const downloadPhoto = useCallback(() => {
    if (!finalCanvasRef.current) return;
    downloadCanvas(finalCanvasRef.current, 'two-up-photobooth.png');
  }, []);

  const retake = useCallback(() => {
    setResultReady(false);
    resetCaptures(settingsRef.current.shots);
    setStatusText('READY');
    sendMsg({ type: 'reset' });
  }, [resetCaptures, sendMsg]);

  return {
    // settings
    filter, layout, shots, frameColor, caption,
    pickFilter, pickLayout, pickColor, updateCaption,
    broadcastSettings,
    // runtime state
    statusText, shutterDisabled, countdownN, flashKey, shotBadge, thumbs,
    sessionActive, resultReady,
    // refs
    finalCanvasRef,
    // actions
    runSession, downloadPhoto, retake, enableShutter,
    handlePeerMessage,
  };
}