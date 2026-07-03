import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/Common/SEO/SEO';
import Button from '../components/Common/Button/Button';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found">
      <SEO title="Page Not Found — SnapTogether" description="The page you're looking for doesn't exist." />
      <span className="not-found-code">404</span>
      <h1>This frame's empty.</h1>
      <p>The page you're looking for doesn't exist — maybe it retook the session.</p>
      <Link to="/">
        <Button variant="primary">Back to SnapTogether</Button>
      </Link>
    </div>
  );
}
