// CSS filter values applied to the live video preview and to captured frames.
export const FILTER_CSS = {
  none: 'none',
  bw: 'grayscale(1) contrast(1.12)',
  sepia: 'sepia(0.8) contrast(1.05) brightness(1.05)',
  vintage: 'sepia(0.35) contrast(0.92) brightness(1.06) saturate(1.35)',
  vivid: 'saturate(1.6) contrast(1.15)',
  cool: 'saturate(1.15) hue-rotate(-12deg) brightness(1.04) contrast(1.05)',
  noir: 'grayscale(1) contrast(1.45) brightness(0.88)',
  blush: 'sepia(0.18) saturate(1.35) hue-rotate(-6deg) brightness(1.08) contrast(1.03)',
};

// Display metadata for the filter picker UI.
export const FILTERS = [
  { id: 'none', label: 'None' },
  { id: 'bw', label: 'B&W' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'vivid', label: 'Vivid' },
  { id: 'cool', label: 'Cool' },
  { id: 'noir', label: 'Noir' },
  { id: 'blush', label: 'Blush' },
];
