import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Sparkles, MapPin, Calendar, Clock, Download, QrCode, CheckCircle } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { useConfetti } from '../../hooks/useConfetti';

export const PartyPass: React.FC = () => {
  const [guestName, setGuestName] = useState('');
  const [passGenerated, setPassGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { triggerHeroBurst } = useConfetti();

  const mapsUrl = birthdayConfig.event.googleMapsUrl;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(mapsUrl)}`;

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setPassGenerated(true);
    triggerHeroBurst();
  };

  const handleDownloadPassImage = () => {
    setIsDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 460;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    const finishDownload = (dataUrl: string) => {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Hanvika-Party-Pass-${guestName.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloading(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    };

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 650, 460);
    grad.addColorStop(0, '#fff3d1');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(1, '#f5d6d0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 650, 460);

    // Border
    ctx.strokeStyle = '#f5c65d';
    ctx.lineWidth = 12;
    ctx.strokeRect(10, 10, 630, 440);

    // Header Badge
    ctx.fillStyle = '#f5c65d';
    ctx.beginPath();
    ctx.roundRect(175, 25, 300, 36, 18);
    ctx.fill();

    ctx.fillStyle = '#49362d';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ OFFICIAL VIP PARTY PASS ✨', 325, 48);

    // Title
    ctx.font = 'bold 28px serif';
    ctx.fillText("Y S HANVIKA'S 1ST BIRTHDAY", 325, 110);

    // Guest Name
    ctx.fillStyle = '#f3a187';
    ctx.font = 'bold 22px cursive, sans-serif';
    ctx.fillText(`Guest of Honor: ${guestName}`, 325, 145);

    // Event Info Box Left
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 175, 400, 170);
    ctx.strokeStyle = '#f5c65d';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 175, 400, 170);

    ctx.fillStyle = '#49362d';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🗓️ Date: Wednesday, 14 October 2026', 60, 215);
    ctx.fillText('⏰ Time: 6:00 PM Onwards', 60, 250);
    ctx.fillText('🎂 Cake Cutting: 7:00 PM', 60, 285);
    ctx.fillText('📍 Venue: Kalaignar Thirumana Maligai', 60, 320);

    // Draw QR Code Image Right
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrCodeUrl;
    qrImg.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(460, 175, 150, 170);
      ctx.strokeRect(460, 175, 150, 170);

      ctx.drawImage(qrImg, 470, 185, 130, 130);

      ctx.fillStyle = '#49362d';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Scan for Location 📍', 535, 332);

      // Footer
      ctx.fillStyle = '#777777';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Hosts: Suganya & Yogarajan • Show this pass at the venue entrance!', 325, 415);

      finishDownload(canvas.toDataURL('image/png'));
    };

    // Fallback if image fails crossOrigin load
    qrImg.onerror = () => {
      ctx.fillStyle = '#777777';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Hosts: Suganya & Yogarajan • Show this pass at the venue entrance!', 325, 415);

      finishDownload(canvas.toDataURL('image/png'));
    };
  };

  return (
    <section id="party-pass" className="relative py-20 px-4 max-w-4xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Exclusive Digital Pass
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Get Your Party Pass
        </h2>
        <p className="text-[#49362d]/80 font-medium mt-2 text-sm md:text-base">
          Type your name below to get your personalized digital VIP party badge with venue location QR code!
        </p>
      </div>

      <div className="glass-card rounded-[36px] p-6 md:p-10 border-4 border-[#fff3d1] shadow-2xl relative max-w-xl mx-auto">
        {!passGenerated ? (
          <form onSubmit={handleGeneratePass} className="space-y-4 text-center">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2">
                Enter Your Name / Family Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Uncle Ramesh & Family"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d] text-center shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#f5c65d] hover:bg-[#f3a187] text-[#49362d] font-bold text-base shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              <span>Generate My Digital Party Pass 🎟️</span>
            </button>
          </form>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="space-y-6"
            >
              {/* ILLUSTRATED DIGITAL PARTY PASS TICKET */}
              <div
                id="digitalPartyPassCard"
                className="relative bg-gradient-to-br from-[#fff3d1] via-white to-[#f5d6d0] rounded-3xl p-6 shadow-2xl border-4 border-[#f5c65d] overflow-hidden text-center"
              >
                {/* Gold Crest */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#f5c65d] text-[#49362d] text-xs font-extrabold shadow-sm mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OFFICIAL VIP PARTY PASS</span>
                </div>

                <h3 className="font-serif font-black text-2xl md:text-3xl text-[#49362d]">
                  Y S HANVIKA’S 1ST BIRTHDAY
                </h3>
                <p className="font-handwriting text-xl font-bold text-[#f3a187] mt-0.5">
                  Guest of Honor: {guestName}
                </p>

                {/* Event Highlights & Scannable QR Code Layout */}
                <div className="flex flex-col sm:flex-row items-center gap-4 my-5 bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-[#f5c65d]/40 shadow-xs">
                  <div className="flex-1 text-left space-y-2 text-xs font-bold text-[#49362d]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#f5c65d]" />
                      <span>Wednesday, 14 Oct 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#f3a187]" />
                      <span>6:00 PM (Cake cutting 7:00 PM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#29b6f6]" />
                      <span>Kalaignar Thirumana Maligai, Royapuram</span>
                    </div>
                  </div>

                  {/* Scannable Location QR Code */}
                  <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm shrink-0">
                    {/* QR MUST be square with NO border-radius — corners are finder patterns */}
                    <div className="w-28 h-28 flex items-center justify-center bg-white overflow-hidden">
                      <img
                        src={qrCodeUrl}
                        alt="Google Maps QR Code — Scan to navigate to venue"
                        className="w-full h-full object-contain"
                        style={{ borderRadius: 0 }}
                        draggable={false}
                      />
                    </div>
                    <span className="text-[10px] font-extrabold text-[#49362d] mt-1.5 flex items-center gap-1">
                      <QrCode className="w-3 h-3 text-[#f3a187]" />
                      <span>Scan for Location</span>
                    </span>
                  </div>
                </div>

                {/* Stub Footer */}
                <div className="pt-3 border-t-2 border-dashed border-[#49362d]/20 flex items-center justify-between text-[11px] font-extrabold text-[#49362d]/70">
                  <span>Host: Suganya & Yogarajan</span>
                  <span>Pass ID: #YSH-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadPassImage}
                  disabled={isDownloading}
                  className={`flex-1 py-3.5 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-105 ${
                    isDownloaded
                      ? 'bg-[#e2f0d9] text-[#49362d] border border-[#afc6a4]'
                      : 'bg-[#49362d] hover:bg-[#f3a187] text-white'
                  }`}
                >
                  {isDownloaded ? (
                    <><CheckCircle className="w-4 h-4 text-[#afc6a4]" /><span>Pass Downloaded! ✓</span></>
                  ) : isDownloading ? (
                    <><Download className="w-4 h-4 animate-bounce" /><span>Downloading Pass... ⏳</span></>
                  ) : (
                    <><Download className="w-4 h-4" /><span>Download Pass Image 🖼️</span></>
                  )}
                </button>
                <button
                  onClick={() => setPassGenerated(false)}
                  className="py-3.5 px-6 rounded-full bg-white hover:bg-gray-100 text-[#49362d] font-bold text-sm border border-gray-200"
                >
                  Create Another Pass
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};
