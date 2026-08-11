import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { useConfetti } from '../../hooks/useConfetti';
import { SkyClouds } from '../Decorations/SkyClouds';

interface HeroSectionProps {
  onOpenInvitation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenInvitation }) => {
  const { triggerHeroBurst } = useConfetti();
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenClick = () => {
    triggerHeroBurst();
    onOpenInvitation();
    const target = document.getElementById('welcome');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
      {/* Background Drifting Sky Clouds */}
      <SkyClouds />

      {/* Sun Ray Gradient Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#f5c65d]/20 via-[#f3a187]/20 to-transparent blur-3xl" />
      </div>

      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Tagline Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff3d1] border border-[#f5c65d]/40 shadow-sm mb-4"
        >
          <Sparkles className="w-4 h-4 text-[#f5c65d] animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs font-black uppercase tracking-widest text-[#49362d]">
            {birthdayConfig.tagline}
          </span>
        </motion.div>

        {/* Hero Headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl font-handwriting font-bold text-[#f3a187] mb-1"
        >
          {birthdayConfig.heroSubtitle}
        </motion.p>

        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-serif gold-shimmer-text tracking-tight mb-2 drop-shadow-sm leading-tight"
        >
          {birthdayConfig.babyName}
        </motion.h1>


        {/* Giant Floating Number 1 Badge */}
        <motion.div
          initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
          animate={{ rotate: [ -4, 4, -4 ], scale: 1, opacity: 1 }}
          transition={{
            rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            scale: { duration: 0.6, delay: 0.4 },
            opacity: { duration: 0.6, delay: 0.4 }
          }}
          className="inline-block mb-6"
        >
          <span className="px-6 py-2 rounded-2xl bg-gradient-to-r from-[#f5c65d] to-[#f3a187] text-white font-serif font-extrabold text-2xl md:text-3xl shadow-lg border-2 border-white/60 tracking-wider">
            Turns One ✨
          </span>
        </motion.div>

        {/* Baby Photo Framed Display */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mb-8 group"
        >
          {/* Rotating Sunshine Graphic Ring */}
          <div className="absolute -inset-6 rounded-full border-2 stroke-dasharray border-dashed border-[#f5c65d]/50 animate-rotate-sun pointer-events-none" />

          {/* Pulsing Glow Ring Behind Photo */}
          <div
            className="absolute -inset-4 rounded-full animate-pulse-ring pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(245,198,93,0.25) 0%, rgba(243,161,135,0.15) 50%, transparent 70%)' }}
          />

          {/* Photo Frame Container */}
          <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full p-3 bg-white shadow-2xl border-4 border-[#f5c65d] overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
            <img
              src={birthdayConfig.images.hero}
              alt={`${birthdayConfig.babyName}'s Birthday Photo`}
              className="w-full h-full object-cover rounded-full"
              loading="eager"
            />
          </div>

          {/* Corner Ribbon Badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#49362d] text-white font-handwriting text-sm md:text-lg font-bold shadow-md whitespace-nowrap">
            1st Trip Around The Sun ☀️
          </div>
        </motion.div>

        {/* Short Love Story Intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-base md:text-xl text-[#49362d]/80 max-w-lg mb-6 leading-relaxed font-medium"
        >
          {birthdayConfig.heroDescription}
        </motion.p>


        {/* Event Date & Time Pill */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#f5c65d]/50 shadow-md font-bold text-xs md:text-sm text-[#49362d] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center"
        >
          <span>🗓️ {birthdayConfig.event.date}</span>
          <span className="text-[#f3a187]">|</span>
          <span>⏰ {birthdayConfig.event.time}</span>
        </motion.div>

        {/* Interactive Invitation CTA Button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <button
            onClick={handleOpenClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3.5 md:py-4 rounded-full font-serif font-extrabold text-base md:text-lg text-[#49362d] shadow-xl border-2 border-white transition-all duration-300 transform ${
              isHovered
                ? '-translate-y-1 bg-[#f3a187] text-white shadow-2xl'
                : 'bg-[#f5c65d] hover:bg-[#f3a187]'
            }`}
          >
            <span>Open the Invitation</span>
            <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1.5' : ''}`} />
          </button>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#49362d]/50"
          aria-hidden="true"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
          <div className="animate-scroll-bounce text-lg">↓</div>
        </motion.div>
      </div>
    </section>
  );
};
