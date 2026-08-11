import { useState, useEffect, useRef } from 'react';
import { BirthdayLoader } from './components/BirthdayLoader/BirthdayLoader';
import { FloatingDecorations } from './components/FloatingDecorations/FloatingDecorations';
import { Cake3DBackground } from './components/Decorations/Cake3DBackground';
import { GlobalBalloons } from './components/FloatingDecorations/GlobalBalloons';
import { ImageTrail } from './components/Decorations/ImageTrail';
import { PartyBanner } from './components/Decorations/PartyBanner';
import { CloudDivider } from './components/Decorations/CloudDivider';

import { FloatingNavbar } from './components/Navbar/FloatingNavbar';
import { HeroSection } from './components/Hero/HeroSection';
import { WelcomeSection } from './components/Welcome/WelcomeSection';
import { StoryTimeline } from './components/StoryTimeline/StoryTimeline';
import { FirstsSection } from './components/Firsts/FirstsSection';
import { ThenAndNow } from './components/ThenAndNow/ThenAndNow';
import { FavoriteThings } from './components/FavoriteThings/FavoriteThings';
import { FamilyGallery } from './components/FamilyGallery/FamilyGallery';
import { EventDetails } from './components/EventDetails/EventDetails';
import { CountdownSection } from './components/Countdown/CountdownSection';
import { RSVPSection } from './components/RSVP/RSVPSection';
import { GuestWishes } from './components/GuestWishes/GuestWishes';
import { LocationSection } from './components/Location/LocationSection';
import { FinalCelebration } from './components/FinalCelebration/FinalCelebration';
import { BackgroundAudio } from './components/Audio/BackgroundAudio';
import { PartyPass } from './components/PartyPass/PartyPass';
import { PartyJukebox } from './components/Jukebox/PartyJukebox';
import { SelfieFrame } from './components/SelfieFrame/SelfieFrame';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleOpenInvitation = () => {
    setIsAudioPlaying(true);
  };

  // ── Scroll progress bar + back-to-top visibility ──────────────
  useEffect(() => {
    if (isLoading) return;

    const progressEl = document.getElementById('scroll-progress');
    const backTopEl  = document.getElementById('back-to-top');

    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (progressEl) progressEl.style.width = `${progress}%`;

      // Show back-to-top after 40% scroll
      const show = progress > 40;
      setShowBackToTop(show);
      if (backTopEl) {
        backTopEl.classList.toggle('visible', show);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLoading]);

  // ── Global IntersectionObserver for .reveal elements ─────────
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe all .reveal elements
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isLoading]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#fff8ee] text-[#49362d] overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <div id="scroll-progress" aria-hidden="true" />

      {/* 1. Opening Loader */}
      {isLoading ? (
        <BirthdayLoader onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          {/* 3D GLB Birthday Cake Background Scene */}
          <Cake3DBackground modelPath="/cake.glb" opacity={0.85} />

          {/* Reusable Parallax Floating Decorations & Balloons */}
          <FloatingDecorations />
          <GlobalBalloons />

          {/* 🖼️ Interactive Image Trail Cursor Effect */}
          <ImageTrail threshold={60} minDelay={45} duration={1100} maxItems={8} rotationRange={25} />

          {/* 🎀 Hanging Pastel Party Pennant Banner */}
          <PartyBanner />

          {/* Navigation Bar */}
          <FloatingNavbar />

          <main>
            {/* 2. Hero Section */}
            <HeroSection onOpenInvitation={handleOpenInvitation} />

            {/* ☁️ Cloud Wave Divider */}
            <CloudDivider fillColor="#fff3d1" />

            {/* 3. Birthday Countdown Timer Card */}
            <CountdownSection />

            {/* 4. Welcome Section */}
            <WelcomeSection />

            {/* ☁️ Cloud Wave Divider */}
            <CloudDivider fillColor="#ffffff" />

            {/* 5. 12-Month Story Journey Timeline */}
            <StoryTimeline />

            {/* 6. A Collection of Firsts */}
            <FirstsSection />

            {/* 7. Personalized Digital VIP Party Pass */}
            <PartyPass />

            {/* ☁️ Cloud Wave Divider */}
            <CloudDivider fillColor="#fff8ee" />

            {/* 8. Then and Now Comparison */}
            <ThenAndNow />

            {/* 9. Favorite Things */}
            <FavoriteThings />

            {/* 10. Guest Party Song Request Jukebox */}
            <PartyJukebox />

            {/* 11. Family Photo Collage */}
            <FamilyGallery />

            {/* 12. Event Details */}
            <EventDetails />

            {/* 13. Virtual Guest Selfie Souvenir Frame */}
            <SelfieFrame />

            {/* 14. Attendance Confirmation & Envelope */}
            <RSVPSection />

            {/* 15. Digital Guest Wishes Pinboard */}
            <GuestWishes />

            {/* 16. Illustrated Location Map */}
            <LocationSection />

            {/* 17. Final Celebration */}
            <FinalCelebration />
          </main>

          {/* Background Audio Controller */}
          <BackgroundAudio
            isPlaying={isAudioPlaying}
            onTogglePlay={() => setIsAudioPlaying(!isAudioPlaying)}
          />

          {/* Back to Top Button */}
          <button
            id="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
            className={showBackToTop ? 'visible' : ''}
          >
            ↑
          </button>
        </>
      )}
    </div>
  );
}

export default App;
