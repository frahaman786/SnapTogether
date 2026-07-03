import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import './StaticPage.css';

export default function Terms() {
  return (
    <div className="static-page">
      <SEO title="Terms of Service — SnapTogether" description="The terms that govern your use of SnapTogether." />
      <div className="container">
        <p className="section-eyebrow">Legal</p>
        <h1 className="section-title">Terms of Service</h1>
        <div className="static-content">
          <p><em>Last updated: placeholder date — replace with your actual publish date before launch, and have this reviewed by counsel before relying on it.</em></p>

          <h2>Using SnapTogether</h2>
          <p>
            SnapTogether is provided as a free, browser-based photobooth tool. By using it, you
            agree to use it lawfully and to only share session links with people you intend
            to invite into your booth.
          </p>

          <h2>Content you create</h2>
          <p>
            You own the photos you capture using SnapTogether. We don't claim any rights to them,
            and — because they're composed locally in your browser — we never receive a
            copy of them.
          </p>

          <h2>Acceptable use</h2>
          <ul>
            <li>Don't use SnapTogether to capture or share content that is illegal, harassing, or infringes on someone else's rights.</li>
            <li>Don't attempt to interfere with the service, including the peer-connection signaling infrastructure.</li>
            <li>Don't use SnapTogether to impersonate another person without their consent.</li>
          </ul>

          <h2>No warranty</h2>
          <p>
            SnapTogether is provided "as is." Because sessions rely on a direct connection
            between two browsers, connection quality can vary based on each person's
            network. We don't guarantee uninterrupted or error-free service.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of SnapTogether after an
            update means you accept the revised terms.
          </p>
        </div>
      </div>
    </div>
  );
}
