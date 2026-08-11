import React from 'react';

export const BalloonSVG: React.FC<{ color?: string; stringColor?: string; className?: string; style?: React.CSSProperties }> = ({
  color = '#f3a187',
  stringColor = '#49362d',
  className = 'w-12 h-16',
  style,
}) => (
  <svg viewBox="0 0 100 140" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">

    <ellipse cx="50" cy="50" rx="40" ry="48" fill={color} />
    {/* Highlight */}
    <ellipse cx="34" cy="34" rx="12" ry="16" fill="#ffffff" fillOpacity="0.4" transform="rotate(-20 34 34)" />
    {/* Knot */}
    <polygon points="44,98 56,98 50,106" fill={color} />
    {/* String */}
    <path d="M50 106 Q45 120 52 135 T48 145" stroke={stringColor} strokeWidth="2.5" fill="none" opacity="0.6" />
  </svg>
);

export const CakeSVG: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Layer */}
    <rect x="15" y="55" width="70" height="35" rx="8" fill="#fff3d1" stroke="#f5c65d" strokeWidth="3" />
    <rect x="25" y="30" width="50" height="28" rx="6" fill="#f5d6d0" stroke="#f3a187" strokeWidth="3" />
    {/* Frosting drips */}
    <path d="M25 38 Q35 44 40 38 Q45 44 50 38 Q55 44 60 38 Q65 44 75 38" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    {/* Candle */}
    <rect x="47" y="14" width="6" height="16" fill="#b9dde4" rx="2" />
    {/* Candle Flame */}
    <path d="M50 4 C54 10 52 14 50 15 C48 14 46 10 50 4 Z" fill="#f5c65d" className="animate-flame" />
  </svg>
);

export const StarSVG: React.FC<{ color?: string; className?: string }> = ({
  color = '#f5c65d',
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.85 8.76L22 9.27L16.54 13.97L18.18 21L12 17.27L5.82 21L7.46 13.97L2 9.27L9.15 8.76L12 2Z" />
  </svg>
);

export const CloudSVG: React.FC<{ color?: string; className?: string }> = ({
  color = '#ffffff',
  className = 'w-24 h-14',
}) => (
  <svg viewBox="0 0 120 70" className={className} fill={color} xmlns="http://www.w3.org/2000/svg" filter="drop-shadow(0px 4px 12px rgba(0,0,0,0.04))">
    <path d="M25 60 C10 60 0 48 0 35 C0 22 12 12 25 15 C32 5 45 0 60 0 C78 0 92 10 98 22 C108 20 120 30 120 42 C120 54 108 60 95 60 Z" opacity="0.95" />
  </svg>
);

export const GiftSVG: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="40" width="70" height="50" rx="8" fill="#b9dde4" stroke="#49362d" strokeWidth="3" />
    <rect x="10" y="30" width="80" height="15" rx="4" fill="#f3a187" stroke="#49362d" strokeWidth="3" />
    {/* Ribbon */}
    <rect x="44" y="30" width="12" height="60" fill="#f5c65d" />
    {/* Bow */}
    <path d="M50 30 C35 15 25 25 45 30 Z M50 30 C65 15 75 25 55 30 Z" fill="#f5c65d" stroke="#49362d" strokeWidth="2" />
  </svg>
);

export const FlowerSVG: React.FC<{ color?: string; className?: string }> = ({
  color = '#f5d6d0',
  className = 'w-8 h-8',
}) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="25" r="18" fill={color} />
    <circle cx="75" cy="50" r="18" fill={color} />
    <circle cx="50" cy="75" r="18" fill={color} />
    <circle cx="25" cy="50" r="18" fill={color} />
    {/* Center */}
    <circle cx="50" cy="50" r="14" fill="#f5c65d" />
  </svg>
);

export const TeddySVG: React.FC<{ className?: string }> = ({ className = 'w-12 h-14' }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ears */}
    <circle cx="25" cy="25" r="16" fill="#d7ccc8" stroke="#49362d" strokeWidth="3" />
    <circle cx="75" cy="25" r="16" fill="#d7ccc8" stroke="#49362d" strokeWidth="3" />
    <circle cx="25" cy="25" r="8" fill="#f5d6d0" />
    <circle cx="75" cy="25" r="8" fill="#f5d6d0" />
    {/* Head */}
    <circle cx="50" cy="45" r="32" fill="#d7ccc8" stroke="#49362d" strokeWidth="3" />
    {/* Muzzle */}
    <ellipse cx="50" cy="52" rx="14" ry="10" fill="#fff8ee" />
    <ellipse cx="50" cy="48" rx="5" ry="4" fill="#49362d" />
    {/* Eyes */}
    <circle cx="38" cy="40" r="4" fill="#49362d" />
    <circle cx="62" cy="40" r="4" fill="#49362d" />
    {/* Body */}
    <ellipse cx="50" cy="90" rx="30" ry="26" fill="#d7ccc8" stroke="#49362d" strokeWidth="3" />
    <ellipse cx="50" cy="90" rx="18" ry="14" fill="#fff8ee" />
  </svg>
);

export const PartyHatSVG: React.FC<{ className?: string }> = ({ className = 'w-10 h-12' }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,20 15,105 85,105" fill="#f3a187" stroke="#49362d" strokeWidth="3" />
    {/* Stripes */}
    <path d="M38 60 L62 60 M28 85 L72 85" stroke="#f5c65d" strokeWidth="8" strokeLinecap="round" />
    {/* Pom-pom */}
    <circle cx="50" cy="18" r="10" fill="#fff" stroke="#f5c65d" strokeWidth="3" />
  </svg>
);

export const RattleSVG: React.FC<{ className?: string }> = ({ className = 'w-8 h-12' }) => (
  <svg viewBox="0 0 60 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="22" fill="#b9dde4" stroke="#49362d" strokeWidth="3" />
    <circle cx="30" cy="30" r="12" fill="#f5d6d0" />
    <rect x="26" y="52" width="8" height="38" rx="4" fill="#f5c65d" stroke="#49362d" strokeWidth="3" />
    <circle cx="30" cy="92" r="6" fill="#afc6a4" />
  </svg>
);
