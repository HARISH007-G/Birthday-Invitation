import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface WheelCarouselItem {
  label: string;
  image: string;
  imageAlt?: string;
  month?: string;
  title?: string;
  date?: string;
  description?: string;
  sparkleLevel?: "small" | "large";
  objectPosition?: string;
  icon?: string;
}

export type WheelCarouselMode = "system" | "light" | "dark" | "custom";

export interface WheelCarouselProps {
  items?: WheelCarouselItem[];
  mode?: WheelCarouselMode;
  photoSide?: "left" | "right";
  photoWidth?: number;
  photoAspect?: "3/4" | "1/1" | "4/3" | "3/2";
  contentWidth?: number;
  gap?: number;
  photoRadius?: number;
  crossfadeDuration?: number;
  radius?: number;
  spacing?: number;
  visibleItems?: number;
  apexInset?: number;
  textColor?: string;
  selectedColor?: string;
  showMarker?: boolean;
  markerColor?: string;
  markerSize?: number;
  markerGap?: number;
  background?: string;
  panelColor?: string;
  scrollSpeed?: number;
  dragSpeed?: number;
  snap?: boolean;
  momentum?: boolean;
  appear?: boolean;
  edgeFade?: boolean;
  edgeFadeSize?: number;
  initialIndex?: number;
  activeIndex?: number;
  onActiveChange?: (item: WheelCarouselItem, index: number) => void;
  className?: string;
  photoClassName?: string;
  itemClassName?: string;
}

const aspectRatios = {
  "3/4": "3 / 4",
  "1/1": "1 / 1",
  "4/3": "4 / 3",
  "3/2": "3 / 2",
} as const;

function wrapIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function shortestOffset(index: number, rotation: number, length: number) {
  let offset = index - rotation;
  while (offset > length / 2) offset -= length;
  while (offset < -length / 2) offset += length;
  return offset;
}

