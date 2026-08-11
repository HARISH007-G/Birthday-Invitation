import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  char: string;
}

const SPARKLE_CHARS = ['✨', '⭐', '💖', '🌸', '💫'];
const SPARKLE_COLORS = ['#f5c65d', '#f3a187', '#b9dde4', '#ffffff', '#e2f0d9'];

export const SparkleCursor: React.FC = () => {
  const isReducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    if (isReducedMotion) return;

    let idCounter = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      // Throttle sparkle creation (approx every few px)
      if (Math.random() > 0.4) return;

      const newParticle: SparkleParticle = {
        id: ++idCounter,
        x: clientX + (Math.random() * 16 - 8),
        y: clientY + (Math.random() * 16 - 8),
        size: Math.floor(Math.random() * 12) + 12,
        color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        char: SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)],
      };

      setParticles((prev) => [...prev.slice(-18), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 700);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [isReducedMotion]);

  if (isReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-ping transition-opacity duration-700 select-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            color: p.color,
            transform: 'translate(-50%, -50%)',
            animationDuration: '0.7s',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};
