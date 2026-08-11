import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';
import { birthdayConfig } from '../../config/birthdayConfig';
import { useConfetti } from '../../hooks/useConfetti';
import { CakeSVG } from '../FloatingDecorations/DecorationsSVG';

export const CountdownSection: React.FC = () => {
  const timeLeft = useCountdown(birthdayConfig.event.isoDate);
  const { triggerMilestoneCelebration } = useConfetti();

  useEffect(() => {
    if (timeLeft.isExpired) {
      triggerMilestoneCelebration();
    }
  }, [timeLeft.isExpired]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-20 px-4 max-w-4xl mx-auto overflow-hidden">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-[40px] p-8 md:p-14 text-center border-4 border-[#fff3d1] shadow-2xl relative"
      >
        {/* Animated Cake Icon Header */}
        <div className="flex justify-center mb-5 relative">
          {/* Pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full animate-pulse-ring" style={{ background: 'radial-gradient(circle, rgba(245,198,93,0.3) 0%, transparent 70%)' }} />
          </div>
          <CakeSVG className="w-16 h-16 drop-shadow-md animate-bounce relative z-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Counting Down The Moments
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1 mb-8">
          The Big Day Is Almost Here!
        </h2>

        {/* Countdown Digits Grid */}
        {timeLeft.isExpired ? (
          <div className="bg-[#fff3d1] p-8 rounded-3xl border-2 border-[#f5c65d] shadow-inner">
            <h3 className="text-3xl md:text-4xl font-extrabold font-serif text-[#49362d]">
              Today is the day! 🎉
            </h3>
            <p className="font-handwriting text-2xl font-bold text-[#f3a187] mt-2">
              Let the celebration begin!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
            {units.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -6, scale: 1.05, boxShadow: '0 16px 40px rgba(245,198,93,0.3)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-lg border-2 border-[#f5c65d]/30 flex flex-col items-center justify-center cursor-default"
                style={{ boxShadow: '0 4px 20px rgba(73,54,45,0.08), inset 0 1px 0 rgba(255,255,255,0.8)' }}
              >
                <motion.span
                  key={unit.value}
                  initial={{ y: -14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="font-serif font-black text-4xl md:text-5xl text-[#49362d] tabular-nums"
                >
                  {String(unit.value).padStart(2, '0')}
                </motion.span>
                <span className="text-[10px] font-black tracking-widest uppercase text-[#f3a187] mt-1.5">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};
