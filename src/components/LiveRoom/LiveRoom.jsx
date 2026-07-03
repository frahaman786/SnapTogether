import React from 'react';
import PhotoBooth from '../PhotoBooth/PhotoBooth';
import './LiveRoom.css';

const STEPS = [
  { n: '01', title: 'Create a session', desc: 'Tap "Create shared session" and SnapTogether generates a private room link just for the two of you.' },
  { n: '02', title: 'Send the link', desc: 'Text, message, or email the link to your partner. No account or app install required on their end.' },
  { n: '03', title: 'Say cheese, together', desc: 'Once they open it, you both appear live side-by-side. Pick a filter, hit the shutter, and capture your strip.' },
];

export default function LiveRoom() {
  return (
    <div>
      <section className="section live-room-intro">
        <div className="container">
          <p className="section-eyebrow">Live Room</p>
          <h1 className="section-title">One room, two people, anywhere</h1>
          <p className="section-subtitle">
            The Live Room is a private, peer-to-peer video session built just for taking
            photos together. Here's how it works.
          </p>
          <div className="live-room-steps">
            {STEPS.map((s) => (
              <div key={s.n} className="live-room-step">
                <span className="live-room-step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PhotoBooth />
    </div>
  );
}
