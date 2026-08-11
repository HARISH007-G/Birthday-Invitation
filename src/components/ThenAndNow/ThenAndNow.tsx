import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import { Sparkles, MoveHorizontal } from 'lucide-react';

export const ThenAndNow: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <section id="then-and-now" className="relative py-20 px-4 max-w-5xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
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
        className="relative max-w-3xl mx-auto rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-white select-none"
      >
        <div
          className="relative w-full h-[280px] sm:h-[360px] md:h-[500px] cursor-ew-resize overflow-hidden"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* NOW PHOTO (Background Layer - 1 Year Birthday) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={birthdayConfig.images.birthday}
              alt="Hanvika Turns One"
              className="w-full h-full object-cover"
              style={{ objectPosition: birthdayConfig.images.birthdayObjectPosition || 'center' }}
            />
            <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#f5c65d] text-[#49362d] font-bold text-xs shadow-md border border-white flex items-center gap-1.5 z-10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ONE YEAR LATER (OCT 2026)</span>
            </div>
          </div>


          {/* THEN PHOTO (Clipped Layer with smooth clip-path, zero zoom/stretch!) */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={birthdayConfig.images.newborn}
              alt="Newborn Hanvika"
              className="w-full h-full object-cover"
              style={{ objectPosition: birthdayConfig.images.newbornObjectPosition || 'center 20%' }}
            />
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-[#f3a187] text-white font-bold text-xs shadow-md border border-white flex items-center gap-1.5 z-10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AT THE BEGINNING (OCT 2025)</span>
            </div>
          </div>



          {/* Draggable Divider Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl -translate-x-1/2 pointer-events-none z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-2xl border-4 border-[#f5c65d] flex items-center justify-center text-[#49362d]">
              <MoveHorizontal className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Drag Helper Pill */}
        <div className="bg-[#fff8ee] py-3 text-center border-t border-[#f5c65d]/30">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#49362d]/70 flex items-center justify-center gap-2">
            <MoveHorizontal className="w-4 h-4 text-[#f3a187]" />
            Drag or swipe slider left and right to compare!
          </span>
        </div>
      </motion.div>

      {/* Comparison Text Bullet Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-10">
        {/* Then Column */}
        <div className="glass-card rounded-2xl p-6 border-l-4 border-[#f3a187]">
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
        <div className="glass-card rounded-2xl p-6 border-l-4 border-[#f5c65d]">
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
