import React from 'react';
import './Button.css';

/**
 * Shared button used across the marketing site and the booth UI.
 * variant: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({ variant = 'secondary', wide = false, className = '', children, ...rest }) {
  const classes = ['btn', `btn-${variant}`, wide ? 'btn-wide' : '', className].filter(Boolean).join(' ');
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
