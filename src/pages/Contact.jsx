import React, { useState } from 'react';
import SEO from '../components/Common/SEO/SEO';
import Button from '../components/Common/Button/Button';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit — wire this up to a real endpoint or service later.
    setSubmitted(true);
  };

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

        {submitted ? (
          <div className="contact-success">
            Thanks, {form.name || 'friend'} — your message has been queued. We'll reply at {form.email}.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Message
              <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
            </label>
            <Button type="submit" variant="primary" wide>Send message</Button>
          </form>
        )}
      </div>
    </div>
  );
}
