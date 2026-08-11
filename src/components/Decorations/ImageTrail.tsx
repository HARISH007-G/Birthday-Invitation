import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TrailItem {
  id: number;
  x: number;
  y: number;
  image: string;
  rotation: number;
  scale: number;
  isBabyPhoto?: boolean;
}

const TRAIL_REAL_PHOTOS = [
  { src: '/images/chocolate.svg', isBabyPhoto: false },
  { src: '/images/hero.jpg', isBabyPhoto: true },
  { src: '/images/cake.svg', isBabyPhoto: false },
  { src: '/images/newborn.jpg', isBabyPhoto: true },
  { src: '/images/teddy.svg', isBabyPhoto: false },
  { src: '/images/birthday.jpg', isBabyPhoto: true },
  { src: '/images/crown.svg', isBabyPhoto: false },
  { src: '/images/candy.svg', isBabyPhoto: false },
  { src: '/images/gift.svg', isBabyPhoto: false },
  { src: '/images/balloon-gold.svg', isBabyPhoto: false },
  { src: '/images/balloon-pink.svg', isBabyPhoto: false },
];

interface ImageTrailProps {
  threshold?: number;
  minDelay?: number;
  duration?: number;
  maxItems?: number;
  rotationRange?: number;
}

export const ImageTrail: React.FC<ImageTrailProps> = ({
  threshold = 45,
  minDelay = 30,
  duration = 1000,
  maxItems = 12,
  rotationRange = 25,
}) => {
  const isReducedMotion = useReducedMotion();
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const imageIndexRef = useRef<number>(0);
  const idCounterRef = useRef<number>(0);

  useEffect(() => {
    if (isReducedMotion) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const now = Date.now();
      const dist = Math.hypot(clientX - lastPosRef.current.x, clientY - lastPosRef.current.y);

      if (dist < threshold || now - lastTimeRef.current < minDelay) return;

      lastPosRef.current = { x: clientX, y: clientY };
      lastTimeRef.current = now;

      // Pick next photo item in sequence
      const photoObj = TRAIL_REAL_PHOTOS[imageIndexRef.current % TRAIL_REAL_PHOTOS.length];
      imageIndexRef.current += 1;

      const rotation = (Math.random() - 0.5) * rotationRange * 2;
      const scale = 0.85 + Math.random() * 0.35;
      const newItemId = ++idCounterRef.current;

      const newItem: TrailItem = {
        id: newItemId,
        x: clientX,
        y: clientY,
        image: photoObj.src,
        rotation,
        scale,
        isBabyPhoto: photoObj.isBabyPhoto,
      };

      setTrail((prev) => [...prev.slice(-(maxItems - 1)), newItem]);

      setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== newItemId));
      }, duration);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [isReducedMotion, threshold, minDelay, duration, maxItems, rotationRange]);

  if (isReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {trail.map((item) => (
        <div
          key={item.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            animation: `floatingItemPop ${duration}ms forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
            transformOrigin: 'center center',
          }}
        >
          {item.isBabyPhoto ? (
            /* Circular Framed Baby Photo */
            <div
              className="w-14 h-14 md:w-18 md:h-18 rounded-full p-1 bg-white shadow-xl border-2 border-[#f5c65d] overflow-hidden"
              style={{ transform: `rotate(${item.rotation}deg) scale(${item.scale})` }}
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover rounded-full select-none"
              />
            </div>
          ) : (
            /* Pure Backgroundless Floating 3D Graphic */
            <img
              src={item.image}
              alt=""
              className="w-12 h-12 md:w-16 md:h-16 object-contain block filter drop-shadow-md pointer-events-none select-none"
              style={{
                transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              }}
            />
          )}
        </div>
      ))}

      <style>{`
        @keyframes floatingItemPop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          40% {
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-25px) scale(0.7);
          }
        }
      `}</style>
    </div>
  );
};
