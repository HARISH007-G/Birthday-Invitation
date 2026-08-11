import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { FirstMemory } from '../../config/birthdayConfig';

import { Sparkles } from 'lucide-react';

export const FirstsSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleCardClick = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="firsts" className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Precious Memories
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          A Collection of Firsts
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-2 text-sm md:text-base">
          Hover on desktop or tap on mobile to flip the cards and discover Hanvika’s tiny milestones!
        </p>
      </div>

      {/* 9 3D Flip Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {birthdayConfig.firsts.map((first: FirstMemory) => {
          const isFlipped = flippedCards[first.id] || false;

          return (
            <motion.div
              key={first.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              onClick={() => handleCardClick(first.id)}
              className="group h-52 w-full perspective-1000 cursor-pointer"
            >
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                  isFlipped ? 'rotate-y-180' : 'group-hover:rotate-y-180'
                }`}
              >
                {/* FRONT FACE */}
                <div
                  style={{ backgroundColor: first.color }}
                  className="absolute inset-0 w-full h-full rounded-3xl p-6 shadow-lg border-2 border-white flex flex-col items-center justify-center text-center backface-hidden"
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                    {first.icon}
                  </div>
                  <h3 className="text-lg font-serif font-extrabold text-[#49362d] tracking-wide uppercase">
                    {first.title}
                  </h3>
                  <span className="mt-2 text-[10px] font-bold text-[#49362d]/60 bg-white/60 px-3 py-1 rounded-full">
                    TAP OR HOVER TO REVEAL ✨
                  </span>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-white shadow-xl border-2 border-[#f5c65d] flex flex-col items-center justify-center text-center rotate-y-180 backface-hidden">
                  <div className="inline-flex items-center gap-1 text-xs font-extrabold text-[#f3a187] mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{first.dateText}</span>
                  </div>
                  <p className="text-sm text-[#49362d] font-medium leading-relaxed">
                    {first.backDescription}
                  </p>
                  <span className="mt-3 font-handwriting text-base font-bold text-[#f5c65d]">
                    Pure Happiness ❤️
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
