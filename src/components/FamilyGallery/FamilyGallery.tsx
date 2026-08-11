import React from 'react';
import { motion } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { FamilyPhoto } from '../../config/birthdayConfig';

import { Heart } from 'lucide-react';

export const FamilyGallery: React.FC = () => {
  return (
    <section className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Family & Happiness
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Surrounded by Love
        </h2>
        <p className="text-[#49362d]/80 font-medium mt-3 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Every smile has been celebrated, every tiny achievement has been treasured, and every moment has been made more special by the love of family and friends.
        </p>
      </div>

      {/* Polaroid Photo Wall Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {birthdayConfig.familyPhotos.map((photo: FamilyPhoto, index: number) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9, rotate: parseFloat(photo.rotation) * 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: parseFloat(photo.rotation) }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative bg-white p-4 pb-6 rounded-2xl shadow-xl border border-gray-100 transform transition-all duration-300 group cursor-pointer"
          >
            {/* Washi Tape Corner Decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#f5c65d]/60 rotate-[-2deg] opacity-80 shadow-xs z-10" />

            {/* Photo Viewport */}
            <div className="overflow-hidden rounded-xl aspect-[4/5] bg-gray-100 mb-3 shadow-inner">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Caption */}
            <div className="text-center px-1">
              <h3 className="font-serif font-bold text-base text-[#49362d] flex items-center justify-center gap-1">
                <span>{photo.title}</span>
                <Heart className="w-3.5 h-3.5 text-[#f3a187] fill-current" />
              </h3>
              <p className="font-handwriting text-base font-bold text-[#f3a187] mt-0.5">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
