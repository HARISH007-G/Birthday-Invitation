import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { TravelShortcuts } from './TravelShortcuts';

export const LocationSection: React.FC = () => {
  const [routeFinished, setRouteFinished] = useState(false);

  return (
    <section className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Map & Route
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Illustrated Party Map
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-2 text-sm md:text-base">
          Follow the magical route straight to {birthdayConfig.event.venueName}, Royapuram, Chennai!
        </p>
      </div>

      {/* SVG Illustrated Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        onViewportEnter={() => setTimeout(() => setRouteFinished(true), 2500)}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#e2f0d9] rounded-[40px] p-6 md:p-10 shadow-2xl border-4 border-white overflow-hidden max-w-4xl mx-auto mb-10"
      >
        <div className="relative w-full h-[360px] md:h-[420px] rounded-3xl bg-[#eef7ea] overflow-hidden border-2 border-[#afc6a4]/50 shadow-inner">
          <svg viewBox="0 0 800 450" className="w-full h-full" fill="none">
            {/* Background Grass & River Details */}
            <path d="M-20 200 Q200 150 400 220 T820 180" stroke="#b9dde4" strokeWidth="36" opacity="0.6" strokeLinecap="round" />

            {/* Trees & Houses Scatter */}
            {/* Start point houses */}
            <g transform="translate(60, 320)">
              <rect width="40" height="30" fill="#fff" rx="4" stroke="#49362d" strokeWidth="2" />
              <polygon points="20,-10 -5,0 45,0" fill="#f3a187" stroke="#49362d" strokeWidth="2" />
              <text x="20" y="45" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#49362d" textAnchor="middle">YOU ARE HERE</text>
            </g>

            {/* Tree 1 */}
            <circle cx="220" cy="100" r="22" fill="#afc6a4" />
            <circle cx="200" cy="110" r="16" fill="#88a87a" />
            {/* Tree 2 */}
            <circle cx="580" cy="340" r="26" fill="#afc6a4" />

            {/* Main Curved Road */}
            <path
              id="partyRoadPath"
              d="M80 300 C 220 300, 200 120, 420 160 C 600 200, 560 300, 720 180"
              stroke="#ffffff"
              strokeWidth="28"
              strokeLinecap="round"
            />
            {/* Road Dotted Line */}
            <motion.path
              d="M80 300 C 220 300, 200 120, 420 160 C 600 200, 560 300, 720 180"
              stroke="#f5c65d"
              strokeWidth="6"
              strokeDasharray="12 12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />

            {/* Animated Car Traveling along Route */}
            <motion.g
              initial={{ offsetDistance: "0%" }}
              whileInView={{ offsetDistance: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              style={{
                offsetPath: 'path("M80 300 C 220 300, 200 120, 420 160 C 600 200, 560 300, 720 180")',
              }}
            >
              <g transform="translate(-18, -14)">
                <rect width="36" height="20" rx="8" fill="#f3a187" stroke="#49362d" strokeWidth="2" />
                <circle cx="8" cy="18" r="4" fill="#49362d" />
                <circle cx="28" cy="18" r="4" fill="#49362d" />
                <polygon points="12,2 24,2 20,-4 16,-4" fill="#fff" opacity="0.8" />
              </g>
            </motion.g>

            {/* Grand Venue Destination Building */}
            <g transform="translate(660, 90)">
              <rect width="110" height="80" fill={routeFinished ? '#fff3d1' : '#ffffff'} rx="12" stroke="#49362d" strokeWidth="3" className="transition-colors duration-500" />
              <polygon points="55,-20 0,0 110,0" fill="#f5c65d" stroke="#49362d" strokeWidth="3" />
              <rect x="45" y="45" width="20" height="35" fill="#49362d" rx="2" />
              {/* Bouncing Pin */}
              <g transform="translate(55, -35)" className="animate-bounce">
                <circle r="16" fill="#f3a187" stroke="#ffffff" strokeWidth="3" />
                <text x="0" y="5" fontFamily="sans-serif" fontSize="12" textAnchor="middle" fill="#ffffff">📍</text>
              </g>
              <text x="55" y="95" fontFamily="'Playfair Display', serif" fontSize="10" fontWeight="bold" fill="#49362d" textAnchor="middle">KALAIGNAR MALIGAI</text>
            </g>
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#f5c65d]/40 shadow-sm text-xs font-bold text-[#49362d] flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#f3a187]" />
            <span>Cemetry Road, Royapuram, Chennai - 600013 (Opp. R S R M Hospital)</span>
          </div>
        </div>
      </motion.div>

      {/* Smart Travel & Cab Booking Shortcuts Panel */}
      <TravelShortcuts />
    </section>
  );
};
