import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Calendar, Crown, Sparkles, BookOpen, Star, Ticket, Music, MapPin } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

export const FloatingNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);

  const navLinks = [
    { name: 'Story',      href: '#timeline',     id: 'timeline',     icon: BookOpen },
    { name: 'Firsts',     href: '#firsts',        id: 'firsts',       icon: Star },
    { name: 'Pass 🎟️',   href: '#party-pass',    id: 'party-pass',   icon: Ticket },
    { name: 'Jukebox 🎵', href: '#jukebox',       id: 'jukebox',      icon: Music },
    { name: 'Details',    href: '#event-details', id: 'event-details',icon: MapPin },
    { name: 'Join Party', href: '#rsvp',          id: 'rsvp',         icon: Heart },
  ];

  // ── Scroll-based active section detection + Smart Auto-Hide ─────────
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detect background glass effect threshold
      setIsScrolled(currentScrollY > 60);

      // Smart Auto-Hide logic:
      // Scroll Down > 100px: Hide menu bar so it doesn't obstruct view
      // Scroll Up: Reveal menu bar instantly for easy navigation
      if (currentScrollY > lastScrollY.current && currentScrollY > 100 && !isOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-3 left-0 right-0 z-40 flex justify-center px-3 md:px-6 pointer-events-none transition-transform duration-400 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0'
      }`}
      style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease' }}
    >
      {/* Handcrafted Festive Ribbon Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className={`relative w-full max-w-5xl pointer-events-auto transition-all duration-300 ${
          isScrolled ? 'scale-[0.98]' : 'scale-100'
        }`}
      >
        {/* Ribbon Side Fold Details (Desktop decoration) */}
        <div className="hidden lg:block absolute -left-4 top-2 bottom-2 w-6 bg-[#f5c65d] rounded-l-md transform -skew-y-6 shadow-md border-y border-l border-white/60 -z-10" />
        <div className="hidden lg:block absolute -right-4 top-2 bottom-2 w-6 bg-[#f3a187] rounded-r-md transform skew-y-6 shadow-md border-y border-r border-white/60 -z-10" />

        {/* Main Banner Container */}
        <div className="relative bg-gradient-to-r from-[#fff3d1] via-white to-[#f5d6d0] rounded-2xl md:rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between shadow-[0_8px_25px_rgba(73,54,45,0.12)] border-2 border-dashed border-[#f5c65d]/70 backdrop-blur-md">

          {/* Golden Crown Wax-Seal Brand Badge */}
          <a href="#" className="flex items-center gap-2.5 group" aria-label="Back to top">
            <div className="relative flex items-center justify-center">
              {/* Crown Badge Icon */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f5c65d] via-[#e8b84b] to-[#f3a187] p-0.5 shadow-md flex items-center justify-center border-2 border-white"
              >
                <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Crown className="w-5 h-5 drop-shadow-xs fill-amber-100" />
                </div>
              </motion.div>
              {/* Tiny "1" Gold Star Badge */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#49362d] text-white font-extrabold text-[9px] flex items-center justify-center border border-white shadow-xs">
                1
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-serif font-black text-sm md:text-base text-[#49362d] tracking-tight">
                  {birthdayConfig.babyName}
                </span>
                <Sparkles className="w-3 h-3 text-[#f5c65d] animate-pulse" />
              </div>
              <span className="text-[10px] font-handwriting text-[#f3a187] font-bold tracking-wider -mt-1">
                Turns One Birthday Party 🎉
              </span>
            </div>
          </a>

          {/* Ribbon Tabs Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Festive navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              const IconComp = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f5c65d] to-[#f3a187] text-white border-white/80 shadow-md scale-105'
                      : 'bg-white/70 hover:bg-white text-[#49362d] border-transparent hover:border-[#f5c65d]/40 hover:shadow-xs'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#f3a187]'}`} />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Trigger */}
          <div className="flex items-center gap-2">
            <a
              href="#rsvp"
              className="btn-premium flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#f5c65d] via-[#f3a187] to-[#f5c65d] text-white font-extrabold text-xs shadow-md border border-white/60 hover:shadow-lg"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Confirm RSVP</span>
              <span className="sm:hidden">RSVP 💖</span>
            </a>

            {/* Mobile Menu Ribbon Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-full bg-white/90 text-[#49362d] border border-[#f5c65d]/50 shadow-xs hover:bg-[#fff3d1] transition-colors"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-[#f3a187]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-[#49362d]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer Dropdown — Styled like a folded festive banner */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-16 left-4 right-4 bg-white/98 backdrop-blur-2xl rounded-3xl p-5 shadow-2xl border-4 border-[#fff3d1] pointer-events-auto md:hidden"
          >
            {/* Header trim inside menu */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#f5c65d]/30">
              <span className="text-xs font-black uppercase tracking-widest text-[#f3a187] flex items-center gap-1">
                <Crown className="w-4 h-4 text-[#f5c65d]" />
                Party Navigation
              </span>
              <span className="text-[10px] font-bold text-[#49362d]/60">1st Birthday</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link, i) => {
                const IconComp = link.icon;
                const isActive = activeSection === link.id;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#fff3d1] to-[#f5d6d0] text-[#49362d] border-[#f5c65d]'
                        : 'bg-[#fff8ee] text-[#49362d] border-transparent hover:border-[#f5c65d]/30'
                    }`}
                  >
                    <div className="p-1.5 rounded-full bg-white shadow-2xs">
                      <IconComp className="w-3.5 h-3.5 text-[#f3a187]" />
                    </div>
                    <span>{link.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
