import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

interface BackgroundAudioProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const BackgroundAudio: React.FC<BackgroundAudioProps> = ({ isPlaying, onTogglePlay }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('birthday_audio_muted') === 'true';
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isPlayingCustomSong, setIsPlayingCustomSong] = useState(false);

  // Soft celebratory chime notes (Happy Birthday melody frequencies in Hz)
  const notes = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy birthday to you
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy birthday dear Hanvika
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23  // Happy birthday to you
  ];

  const noteDurations = [
    0.4, 0.4, 0.8, 0.8, 0.8, 1.4,
    0.4, 0.4, 0.8, 0.8, 0.8, 1.4,
    0.4, 0.4, 0.8, 0.8, 0.8, 0.8, 1.4,
    0.4, 0.4, 0.8, 0.8, 0.8, 1.6
  ];

  const playChimeNote = (freq: number, duration: number) => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || isMuted) return;

    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Soft music box envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration - 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio synthesis errors
    }
  };

  useEffect(() => {
    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.volume = birthdayConfig.audio?.volume ?? 0.6;
    }

    if (isPlaying && !isMuted) {
      if (audioEl && birthdayConfig.audio?.bgMusic) {
        audioEl
          .play()
          .then(() => {
            setIsPlayingCustomSong(true);
          })
          .catch(() => {
            // Audio file was not found or blocked -> fallback to synthesized chimes
            setIsPlayingCustomSong(false);
            startChimeLoop();
          });
      } else {
        startChimeLoop();
      }

      function startChimeLoop() {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
        }

        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        let noteIdx = 0;
        const playLoop = () => {
          const freq = notes[noteIdx];
          const duration = noteDurations[noteIdx];
          playChimeNote(freq, duration);

          noteIdx = (noteIdx + 1) % notes.length;
          timerRef.current = window.setTimeout(playLoop, duration * 1000 + 100);
        };

        playLoop();
      }
    } else {
      if (audioEl) {
        audioEl.pause();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      setIsPlayingCustomSong(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioEl) audioEl.pause();
    };
  }, [isPlaying, isMuted]);

  // Handle visibility change (pause on tab hide)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audioEl = audioRef.current;
      if (document.hidden) {
        if (audioEl && !audioEl.paused) {
          audioEl.pause();
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          audioCtxRef.current.suspend();
        }
      } else if (isPlaying && !isMuted) {
        if (audioEl && isPlayingCustomSong) {
          audioEl.play().catch(() => {});
        } else if (audioCtxRef.current) {
          audioCtxRef.current.resume();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, isMuted, isPlayingCustomSong]);

  const toggleMute = () => {
    if (!isPlaying) {
      onTogglePlay();
      setIsMuted(false);
      localStorage.setItem('birthday_audio_muted', 'false');
      return;
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('birthday_audio_muted', String(nextMuted));
  };

  const isActive = isPlaying && !isMuted;

  return (
    <>
      {birthdayConfig.audio?.bgMusic && (
        <audio
          ref={audioRef}
          src={birthdayConfig.audio.bgMusic}
          loop
          preload="auto"
          aria-hidden="true"
        />
      )}
      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] z-40">
        <button
          onClick={toggleMute}
          aria-label={isActive ? 'Mute birthday music' : 'Play birthday music'}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-[#f5c65d]/50 text-[#49362d] font-extrabold text-xs hover:bg-[#fff3d1] transition-all transform hover:scale-105 active:scale-95"
        >
          {isActive ? (
            <>
              <Volume2 className="w-4 h-4 text-[#f3a187] animate-pulse" />
              <span>{isPlayingCustomSong ? 'Song Playing 🎶' : 'Music Playing 🎵'}</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#49362d]/60" />
              <span>Play Music 🎵</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
