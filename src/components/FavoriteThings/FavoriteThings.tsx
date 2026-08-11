import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Music, Heart, Sparkles, Smile } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { FavoriteThing } from '../../config/birthdayConfig';

import { TeddySVG } from '../FloatingDecorations/DecorationsSVG';

export const FavoriteThings: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'spoon': return <Utensils className="w-6 h-6 text-[#f3a187]" />;
      case 'teddy': return <TeddySVG className="w-8 h-8" />;
      case 'music': return <Music className="w-6 h-6 text-[#b9dde4]" />;
      case 'balloon': return <Sparkles className="w-6 h-6 text-[#afc6a4]" />;
      case 'heart': return <Heart className="w-6 h-6 text-[#ec407a]" />;
      default: return <Smile className="w-6 h-6 text-[#f5c65d]" />;
    }
  };

  return (
    <section id="favorites" className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Hanvika’s Favorites
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Favorite Things
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-2 text-sm md:text-base">
          The little things that bring the biggest smiles to her face every single day!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {birthdayConfig.favoriteThings.map((fav: FavoriteThing, index: number) => (
          <motion.div
            key={fav.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            style={{ backgroundColor: fav.bg }}
            className="rounded-3xl p-5 md:p-6 shadow-lg border-2 border-white flex flex-col items-center text-center justify-between min-h-[180px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 transform hover:rotate-6 transition-transform">
              {getIcon(fav.icon)}
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#49362d]/70 mb-1">
              {fav.category}
            </span>
            <h3 className="font-serif font-bold text-lg text-[#49362d] leading-snug">
              {fav.name}
            </h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
