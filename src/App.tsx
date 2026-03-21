import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Experiences from './pages/Experiences';
import FoodCulture from './pages/FoodCulture';
import Planning from './pages/Planning';
import Blog from './pages/Blog';
import Booking from './pages/Booking';
import Map from './pages/Map';
import Dictionary from './pages/Dictionary';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Volunteers from './pages/Volunteers';
import LuckyWheel from './pages/LuckyWheel';
import Assistant from './pages/Assistant';

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    const isFirstLoad = isFirstLoadRef.current;
    if (isFirstLoad) {
      isFirstLoadRef.current = false;
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    }

    if (hash) {
      const targetId = hash.startsWith('#') ? hash.slice(1) : hash;
      const el = document.getElementById(targetId) ?? document.querySelector(hash);
      if (el instanceof HTMLElement) el.scrollIntoView();
      return;
    }

    if (isFirstLoad) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, search, hash, navigationType]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/food-culture" element={<FoodCulture />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/map" element={<Map />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/about" element={<About />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/lucky-wheel" element={<LuckyWheel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
