import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, CheckCircle2 } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface WishMessage {
  id: string;
  name: string;
  message: string;
  date: string;
  bg: string;
}

export const GuestWishes: React.FC = () => {
  const [wishes, setWishes] = useState<WishMessage[]>(() => {
    const saved = localStorage.getItem('hanvika_guest_wishes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      { id: '1', name: 'Grandma & Grandpa', message: 'Happy 1st Birthday our little sunshine! May your life be filled with infinite smiles and laughter!', date: 'Just now', bg: '#fff3d1' },
      { id: '2', name: 'Aunt Priya', message: 'Can’t believe you are one already! Sending you endless cuddles and sweetest wishes!', date: 'Today', bg: '#f5d6d0' },
      { id: '3', name: 'Uncle Vikram', message: 'Happy Birthday tiny miracle! Looking forward to cake cutting and playtime!', date: 'Today', bg: '#dbebf2' },
    ];
  });

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const colors = ['#fff3d1', '#f5d6d0', '#dbebf2', '#e2f0d9', '#f3e5f5'];

  // Stable rotation values seeded from wish id for scrapbook randomness
  const getRotation = (id: string) => {
    const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ((hash % 7) - 3) * 0.9; // -2.7° to +2.7°
  };

  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSending(true);

    const addedName = name.trim();
    const addedMessage = message.trim();

    const newWish: WishMessage = {
      id: Date.now().toString(),
      name: addedName,
      message: addedMessage,
      date: 'Just now',
      bg: colors[Math.floor(Math.random() * colors.length)],
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    localStorage.setItem('hanvika_guest_wishes', JSON.stringify(updated));

    // Quietly dispatch background record via Web3Forms API to parents
    try {
      const apiKey = birthdayConfig.event.web3formsKey || '5c020812-6d1b-41b8-8931-9a3d1440f653';
      const emailTo = birthdayConfig.event.notificationEmail || 'harish02102006@gmail.com';

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: apiKey,
          subject: `💌 New Birthday Wish & Love Note from ${addedName} for Y S Hanvika!`,
          from_name: `Y S Hanvika's Guest Wishes Pinboard 🎈`,
          to_email: emailTo,
          "Message": `Dear Suganya & Yogarajan (Amma & Appa), ${addedName} has left a beautiful birthday wish for little Y S Hanvika!`,
          "Guest / Family Name": `👤 ${addedName}`,
          "Personal Birthday Wish": `“${addedMessage}”`,
          "Submission Time": new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          "Event": `Y S Hanvika 1st Birthday Celebration`,
          "Party Date & Time": `${birthdayConfig.event.date} at ${birthdayConfig.event.time}`,
          "Venue": `${birthdayConfig.event.venueName}, ${birthdayConfig.event.locationAddress}`
        })
      });
    } catch {
      // Ignore network errors, local pin is saved
    } finally {
      setIsSending(false);
      setIsSubmittedSuccess(true);
      setName('');
      setMessage('');
      setTimeout(() => setIsSubmittedSuccess(false), 5000);
    }
  };

  return (
    <section id="guest-wishes" className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Digital Pinboard
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Guest Wishes & Love Notes
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-2 text-sm md:text-base">
          Leave a sweet birthday message for Hanvika to cherish forever — your wish will be pinned here & delivered to Hanvika and her family!
        </p>
      </div>

      {/* Wish Input Form */}
      <div className="glass-card rounded-3xl p-6 md:p-8 max-w-xl mx-auto mb-12 border-2 border-white shadow-xl">
        <form onSubmit={handleAddWish} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-1.5">
              Your Name / Family Name *
            </label>
            <input
              type="text"
              required
              placeholder="Your Name / Family Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d]"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-1.5">
              Your Birthday Wish or Message for Hanvika *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Write a sweet birthday wish for Hanvika..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 focus:border-[#f5c65d] focus:outline-hidden text-sm font-medium text-[#49362d] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="btn-premium w-full py-3.5 rounded-full bg-gradient-to-r from-[#f5c65d] to-[#f3a187] hover:from-[#f3a187] hover:to-[#f5c65d] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Send className="w-4 h-4 animate-spin" />
                <span>Sending Wish to Hanvika... 💌</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Wish to Hanvika 🎈</span>
              </>
            )}
          </button>

          {/* Success Banner */}
          <AnimatePresence>
            {isSubmittedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 rounded-2xl bg-[#e2f0d9] border border-[#afc6a4] text-[#49362d] text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#afc6a4]" />
                <span>Wish Pinned to Board & Sent to Hanvika & Family! ❤️</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Pinboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishes.map((wish: WishMessage, index: number) => (
          <motion.div
            key={wish.id}
            initial={{ opacity: 0, scale: 0.88, rotate: getRotation(wish.id) * 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: getRotation(wish.id) }}
            whileHover={{ y: -8, scale: 1.03, rotate: 0, zIndex: 10 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.4), ease: [0.19, 1, 0.22, 1] }}
            style={{ backgroundColor: wish.bg, rotate: getRotation(wish.id) }}
            className="relative p-6 rounded-3xl shadow-lg border-2 border-white flex flex-col justify-between cursor-default"
          >
            {/* Pin Badge */}
            <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-[#f3a187] border-2 border-white shadow-xs flex items-center justify-center text-white text-[10px]">
              📌
            </div>

            <div>
              <p className="text-sm font-medium text-[#49362d] leading-relaxed italic mb-4">
                “{wish.message}”
              </p>
            </div>

            <div className="pt-3 border-t border-[#49362d]/10 flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#49362d]">
                {wish.name}
              </span>
              <Heart className="w-4 h-4 text-[#f3a187] fill-current" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
