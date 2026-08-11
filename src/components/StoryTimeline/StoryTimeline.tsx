import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Compass, Gift, Camera, Crown, Smile, Music, Baby, Cake } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import type { Milestone } from '../../config/birthdayConfig';

import { useConfetti } from '../../hooks/useConfetti';

export const StoryTimeline: React.FC = () => {
  const { triggerSmallSparkle, triggerMilestoneCelebration } = useConfetti();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'baby': return <Baby className="w-5 h-5 text-[#f3a187]" />;
      case 'smile': return <Smile className="w-5 h-5 text-[#f5c65d]" />;
      case 'music': return <Music className="w-5 h-5 text-[#ba68c8]" />;
      case 'star': return <Star className="w-5 h-5 text-[#f5c65d]" />;
      case 'heart': return <Heart className="w-5 h-5 text-[#ec407a]" />;
      case 'cake': return <Cake className="w-5 h-5 text-[#ff8a65]" />;
      case 'compass': return <Compass className="w-5 h-5 text-[#66bb6a]" />;
      case 'gift': return <Gift className="w-5 h-5 text-[#29b6f6]" />;
      case 'camera': return <Camera className="w-5 h-5 text-[#ec407a]" />;
      case 'balloon': return <Sparkles className="w-5 h-5 text-[#ffa726]" />;
      case 'crown': return <Crown className="w-5 h-5 text-[#ab47bc]" />;
      case 'sparkles': return <Sparkles className="w-5 h-5 text-[#f5c65d]" />;
      default: return <Sparkles className="w-5 h-5 text-[#f5c65d]" />;
    }
  };

  const handleCardViewportEnter = (milestone: Milestone) => {
    if (milestone.sparkleLevel === 'large') {
      triggerMilestoneCelebration();
    } else {
      triggerSmallSparkle(0.5, 0.5);
    }
  };

  return (
    <section id="timeline" className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          First Year Story
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          12 Magical Months
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-3">
          Watch our little sunshine grow month by month, from her first smile to turning one whole year!
        </p>
      </div>

      {/* Central Connecting Dotted Line for Desktop & Mobile */}
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f5c65d] via-[#f3a187] to-[#b9dde4] -translate-x-1/2 rounded-full opacity-60 stroke-dasharray" />

        {/* 12 Monthly Timeline Cards */}
        <div className="space-y-12 md:space-y-16">
          {birthdayConfig.milestones.map((milestone, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={milestone.month}
                initial={{ opacity: 0, y: 40, rotate: -2, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                onViewportEnter={() => handleCardViewportEnter(milestone)}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4), ease: [0.19, 1, 0.22, 1] }}
                className={`relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Center Dot Indicator */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className="w-10 h-10 rounded-full bg-white border-4 border-[#f5c65d] shadow-lg flex items-center justify-center"
                  >
                    <span className="text-xs font-extrabold text-[#49362d]">
                      {milestone.month}
                    </span>
                  </motion.div>
                </div>

                {/* Card Container */}
                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div 
                    className="glass-card rounded-3xl p-5 md:p-6 shadow-xl border-2 border-white/80 hover:border-[#f5c65d]/70 transition-all duration-300 group"
                    style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    {/* Month Tag & Icon */}
                    <div className={`flex items-center gap-2 mb-3 ${isEven ? 'md:justify-end' : ''}`}>
                      <span className="px-3 py-1 rounded-full bg-[#fff3d1] text-[#49362d] text-xs font-extrabold tracking-wider border border-[#f5c65d]/40">
                        MONTH {milestone.month}
                      </span>
                      <div className="p-1.5 rounded-full bg-white shadow-xs">
                        {getIcon(milestone.icon)}
                      </div>
                      <span className="text-xs font-bold text-[#f3a187]">
                        {milestone.date}
                      </span>
                    </div>

                    {/* Photo Viewport */}
                    <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square max-w-xs mx-auto shadow-md border-2 border-white">
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ objectPosition: milestone.objectPosition || 'center' }}
                        loading="lazy"
                      />

                      {milestone.sparkleLevel === 'large' && (
                        <div className="absolute top-3 right-3 bg-[#f5c65d] text-[#49362d] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                          MILESTONE! 🎉
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[#49362d]">
                      {milestone.title}
                    </h3>
                    <p className="text-xs md:text-sm text-[#49362d]/80 mt-1 font-medium leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
