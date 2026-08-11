import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundAudioProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const BackgroundAudio: React.FC<BackgroundAudioProps> = ({ isPlaying, onTogglePlay }) => {

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('birthday_audio_muted') === 'true';
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

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
    if (isPlaying && !isMuted) {
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
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, isMuted]);

  // Handle visibility change (pause on tab hide)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
          audioCtxRef.current.suspend();
        }
      } else if (isPlaying && !isMuted && audioCtxRef.current) {
        audioCtxRef.current.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, isMuted]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem('birthday_audio_muted', String(nextMuted));
    if (nextMuted === false && !isPlaying) {
      onTogglePlay();
    }
  };


  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute birthday music' : 'Mute birthday music'}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-[#f5c65d]/40 text-[#49362d] font-bold text-xs hover:bg-[#fff3d1] transition-all transform hover:scale-105 active:scale-95"
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-red-400" />
            <span>Music Off</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-[#f3a187] animate-pulse" />
            <span>Music Playing 🎵</span>
          </>
        )}
      </button>
    </div>
  );
};
