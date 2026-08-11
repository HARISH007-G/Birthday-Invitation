import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2, Plus, Heart, CheckCircle2, Send } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface SongRequest {
  id: string;
  songName: string;
  requestedBy: string;
  likes: number;
}

export const PartyJukebox: React.FC = () => {
  const [songs, setSongs] = useState<SongRequest[]>(() => {
    const saved = localStorage.getItem('hanvika_party_songs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      { id: '1', songName: 'The Wheels on the Bus Go Round and Round 🚌🎶', requestedBy: 'Amma & Appa (Hanvika\'s Favorite)', likes: 12 },
      { id: '2', songName: 'Baby Shark Dance 🦈🎵', requestedBy: 'Aunt Priya', likes: 8 },
      { id: '3', songName: 'If You\'re Happy and You Know It Clap Your Hands 👏', requestedBy: 'Uncle Ramesh', likes: 6 },
    ];
  });

  const [newSong, setNewSong] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.trim() || !guestName.trim()) return;

    setIsSending(true);

    const addedSongName = newSong.trim();
    const addedGuestName = guestName.trim();

    const added: SongRequest = {
      id: Date.now().toString(),
      songName: addedSongName,
      requestedBy: addedGuestName,
      likes: 1,
    };

    const updated = [added, ...songs];
    setSongs(updated);
    localStorage.setItem('hanvika_party_songs', JSON.stringify(updated));

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
          subject: `🎵 New DJ Song Request from ${addedGuestName} for Y S Hanvika's Birthday!`,
          from_name: `Y S Hanvika's Party Jukebox 🎶`,
          to_email: emailTo,
          "Message": `Dear Suganya & Yogarajan (Amma & Appa), a new party song request has been submitted by ${addedGuestName} for Y S Hanvika's 1st Birthday playlist!`,
          "Requested Song / Track": `🎵 ${addedSongName}`,
          "Requested By (Guest)": `👤 ${addedGuestName}`,
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
      setNewSong('');
      setGuestName('');
      setTimeout(() => setIsSubmittedSuccess(false), 5000);
    }
  };

  const handleLike = (id: string) => {
    const updated = songs.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s));
    setSongs(updated);
    localStorage.setItem('hanvika_party_songs', JSON.stringify(updated));
  };

  return (
    <section id="jukebox" className="relative py-20 px-4 max-w-5xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Party DJ Jukebox
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1 flex items-center justify-center gap-2">
          <span>Suggest a Party Song</span>
          <Music2 className="w-8 h-8 text-[#f5c65d] animate-bounce" />
        </h2>
        <p className="text-[#49362d]/80 font-medium mt-2 text-sm md:text-base">
          What song would you love to dance to at Y S Hanvika’s 1st Birthday party? Add your song request below to send it to the Party DJ & parents!
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-card rounded-3xl p-6 md:p-8 max-w-xl mx-auto mb-12 border-2 border-white shadow-xl">
        <form onSubmit={handleAddSong} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-1.5">
              Song Name / Track Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. The Wheels on the Bus, Baby Shark, Lungi Dance"
              value={newSong}
              onChange={(e) => setNewSong(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d]"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#49362d] mb-1.5">
              Your Name / Family Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh & Family"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 focus:border-[#f5c65d] focus:outline-hidden text-sm font-bold text-[#49362d]"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="btn-premium w-full py-4 rounded-full bg-gradient-to-r from-[#f5c65d] to-[#f3a187] hover:from-[#f3a187] hover:to-[#f5c65d] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Send className="w-4 h-4 animate-spin" />
                <span>Sending Song Request to DJ... 🎶</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Send Song to Party DJ 🎵</span>
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
                <span>Song Added to Playlist & Sent to Party DJ! 🎶</span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {songs.map((song: SongRequest, index: number) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="glass-card rounded-2xl p-5 border border-[#f5c65d]/30 shadow-md flex flex-col justify-between"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#fff3d1] border border-[#f5c65d]/40 flex items-center justify-center text-[#f5c65d] shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#49362d] leading-snug">
                  {song.songName}
                </h3>
                <span className="text-xs font-bold text-[#f3a187]">
                  Requested by {song.requestedBy}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#49362d]/60">
                Party Song #{index + 1}
              </span>
              <button
                onClick={() => handleLike(song.id)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-red-100 text-xs font-bold text-red-500 shadow-2xs hover:bg-red-50 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{song.likes}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
