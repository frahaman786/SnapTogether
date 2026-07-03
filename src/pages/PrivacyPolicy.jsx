import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import './StaticPage.css';

export default function PrivacyPolicy() {
  return (
    <div className="static-page">
      <SEO title="Privacy Policy — SnapTogether" description="How SnapTogether handles your camera, video, and personal data." />
      <div className="container">
        <p className="section-eyebrow">Legal</p>
        <h1 className="section-title">Privacy Policy</h1>
        <div className="static-content">
          <p><em>Last updated: placeholder date — replace with your actual publish date before launch, and have this reviewed by counsel before relying on it.</em></p>

          <h2>What we collect</h2>
          <p>
            SnapTogether requests access to your device's camera to display your live video feed
            in the booth. When you use a shared session, your video stream is sent directly
            to your partner's browser using a peer-to-peer connection (WebRTC) — it does not
            pass through or get stored on our servers.
          </p>

          <h2>Photos you capture</h2>
          <p>
            Finished photo strips are composed locally in your browser. When you tap
            "Download photo," the image is saved directly to your device. We do not
            receive, store, or have access to your captured photos.
          </p>

          <h2>Session links</h2>
          <p>
            Shared session links include a randomly generated room code used solely to
            connect two browsers together. These codes are not tied to any account and
            expire once the session ends.
          </p>

          <h2>Contact form data</h2>
          <p>
            If you reach out through our contact form, we use your name, email, and message
            only to respond to your inquiry.
          </p>

          <h2>Third-party services</h2>
          <p>
            We use a peer-connection signaling service to help two browsers find each other
            before establishing a direct connection. This service can see that a connection
            request occurred, but not the contents of your video stream.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>You can deny or revoke camera permission at any time through your browser settings.</li>
            <li>You can end a session at any time by closing the tab.</li>
            <li>You can contact us to request removal of any data you've submitted via the contact form.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
