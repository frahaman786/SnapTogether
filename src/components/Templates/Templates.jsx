import React from 'react';
import Card from '../Common/Card/Card';
import './Templates.css';

const TEMPLATES = [
  { id: 'strip', name: 'Classic Strip', desc: 'Four vertical frames on a cream border — the timeless photobooth look.', color: '#fff8ef' },
  { id: 'grid', name: 'Grid Two-by-Two', desc: 'A 2×2 square layout, great for framing and printing at 4×4.', color: '#e8b84b' },
  { id: 'single', name: 'Single Frame', desc: 'One large hero shot with your caption underneath — perfect for a profile photo.', color: '#d8546e' },
  { id: 'noir', name: 'Noir Strip', desc: 'The classic strip layout paired with the high-contrast Noir filter.', color: '#241726' },
];

export default function Templates() {
  return (
    <section className="section templates">
      <div className="container">
        <p className="section-eyebrow">Layouts</p>
        <h2 className="section-title">Pick a template, make it yours</h2>
        <p className="section-subtitle">
          Every layout supports all 8 filters, 4 frame colors, and a custom caption —
          mix and match to find your look.
        </p>
        <div className="templates-grid">
          {TEMPLATES.map((t) => (
            <Card key={t.id} className="template-card">
              <div className="template-swatch" style={{ background: t.color }} />
              <h3 className="template-name">{t.name}</h3>
              <p className="template-desc">{t.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
