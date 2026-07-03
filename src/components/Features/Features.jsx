import React from 'react';
import Card from '../Common/Card/Card';
import './Features.css';

const FEATURES = [
  {
    icon: '🎞️',
    title: 'Live shared sessions',
    description: 'Create a link, send it to anyone, and appear side-by-side in the same booth in real time — no matter where they are.',
  },
  {
    icon: '🎨',
    title: '8 curated filters',
    description: 'From clean black & white and warm Sepia to punchy Vivid and soft Blush — dial in a look before you shoot.',
  },
  {
    icon: '🖼️',
    title: 'Strip, grid, or single',
    description: 'Choose a classic four-shot strip, a 2×2 grid, or one clean single frame — plus four frame colors and a custom caption.',
  },
  {
    icon: '⚡',
    title: 'Countdown & auto-capture',
    description: 'A synced 3-2-1 countdown fires for both people at once, so nobody misses a shot or looks away too soon.',
  },
  {
    icon: '⬇️',
    title: 'Instant download',
    description: 'Your finished strip renders right in the browser and downloads as a PNG — ready to share or print.',
  },
  {
    icon: '🔒',
    title: 'No accounts, no uploads',
    description: 'Video stays peer-to-peer between the two of you. Nothing is stored on a server.',
  },
];

export default function Features() {
  return (
    <section className="section features">
      <div className="container">
        <p className="section-eyebrow">Why SnapTogether</p>
        <h2 className="section-title">Everything you need for a shared moment</h2>
        <p className="section-subtitle">
          Built for long-distance friends, couples, and families who want the feel of a
          real photobooth without being in the same room.
        </p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <Card key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-description">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
