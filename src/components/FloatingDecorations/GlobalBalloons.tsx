import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface BalloonPhysicsData {
  el: HTMLDivElement;
  speed: number;
  swayAmp: number;
  y: number;
  x: number;
  phase: number;
}

export const GlobalBalloons: React.FC = () => {
  const isReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return;

    const wrappers = containerRef.current.querySelectorAll<HTMLDivElement>('.balloon-wrapper');
    const balloonData: BalloonPhysicsData[] = [];

    wrappers.forEach((wrapper, index) => {
      balloonData.push({
        el: wrapper,
        speed: parseFloat(wrapper.getAttribute('data-speed') || '1'),
        swayAmp: parseFloat(wrapper.getAttribute('data-sway') || '30'),
        y: Math.random() * (window.innerHeight || 800), // Random initial height spread
        x: 0,
        phase: index * (Math.PI / 3),
      });
    });

    let lastTime = Date.now();

    const animateBalloons = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const screenHeight = window.innerHeight || 800;

      balloonData.forEach((data) => {
        // Continuous Upward Movement
        data.y -= 45 * data.speed * delta;

        // Sine wave swaying physics
        data.x = Math.sin(now * 0.0012 * data.speed + data.phase) * data.swayAmp;

        // Subtle tilt angle depending on sway direction
        const tilt = data.x * 0.25;

        // Apply Hardware Accelerated 3D Transforms
        data.el.style.transform = `translate3d(${data.x}px, ${data.y}px, 0) rotate(${tilt}deg)`;

        // Reset position when balloon floats past top of screen
        if (data.y < -screenHeight - 200) {
          data.y = screenHeight + 100;
        }
      });

      animRef.current = requestAnimationFrame(animateBalloons);
    };

    animRef.current = requestAnimationFrame(animateBalloons);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isReducedMotion]);

  if (isReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      id="globalBalloons"
      className="floating-balloons fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden"
    >
      <div className="balloon-wrapper b1 absolute bottom-[-200px] left-[8%] md:left-[12%]" data-speed="1.1" data-sway="35">
        <img src="/images/balloon-red.svg" alt="" className="balloon-img w-12 md:w-16 h-auto block filter drop-shadow-lg" />
      </div>
      <div className="balloon-wrapper b2 absolute bottom-[-200px] left-[24%] md:left-[30%]" data-speed="0.85" data-sway="45">
        <img src="/images/balloon-gold.svg" alt="" className="balloon-img w-14 md:w-20 h-auto block filter drop-shadow-lg" />
      </div>
      <div className="balloon-wrapper b3 absolute bottom-[-200px] left-[40%] md:left-[48%]" data-speed="1.3" data-sway="25">
        <img src="/images/balloon-pink.svg" alt="" className="balloon-img w-12 md:w-16 h-auto block filter drop-shadow-lg" />
      </div>
      <div className="balloon-wrapper b4 absolute bottom-[-200px] left-[56%] md:left-[65%]" data-speed="0.95" data-sway="40">
        <img src="/images/balloon-blue.svg" alt="" className="balloon-img w-12 md:w-16 h-auto block filter drop-shadow-lg" />
      </div>
      <div className="balloon-wrapper b5 absolute bottom-[-200px] left-[72%] md:left-[80%]" data-speed="1.2" data-sway="30">
        <img src="/images/balloon-purple.svg" alt="" className="balloon-img w-11 md:w-14 h-auto block filter drop-shadow-lg" />
      </div>
      <div className="balloon-wrapper b6 absolute bottom-[-200px] left-[88%] md:left-[92%]" data-speed="0.75" data-sway="50">
        <img src="/images/balloon-teal.svg" alt="" className="balloon-img w-12 md:w-16 h-auto block filter drop-shadow-lg" />
      </div>

    </div>
  );
};
