import React from 'react';
import Button from '../Common/Button/Button';
import { useBooth } from '../../context/BoothContext';
import './ResultScreen.css';

export default function ResultScreen() {
  const { capture } = useBooth();
  const { resultReady, finalCanvasRef, downloadPhoto, retake } = capture;

  // IMPORTANT: this element stays mounted at all times (visibility is toggled
  // purely with CSS via the "show" class). Conditionally mounting/unmounting
  // the <canvas> would make `finalCanvasRef.current` null exactly when the
  // capture pipeline needs to draw into it.
  return (
    <div className={`result-wrap ${resultReady ? 'show' : ''}`}>
      <canvas ref={finalCanvasRef} />
      <div className="result-actions">
        <Button variant="primary" onClick={downloadPhoto}>Download photo</Button>
        <Button onClick={retake}>Retake session</Button>
      </div>
    </div>
  );
}
