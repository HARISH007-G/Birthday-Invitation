import React from 'react';

export const SkyClouds: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-45">
      {/* Cloud 1 */}
      <div className="absolute top-12 left-[-150px] animate-drift" style={{ animationDuration: '42s' }}>
        <svg width="180" height="90" viewBox="0 0 180 90" fill="#ffffff">
          <path d="M 20,60 Q 0,60 10,40 Q 20,10 50,20 Q 80,0 110,20 Q 140,10 160,30 Q 180,50 160,70 Q 140,90 110,80 Q 80,90 50,80 Z" />
        </svg>
      </div>

      {/* Cloud 2 */}
      <div className="absolute top-48 left-[-150px] animate-drift" style={{ animationDuration: '55s', animationDelay: '12s' }}>
        <svg width="220" height="110" viewBox="0 0 180 90" fill="#ffffff">
          <path d="M 20,60 Q 0,60 10,40 Q 20,10 50,20 Q 80,0 110,20 Q 140,10 160,30 Q 180,50 160,70 Q 140,90 110,80 Q 80,90 50,80 Z" />
        </svg>
      </div>

      {/* Cloud 3 */}
      <div className="absolute top-96 left-[-150px] animate-drift" style={{ animationDuration: '38s', animationDelay: '25s' }}>
        <svg width="160" height="80" viewBox="0 0 180 90" fill="#ffffff">
          <path d="M 20,60 Q 0,60 10,40 Q 20,10 50,20 Q 80,0 110,20 Q 140,10 160,30 Q 180,50 160,70 Q 140,90 110,80 Q 80,90 50,80 Z" />
        </svg>
      </div>
    </div>
  );
};
