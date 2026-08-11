import React from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import {
  BalloonSVG,
  CakeSVG,
  StarSVG,
  CloudSVG,
  GiftSVG,
  FlowerSVG,
  TeddySVG,
  PartyHatSVG,
  RattleSVG,
} from './DecorationsSVG';

export const FloatingDecorations: React.FC = () => {
  const isReducedMotion = useReducedMotion();

  if (isReducedMotion) {
    return null; // Respect user reduced motion preference
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* LAYER 1: Background distant elements (35% Opacity, Slow movement) */}
      <div className="absolute inset-0 opacity-35">
        {/* Top Left Clouds */}
        <div className="absolute top-[8%] left-[-2%] animate-drift" style={{ animationDuration: '45s' }}>
          <CloudSVG className="w-36 h-20 text-white" />
        </div>
        <div className="absolute top-[22%] right-[-3%] animate-drift" style={{ animationDuration: '55s' }}>
          <CloudSVG className="w-48 h-24 text-white" />
        </div>
        {/* Distant Floating Balloons */}
        <div className="absolute top-[35%] left-[3%] animate-float-slow" style={{ animationDuration: '9s' }}>
          <BalloonSVG color="#b9dde4" className="w-10 h-14" />
        </div>
        <div className="absolute top-[65%] right-[2%] animate-float-slow" style={{ animationDuration: '11s', animationDelay: '2s' }}>
          <BalloonSVG color="#f5d6d0" className="w-12 h-16" />
        </div>
        {/* Soft Twinkling Background Stars */}
        <div className="absolute top-[15%] left-[12%] animate-pulse-soft">
          <StarSVG color="#f5c65d" className="w-5 h-5" />
        </div>
        <div className="absolute top-[48%] right-[10%] animate-pulse-soft" style={{ animationDelay: '1.5s' }}>
          <StarSVG color="#f3a187" className="w-6 h-6" />
        </div>
        <div className="absolute top-[78%] left-[8%] animate-pulse-soft" style={{ animationDelay: '3s' }}>
          <StarSVG color="#afc6a4" className="w-5 h-5" />
        </div>
      </div>

      {/* LAYER 2: Middle decorations (75% Opacity, Natural float) */}
      <div className="absolute inset-0 opacity-75">
        {/* Swaying Flowers */}
        <div className="absolute top-[18%] left-[1.5%] animate-sway">
          <FlowerSVG color="#f5d6d0" className="w-10 h-10" />
        </div>
        <div className="absolute top-[42%] right-[1.5%] animate-sway" style={{ animationDelay: '1s' }}>
          <FlowerSVG color="#fff3d1" className="w-12 h-12" />
        </div>
        <div className="absolute top-[82%] right-[2%] animate-sway" style={{ animationDelay: '2s' }}>
          <FlowerSVG color="#b9dde4" className="w-10 h-10" />
        </div>

        {/* Bouncing Gifts & Party Hats */}
        <div className="absolute top-[52%] left-[2%] animate-float-slow" style={{ animationDuration: '7s' }}>
          <GiftSVG className="w-10 h-10" />
        </div>
        <div className="absolute top-[72%] left-[1%] animate-sway">
          <PartyHatSVG className="w-10 h-12" />
        </div>
        <div className="absolute top-[28%] right-[2%] animate-float-slow" style={{ animationDuration: '8s' }}>
          <RattleSVG className="w-8 h-12" />
        </div>
      </div>

      {/* LAYER 3: Foreground Crisp Elements (100% Opacity) */}
      <div className="absolute inset-0">
        {/* Floating Pastel Balloons */}
        <div className="absolute top-[12%] right-[2.5%] animate-float-slow" style={{ animationDuration: '6s' }}>
          <BalloonSVG color="#f5c65d" className="w-14 h-20 drop-shadow-soft" />
        </div>
        <div className="absolute top-[38%] left-[1.5%] animate-float-slow" style={{ animationDuration: '7.5s', animationDelay: '1s' }}>
          <BalloonSVG color="#f3a187" className="w-12 h-18 drop-shadow-soft" />
        </div>
        {/* Teddy Bear Rocking */}
        <div className="absolute top-[88%] left-[2.5%] animate-sway" style={{ animationDuration: '5s' }}>
          <TeddySVG className="w-14 h-16 drop-shadow-soft" />
        </div>
        {/* Cake floating gently */}
        <div className="absolute top-[92%] right-[3%] animate-float-slow" style={{ animationDuration: '7s' }}>
          <CakeSVG className="w-14 h-14 drop-shadow-soft" />
        </div>
      </div>
    </div>
  );
};
