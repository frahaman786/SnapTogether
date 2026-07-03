import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import './Contact.css';

// Paste the src URL from your Google Form's embed snippet (Send → <> Embed HTML) here.
const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeoBLBdfyhR4RuPZRSyPUQyMpyq7TpdmPXarwDFJaPjz6HAmQ/viewform?embedded=true';

export default function Contact() {
  return (
    <div className="static-page">
      <SEO
        title="Contact — SnapTogether"
        description="Get in touch with the SnapTogether team — questions, feedback, and partnership inquiries welcome."
      />
      <div className="container contact-container">
        <p className="section-eyebrow">Contact</p>
        <h1 className="section-title">We'd love to hear from you</h1>
        <p className="section-subtitle">
          Questions, bug reports, or ideas for a feature — send us a note and we'll get
          back to you.
        </p>

        <div className="contact-form-embed">
          <iframe
            src={GOOGLE_FORM_EMBED_URL}
            title="SnapTogether contact form"
            width="100%"
            height="820"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
}