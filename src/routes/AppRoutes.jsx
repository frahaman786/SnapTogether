import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingScreen from '../components/Loading/LoadingScreen';

// Lazy-loaded pages: each route's code only downloads when the user visits it.
const Home = lazy(() => import('../pages/Home'));
const PhotoboothPage = lazy(() => import('../pages/PhotoboothPage'));
const LiveRoomPage = lazy(() => import('../pages/LiveRoomPage'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const Terms = lazy(() => import('../pages/Terms'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading SnapTogether…" />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booth" element={<PhotoboothPage />} />
          <Route path="/live-room" element={<LiveRoomPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
