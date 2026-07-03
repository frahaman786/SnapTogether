import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import './StaticPage.css';

export default function About() {
  return (
    <div className="static-page">
      <SEO
        title="About — SnapTogether"
        description="SnapTogether was built to close the distance between people who can't be in the same room for a photo."
      />
      <div className="container">
        <p className="section-eyebrow">About</p>
        <h1 className="section-title">A photobooth for people who aren't in the same room</h1>
        <div className="static-content">
          <p>
            SnapTogether started from a simple frustration: photobooths are one of the best parts
            of a night out, a wedding, or a family gathering — but they only work if
            everyone is standing in the same spot. Long-distance couples, family split
            across cities, and friends scattered across time zones never got to have that
            moment.
          </p>
          <p>
            We built SnapTogether to fix that. It's a lightweight, browser-based photobooth that
            connects two cameras directly, peer-to-peer, so two people can share the same
            frame no matter where they actually are. No app to install, no account to
            create, and no video ever touches a server in between.
          </p>
          <p>
            Today, SnapTogether is used for long-distance date nights, virtual showers and
            birthdays, weekly family calls, and just about any moment worth freezing
            together. We're a small team that believes the best products get out of the
            way and let the moment speak for itself.
          </p>
        </div>
      </div>
    </div>
  );
}
