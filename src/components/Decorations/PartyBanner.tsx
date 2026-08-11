import React from 'react';

export const PartyBanner: React.FC = () => {
  const flags = [
    { color: '#f5c65d' },
    { color: '#f3a187' },
    { color: '#b9dde4' },
    { color: '#e2f0d9' },
    { color: '#ba68c8' },
    { color: '#f5c65d' },
    { color: '#f3a187' },
    { color: '#b9dde4' },
    { color: '#e2f0d9' },
    { color: '#ba68c8' },
    { color: '#f5c65d' },
    { color: '#f3a187' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden h-12 flex items-start justify-between px-2">
      <svg viewBox="0 0 1200 60" className="w-full h-full" fill="none" preserveAspectRatio="none">
        {/* Rope string */}
        <path d="M 0,5 Q 600,45 1200,5" stroke="#49362d" strokeWidth="2" strokeDasharray="4 2" opacity="0.3" />

        {/* Bunting Flag Triangles */}
        {flags.map((flag, idx) => {
          const cx = (idx + 0.5) * (1200 / flags.length);
          const cy = 10 + Math.sin((idx / flags.length) * Math.PI) * 20;
          return (
            <g key={idx} transform={`translate(${cx - 20}, ${cy})`} className="animate-sway" style={{ animationDelay: `${idx * 0.2}s` }}>
              <polygon points="0,0 40,0 20,40" fill={flag.color} stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
