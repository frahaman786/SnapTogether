import { useRef, useCallback, useEffect } from 'react';

/**
 * Manages the local camera stream lifecycle.
 * Returns refs to attach to the local <video> element plus start/stop controls.
 */
export function useMediaStream() {
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);

  const getCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false,
    });
    localStreamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      // Some mobile browsers need an explicit play() call even for the
      // local preview, especially if getCamera() resolves after the
      // component has already rendered.
      videoRef.current.play().catch((err) => {
        console.error('[useMediaStream] local video.play() failed:', err);
      });
    }
    return stream;
  }, []);

  const stopCamera = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  return { videoRef, localStreamRef, getCamera, stopCamera };
}