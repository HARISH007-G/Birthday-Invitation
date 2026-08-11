import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Palette, Sparkles, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

export const EventDetails: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Hanvika's+1st+Birthday+Party&dates=20261014T123000Z/20261014T163000Z&details=Join+us+in+celebrating+Hanvika's+1st+Birthday!&location=${encodeURIComponent(birthdayConfig.event.venueName + ', ' + birthdayConfig.event.locationAddress)}`;

  const handleCopyAddress = async () => {
    const address = `${birthdayConfig.event.venueName}, ${birthdayConfig.event.locationAddress}`;
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Hanvika Birthday//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Y S Hanvika 1st Birthday Party 🎂',
      'DESCRIPTION:Join us in celebrating Y S Hanvika\'s 1st Birthday! Cake cutting at 7:00 PM.',
      'LOCATION:Kalaignar Thirumana Maligai, Royapuram, Chennai',
      'DTSTART:20261014T123000Z',
      'DTEND:20261014T163000Z',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Hanvika-1st-Birthday.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="event-details" className="relative py-20 px-4 max-w-6xl mx-auto overflow-hidden">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
          Party Celebration Info
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#49362d] mt-1">
          Event Details
        </h2>
        <p className="text-[#49362d]/75 font-medium mt-2 text-sm md:text-base">
          Mark your calendar! We can’t wait to celebrate Hanvika’s special day with you.
        </p>
      </div>

      {/* 4 Illustrated Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/* DATE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-3xl p-6 border-2 border-white hover:border-[#f5c65d] transition-all duration-300 shadow-xl group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#fff3d1] border border-[#f5c65d]/40 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Calendar className="w-7 h-7 text-[#f5c65d]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
              THE DATE
            </span>
            <h3 className="text-xl font-bold font-serif text-[#49362d] mt-1">
              {birthdayConfig.event.date}
            </h3>
            <p className="text-xs text-[#49362d]/70 font-medium mt-2">
              A joyful Wednesday evening gathering!
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-[#f5c65d]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save the date</span>
          </div>
        </motion.div>

        {/* TIME CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card rounded-3xl p-6 border-2 border-white hover:border-[#f3a187] transition-all duration-300 shadow-xl group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#f5d6d0] border border-[#f3a187]/40 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-transform">
              <Clock className="w-7 h-7 text-[#f3a187] animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
              THE TIME
            </span>
            <h3 className="text-xl font-bold font-serif text-[#49362d] mt-1">
              {birthdayConfig.event.time}
            </h3>
            <p className="text-xs font-bold text-[#f3a187] mt-2 bg-[#f5d6d0]/50 px-3 py-1.5 rounded-full inline-block">
              🎂 Cake Cutting at {birthdayConfig.event.cakeCuttingTime}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-[#f3a187]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Evening party</span>
          </div>
        </motion.div>

        {/* VENUE CARD — Clickable to Google Maps */}
        <motion.a
          href={birthdayConfig.event.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card rounded-3xl p-6 border-2 border-white hover:border-[#b9dde4] transition-all duration-300 shadow-xl group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#dbebf2] border border-[#b9dde4]/40 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-[#29b6f6] animate-bounce" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
              THE PLACE
            </span>
            <h3 className="text-xl font-bold font-serif text-[#49362d] mt-1 group-hover:text-[#29b6f6] transition-colors">
              {birthdayConfig.event.venueName}
            </h3>
            <p className="text-xs text-[#49362d]/75 font-medium mt-1">
              {birthdayConfig.event.locationAddress}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-extrabold text-[#29b6f6]">
            <span>Open in Google Maps 🗺️</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </motion.a>

        {/* DRESS CODE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-card rounded-3xl p-6 border-2 border-white hover:border-[#afc6a4] transition-all duration-300 shadow-xl group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#e2f0d9] border border-[#afc6a4]/40 flex items-center justify-center mb-6 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Palette className="w-7 h-7 text-[#afc6a4]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#f3a187]">
              THE THEME
            </span>
            <h3 className="text-xl font-bold font-serif text-[#49362d] mt-1">
              {birthdayConfig.event.themeDressCode}
            </h3>
            <p className="text-xs text-[#49362d]/75 font-medium mt-2">
              {birthdayConfig.event.themeDescription}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-[#afc6a4]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pastel shades</span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons Row */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <a
          href={birthdayConfig.event.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#29b6f6] to-[#0288d1] text-white font-bold text-sm shadow-md border border-white/30 hover:shadow-lg"
        >
          <MapPin className="w-4 h-4" />
          <span>Open Venue in Google Maps 🗺️</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>

        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#f5c65d] to-[#f3a187] text-white font-bold text-sm shadow-md border border-white/30"
        >
          <Calendar className="w-4 h-4" />
          <span>Google Calendar 🗓️</span>
        </a>

        <button
          onClick={handleDownloadIcs}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-[#f5c65d]/50 hover:bg-[#fff3d1] text-[#49362d] font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-[#f3a187]" />
          <span>Apple / iCal (.ics) 🍏</span>
        </button>

        <button
          onClick={handleCopyAddress}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-md border-2 transition-all duration-250 ${
            copied
              ? 'bg-[#e2f0d9] border-[#afc6a4] text-[#49362d]'
              : 'bg-white border-[#f5c65d]/40 text-[#49362d] hover:bg-[#fff3d1] hover:-translate-y-0.5'
          }`}
          style={{ transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
          aria-label="Copy venue address to clipboard"
        >
          {copied ? (
            <><CheckCircle className="w-4 h-4 text-[#afc6a4]" /><span>Address Copied! ✓</span></>
          ) : (
            <><Copy className="w-4 h-4 text-[#f3a187]" /><span>Copy Address 📍</span></>
          )}
        </button>
      </div>
    </section>
  );
};
