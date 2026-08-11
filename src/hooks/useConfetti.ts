import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerHeroBurst = () => {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#f5c65d', '#f3a187', '#b9dde4', '#afc6a4', '#f5d6d0'],
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#f5c65d', '#f3a187', '#b9dde4', '#afc6a4', '#f5d6d0'],
    });
  };

  const triggerSmallSparkle = (x = 0.5, y = 0.5) => {
    confetti({
      particleCount: 15,
      spread: 360,
      ticks: 50,
      gravity: 0.6,
      decay: 0.92,
      startVelocity: 12,
      origin: { x, y },
      colors: ['#f5c65d', '#ffffff', '#f3a187'],
    });
  };

  const triggerMilestoneCelebration = () => {
    const duration = 1.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f5c65d', '#f3a187', '#b9dde4'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f5c65d', '#f3a187', '#b9dde4'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const triggerEnvelopeOpen = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f5c65d', '#f3a187', '#ba68c8', '#66bb6a'],
    });
  };

  return {
    triggerHeroBurst,
    triggerSmallSparkle,
    triggerMilestoneCelebration,
    triggerEnvelopeOpen,
  };
};
