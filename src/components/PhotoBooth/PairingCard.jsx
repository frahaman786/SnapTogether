import React from 'react';
import Button from '../Common/Button/Button';
import { useBooth } from '../../context/BoothContext';
import './PairingCard.css';

export default function PairingCard() {
  const { stage, createSession, goSolo, cancelWait, peer, copyLabel, copyLink } = useBooth();

  if (stage === 'booth' || stage === 'result') return null;

  return (
    <div className="pair-card">
      {stage === 'hostChoice' && (
        <div>
          <h2>Start a session</h2>
          <p>Create a link, send it to your partner, and you'll both appear live in the same photobooth.</p>
          <Button variant="primary" wide onClick={createSession}>Create shared session</Button>
          <div className="or-divider">or</div>
          <Button wide onClick={goSolo}>Use solo mode instead</Button>
        </div>
      )}

      {stage === 'hostWaiting' && (
        <div>
          <h2>Send this to your partner</h2>
          <div className="link-box">
            <input type="text" readOnly value={peer.shareLink} />
            <button className="copy-btn" onClick={copyLink}>{copyLabel}</button>
          </div>
          <div className="status-line">
            <span className={`status-dot ${peer.statusGood ? 'good' : 'pulse'}`} />
            <span>{peer.statusMsg}</span>
          </div>
          <Button wide onClick={cancelWait}>Cancel</Button>
        </div>
      )}

      {stage === 'guestJoining' && (
        <div>
          <h2>Joining your photobooth…</h2>
          <div className="status-line">
            <span className="status-dot pulse" />
            <span>{peer.joinStatusMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
