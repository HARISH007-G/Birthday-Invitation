import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ExternalLink } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { BalloonSVG, CakeSVG, TeddySVG } from '../FloatingDecorations/DecorationsSVG';

export const FinalCelebration: React.FC = () => {
  return (
    <section className="relative py-28 px-4 text-center overflow-hidden bg-gradient-to-b from-[#fff8ee] via-[#fff3d1] to-[#f5d6d0]">
      {/* Background Soft Sunset Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-t from-[#f3a187]/20 via-[#f5c65d]/20 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Floating Icons */}
        <div className="flex items-center gap-6 mb-6">
          <BalloonSVG color="#f5c65d" className="w-12 h-16 animate-float-slow" />
          <TeddySVG className="w-14 h-16 animate-sway" />
          <BalloonSVG color="#f3a187" className="w-12 h-16 animate-float-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Heartfelt Poem / Quote */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-2 mb-8 font-serif font-bold text-xl md:text-3xl text-[#49362d] leading-relaxed"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >One tiny year.</motion.p>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-[#f3a187]"
          >A thousand beautiful memories.</motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[#f5c65d]"
          >A lifetime of love ahead.</motion.p>
        </motion.div>

        {/* Baby Photo Framed Portrait */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mb-8"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-3 rounded-full animate-pulse-ring" style={{ background: 'radial-gradient(circle, rgba(245,198,93,0.25) 0%, rgba(243,161,135,0.12) 60%, transparent 80%)' }} />
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-full p-3 bg-white shadow-2xl border-4 border-[#f5c65d] overflow-hidden mx-auto" style={{ boxShadow: '0 0 0 8px rgba(245,198,93,0.15), 0 24px 64px rgba(73,54,45,0.18)' }}>
              <img
                src={birthdayConfig.images.finalCelebration}
                alt={birthdayConfig.babyName}
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-[#f3a187] text-white font-serif font-extrabold text-lg shadow-lg border-2 border-white flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{birthdayConfig.babyName} Turns One</span>
          </div>
        </motion.div>

        {/* Cake Illustration */}
        <div className="mt-4 mb-8">
          <CakeSVG className="w-16 h-16 mx-auto animate-bounce" />
        </div>

        {/* Footer Copyright & Creator Love Note */}
        <footer className="pt-8 border-t border-[#49362d]/10 text-xs font-bold text-[#49362d]/70 flex flex-col items-center gap-3 w-full">
          <div className="flex items-center gap-1.5 text-sm md:text-base font-serif">
            <span>Made with endless love for</span>
            <span className="text-[#f3a187] font-black">{birthdayConfig.babyName}</span>
            <Heart className="w-4 h-4 text-[#ec407a] fill-current animate-pulse" />
          </div>

          {/* Designer / Creator Credit Badge */}
          <a
            href="https://www.instagram.com/itz.harish1002?igsh=MXY4NzNmNWFvaGh5Ng=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#f5c65d] shadow-md hover:shadow-lg transition-all transform hover:scale-105 group text-[#49362d]"
          >
            <span>Crafted with ❤️ by</span>
            <span className="font-extrabold text-[#f3a187] group-hover:underline">HARISH G</span>
            <svg className="w-4 h-4 text-[#e1306c] fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="text-xs font-bold text-[#49362d]/70">(@Itz.harish1002)</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#49362d]/50" />
          </a>

          <p className="text-[11px] text-[#49362d]/50 mt-1">
            © 2026 • Y S Hanvika 1st Birthday Celebration Invitation
          </p>
        </footer>
      </div>
    </section>
  );
};

