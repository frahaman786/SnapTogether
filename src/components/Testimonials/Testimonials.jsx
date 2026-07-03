import React from 'react';
import Card from '../Common/Card/Card';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    quote: "My partner and I are in different time zones and this is the closest thing we've found to a real date-night photobooth. We keep every strip in a shared album.",
    name: 'Maya R.',
    role: 'Long-distance relationship',
  },
  {
    quote: "We used SnapTogether for a virtual bridal shower and it was the highlight of the call. Everyone loved picking a filter and hamming it up for the countdown.",
    name: 'Priya K.',
    role: 'Event host',
  },
  {
    quote: "Simple, fast, and it just works — no downloads, no sign-up. My grandkids and I do a strip every Sunday after our video call.",
    name: 'Daniel T.',
    role: 'Weekly family call',
  },
];

export default function Testimonials() {
  return (
    <section className="section testimonials">
      <div className="container">
        <p className="section-eyebrow">Loved by long-distance everyone</p>
        <h2 className="section-title">A few words from people who've used it</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="testimonial-card">
              <p className="testimonial-quote">“{t.quote}”</p>
              <div className="testimonial-author">
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
