import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageCircle, CheckCircle2, Heart } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';
import { useConfetti } from '../../hooks/useConfetti';

export interface RSVPFormData {
  guestName: string;
  guestCount: number;
  isAttending: boolean;
  notes: string;
}

export const RSVPSection: React.FC = () => {
  const { triggerEnvelopeOpen } = useConfetti();

  const [formData, setFormData] = useState<RSVPFormData>(() => {
    const saved = localStorage.getItem('hanvika_rsvp_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return { guestName: '', guestCount: 1, isAttending: true, notes: '' };
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    return localStorage.getItem('hanvika_rsvp_submitted') === 'true';
  });

  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName.trim()) return;

    setIsSendingEmail(true);

    // Save in local storage
    localStorage.setItem('hanvika_rsvp_data', JSON.stringify(formData));
    localStorage.setItem('hanvika_rsvp_submitted', 'true');

    // Send email via Web3Forms API
    try {
      const apiKey = birthdayConfig.event.web3formsKey || 'YOUR_ACCESS_KEY';
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: apiKey,
          subject: formData.isAttending
            ? `🎉 Wonderful News! ${formData.guestName} is coming to Y S Hanvika's 1st Birthday!`
            : `💌 Response from ${formData.guestName} for Y S Hanvika's Birthday`,
          from_name: `Y S Hanvika's Birthday Invitation 🎈`,
          to_email: birthdayConfig.event.notificationEmail,
          "Message": `Dear Suganya & Yogarajan, ${formData.guestName} has submitted their response for Y S Hanvika's 1st Birthday celebration!`,
          "Guest / Family Name": formData.guestName,
          "Attendance Status": formData.isAttending
            ? "🎉 YES! We are so excited to celebrate Hanvika's 1st Birthday with you!"
            : "💔 Regretfully unable to attend, but sending lots of love & blessings to little Hanvika!",
          "Total Guests Attending": formData.isAttending ? `${formData.guestCount} Person(s)` : "0",
          "Personal Message / Wish": formData.notes || "Sending endless love, health & happiness to little Hanvika! ❤️",
          "Party Date & Time": "Wednesday, 14 October 2026 at 6:00 PM (Cake cutting at 7:00 PM)",
          "Venue": "Kalaignar Thirumana Maligai, Cemetry Road, Royapuram, Chennai"
        })

      });
    } catch {
      // Ignore network errors, local save is successful
    } finally {
      setIsSendingEmail(false);
      setIsSubmitted(true);
      triggerEnvelopeOpen();
    }
  };


  const handleWhatsAppRSVP = () => {
    const name = encodeURIComponent(formData.guestName || 'Guest');
    const notes = encodeURIComponent(formData.notes || 'Sending endless love!');
    
    let text = '';
    if (formData.isAttending) {
      text = `Hi Suganya %26 Yogarajan! 👋%0A%0AWe are so happy to confirm that we will be attending Y S Hanvika's 1st Birthday party on Oct 14th! 🎉%0A%0A• Family Name: ${name}%0A• Guests Attending: ${formData.guestCount}%0A• Message: ${notes}`;
    } else {
      text = `Hi Suganya %26 Yogarajan! 👋%0A%0AThank you so much for inviting us to Y S Hanvika's 1st Birthday! Regretfully we won't be able to make it, but sending lots of love %26 blessings to little Hanvika! ❤️`;
    }

    window.open(`https://wa.me/${birthdayConfig.event.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="rsvp" className="relative py-20 px-4 max-w-4xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Join The Celebration
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Are You Coming?
        </h2>
        <p className="text-[#49362d]/80 font-medium mt-2 text-sm md:text-base">
          Suganya & Yogarajan would love to have you and your family celebrate Y S Hanvika’s 1st Birthday with us!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          /* FORM CARD */
          <motion.div
            key="rsvp-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-[36px] p-6 md:p-12 border-4 border-[#fff3d1] shadow-2xl relative max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Name */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2">
                  Your Name / Family Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Family"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d] shadow-xs transition-colors"
                />
              </div>

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2">
                  Will You Be Attending? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAttending: true })}
                    className={`py-3.5 px-4 rounded-2xl font-bold text-xs md:text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                      formData.isAttending
                        ? 'bg-[#fff3d1] border-[#f5c65d] text-[#49362d] shadow-sm'
                        : 'bg-white border-gray-100 text-[#49362d]/60 hover:bg-gray-50'
                    }`}
                  >
                    <span>Yes! We can’t wait! 🎉</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isAttending: false })}
                    className={`py-3.5 px-4 rounded-2xl font-bold text-xs md:text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                      !formData.isAttending
                        ? 'bg-[#f5d6d0] border-[#f3a187] text-[#49362d] shadow-sm'
                        : 'bg-white border-gray-100 text-[#49362d]/60 hover:bg-gray-50'
                    }`}
                  >
                    <span>Sorry, we will miss it 💔</span>
                  </button>
                </div>
              </div>

              {/* Number of Guests */}
              {formData.isAttending && (
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2">
                    How many of you are coming?
                  </label>
                  <select
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: parseInt(e.target.value) })}
                    className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d] shadow-xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Note / Message */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-2">
                  Message or Wishes for Y S Hanvika
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a warm note for Hanvika..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#f5c65d] focus:outline-hidden text-sm font-medium text-[#49362d] shadow-xs resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="flex-1 py-4 rounded-full bg-[#f5c65d] hover:bg-[#f3a187] text-[#49362d] font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSendingEmail ? 'Sending Email Notification... ✉️' : 'Confirm Presence ✨'}</span>
                </button>


                <button
                  type="button"
                  onClick={handleWhatsAppRSVP}
                  className="py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send WhatsApp Message</span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* SUCCESS ENVELOPE STATE */
          <motion.div
            key="rsvp-success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="relative max-w-xl mx-auto"
          >
            <div className="bg-[#fff3d1] rounded-[40px] p-8 md:p-12 text-center border-4 border-[#f5c65d] shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#f5c65d] text-white mx-auto flex items-center justify-center mb-6 shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-1 text-xs font-black tracking-widest text-[#f3a187] uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>CONFIRMATION RECEIVED</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-extrabold font-serif text-[#49362d]">
                Thank You So Much!
              </h3>

              <p className="text-base md:text-lg text-[#49362d]/85 font-medium mt-4 leading-relaxed max-w-md mx-auto">
                Suganya & Yogarajan are so delighted that you will be joining us to celebrate <strong className="text-[#f3a187]">{birthdayConfig.babyName}’s</strong> special 1st Birthday!
              </p>

              <p className="font-handwriting text-2xl font-bold text-[#f5c65d] mt-4 flex items-center justify-center gap-2">
                <span>See you at the party!</span>
                <Heart className="w-5 h-5 text-[#f3a187] fill-current" />
              </p>

              <div className="mt-8 pt-6 border-t border-[#f5c65d]/40 flex justify-center gap-4">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-[#49362d]/70 underline hover:text-[#f3a187]"
                >
                  Update your response
                </button>
                <button
                  onClick={handleWhatsAppRSVP}
                  className="text-xs font-bold text-[#25D366] underline hover:text-[#1ebd59] flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send copy to Amma & Appa on WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
