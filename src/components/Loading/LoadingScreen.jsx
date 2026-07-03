import React from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p className="loading-label">{label}</p>
    </div>
  );
}
