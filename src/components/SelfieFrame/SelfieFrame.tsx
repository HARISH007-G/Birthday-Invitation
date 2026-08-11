import React, { useState } from 'react';
import { Camera, Sparkles, Download, Upload, Share2, Award, Calendar, Quote } from 'lucide-react';
import { BalloonSVG, FlowerSVG, TeddySVG, CakeSVG } from '../FloatingDecorations/DecorationsSVG';

const SOUVENIR_QUOTES = [
  '“One tiny day, one lifetime memory forever.”',
  '“12 months of giggles, 365 days of love!”',
  '“First trip around the sun, forever our sunshine!”',
  '“Little hands, tiny feet, making life so sweet!”',
  '“Wrapped in love, blessed with joy, turning one today!”',
];

export const SelfieFrame: React.FC = () => {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>('');
  const [selectedQuote, setSelectedQuote] = useState<string>(SOUVENIR_QUOTES[0]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadSelfie = () => {
    if (!userPhoto) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = userPhoto;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 700;
      canvas.height = 920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Rich Outer Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 700, 920);
      grad.addColorStop(0, '#fff8ee');
      grad.addColorStop(0.3, '#fff3d1');
      grad.addColorStop(0.7, '#f5d6d0');
      grad.addColorStop(1, '#e2f0d9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 700, 920);

      // 2. Outer Decorative Double Frame
      ctx.strokeStyle = '#f5c65d';
      ctx.lineWidth = 14;
      ctx.strokeRect(16, 16, 668, 888);

      ctx.strokeStyle = '#f3a187';
      ctx.lineWidth = 4;
      ctx.strokeRect(26, 26, 648, 868);

      // 3. Top Banner Strip
      ctx.fillStyle = '#f5c65d';
      ctx.beginPath();
      ctx.roundRect(100, 40, 500, 50, 25);
      ctx.fill();

      ctx.fillStyle = '#49362d';
      ctx.font = 'bold 20px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText("✨ HANVIKA'S 1ST BIRTHDAY SOUVENIR ✨", 350, 72);

      // Subtitle
      ctx.font = 'bold 15px "Nunito", sans-serif';
      ctx.fillStyle = '#f3a187';
      ctx.fillText('A Magical Keepsake From Today • 14 October 2026', 350, 115);

      // 4. Badges Strip
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(80, 135, 240, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#49362d';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('🗓️ Wednesday, 14 Oct 2026', 200, 158);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(380, 135, 240, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#f3a187';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('👑 Official Birthday Guest', 500, 158);

      // 5. Main Photo Layer & Layered Polaroid Border
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(73, 54, 45, 0.15)';
      ctx.shadowBlur = 20;
      ctx.fillRect(60, 190, 580, 540);
      ctx.shadowColor = 'transparent';

      // Inner Photo Image
      ctx.drawImage(img, 80, 210, 540, 470);

      // Photo Frame Line
      ctx.strokeStyle = '#f5c65d';
      ctx.lineWidth = 4;
      ctx.strokeRect(80, 210, 540, 470);

      // 6. Guest Name Tag inside photo
      if (guestName.trim()) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(100, 625, 500, 40);
        ctx.fillStyle = '#49362d';
        ctx.font = 'bold 18px cursive, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`With love from: ${guestName}`, 350, 652);
      }

      // 7. Bottom Quote & Details Area
      ctx.fillStyle = '#49362d';
      ctx.font = 'italic bold 20px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedQuote, 350, 770);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#f3a187';
      ctx.fillText('Hanvika • Kalaignar Thirumana Maligai, Royapuram, Chennai', 350, 805);

      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#777777';
      ctx.fillText('Suganya & Yogarajan • Thank you for celebrating with us!', 350, 840);

      // 8. Export PNG File
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Hanvika-1st-Birthday-Souvenir-${(guestName || 'Guest').replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  };

  const handleShareWhatsApp = () => {
    const text = `Look at our souvenir photo card from Y S Hanvika's 1st Birthday celebration! 🎉%0A- Event: 14 October 2026 | Royapuram, Chennai%0A- Host: Suganya %26 Yogarajan`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section className="relative py-20 px-4 max-w-5xl mx-auto overflow-hidden">
      {/* Background Sparkles & Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#f5c65d]/20 via-[#f3a187]/20 to-[#b9dde4]/20 blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#fff3d1] border border-[#f5c65d]/50 shadow-sm mb-3">
          <Sparkles className="w-4 h-4 text-[#f5c65d] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-[#49362d]">
            Digital Souvenir Keepsake
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Hanvika’s Birthday Souvenir Card
        </h2>
        <p className="text-[#49362d]/80 font-medium mt-2 text-sm md:text-base">
          Upload your photo, pick a cute quote, personalize your name, and take home a beautiful keepsake from Hanvika’s 1st Birthday!
        </p>
      </div>

      {/* Controls Container */}
      <div className="glass-card rounded-[36px] p-6 md:p-10 border-4 border-[#fff3d1] shadow-2xl relative max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Input Controls */}
        <div className="w-full space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2">
                1. Your Name / Family Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh & Family"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2">
                2. Upload Photo
              </label>
              <label className="w-full py-3 px-4 rounded-2xl bg-[#f5c65d] hover:bg-[#f3a187] text-[#49362d] font-bold text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{userPhoto ? 'Change Photo 📸' : 'Upload Selfie / Photo 📸'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 3. Choose Souvenir Birthday Quote */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-[#f3a187]" />
              <span>3. Choose Birthday Keepsake Quote</span>
            </label>
            <select
              value={selectedQuote}
              onChange={(e) => setSelectedQuote(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#f5c65d] focus:outline-hidden text-xs md:text-sm font-bold text-[#49362d] shadow-2xs"
            >
              {SOUVENIR_QUOTES.map((q, idx) => (
                <option key={idx} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ULTRA PREMIUM MINI SOUVENIR POSTER CARD */}
        <div
          id="guestSouvenirPoster"
          className="relative w-full max-w-md rounded-[36px] p-6 bg-gradient-to-br from-[#fff8ee] via-white to-[#f5d6d0] shadow-2xl border-4 border-[#f5c65d] overflow-hidden flex flex-col justify-between text-center select-none"
        >
          {/* Decorative Corner Washi Tape */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#f5c65d]/70 rotate-[-1deg] shadow-xs z-20" />

          {/* Floating Stickers around corners */}
          <div className="absolute top-4 left-4 z-20 opacity-90 animate-sway">
            <BalloonSVG color="#f5c65d" className="w-8 h-10" />
          </div>
          <div className="absolute top-4 right-4 z-20 opacity-90 animate-sway" style={{ animationDelay: '1s' }}>
            <TeddySVG className="w-8 h-10" />
          </div>
          <div className="absolute bottom-16 left-4 z-20 opacity-90">
            <FlowerSVG color="#f3a187" className="w-7 h-7" />
          </div>
          <div className="absolute bottom-16 right-4 z-20 opacity-90">
            <CakeSVG className="w-8 h-8" />
          </div>

          {/* TOP SECTION: Soft Gradient Header */}
          <div className="z-10 pt-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#f5c65d] text-[#49362d] text-xs font-black shadow-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ HANVIKA’S 1ST BIRTHDAY SOUVENIR ✨</span>
            </div>
            <p className="text-xs font-bold text-[#f3a187]">
              A Magical Memory To Take Home Forever
            </p>

            {/* Badges Strip */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-white text-[#49362d] text-[10px] font-extrabold border border-[#f5c65d]/40 shadow-2xs flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#f5c65d]" />
                <span>14 Oct 2026</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-[#f3a187] text-[10px] font-extrabold border border-[#f3a187]/40 shadow-2xs flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>Official Guest</span>
              </span>
            </div>
          </div>

          {/* PHOTO FRAME AREA */}
          <div className="relative z-10 w-full aspect-[4/3] rounded-3xl bg-white p-3 shadow-lg border-2 border-[#f5c65d] overflow-hidden my-2 flex flex-col items-center justify-center">
            {userPhoto ? (
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={userPhoto}
                  alt="Guest Souvenir"
                  className="w-full h-full object-cover"
                />
                {guestName && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-[#49362d] text-center shadow-xs">
                    With love from: {guestName} ❤️
                  </div>
                )}
              </div>
            ) : (
              /* ELEGANT EMPTY STATE DESIGN */
              <label className="w-full h-full rounded-2xl border-2 border-dashed border-[#f5c65d] bg-[#fff8ee]/60 hover:bg-[#fff8ee] transition-colors flex flex-col items-center justify-center p-4 cursor-pointer text-center">
                <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mb-2">
                  <Camera className="w-7 h-7 text-[#f3a187] animate-pulse" />
                </div>
                <p className="font-serif font-bold text-sm text-[#49362d]">
                  Tap to upload your photo
                </p>
                <p className="text-[11px] font-bold text-[#49362d]/60 mt-0.5">
                  or select a family picture to create your birthday keepsake
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* RICH BOTTOM MESSAGE & FOOTER */}
          <div className="z-10 pt-2 space-y-1">
            <p className="font-serif font-bold italic text-sm md:text-base text-[#49362d]">
              {selectedQuote}
            </p>
            <p className="text-xs font-extrabold text-[#f3a187]">
              Hanvika • Kalaignar Thirumana Maligai, Royapuram
            </p>
            <p className="text-[10px] font-bold text-[#49362d]/60">
              Suganya & Yogarajan • Thank you for celebrating this special day!
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
          {userPhoto ? (
            <>
              <button
                onClick={handleDownloadSelfie}
                className="flex-1 py-3.5 rounded-full bg-[#49362d] hover:bg-[#f3a187] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Souvenir Image 🖼️</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="py-3.5 px-5 rounded-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Card</span>
              </button>
            </>
          ) : (
            <p className="text-center text-xs font-bold text-[#49362d]/70 w-full">
              ✨ Upload a photo above to unlock instant high-res PNG download & WhatsApp sharing!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
