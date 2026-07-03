import React from 'react';
import SEO from '../components/Common/SEO/SEO';
import FAQ from '../components/FAQ/FAQ';

export default function FAQPage() {
  return (
    <>
      <SEO
        title="FAQ — SnapTogether"
        description="Answers to common questions about how SnapTogether's shared photobooth works, privacy, and downloads."
      />
      <FAQ />
    </>
  );
}
