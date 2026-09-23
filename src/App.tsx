import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Phone, MessageCircle, Calendar, MapPin, 
  ChevronRight, Search, Heart, User, BookOpen, Info, 
  HelpCircle, ClipboardList, ArrowRight, Instagram
} from 'lucide-react';
import { cn } from './lib/utils';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import Breadcrumb from './components/Breadcrumb';
import ReadingProgressBar from './components/ReadingProgressBar';
import { HighContrastProvider } from './context/HighContrastContext';
import { KeyboardShortcutsProvider } from './context/KeyboardShortcutsContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Counselors from './pages/Counselors';
import Programs from './pages/Programs';
import Guide from './pages/Guide';
import Community from './pages/Community';
import Reservation from './pages/Reservation';
import ReservationStatus from './pages/ReservationStatus';
import SelfDiagnosisPage from './pages/SelfDiagnosisPage';
import Confidentiality from './pages/Confidentiality';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Admin from './pages/Admin';

// Route change scroll helper
function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <HighContrastProvider>
      <Router>
        <KeyboardShortcutsProvider>
          <ScrollToTopOnNavigate />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <ReadingProgressBar />
            <main className="flex-grow pt-16">
              <Breadcrumb />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/counselors" element={<Counselors />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/guide" element={<Guide />} />
                  <Route path="/self-diagnosis" element={<SelfDiagnosisPage />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/reservation" element={<Reservation />} />
                  <Route path="/reservation/status" element={<ReservationStatus />} />
                  <Route path="/reservation-status" element={<ReservationStatus />} />
                  <Route path="/confidentiality" element={<Confidentiality />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
            <FloatingButtons />
          </div>
          <KeyboardShortcutsModal />
        </KeyboardShortcutsProvider>
      </Router>
    </HighContrastProvider>
  );
}
