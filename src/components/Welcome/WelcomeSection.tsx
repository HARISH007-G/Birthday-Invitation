import React from 'react';
import { motion } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import { FlowerSVG, TeddySVG } from '../FloatingDecorations/DecorationsSVG';

export const WelcomeSection: React.FC = () => {
  return (
    <section id="welcome" className="relative py-20 px-4 max-w-4xl mx-auto overflow-hidden">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-14 shadow-2xl border-4 border-[#fff3d1] text-center"
      >
        {/* Decorative Top Sun SVG */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#fff3d1] rounded-full p-2 border-4 border-white shadow-md flex items-center justify-center">
          <div className="text-4xl animate-rotate-sun" style={{ animationDuration: '30s' }}>
            ☀️
          </div>
        </div>

        {/* Cloud Title Container */}
        <div className="mt-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
            Warm Welcome
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
            Our Sunshine’s Story
          </h2>
        </div>

        {/* Message Content */}
        <div className="space-y-4 text-base md:text-lg text-[#49362d]/85 leading-relaxed max-w-2xl mx-auto font-medium">
          <p>{birthdayConfig.welcomeMessage.p1}</p>
          <p className="font-bold text-[#f3a187] text-xl font-handwriting">
            {birthdayConfig.welcomeMessage.p2}
          </p>
        </div>

        {/* Waving Teddy Bear Illustration */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="flex items-center gap-3 bg-[#fff8ee] px-4 py-2.5 rounded-full border border-[#f5c65d]/40 shadow-sm"
          >
            <TeddySVG className="w-7 h-9 shrink-0" />
            <span className="font-handwriting text-sm sm:text-lg font-bold text-[#49362d] leading-snug">
              Teddy says hi & can't wait to celebrate! 🧸
            </span>
          </motion.div>
        </div>

        {/* Bottom Growing Flowers SVG Decoration */}
        <div className="absolute -bottom-5 left-8 right-8 flex justify-between pointer-events-none opacity-80">
          <FlowerSVG color="#f5d6d0" className="w-10 h-10 animate-sway" />
          <FlowerSVG color="#fff3d1" className="w-8 h-8 animate-sway" />
          <FlowerSVG color="#b9dde4" className="w-10 h-10 animate-sway" />
        </div>
      </motion.div>
    </section>
  );
};
