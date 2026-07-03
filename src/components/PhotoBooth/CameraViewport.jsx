import React from 'react';
import { useBooth } from '../../context/BoothContext';
import './CameraViewport.css';

export default function CameraViewport() {
  const { videoRef, remoteVideoRef, peer, capture } = useBooth();
  const { hasPartner, role } = peer;
  const { countdownN, flashKey, shotBadge } = capture;

  return (
    <div className={`viewport filt-${capture.filter}`}>
      <div className="vslot me">
        <video ref={videoRef} autoPlay playsInline muted />
        <span className="vslot-label">YOU</span>
      </div>

      {hasPartner && <div className="divider" />}

      {hasPartner ? (
        <div className="vslot">
          <video ref={remoteVideoRef} autoPlay playsInline />
          <span className="vslot-label">THEM</span>
        </div>
      ) : role !== 'solo' ? (
        <div className="vslot waiting">
          <span>💛</span>
          <span>Waiting for partner…</span>
        </div>
      ) : null}

      {countdownN !== null && <div className="countdown">{countdownN}</div>}
      <div key={flashKey} className={`flash ${flashKey ? 'go' : ''}`} />
      {shotBadge && <div className="shot-badge">{shotBadge}</div>}
    </div>
  );
}
