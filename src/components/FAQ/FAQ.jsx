import React, { useState } from 'react';
import './FAQ.css';

const FAQ_ITEMS = [
  {
    q: 'Do both people need to install anything?',
    a: 'No. SnapTogether runs entirely in the browser. Whoever creates a session gets a link — the other person just opens it and allows camera access.',
  },
  {
    q: 'Is my video recorded or stored anywhere?',
    a: 'No. Video is streamed peer-to-peer directly between the two browsers using WebRTC. Only the final photo strip you choose to download is ever saved, and that happens locally on your own device.',
  },
  {
    q: 'What if my partner and I are on different networks or countries?',
    a: 'That\'s exactly what SnapTogether is built for. As long as both people have a working camera and an internet connection, the session will connect regardless of location.',
  },
  {
    q: 'Can I use SnapTogether alone?',
    a: 'Yes — choose "Use solo mode" on the start screen to use the booth by yourself, with all the same filters and layouts.',
  },
  {
    q: 'What image formats can I download?',
    a: 'Finished strips download as a high-resolution PNG, ready to share on social media or print at home.',
  },
  {
    q: 'Is there a limit to how many photos I can take?',
    a: 'No limit. Retake as many sessions as you like — nothing is capped or paywalled.',
  },
];

export default function FAQ({ limit }) {
  const [openIndex, setOpenIndex] = useState(0);
  const items = limit ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;

  return (
    <section className="section faq">
      <div className="container">
        <p className="section-eyebrow">Questions</p>
        <h2 className="section-title">Frequently asked questions</h2>
        <div className="faq-list">
          {items.map((item, i) => (
            <div key={item.q} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                aria-expanded={openIndex === i}
              >
                {item.q}
                <span className="faq-icon">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <p className="faq-answer">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
