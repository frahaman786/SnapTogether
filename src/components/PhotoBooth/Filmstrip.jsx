import React from 'react';
import { useBooth } from '../../context/BoothContext';
import './Filmstrip.css';

export default function Filmstrip() {
  const { capture } = useBooth();
  const { thumbs, shutterDisabled, runSession } = capture;

  return (
    <>
      <div className="shutter-row">
        <button className="shutter" disabled={shutterDisabled} onClick={runSession} title="Start session">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>
        </button>
      </div>
      <div className="filmstrip">
        {thumbs.map((thumb, i) =>
          thumb ? (
            <img key={i} src={thumb} className="frame-thumb" alt={`shot ${i + 1}`} />
          ) : (
            <div key={i} className="frame-slot" />
          )
        )}
      </div>
    </>
  );
}
