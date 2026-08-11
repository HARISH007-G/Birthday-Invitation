import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayConfig } from '../../config/birthdayConfig';
import { StarSVG } from '../FloatingDecorations/DecorationsSVG';

interface BirthdayLoaderProps {
  onComplete: () => void;
}

export const BirthdayLoader: React.FC<BirthdayLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 400);
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fff8ee] text-[#49362d] p-6 select-none"
        >
          {/* Background twinkle stars */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1/4 left-1/5"
            >
              <StarSVG color="#f5c65d" className="w-8 h-8" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
              className="absolute top-1/3 right-1/5"
            >
              <StarSVG color="#f3a187" className="w-10 h-10" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 1 }}
              className="absolute bottom-1/4 left-1/4"
            >
              <StarSVG color="#b9dde4" className="w-6 h-6" />
            </motion.div>
          </div>

          {/* Animated Birthday Cake */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <svg viewBox="0 0 160 160" className="w-32 h-32 drop-shadow-lg" fill="none">
              {/* Outer Glow Ring */}
              <circle cx="80" cy="80" r="72" fill="#fff" opacity="0.6" />
              {/* Circular Progress Path */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#f5c65d"
                strokeWidth="6"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * progress) / 100}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 80 80)"
                className="transition-all duration-100 ease-out"
              />
              {/* Cake SVG Base */}
              <g transform="translate(30, 35)">
                <rect x="15" y="55" width="70" height="35" rx="8" fill="#fff3d1" stroke="#f5c65d" strokeWidth="3" />
                <rect x="25" y="30" width="50" height="28" rx="6" fill="#f5d6d0" stroke="#f3a187" strokeWidth="3" />
                <path d="M25 38 Q35 44 40 38 Q45 44 50 38 Q55 44 60 38 Q65 44 75 38" fill="none" stroke="#ffffff" strokeWidth="4" />
                {/* Candle */}
                <rect x="47" y="14" width="6" height="16" fill="#b9dde4" rx="2" />
                {/* Flickering Flame */}
                <path
                  d="M50 2 C54 8 52 14 50 15 C48 14 46 8 50 2 Z"
                  fill="#f5c65d"
                  className="animate-flame"
                />
              </g>
            </svg>
          </motion.div>

          {/* Fade Upward Welcome Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-2 mb-8"
          >
            <p className="text-sm font-bold uppercase tracking-widest text-[#f3a187]">
              Welcome to
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-[#49362d]">
              {birthdayConfig.babyName}’s
            </h1>
            <p className="text-xl font-handwriting text-[#f5c65d] text-2xl font-bold">
              First Birthday Celebration
            </p>
          </motion.div>

          {/* Progress Percentage & Skip Button */}
          <div className="flex flex-col items-center space-y-4">
            <span className="text-xs font-bold tracking-wider text-[#49362d]/60">
              {progress}%
            </span>
            <button
              onClick={handleSkip}
              className="px-6 py-2.5 bg-[#f5c65d] hover:bg-[#f3a187] text-[#49362d] font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Let’s Celebrate! ✨
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
