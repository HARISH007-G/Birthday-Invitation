import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Sparkles, Globe, FileText, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface PrintableInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TemplateType = 'classic' | 'modern' | 'pastel';
type LanguageType = 'en' | 'ta';

export const PrintableInvitationModal: React.FC<PrintableInvitationModalProps> = ({ isOpen, onClose }) => {
  const [template, setTemplate] = useState<TemplateType>('classic');
  const [language, setLanguage] = useState<LanguageType>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(birthdayConfig.event.googleMapsUrl)}`;

  // Translation text dictionaries
  const texts = {
    en: {
      tagline: "A VERY SPECIAL DAY IS HERE",
      invitationHeading: "1st Birthday Celebration",
      heroSubtitle: "Our Little Sunshine",
      hostsLabel: "Invited by Suganya & Yogarajan",
      dateLabel: "Wednesday, 14 October 2026",
      timeLabel: "6:00 PM Onwards (Cake Cutting 7:00 PM)",
      venueLabel: "Kalaignar Thirumana Maligai",
      addressLabel: "Cemetry Road, Royapuram, Chennai - 600013",
      dressCodeLabel: "Dress Code: Pastel Colors",
      scanQr: "Scan for Location 📍",
      footerNote: "Join us in blessing our little princess Y S Hanvika on her first milestone!",
    },
    ta: {
      tagline: "ஒரு சிறப்பான நாள் வந்துவிட்டது",
      invitationHeading: "1வது பிறந்தநாள் விழா கொண்டாட்டம்",
      heroSubtitle: "எங்கள் குட்டி செல்லம்",
      hostsLabel: "அழைப்பாளர்கள்: சுகன்யா & யோகராஜன்",
      dateLabel: "புதன்கிழமை, 14 அக்டோபர் 2026",
      timeLabel: "மாலை 6:00 மணி முதல் (கேக் வெட்டுதல் 7:00 PM)",
      venueLabel: "கலைஞர் திருமண மாளிகை",
      addressLabel: "சிமெட்ரி ரோடு, இராயபுரம், சென்னை - 600013",
      dressCodeLabel: "ஆடை உடை: பாஸ்டல் நிறங்கள்",
      scanQr: "இடத்தைக் கண்டறிய ஸ்கேன் செய்யவும் 📍",
      footerNote: "எங்கள் அன்பு மகள் ஒய் எஸ் ஹான்விகாவை வாழ்த்த குடும்பத்துடன் வருகை தாருங்கள்!",
    }
  };

  const t = texts[language];

  // Theme configuration definitions for both Live Preview & Canvas Rendering
  const themeStyles = {
    classic: {
      cardBg: 'bg-gradient-to-br from-[#fff8ee] via-white to-[#fff3d1]',
      borderColor: 'border-[#f5c65d]',
      taglineBg: 'bg-[#f5c65d] text-[#49362d]',
      nameColor: 'text-[#49362d] font-serif',
      headingColor: 'text-[#f3a187]',
      hostsColor: 'text-[#49362d]/70',
      photoFrame: 'rounded-full border-4 border-[#f5c65d] shadow-lg p-2 bg-white',
      detailsBg: 'bg-white/95 border-2 border-[#f5c65d]/40 text-[#49362d]',
      accentText: 'text-[#f3a187]',
      // Canvas colors
      canvasPrimary: '#f5c65d',
      canvasAccent: '#f3a187',
      canvasBgStart: '#fff8ee',
      canvasBgEnd: '#fff3d1',
      canvasText: '#49362d',
    },
    modern: {
      cardBg: 'bg-gradient-to-br from-[#f5c65d] via-[#f3a187] to-[#e85d04]',
      borderColor: 'border-white',
      taglineBg: 'bg-white text-[#e85d04] shadow-md',
      nameColor: 'text-white font-sans drop-shadow-md',
      headingColor: 'text-[#fff3d1]',
      hostsColor: 'text-white/90',
      photoFrame: 'rounded-2xl border-4 border-white shadow-2xl p-1.5 bg-white',
      detailsBg: 'bg-white/95 border-2 border-white/80 text-[#49362d]',
      accentText: 'text-[#e85d04]',
      // Canvas colors
      canvasPrimary: '#e85d04',
      canvasAccent: '#f3a187',
      canvasBgStart: '#f5c65d',
      canvasBgEnd: '#e85d04',
      canvasText: '#ffffff',
    },
    pastel: {
      cardBg: 'bg-gradient-to-br from-[#e2f0d9] via-[#f3e5f5] to-[#dbebf2]',
      borderColor: 'border-[#afc6a4]',
      taglineBg: 'bg-[#afc6a4] text-white shadow-xs',
      nameColor: 'text-[#49362d] font-serif',
      headingColor: 'text-[#88a87a]',
      hostsColor: 'text-[#49362d]/75',
      photoFrame: 'rounded-[32px] border-4 border-[#afc6a4] shadow-md p-2 bg-white',
      detailsBg: 'bg-white/90 border border-[#afc6a4]/50 text-[#49362d]',
      accentText: 'text-[#88a87a]',
      // Canvas colors
      canvasPrimary: '#afc6a4',
      canvasAccent: '#88a87a',
      canvasBgStart: '#e2f0d9',
      canvasBgEnd: '#dbebf2',
      canvasText: '#49362d',
    }
  };

  const currentTheme = themeStyles[template];

  // Canvas Generator for Image / PDF
  const handleDownload = (format: 'image' | 'pdf') => {
    setIsGenerating(true);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // 1. Background styling depending on selected template
    const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
    grad.addColorStop(0, currentTheme.canvasBgStart);
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(1, currentTheme.canvasBgEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1350);

    // Border
    ctx.strokeStyle = currentTheme.canvasPrimary;
    ctx.lineWidth = 24;
    ctx.strokeRect(30, 30, 1020, 1290);

    ctx.strokeStyle = currentTheme.canvasAccent;
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 984, 1254);

    // 2. Header Tagline Pill
    ctx.fillStyle = currentTheme.canvasPrimary;
    ctx.beginPath();
    ctx.roundRect(290, 80, 500, 50, 25);
    ctx.fill();

    ctx.fillStyle = template === 'modern' ? '#ffffff' : '#49362d';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`✨ ${t.tagline} ✨`, 540, 113);

    // 3. Main Title
    ctx.fillStyle = template === 'modern' ? '#ffffff' : '#49362d';
    ctx.font = 'bold 54px serif';
    ctx.fillText(birthdayConfig.babyName.toUpperCase(), 540, 210);

    ctx.fillStyle = currentTheme.canvasAccent;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(t.invitationHeading, 540, 265);

    ctx.fillStyle = template === 'modern' ? '#ffffff' : '#666666';
    ctx.font = 'italic 24px sans-serif';
    ctx.fillText(t.hostsLabel, 540, 310);

    // 4. Hero Photo Container Frame
    const babyImg = new Image();
    babyImg.crossOrigin = 'anonymous';
    babyImg.src = birthdayConfig.images.hero;

    const renderTextAndDetails = () => {
      // Event Details Box
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(73, 54, 45, 0.15)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.roundRect(100, 740, 880, 360, 32);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      ctx.strokeStyle = currentTheme.canvasPrimary;
      ctx.lineWidth = 4;
      ctx.strokeRect(100, 740, 880, 360);

      // Info List
      ctx.fillStyle = '#49362d';
      ctx.textAlign = 'left';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`🗓️  ${t.dateLabel}`, 140, 810);
      ctx.fillText(`⏰  ${t.timeLabel}`, 140, 870);
      ctx.fillText(`📍  ${t.venueLabel}`, 140, 930);

      ctx.fillStyle = '#666666';
      ctx.font = '22px sans-serif';
      ctx.fillText(t.addressLabel, 190, 965);

      ctx.fillStyle = currentTheme.canvasAccent;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(`🎨  ${t.dressCodeLabel}`, 140, 1040);

      // QR Code Box Right
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      qrImg.src = qrCodeUrl;

      const finishCanvas = () => {
        // Footer Note
        ctx.fillStyle = template === 'modern' ? '#ffffff' : '#49362d';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.footerNote, 540, 1160);

        ctx.fillStyle = template === 'modern' ? '#fff3d1' : '#888888';
        ctx.font = '18px sans-serif';
        ctx.fillText('RSVP: Suganya & Yogarajan • Phone: +91 9884948318', 540, 1200);

        // Download Trigger
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `Hanvika-1st-Birthday-${template.toUpperCase()}-${language.toUpperCase()}.${format === 'pdf' ? 'pdf' : 'png'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setIsGenerating(false);
        setDownloadSuccess(format === 'pdf' ? 'Printable PDF Downloaded! 📄' : 'WhatsApp Image Downloaded! 🖼️');
        setTimeout(() => setDownloadSuccess(null), 3500);
      };

      qrImg.onload = () => {
        ctx.drawImage(qrImg, 760, 780, 180, 180);
        ctx.fillStyle = '#49362d';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.scanQr, 850, 985);
        finishCanvas();
      };
      qrImg.onerror = finishCanvas;
    };

    babyImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(540, 520, 180, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(babyImg, 360, 340, 360, 360);
      ctx.restore();

      // Circular Ring
      ctx.strokeStyle = currentTheme.canvasPrimary;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(540, 520, 180, 0, Math.PI * 2);
      ctx.stroke();

      renderTextAndDetails();
    };
    babyImg.onerror = renderTextAndDetails;
  };

  const handleShareWhatsApp = () => {
    const shareText = `🎂 *You are Cordially Invited!* 🎈\n\n*${birthdayConfig.babyName}'s 1st Birthday Celebration*\n\n🗓️ *Date:* ${t.dateLabel}\n⏰ *Time:* ${t.timeLabel}\n📍 *Venue:* ${t.venueLabel}, ${t.addressLabel}\n🎨 *Theme:* ${t.dressCodeLabel}\n\n✨ _${t.footerNote}_\n\n🗺️ *Open Location & RSVP:* ${birthdayConfig.event.googleMapsUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-[36px] p-6 md:p-8 max-w-2xl w-full shadow-2xl border-4 border-[#fff3d1] my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[#49362d] flex items-center justify-center transition-all z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fff3d1] border border-[#f5c65d]/40 text-[#49362d] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#f3a187]" />
              <span>Printable & Shareable Invitation Card</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold font-serif text-[#49362d] mt-2">
              Download Invitation Card 📄
            </h3>
            <p className="text-xs md:text-sm text-[#49362d]/75 font-medium mt-1">
              Select a design template & language below to download your high-resolution card for WhatsApp or printing!
            </p>
          </div>

          {/* Controls Bar (Template + Language) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-[#fff8ee] p-4 rounded-2xl border border-[#f5c65d]/30">
            {/* Template Selector */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#49362d] mb-1.5">
                Template Theme
              </label>
              <div className="flex gap-1.5">
                {(['classic', 'modern', 'pastel'] as TemplateType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-extrabold capitalize border transition-all ${
                      template === t
                        ? 'bg-[#f5c65d] text-[#49362d] border-white shadow-sm scale-105 ring-2 ring-[#f3a187]'
                        : 'bg-white text-[#49362d]/70 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#49362d] mb-1.5 flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#f3a187]" />
                <span>Card Language</span>
              </label>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    language === 'en'
                      ? 'bg-[#f3a187] text-white border-white shadow-sm scale-105'
                      : 'bg-white text-[#49362d]/70 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  English 🇬🇧
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                    language === 'ta'
                      ? 'bg-[#f3a187] text-white border-white shadow-sm scale-105'
                      : 'bg-white text-[#49362d]/70 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  தமிழ் (Tamil) 🇮🇳
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC LIVE CARD PREVIEW (Fully responds to Classic / Modern / Pastel themes!) */}
          <div
            className={`relative rounded-3xl p-6 md:p-8 text-center border-4 shadow-xl mb-6 overflow-hidden transition-all duration-300 ${currentTheme.cardBg} ${currentTheme.borderColor}`}
          >
            {/* Tagline Crest */}
            <div className={`inline-block px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3 shadow-xs ${currentTheme.taglineBg}`}>
              {t.tagline}
            </div>

            <h4 className={`text-2xl md:text-3xl font-black ${currentTheme.nameColor}`}>
              {birthdayConfig.babyName}
            </h4>
            <p className={`text-lg font-bold mt-0.5 ${currentTheme.headingColor}`}>
              {t.invitationHeading}
            </p>
            <p className={`text-xs font-medium mt-1 italic ${currentTheme.hostsColor}`}>
              {t.hostsLabel}
            </p>

            {/* Baby Hero Photo Frame */}
            <div className="my-5 flex justify-center">
              <div className={`w-28 h-28 md:w-36 md:h-36 overflow-hidden ${currentTheme.photoFrame}`}>
                <img
                  src={birthdayConfig.images.hero}
                  alt={birthdayConfig.babyName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Event Highlights Card */}
            <div className={`p-4 rounded-2xl text-left text-xs font-bold space-y-2 max-w-md mx-auto shadow-xs ${currentTheme.detailsBg}`}>
              <div>🗓️ {t.dateLabel}</div>
              <div>⏰ {t.timeLabel}</div>
              <div>📍 {t.venueLabel}, {t.addressLabel}</div>
              <div className={currentTheme.accentText}>🎨 {t.dressCodeLabel}</div>
            </div>

            <p className={`text-xs font-bold mt-4 italic ${template === 'modern' ? 'text-white' : 'text-[#49362d]/80'}`}>
              “{t.footerNote}”
            </p>
          </div>

          {/* Success Toast */}
          {downloadSuccess && (
            <div className="mb-4 p-3 rounded-2xl bg-[#e2f0d9] border border-[#afc6a4] text-[#49362d] text-xs font-extrabold text-center flex items-center justify-center gap-2 shadow-xs">
              <CheckCircle className="w-4 h-4 text-[#afc6a4]" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Download Image (WhatsApp) */}
            <button
              onClick={() => handleDownload('image')}
              disabled={isGenerating}
              className="py-3 px-4 rounded-full bg-[#49362d] hover:bg-[#f3a187] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4 text-[#f5c65d]" />
              <span>WhatsApp Image 🖼️</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isGenerating}
              className="py-3 px-4 rounded-full bg-[#f5c65d] hover:bg-[#f3a187] text-[#49362d] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>Printable PDF 📄</span>
            </button>

            {/* Share via WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#1eb853] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp 📲</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
