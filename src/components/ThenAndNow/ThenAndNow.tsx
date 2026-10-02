import React from 'react';
import { motion } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import { Sparkles, MoveHorizontal } from 'lucide-react';
import { CompareReveal } from '../ui/compare-reveal';

export const ThenAndNow: React.FC = () => {
  return (
    <section id="then-and-now" className="relative py-16 sm:py-20 px-3 sm:px-4 max-w-5xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Growing Up So Fast
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Then & Now
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-2 text-sm md:text-base">
          From tiny sleepy newborn cuddles to a bright 1-year-old sunshine!
        </p>
      </div>

      {/* Interactive Split Photo Comparison Slider (Desktop & Touch) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-3xl mx-auto rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-white select-none"
      >
        <CompareReveal
          before={{
            src: birthdayConfig.images.newborn,
            alt: "Newborn Hanvika",
            objectPosition: birthdayConfig.images.newbornObjectPosition || 'center 20%',
          }}
          after={{
            src: birthdayConfig.images.birthday,
            alt: "Hanvika Turns One",
            objectPosition: birthdayConfig.images.birthdayObjectPosition || 'center',
          }}
          defaultPosition={50}
          introSweep={true}
          snapOnDoubleClick={50}
          className="w-full h-[280px] sm:h-[380px] md:h-[500px]"
          labels={[
            <div className="px-2.5 py-1 sm:px-4 sm:py-2 rounded-full bg-[#f3a187]/95 backdrop-blur-md text-white font-bold text-[10px] sm:text-xs shadow-md border border-white flex items-center gap-1 sm:gap-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate whitespace-nowrap">
                <span className="sm:hidden">THEN</span>
                <span className="hidden sm:inline">AT THE BEGINNING (OCT 2025)</span>
              </span>
            </div>,
            <div className="px-2.5 py-1 sm:px-4 sm:py-2 rounded-full bg-[#f5c65d]/95 backdrop-blur-md text-[#49362d] font-bold text-[10px] sm:text-xs shadow-md border border-white flex items-center gap-1 sm:gap-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate whitespace-nowrap">
                <span className="sm:hidden">NOW</span>
                <span className="hidden sm:inline">ONE YEAR LATER (OCT 2026)</span>
              </span>
            </div>,
          ]}
        />

        {/* Drag Helper Pill */}
        <div className="bg-[#fff8ee] py-3 text-center border-t border-[#f5c65d]/30">
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider sm:tracking-widest px-3 text-[#49362d]/70 flex items-center justify-center gap-2">
            <MoveHorizontal className="w-4 h-4 text-[#f3a187] shrink-0" />
            Drag or swipe slider left and right to compare (double tap to center)!
          </span>
        </div>
      </motion.div>

      {/* Comparison Text Bullet Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-10">
        {/* Then Column */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border-l-4 border-[#f3a187]">
          <h3 className="font-serif font-bold text-lg text-[#49362d] mb-3 flex items-center gap-2">
            <span>🍼</span> AT THE BEGINNING
          </h3>
          <ul className="space-y-2 text-sm text-[#49362d]/80 font-medium">
            <li className="flex items-center gap-2">✨ Tiny fingers & soft toes</li>
            <li className="flex items-center gap-2">✨ Sleepy newborn smiles</li>
            <li className="flex items-center gap-2">✨ A brand-new miracle beginning</li>
          </ul>
        </div>

        {/* Now Column */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border-l-4 border-[#f5c65d]">
          <h3 className="font-serif font-bold text-lg text-[#49362d] mb-3 flex items-center gap-2">
            <span>👑</span> ONE YEAR LATER
          </h3>
          <ul className="space-y-2 text-sm text-[#49362d]/80 font-medium">
            <li className="flex items-center gap-2">✨ Big, joyful personality</li>
            <li className="flex items-center gap-2">✨ Happy giggles & cheerful babbling</li>
            <li className="flex items-center gap-2">✨ One wonderful year of pure love</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
