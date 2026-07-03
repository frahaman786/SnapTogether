import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button/Button';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <span className="hero-eyebrow">Snap Together🤩</span>
        <h1 className="hero-title">
          Say cheese, <span>together.</span>
        </h1>
        <p className="hero-subtitle">
          SnapTogether is a live, shared photobooth. Send a link, your partner jumps in from
          wherever they are, and you both capture the same photo strip in real time —
          no app to install, no account required.
        </p>
        <div className="hero-actions">
          <Link to="/booth">
            <Button variant="primary">Start a shared session</Button>
          </Link>
          <Link to="/live-room">
            <Button variant="secondary">See how it works</Button>
          </Link>
        </div>
        <div className="hero-meta">
          <span>📸 Instant filters</span>
          <span>🔗 One-tap link sharing</span>
          <span>⬇️ Free to download</span>
        </div>
      </div>
    </section>
  );
}