export function WheelCarousel({
  items = [],
  mode = "custom",
  photoSide = "left",
  photoWidth = 46,
  photoAspect = "1/1",
  contentWidth = 920,
  gap = 16,
  photoRadius = 24,
  crossfadeDuration = 0.4,
  radius = 280,
  spacing = 15,
  visibleItems = 5,
  apexInset = 16,
  textColor = "rgba(73, 54, 45, 0.45)",
  selectedColor = "#f3a187",
  showMarker = true,
  markerColor = "#f5c65d",
  markerSize = 14,
  markerGap = 16,
  background = "transparent",
  panelColor = "#fff8ee",
  scrollSpeed = 0.008,
  dragSpeed = 0.02,
  snap = true,
  momentum = true,
  appear = true,
  edgeFade = true,
  edgeFadeSize = 25,
  initialIndex = 0,
  activeIndex,
  onActiveChange,
  className,
  photoClassName,
  itemClassName,
}: WheelCarouselProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const instanceId = useId();

  const carouselItems = items;
  const itemCount = carouselItems.length;
  const startingIndex = wrapIndex(activeIndex ?? initialIndex, itemCount);
  const [rotation, setRotation] = useState(startingIndex);
  const [selectedIndex, setSelectedIndex] = useState(startingIndex);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(startingIndex);
  const selectedRef = useRef(startingIndex);
  const appliedActiveIndexRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const dragOriginRef = useRef({ x: 0, y: 0, rotation: startingIndex });
  const previousDragRotationRef = useRef(startingIndex);
  const dragAxisRef = useRef<"undecided" | "horizontal" | "vertical">("undecided");
  const hasDraggedRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const normalizedIndex = wrapIndex(selectedRef.current, itemCount);
    if (normalizedIndex === selectedRef.current) return;

    selectedRef.current = normalizedIndex;
    rotationRef.current = normalizedIndex;
    setSelectedIndex(normalizedIndex);
    setRotation(normalizedIndex);
  }, [itemCount]);

  const palette = useMemo(() => {
    if (mode === "dark") {
      return {
        background: "#000000",
        text: "rgba(255, 255, 255, 0.5)",
        selected: "#ffffff",
        marker: "#f5c65d",
        panel: "#141414",
      };
    }
    if (mode === "light") {
      return {
        background: "#ffffff",
        text: "rgba(73, 54, 45, 0.4)",
        selected: "#f3a187",
        marker: "#f5c65d",
        panel: "#fff8ee",
      };
    }
    // "custom" - Website Warm Birthday Theme
    return {
      background,
      text: textColor,
      selected: selectedColor,
      marker: markerColor,
      panel: panelColor ?? background,
    };
  }, [background, markerColor, mode, panelColor, selectedColor, textColor]);

  const commitRotation = useCallback(
    (nextRotation: number) => {
      rotationRef.current = nextRotation;
      setRotation(nextRotation);
      const nextIndex = wrapIndex(Math.round(nextRotation), itemCount);
      if (nextIndex !== selectedRef.current) {
        selectedRef.current = nextIndex;
        setSelectedIndex(nextIndex);
        if (carouselItems[nextIndex]) {
          onActiveChange?.(carouselItems[nextIndex]!, nextIndex);
        }
      }
    },
    [carouselItems, itemCount, onActiveChange],
  );

  const commitRotationRef = useRef(commitRotation);
  commitRotationRef.current = commitRotation;

  const runAnimation = useCallback(() => {
    if (frameRef.current !== null) return;

    const tick = () => {
      let keepAnimating = false;

      if (!draggingRef.current && Math.abs(velocityRef.current) > 0.0008) {
        commitRotation(rotationRef.current + velocityRef.current);
        velocityRef.current *=
          momentum && !reduceMotion ? (snap ? 0.9 : 0.94) : 0.8;
        keepAnimating = true;
      } else if (!draggingRef.current && snap) {
        velocityRef.current = 0;
        const target = Math.round(rotationRef.current);
        const delta = target - rotationRef.current;
        if (Math.abs(delta) > 0.001 && !reduceMotion) {
          commitRotation(rotationRef.current + delta * 0.22);
          keepAnimating = true;
        } else {
          commitRotation(target);
        }
      } else if (!draggingRef.current) {
        velocityRef.current = 0;
      }

      if (keepAnimating) frameRef.current = requestAnimationFrame(tick);
      else frameRef.current = null;
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [commitRotation, momentum, reduceMotion, snap]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (event: globalThis.WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      const delta = event.deltaY * scrollSpeed;
      commitRotation(rotationRef.current + delta);
      velocityRef.current = delta * 0.2;
      runAnimation();
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [commitRotation, runAnimation, scrollSpeed]);

  useEffect(() => {
    if (activeIndex === undefined) return;
    const controlledIndex = wrapIndex(activeIndex, itemCount);
    if (appliedActiveIndexRef.current === controlledIndex) return;
    appliedActiveIndexRef.current = controlledIndex;
    const currentIndex = wrapIndex(Math.round(rotationRef.current), itemCount);
    let delta = controlledIndex - currentIndex;
    if (delta > itemCount / 2) delta -= itemCount;
    if (delta < -itemCount / 2) delta += itemCount;
    selectedRef.current = controlledIndex;
    setSelectedIndex(controlledIndex);
    commitRotationRef.current(rotationRef.current + delta);
  }, [activeIndex, itemCount]);

  const moveBy = (amount: number) => {
    velocityRef.current = 0;
    commitRotation(rotationRef.current + amount);
    runAnimation();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    draggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragAxisRef.current = "undecided";
    velocityRef.current = 0;
    dragOriginRef.current = {
      x: event.clientX,
      y: event.clientY,
      rotation: rotationRef.current,
    };
    previousDragRotationRef.current = rotationRef.current;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Gracefully handle if setPointerCapture is unsupported
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const deltaX = event.clientX - dragOriginRef.current.x;
    const deltaY = event.clientY - dragOriginRef.current.y;
    const totalDist = Math.hypot(deltaX, deltaY);

    if (totalDist > 6) {
      hasDraggedRef.current = true;
    }

    if (dragAxisRef.current === "undecided" && totalDist > 4) {
      dragAxisRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
    }

    // Swiping left (deltaX < 0) or dragging up (deltaY < 0) advances to next month (+rotation)
    // Swiping right (deltaX > 0) or dragging down (deltaY > 0) goes to previous month (-rotation)
    let distance = deltaY;
    if (dragAxisRef.current === "horizontal") {
      distance = deltaX * 1.25;
    } else if (dragAxisRef.current === "undecided") {
      distance = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX * 1.25 : deltaY;
    }

    const nextRotation = dragOriginRef.current.rotation - distance * dragSpeed;
    velocityRef.current = nextRotation - previousDragRotationRef.current;
    previousDragRotationRef.current = nextRotation;
    commitRotation(nextRotation);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Gracefully handle if pointer capture was already released
    }
    runAnimation();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      velocityRef.current = 0;
      commitRotation(rotationRef.current - selectedIndex);
      runAnimation();
    }
    if (event.key === "End") {
      event.preventDefault();
      velocityRef.current = 0;
      const lastIndex = itemCount - 1;
      commitRotation(rotationRef.current + lastIndex - selectedIndex);
      runAnimation();
    }
  };

  if (!carouselItems.length) return null;

  const safeSelectedIndex = wrapIndex(selectedIndex, itemCount);
  const selectedItem = carouselItems[safeSelectedIndex] || carouselItems[0];
  const mask = edgeFade
    ? `linear-gradient(to bottom, transparent 0%, black ${edgeFadeSize}%, black ${100 - edgeFadeSize}%, transparent 100%)`
    : undefined;

  return (
    <motion.div
      initial={appear && !reduceMotion ? { opacity: 0, y: 18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex min-h-[290px] sm:min-h-[380px] md:min-h-[440px] w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{ backgroundColor: palette.background }}
    >
      <div
        ref={stageRef}
        role="listbox"
        aria-label="12 Months Wheel Carousel"
        aria-activedescendant={
          Math.abs(shortestOffset(safeSelectedIndex, rotation, itemCount)) <=
          visibleItems + 1
            ? `${instanceId}-item-${safeSelectedIndex}`
            : undefined
        }
        tabIndex={0}
        className={cn(
          "flex h-full w-full select-none items-stretch overflow-hidden outline-none touch-none",
          photoSide === "right" && "flex-row-reverse",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ maxWidth: contentWidth, gap, touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
      >
        {/* Photo Display Card */}
        <div
          className="flex h-full shrink-0 items-center justify-center p-1 sm:p-3"
          style={{
            width: `${photoWidth}%`,
          }}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden shadow-2xl border-4 border-white/95 bg-white transition-all duration-300",
              photoClassName,
            )}
            style={{
              aspectRatio: aspectRatios[photoAspect],
              borderRadius: photoRadius,
              boxShadow: "0 16px 36px rgba(73, 54, 45, 0.14), 0 0 0 2px rgba(245, 198, 93, 0.4)",
            }}
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.img
                key={`${safeSelectedIndex}-${selectedItem?.image}`}
                src={selectedItem?.image}
                alt={selectedItem?.imageAlt ?? selectedItem?.label}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : crossfadeDuration, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: selectedItem?.objectPosition || "center" }}
                draggable={false}
              />
            </AnimatePresence>

            {/* Top Celebration Badge for major milestones */}
            {selectedItem?.sparkleLevel === "large" && (
              <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 bg-gradient-to-r from-[#f5c65d] to-[#f3a187] text-white text-[8px] sm:text-xs font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg border border-white animate-pulse z-10">
                MILESTONE! 🎉
              </div>
            )}

            {/* Bottom Month Pill Badge */}
            {selectedItem?.month && (
              <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 bg-[#49362d]/85 backdrop-blur-md text-white text-[8px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md z-10 flex items-center gap-1 border border-white/30">
                <span className="text-[#f5c65d]">✨</span>
                <span>Month {selectedItem.month}</span>
              </div>
            )}

            {/* Quick Prev/Next floating arrows directly on photo for effortless 1-tap mobile navigation */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveBy(-1);
              }}
              aria-label="Previous month"
              title="Previous month"
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#49362d]/75 hover:bg-[#49362d] active:scale-90 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/50 shadow-md touch-manipulation cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveBy(1);
              }}
              aria-label="Next month"
              title="Next month"
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#49362d]/75 hover:bg-[#49362d] active:scale-90 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/50 shadow-md touch-manipulation cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Wheel Month Labels Side */}
        <div
          className="relative h-full min-w-0 flex-1 overflow-hidden"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          {showMarker && (
            <span
              aria-hidden="true"
              className="absolute top-1/2 z-10 -translate-y-1/2 rounded-full shadow-md flex items-center justify-center border-2 border-white ring-2 ring-[#f5c65d]/50"
              style={{
                left: `max(2px, calc(${apexInset}% - ${markerGap}px))`,
                width: markerSize,
                height: markerSize,
                marginLeft: `-${markerSize / 2}px`,
                backgroundColor: palette.marker,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </span>
          )}

          {carouselItems.map((item, index) => {
            const offset = shortestOffset(index, rotation, itemCount);
            if (Math.abs(offset) > visibleItems + 1) return null;

            const angle = offset * spacing;
            const radians = (angle * Math.PI) / 180;
            const responsiveRadius = typeof window !== 'undefined' && window.innerWidth < 640 ? Math.min(radius * 0.65, 170) : radius;
            const x = -responsiveRadius * (1 - Math.cos(radians));
            const y = responsiveRadius * Math.sin(radians);
            const distance = Math.min(Math.abs(offset) / visibleItems, 1);
            const opacity = Math.cos((distance * Math.PI) / 2);
            const scale = 1 - Math.min(Math.abs(offset) * 0.04, 0.45);
            const selected = Math.abs(offset) < 0.5;

            return (
              <div
                id={`${instanceId}-item-${index}`}
                key={`${item.label}-${index}`}
                role="option"
                aria-selected={selected}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasDraggedRef.current) return;
                  moveBy(offset);
                }}
                className={cn(
                  "absolute top-1/2 origin-left whitespace-nowrap leading-none transition-colors duration-200 cursor-pointer pointer-events-auto py-2.5 px-1 touch-manipulation",
                  selected
                    ? "font-serif font-black text-xs sm:text-base md:text-xl tracking-tight drop-shadow-xs"
                    : "font-semibold text-[11px] sm:text-sm md:text-base tracking-normal hover:opacity-100",
                  itemClassName,
                )}
                style={{
                  left: `${Math.max(6, apexInset)}%`,
                  color: selected ? palette.selected : palette.text,
                  opacity: selected ? 1 : Math.max(opacity * 0.75, 0.25),
                  transform: `translate(${x}px, ${y}px) translateY(-50%) rotate(${angle}deg) scale(${scale})`,
                }}
              >
                <span className="flex items-center gap-1 sm:gap-1.5 max-w-[130px] sm:max-w-none truncate">
                  {selected && <span className="text-[#f5c65d] shrink-0 text-xs">✦</span>}
                  <span className="truncate">{item.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {selectedItem?.label}, item {safeSelectedIndex + 1} of {itemCount}
      </span>
    </motion.div>
  );
}

export default WheelCarousel;
