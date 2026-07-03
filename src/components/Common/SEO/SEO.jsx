import { useEffect } from 'react';

function setMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Lightweight, dependency-free SEO helper. Sets the page title and the
 * common meta/Open Graph tags on mount. Usable on any page:
 *
 *   <SEO title="About — SnapTogether" description="..." />
 */
export default function SEO({ title, description, image }) {
  useEffect(() => {
    if (title) document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    if (image) setMetaTag('property', 'og:image', image);
  }, [title, description, image]);

  return null;
}
