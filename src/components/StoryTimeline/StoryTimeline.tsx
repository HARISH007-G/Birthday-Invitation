import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Star,
  Compass,
  Gift,
  Camera,
  Crown,
  Smile,
  Music,
  Baby,
  Cake,
  ChevronLeft,
  ChevronRight,
  MoveVertical,
} from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { useConfetti } from '../../hooks/useConfetti';
import { WheelCarousel, type WheelCarouselItem } from './WheelCarousel';

export const StoryTimeline: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { triggerSmallSparkle, triggerMilestoneCelebration } = useConfetti();

  const milestoneItems: WheelCarouselItem[] = useMemo(() => {
    return birthdayConfig.milestones.map((milestone) => ({
      label: `Month ${milestone.month} • ${milestone.title}`,
      image: milestone.image,
      imageAlt: `Hanvika - Month ${milestone.month}: ${milestone.title}`,
      month: milestone.month,
      title: milestone.title,
      date: milestone.date,
      description: milestone.description,
      sparkleLevel: milestone.sparkleLevel,
      objectPosition: milestone.objectPosition,
      icon: milestone.icon,
    }));
  }, []);

  const currentMilestone = milestoneItems[activeIndex] || milestoneItems[0];

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'baby': return <Baby className="w-4 h-4 text-[#f3a187]" />;
      case 'smile': return <Smile className="w-4 h-4 text-[#f5c65d]" />;
      case 'music': return <Music className="w-4 h-4 text-[#ba68c8]" />;
      case 'star': return <Star className="w-4 h-4 text-[#f5c65d]" />;
      case 'heart': return <Heart className="w-4 h-4 text-[#ec407a]" />;
      case 'cake': return <Cake className="w-4 h-4 text-[#ff8a65]" />;
      case 'compass': return <Compass className="w-4 h-4 text-[#66bb6a]" />;
      case 'gift': return <Gift className="w-4 h-4 text-[#29b6f6]" />;
      case 'camera': return <Camera className="w-4 h-4 text-[#ec407a]" />;
      case 'crown': return <Crown className="w-4 h-4 text-[#ab47bc]" />;
      case 'sparkles': return <Sparkles className="w-4 h-4 text-[#f5c65d]" />;
      default: return <Sparkles className="w-4 h-4 text-[#f5c65d]" />;
    }
  };

  const handleActiveChange = (item: WheelCarouselItem, index: number) => {
    setActiveIndex(index);
    if (item.sparkleLevel === 'large') {
      triggerMilestoneCelebration();
    } else {
      triggerSmallSparkle(0.5, 0.4);
    }
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + milestoneItems.length) % milestoneItems.length;
    setActiveIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % milestoneItems.length;
    setActiveIndex(nextIdx);
  };

  return (
    <section id="timeline" className="relative py-12 md:py-20 px-3 sm:px-4 max-w-6xl mx-auto overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#f5c65d]/20 via-[#f3a187]/20 to-[#b9dde4]/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          First Year Story
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          12 Magical Months
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-3 text-sm md:text-base">
          Spin the interactive milestone wheel to watch our little sunshine grow month by month!
        </p>
      </div>

      {/* Main Glassmorphic Wheel Carousel Showcase Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-[36px] md:rounded-[44px] p-3 sm:p-6 md:p-10 border-4 border-white shadow-2xl relative max-w-4xl mx-auto"
      >
        {/* Interactive Wheel Carousel */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-white/70 to-[#fff8ee]/70 border border-[#f5c65d]/25 p-2 sm:p-4">
          <WheelCarousel
            items={milestoneItems}
            activeIndex={activeIndex}
            onActiveChange={handleActiveChange}
            photoSide="left"
            photoAspect="1/1"
            photoWidth={44}
            radius={260}
            spacing={16}
            visibleItems={5}
            apexInset={14}
            selectedColor="#f3a187"
            textColor="rgba(73, 54, 45, 0.4)"
            markerColor="#f5c65d"
            panelColor="#fff3d1"
            className="h-[340px] sm:h-[400px] md:h-[440px]"
          />
        </div>

        {/* Milestone Detail Story Card */}
        <div className="mt-6 pt-5 border-t border-[#f5c65d]/25">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMilestone?.month}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white shadow-sm"
            >
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <span className="px-3 py-0.5 rounded-full bg-[#f5c65d] text-[#49362d] text-xs font-black uppercase tracking-wider shadow-xs">
                    Month {currentMilestone?.month}
                  </span>
                  <div className="p-1 rounded-full bg-[#fff8ee] border border-[#f5c65d]/30">
                    {getIcon(currentMilestone?.icon)}
                  </div>
                  <span className="text-xs font-bold text-[#f3a187]">
                    {currentMilestone?.date}
                  </span>
                  {currentMilestone?.sparkleLevel === 'large' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#f5c65d] to-[#f3a187] text-white text-[10px] font-black shadow-xs">
                      Special Milestone ✨
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#49362d]">
                  {currentMilestone?.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#49362d]/80 font-medium mt-1 leading-relaxed max-w-2xl">
                  {currentMilestone?.description}
                </p>
              </div>

              {/* Prev / Next Step Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white hover:bg-[#fff8ee] text-[#49362d] border border-gray-200 shadow-sm flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
                  aria-label="Previous month"
                  title="Previous month"
                >
                  <ChevronLeft className="w-5 h-5 text-[#49362d]" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-[#f5c65d] hover:bg-[#f3a187] text-[#49362d] hover:text-white border border-white shadow-sm flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
                  aria-label="Next month"
                  title="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Month Jump Bar (1 - 12) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {milestoneItems.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.month}
                onClick={() => handleActiveChange(item, idx)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[11px] sm:text-xs font-black transition-all transform ${
                  isSelected
                    ? 'bg-[#f5c65d] text-[#49362d] scale-110 shadow-md ring-2 ring-[#f3a187]/60'
                    : 'bg-white/80 hover:bg-white text-[#49362d]/70 border border-gray-200 hover:scale-105'
                }`}
                title={`Month ${item.month}: ${item.title}`}
              >
                {item.month}
              </button>
            );
          })}
        </div>

        {/* Interaction Hint */}
        <div className="mt-4 text-center">
          <span className="text-[11px] font-bold text-[#49362d]/60 inline-flex items-center gap-1.5">
            <MoveVertical className="w-3.5 h-3.5 text-[#f3a187]" />
            <span>Drag the wheel, scroll, or tap any month to spin through Hanvika's first year!</span>
          </span>
        </div>
      </motion.div>
    </section>
  );
};
