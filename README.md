# SnapTogether

A live, shared photobooth built with React + Vite. Send a link, jump into the
same booth as a partner from anywhere via WebRTC (PeerJS), apply a filter, and
capture a photo strip together.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

> Camera access requires a secure context — `localhost` works for local dev.
> To test a real two-person session, deploy somewhere with HTTPS and open the
> shared link on a second device.

## Project structure

```
src/
├── assets/            Images, icons, fonts
├── components/        One folder per component, each with its own CSS
│   ├── Navbar/
│   ├── Hero/
│   ├── Features/
│   ├── Footer/
│   ├── PhotoBooth/    Core feature: pairing, camera, controls, capture, result
│   ├── LiveRoom/       Explainer + embeds PhotoBooth
│   ├── SlowMotion/     "Coming soon" feature teaser
│   ├── Templates/      Layout/frame showcase
│   ├── FAQ/
│   ├── Testimonials/
│   ├── Loading/
│   └── Common/         Button, Card, Modal, SEO — shared across the app
├── pages/              One component per route (composes the above)
├── layouts/            MainLayout wraps every page with Navbar + Footer
├── hooks/              useMediaStream, usePeerConnection, usePhotoCapture
├── context/            BoothContext — wires the three hooks together
├── services/           peerService — room code helpers
├── utils/              filters.js, constants.js, canvasUtils.js
├── styles/             global.css, variables.css, animations.css
├── routes/             AppRoutes.jsx (React Router, lazy-loaded pages)
├── App.jsx
└── main.jsx
```

## How the PhotoBooth feature is wired

- **`useMediaStream`** — gets/releases the local camera.
- **`usePeerConnection`** — creates/joins a PeerJS room, exposes `sendMsg`
  and a `hasPartner` flag.
- **`usePhotoCapture`** — owns filter/layout/color/caption state and the
  capture → countdown → composite → download pipeline.
- **`BoothContext`** — combines the three hooks and exposes one `useBooth()`
  hook so components never need prop drilling.

The result canvas (`ResultScreen.jsx`) stays mounted at all times and is
shown/hidden with a CSS class rather than being conditionally rendered — this
avoids a null-ref bug where the capture pipeline tries to draw into a canvas
that hasn't mounted yet.

## Adding new features

The structure is meant to make these straightforward to slot in:
- **AI background removal / photo enhancement** — add a step in
  `usePhotoCapture`'s `composeFinal`, or a new hook (`useAIEnhance`) called
  before compositing.
- **Auth / premium plans / payments** — add a `context/AuthContext.jsx` and
  a `services/` module per provider (e.g. `services/stripeService.js`).
- **Cloud storage / event galleries** — add `services/storageService.js` and
  a `pages/Gallery.jsx` route.
- **QR code sharing** — small addition to `PairingCard.jsx` using any QR lib.
- **Watermarks** — one more draw call inside `canvasUtils.js`.
- **Admin dashboard / analytics** — new top-level routes under `pages/admin/`.
- **Multi-language** — wrap `App.jsx` with an i18n provider and move copy
  (currently inline in components) into locale files.

## SEO

- Per-page `<title>` and meta description via the dependency-free `SEO`
  component (`components/Common/SEO/SEO.jsx`).
- Open Graph / Twitter tags in `index.html`.
- `public/robots.txt` and `public/sitemap.xml` included — update the domain
  before launch.
- `public/favicon.svg` is a placeholder; swap in your real mark.

## Notes

- Legal copy in `PrivacyPolicy.jsx` and `Terms.jsx` is realistic placeholder
  text, not legal advice — have it reviewed before publishing.
- Testimonials and stats are illustrative placeholder content.
