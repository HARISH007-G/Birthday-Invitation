import React from 'react';

interface CloudDividerProps {
  fillColor?: string;
  flip?: boolean;
}

export const CloudDivider: React.FC<CloudDividerProps> = ({ fillColor = "#fff8ee", flip = false }) => {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-12 md:h-16"
        style={{ fill: fillColor }}
      >
        <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,-20 1200,40 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
};
