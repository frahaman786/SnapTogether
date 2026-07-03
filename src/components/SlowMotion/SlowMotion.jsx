import React from 'react';
import Card from '../Common/Card/Card';
import './SlowMotion.css';

export default function SlowMotion() {
  return (
    <section className="section slow-motion">
      <div className="container slow-motion-inner">
        <Card className="slow-motion-card">
          <span className="slow-motion-badge">Coming soon</span>
          <h2 className="slow-motion-title">Slow-motion capture</h2>
          <p className="slow-motion-desc">
            We're building a slow-motion mode for SnapTogether: a 3-second burst recorded at a
            higher frame rate and played back smoothly, so confetti tosses, hair flips, and
            laughs get their own highlight reel instead of just a still frame.
          </p>
          <ul className="slow-motion-list">
            <li>Synced burst capture for both people at once</li>
            <li>Export as a looping video or a GIF</li>
            <li>Same filters and frame colors as the photo booth</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
