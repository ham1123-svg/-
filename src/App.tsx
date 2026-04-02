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

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Counselors from './pages/Counselors';
import Programs from './pages/Programs';
import Guide from './pages/Guide';
import Community from './pages/Community';
import Reservation from './pages/Reservation';
import Confidentiality from './pages/Confidentiality';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/counselors" element={<Counselors />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/community" element={<Community />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/confidentiality" element={<Confidentiality />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </Router>
  );
}
