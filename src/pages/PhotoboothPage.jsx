import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import PhotoBooth from '../components/PhotoBooth/PhotoBooth';

export default function PhotoboothPage() {
  return (
    <>
      <SEO
        title="Booth — SnapTogether"
        description="Start a shared or solo photobooth session. Pick a filter, choose a layout, and capture your strip."
      />
      <div className="container" style={{ paddingTop: 32 }}>
        <p className="section-eyebrow">JT Booth</p>
        <h1 className="section-title">Say cheese, together.</h1>
      </div>
      <PhotoBooth />
    </>
  );
}
