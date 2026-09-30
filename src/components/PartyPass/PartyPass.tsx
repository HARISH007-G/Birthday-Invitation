import React, { useState, useRef, useEffect } from 'react';
import { Ticket, Sparkles, Download, CheckCircle, RotateCcw } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { useConfetti } from '../../hooks/useConfetti';
import { AdmitOneTicket, playShutterSound, ticketClipPath, TICKET_GEOMETRY } from './AdmitOneTicket';

export const PartyPass: React.FC = () => {
  const [guestName, setGuestName] = useState('Guest of Honor');
  const [inputName, setInputName] = useState('');
  const [passGenerated, setPassGenerated] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [ticketWidth, setTicketWidth] = useState(640);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { triggerHeroBurst } = useConfetti();

  const mapsUrl = birthdayConfig.event.googleMapsUrl;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(mapsUrl)}`;

  // Responsive Ticket Width Calculation
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 32;
        // Limit between 320px (mobile) and 680px (desktop)
        const targetWidth = Math.max(300, Math.min(availableWidth, 680));
        setTicketWidth(targetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setGuestName(inputName.trim());
    setPassGenerated(true);
    playShutterSound({ volume: 0.4 });
    triggerHeroBurst();
  };

  const handleDownloadPassImage = () => {
    setIsDownloading(true);
    playShutterSound({ volume: 0.3 });

    const canvas = document.createElement('canvas');
    canvas.width = 1112; // 741 * 1.5
    canvas.height = 638;  // 425 * 1.5
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    const w = canvas.width;
    const h = canvas.height;

    // Draw Ticket Silhouette Clip Path
    const clipPathString = ticketClipPath(w, h, TICKET_GEOMETRY);
    const p = new Path2D(clipPathString);
    ctx.save();
    ctx.clip(p);

    // Warm Gold-Peach Sunset Background Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#fff3d1');
    grad.addColorStop(0.35, '#f5c65d');
    grad.addColorStop(0.7, '#f3a187');
    grad.addColorStop(1, '#e8886d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Inner Border
    ctx.strokeStyle = '#f5c65d';
    ctx.lineWidth = 10;
    ctx.stroke(p);

    // Perforation Line
    const perfX = (562 / 741) * w;
    ctx.strokeStyle = 'rgba(73, 54, 45, 0.35)';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(perfX, 0);
    ctx.lineTo(perfX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Watermark on Stub
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '900 130px sans-serif';
    ctx.translate(perfX + (w - perfX) / 2 + 10, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2026', 0, 0);
    ctx.restore();

    // Stub Vertical Text
    ctx.save();
    ctx.fillStyle = '#49362d';
    ctx.font = '800 36px sans-serif';
    ctx.translate(perfX + (w - perfX) / 2 - 35, h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OFFICIAL VIP PASS', 0, 0);
    ctx.restore();

    // Main Text
    ctx.fillStyle = '#49362d';
    ctx.textAlign = 'left';

    // Presenter
    ctx.font = '800 24px sans-serif';
    ctx.fillText('SUGANYA & YOGARAJAN PRESENT', 80, 90);

    // Event
    ctx.font = '900 32px serif';
    ctx.fillText("Y S HANVIKA'S 1ST BIRTHDAY", 80, 130);

    // Guest Name
    ctx.font = '900 64px serif';
    ctx.fillText(guestName.toUpperCase(), 80, 240);

    // Venue & Date
    ctx.font = '800 24px sans-serif';
    ctx.fillText('KALAIGNAR MALIGAI, ROYAPURAM · OCT 14 · 6:00 PM', 80, 480);
    ctx.font = '600 18px sans-serif';
    ctx.fillStyle = 'rgba(73, 54, 45, 0.8)';
    ctx.fillText('Dress Code: Pastel Colors · Cake Cutting: 7:00 PM', 80, 515);

    // Draw QR Code
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrCodeUrl;

    const finishCanvas = () => {
      ctx.restore();
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `Hanvika-VIP-Pass-${guestName.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloading(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    };

    qrImg.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(perfX - 170, 270, 140, 140);
      ctx.drawImage(qrImg, perfX - 165, 275, 130, 130);
      finishCanvas();
    };
    qrImg.onerror = finishCanvas;
  };

  return (
    <section id="party-pass" className="relative py-20 px-4 max-w-5xl mx-auto overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#f5c65d]/20 via-[#f3a187]/20 to-[#b9dde4]/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Exclusive Digital VIP Badge
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Admit One Party Pass
        </h2>
        <p className="text-[#49362d]/80 font-medium mt-2 text-sm md:text-base">
          Personalize your official birthday VIP ticket with interactive 3D tilt, realistic lighting glare, and vintage perforation notches!
        </p>
      </div>

      <div
        ref={containerRef}
        className="glass-card rounded-[36px] md:rounded-[44px] p-6 sm:p-10 border-4 border-white shadow-2xl relative max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Name Input Bar */}
        <form onSubmit={handleGeneratePass} className="w-full max-w-md mb-8">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2 text-center">
            {passGenerated ? "Personalize Another Guest Name" : "Enter Your Name / Family Name"}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              placeholder="e.g. Ramesh & Family"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d] text-center sm:text-left shadow-xs"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-[#f5c65d] hover:bg-[#f3a187] text-[#49362d] hover:text-white font-extrabold text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>{passGenerated ? "Update Pass" : "Generate Pass"}</span>
            </button>
          </div>
        </form>

        {/* 3D TILT ADMIT-ONE TICKET SHOWCASE */}
        <div className="flex flex-col items-center justify-center w-full my-2">
          <AdmitOneTicket
            name={passGenerated ? guestName : (inputName.trim() || "GUEST OF HONOR")}
            presenter="SUGANYA & YOGARAJAN PRESENT"
            event="HANVIKA'S 1ST BIRTHDAY"
            venue="KALAIGNAR MALIGAI, ROYAPURAM"
            dates="OCTOBER 14 · 6:00 PM"
            stubText="VIP PASS"
            watermark="2026"
            width={ticketWidth}
          />

          <span className="text-[11px] font-bold text-[#49362d]/60 mt-4 flex items-center gap-1.5 text-center">
            <Sparkles className="w-3.5 h-3.5 text-[#f5c65d] animate-pulse" />
            <span>Hover or touch the ticket to experience 3D tilt with real-time specular light glare!</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full max-w-md">
          <button
            onClick={handleDownloadPassImage}
            disabled={isDownloading}
            className={`flex-1 py-3.5 px-6 rounded-full font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 ${
              isDownloaded
                ? 'bg-[#e2f0d9] text-[#49362d] border border-[#afc6a4]'
                : 'bg-[#49362d] hover:bg-[#f3a187] text-white'
            }`}
          >
            {isDownloaded ? (
              <><CheckCircle className="w-4 h-4 text-[#afc6a4]" /><span>Pass Downloaded! ✓</span></>
            ) : isDownloading ? (
              <><Download className="w-4 h-4 animate-bounce" /><span>Generating Ticket... ⏳</span></>
            ) : (
              <><Download className="w-4 h-4" /><span>Download VIP Ticket 🖼️</span></>
            )}
          </button>

          {passGenerated && (
            <button
              onClick={() => {
                setPassGenerated(false);
                setInputName('');
                setGuestName('Guest of Honor');
              }}
              className="py-3.5 px-5 rounded-full bg-white hover:bg-gray-100 text-[#49362d] font-bold text-sm border border-gray-200 shadow-xs flex items-center gap-1.5 transition-all"
              title="Reset Pass"
            >
              <RotateCcw className="w-4 h-4 text-[#f3a187]" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
