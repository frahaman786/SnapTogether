import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import LiveRoom from '../components/LiveRoom/LiveRoom';

export default function LiveRoomPage() {
  return (
    <>
      <SEO
        title="Live Room — SnapTogether"
        description="See how SnapTogether's shared, peer-to-peer photobooth room works, then start a session."
      />
      <LiveRoom />
    </>
  );
}
