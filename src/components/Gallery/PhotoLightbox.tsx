import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';
import type { HangingPhoto } from '../../config/birthdayConfig';


interface PhotoLightboxProps {
  photo: HangingPhoto | null;
  onClose: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer select-none"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full bg-white rounded-3xl p-4 md:p-6 shadow-2xl border-4 border-[#f5c65d] overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#49362d] text-white hover:bg-[#f3a187] transition-colors shadow-md"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* High-Res Viewport */}
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 mb-4 shadow-inner">
            <img
              src={photo.image}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="text-center px-2 py-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff3d1] text-[#49362d] text-xs font-extrabold mb-2 border border-[#f5c65d]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#f5c65d]" />
              <span>HANVIKA’S MEMORY</span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-[#49362d]">
              {photo.title}
            </h3>
            <p className="text-sm font-handwriting text-xl font-bold text-[#f3a187] mt-1 flex items-center justify-center gap-1">
              <span>{photo.caption}</span>
              <Heart className="w-4 h-4 text-[#f3a187] fill-current" />
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
