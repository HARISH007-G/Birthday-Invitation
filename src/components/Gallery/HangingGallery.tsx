import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { HangingPhoto } from '../../config/birthdayConfig';

import { PhotoLightbox } from './PhotoLightbox';
import { useConfetti } from '../../hooks/useConfetti';
import { Sparkles, Maximize2 } from 'lucide-react';

export const HangingGallery: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<HangingPhoto | null>(null);
  const { triggerHeroBurst } = useConfetti();

  const handlePhotoClick = (photo: HangingPhoto) => {
    setActivePhoto(photo);
    triggerHeroBurst();
  };

  return (
    <section id="gallery" className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Hanging Memories
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Photo Scrapbook
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-2 text-sm md:text-base">
          Click any photo to enlarge and celebrate Hanvika’s sweetest moments!
        </p>
      </div>

      {/* Decorative Hanging String Wire */}
      <div className="relative pt-8">
        <div className="absolute top-4 left-0 right-0 h-1 bg-[#49362d]/20 rounded-full shadow-xs" />

        {/* Grid of Hanging Photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {birthdayConfig.hangingPhotos.map((photo: HangingPhoto, index: number) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30, rotate: parseFloat(photo.rotation) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handlePhotoClick(photo)}
              className="relative bg-white p-4 pb-6 rounded-2xl shadow-xl border border-gray-100 cursor-pointer group select-none animate-swing"
              style={{ animationDuration: `${4.5 + index * 0.5}s` }}
            >
              {/* Clothespin Clip Graphic */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-8 bg-[#f5c65d] rounded-t-sm shadow-md border border-[#49362d]/30 z-10 flex flex-col justify-between p-0.5">
                <div className="w-full h-1 bg-[#49362d]/40 rounded-full" />
                <div className="w-full h-1 bg-[#49362d]/40 rounded-full" />
              </div>

              {/* Photo Viewport */}
              <div className="relative overflow-hidden rounded-xl aspect-square bg-gray-100 mb-3 shadow-inner">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Hover Overlay Icon */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-3 rounded-full bg-white/30 backdrop-blur-md">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="text-center px-1">
                <h3 className="font-serif font-bold text-base text-[#49362d]">
                  {photo.title}
                </h3>
                <p className="font-handwriting text-base font-bold text-[#f3a187] mt-0.5 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{photo.caption}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox photo={activePhoto} onClose={() => setActivePhoto(null)} />
    </section>
  );
};
