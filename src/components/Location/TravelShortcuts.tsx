import React, { useState } from 'react';
import { MapPin, Navigation, Car, Copy, CheckCircle, Share2, Compass, ParkingCircle } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface TravelShortcutsProps {
  className?: string;
}

export const TravelShortcuts: React.FC<TravelShortcutsProps> = ({ className = '' }) => {
  const [copied, setCopied] = useState(false);

  // Venue coordinates: Royapuram, Chennai
  const lat = 13.1118;
  const lng = 80.2933;
  const venueName = birthdayConfig.event.venueName;
  const venueAddress = birthdayConfig.event.locationAddress;
  const fullAddress = `${venueName}, ${venueAddress}`;

  // Platform URLs
  const googleMapsUrl = birthdayConfig.event.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(venueName)}`;
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(venueName)}`;
  const olaUrl = `https://link.olacabs.com/ride?drop_lat=${lat}&drop_lng=${lng}&drop_name=${encodeURIComponent(venueName)}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
    } catch {
      const el = document.createElement('textarea');
      el.value = fullAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = `🎂 Join us for ${birthdayConfig.babyName}'s 1st Birthday Celebration!\n\n📍 Venue: ${venueName}\n🏢 Address: ${venueAddress}\n🗓️ Date: ${birthdayConfig.event.date} at ${birthdayConfig.event.time}\n\n🗺️ Open Directions: ${googleMapsUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={`glass-card rounded-[32px] p-6 md:p-8 border-2 border-white shadow-xl max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fff3d1] border border-[#f5c65d]/40 text-[#49362d] text-xs font-black uppercase tracking-wider">
          <Car className="w-3.5 h-3.5 text-[#f3a187]" />
          <span>Smart Travel & Directions Shortcut</span>
        </span>
        <h3 className="text-xl md:text-2xl font-extrabold font-serif text-[#49362d] mt-2">
          Easily Navigate or Book a Ride to the Venue 🚗
        </h3>
        <p className="text-xs md:text-sm text-[#49362d]/75 font-medium mt-1">
          Tap any button below for one-click navigation or pre-filled cab booking!
        </p>
      </div>

      {/* Main Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-gradient-to-r from-[#29b6f6] to-[#0288d1] text-white font-extrabold text-xs shadow-md border border-white/30 flex items-center justify-center gap-2 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Navigation className="w-4 h-4" />
          <span>Google Maps 🗺️</span>
        </a>

        {/* Apple Maps */}
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-white text-[#49362d] font-extrabold text-xs shadow-md border border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all transform hover:-translate-y-0.5"
        >
          <Compass className="w-4 h-4 text-[#f3a187]" />
          <span>Apple Maps 🍎</span>
        </a>

        {/* Uber */}
        <a
          href={uberUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-[#000000] text-white font-extrabold text-xs shadow-md border border-white/20 flex items-center justify-center gap-2 hover:bg-gray-900 transition-all transform hover:-translate-y-0.5"
        >
          <Car className="w-4 h-4 text-[#f5c65d]" />
          <span>Book Uber 🚕</span>
        </a>

        {/* Ola */}
        <a
          href={olaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-[#8bc34a] text-[#1b5e20] font-extrabold text-xs shadow-md border border-white/30 flex items-center justify-center gap-2 hover:bg-[#7cb342] transition-all transform hover:-translate-y-0.5"
        >
          <Car className="w-4 h-4 text-[#1b5e20]" />
          <span>Book Ola 🚖</span>
        </a>
      </div>

      {/* Utility Actions Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={handleCopyAddress}
          className={`px-5 py-2.5 rounded-full font-bold text-xs shadow-sm border transition-all flex items-center gap-1.5 ${
            copied
              ? 'bg-[#e2f0d9] border-[#afc6a4] text-[#49362d]'
              : 'bg-white border-gray-200 text-[#49362d] hover:bg-[#fff8ee]'
          }`}
        >
          {copied ? (
            <><CheckCircle className="w-3.5 h-3.5 text-[#afc6a4]" /><span>Address Copied! ✓</span></>
          ) : (
            <><Copy className="w-3.5 h-3.5 text-[#f3a187]" /><span>Copy Address 📋</span></>
          )}
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="px-5 py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-sm border border-white flex items-center gap-1.5 hover:bg-[#1eb853] transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Venue on WhatsApp 📲</span>
        </button>
      </div>

      {/* Helpful Chips Info */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-[#49362d]/70">
        <span className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 flex items-center gap-1">
          <ParkingCircle className="w-3 h-3 text-[#f5c65d]" />
          <span>Free Dedicated Guest Parking</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#f3a187]" />
          <span>Opp. R S R M Hospital, Royapuram</span>
        </span>
      </div>
    </div>
  );
};
