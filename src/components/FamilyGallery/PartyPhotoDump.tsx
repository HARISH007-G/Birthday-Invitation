import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, ExternalLink, Share2, Sparkles, Copy, CheckCircle, Image as ImageIcon, Heart } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface PartyPhotoDumpProps {
  className?: string;
}

export const PartyPhotoDump: React.FC<PartyPhotoDumpProps> = ({ className = '' }) => {
  const [copied, setCopied] = useState(false);

  // Google Drive / Shared Photos Album Link from config
  const sharedAlbumUrl = birthdayConfig.event.sharedAlbumUrl || "https://photos.google.com";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sharedAlbumUrl);
    } catch {
      const el = document.createElement('textarea');
      el.value = sharedAlbumUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = `📸 *Y S Hanvika's 1st Birthday Party Photo Dump!* 🎈\n\nAttending the party? Upload your photos & videos to our shared album so Suganya & Yogarajan can save them all!\n\n📤 *Upload Photos Here:* ${sharedAlbumUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const samplePhotos = [
    { title: "Cake Cutting 🎂", image: "/images/birthday.jpg" },
    { title: "Family Cuddles 💖", image: "/images/family-01.jpg" },
    { title: "Sweet Smiles 🌟", image: "/images/month-12.jpg" },
  ];

  return (
    <section id="photo-dump" className={`relative py-20 px-4 max-w-6xl mx-auto overflow-hidden ${className}`}>
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#f5c65d]/20 via-[#f3a187]/20 to-[#b9dde4]/20 blur-3xl" />
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff3d1] border border-[#f5c65d]/50 shadow-sm mb-3">
          <Camera className="w-4 h-4 text-[#f3a187] animate-bounce" />
          <span className="text-xs font-black uppercase tracking-widest text-[#49362d]">
            Guest Memory Drive & Photo Dump
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Party Photo Dump 📸
        </h2>
        <p className="text-[#49362d]/80 font-medium mt-2 text-sm md:text-base">
          Took cute photos or videos at Hanvika’s party? Upload them to our shared album so Suganya & Yogarajan can cherish every smile!
        </p>
      </div>

      {/* Main Glassmorphic Photo Dump Card */}
      <div className="glass-card rounded-[40px] p-6 md:p-10 border-4 border-[#fff3d1] shadow-2xl relative max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Information & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5d6d0] text-[#f3a187] text-xs font-extrabold shadow-2xs mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SHARED GUEST ALBUM</span>
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold font-serif text-[#49362d]">
                Upload Your Party Moments 🌟
              </h3>
              <p className="text-xs md:text-sm text-[#49362d]/75 font-medium mt-2 leading-relaxed">
                Whether it's cake cutting giggles, selfie frame poses, or family group snaps, click below to add your phone photos & videos directly into our shared Google Drive / Photos vault!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={sharedAlbumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[#f5c65d] to-[#f3a187] text-white font-extrabold text-sm shadow-xl border-2 border-white/60 hover:shadow-2xl"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photos & Videos 📤</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <a
                href={sharedAlbumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-[#fff8ee] text-[#49362d] font-extrabold text-sm shadow-md border-2 border-[#f5c65d]/50 transition-all transform hover:-translate-y-0.5"
              >
                <ImageIcon className="w-4 h-4 text-[#f3a187]" />
                <span>View Full Album 🖼️</span>
              </a>
            </div>

            {/* Sub Utility Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-full font-bold text-xs shadow-xs border transition-all flex items-center gap-1.5 ${
                  copied
                    ? 'bg-[#e2f0d9] border-[#afc6a4] text-[#49362d]'
                    : 'bg-white border-gray-200 text-[#49362d] hover:bg-[#fff8ee]'
                }`}
              >
                {copied ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-[#afc6a4]" /><span>Album Link Copied! ✓</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5 text-[#f3a187]" /><span>Copy Album Link 📋</span></>
                )}
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-xs border border-white flex items-center gap-1.5 hover:bg-[#1eb853] transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Album on WhatsApp 📲</span>
              </button>
            </div>
          </div>

          {/* Right Column: Stacked Polaroid Memory Preview (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center py-6">
            <div className="relative w-64 h-72">
              {samplePhotos.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ rotate: (i - 1) * 8, scale: 0.9 }}
                  whileHover={{ rotate: 0, scale: 1.05, zIndex: 30 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    top: `${i * 12}px`,
                    left: `${i * 10}px`,
                    zIndex: 10 + i
                  }}
                  className="absolute w-56 p-3 rounded-2xl bg-white shadow-xl border-2 border-gray-100 flex flex-col items-center select-none"
                >
                  <div className="w-full h-44 rounded-xl overflow-hidden shadow-inner mb-2 bg-[#fff8ee]">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full flex items-center justify-between px-1 text-xs font-bold text-[#49362d]">
                    <span>{photo.title}</span>
                    <Heart className="w-3.5 h-3.5 text-[#f3a187] fill-current" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
