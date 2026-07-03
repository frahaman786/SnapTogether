import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import Templates from '../components/Templates/Templates';
import SlowMotion from '../components/SlowMotion/SlowMotion';
import Testimonials from '../components/Testimonials/Testimonials';
import FAQ from '../components/FAQ/FAQ';

export default function Home() {
  return (
    <>
      <SEO
        title="SnapTogether — Share a Photobooth With Anyone, Anywhere"
        description="A live, shared photobooth. Send a link, jump into the same booth as your partner from anywhere, and capture your strip together in real time."
      />
      <Hero />
      <Features />
      <Templates />
      <SlowMotion />
      <Testimonials />
      <FAQ limit={4} />
    </>
  );
}
