"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type CompareRevealSource =
  | React.ReactNode
  | { src: string; alt?: string; objectPosition?: string };

export interface CompareRevealProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The "before" side, revealed from the left edge to the divider. */
  before: CompareRevealSource;
  /** The "after" side, filling the rest of the frame. */
  after: CompareRevealSource;
  /** Uncontrolled starting divider position, 0–100. */
  defaultPosition?: number;
  /** Controlled divider position, 0–100. */
  position?: number;
  /** Fires with the new target percentage on drag, key, or snap. */
  onPositionChange?: (pct: number) => void;
  /** Play the one-time self-demonstrating sweep on first viewport entry. */
  introSweep?: boolean;
  /** Divider spring stiffness — 140 reads as soft elastic resistance. */
  stiffness?: number;
  /** Divider spring damping — 18 gives smooth settling. */
  damping?: number;
  /** Corner chips: [beforeNode/text, afterNode/text]. */
  labels?: [React.ReactNode, React.ReactNode];
  /** Percentage the divider snaps to on double-click. */
  snapOnDoubleClick?: number;
  /** Force still variant regardless of system preference. */
  reducedMotion?: boolean;
  /** Stop the rAF loop while scrolled offscreen or the tab is hidden. */
  pauseWhenHidden?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SPRING_K = 140;
const SPRING_C = 18;
/** Intro sweep: 50 → 94 → 6 → 50 over 2.6s, cubic ease per leg. */
const SWEEP_SECONDS = 2.6;
const KEY_STEP = 2;
const KEY_STEP_LARGE = 10;
/** A side's chip fades out once that side narrows past this percentage. */
const LABEL_FADE = 14;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function sweepAt(u: number): number {
  if (u < 0.38) return lerp(50, 94, easeInOutCubic(u / 0.38));
  if (u < 0.78) return lerp(94, 6, easeInOutCubic((u - 0.38) / 0.4));
  return lerp(6, 50, easeInOutCubic((u - 0.78) / 0.22));
}

function isImageSource(
  v: CompareRevealSource
): v is { src: string; alt?: string; objectPosition?: string } {
  return typeof v === "object" && v !== null && !React.isValidElement(v) && "src" in v;
}

function renderSide(source: CompareRevealSource): React.ReactNode {
  if (isImageSource(source)) {
    return (
      <img
        src={source.src}
        alt={source.alt ?? ""}
        draggable={false}
        className="h-full w-full object-cover select-none"
        style={{ objectPosition: source.objectPosition ?? "center" }}
      />
    );
  }
  return source;
}

/* -------------------------------------------------------------------------- */
/* Motion Primitives                                                          */
/* -------------------------------------------------------------------------- */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useVisibilityPause<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.1 }: { threshold?: number } = {}
): boolean {
  const [onScreen, setOnScreen] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  React.useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const current = isControlled ? (value as T) : internal;
  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );
  return [current, set];
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function CompareReveal({
  before,
  after,
  defaultPosition = 50,
  position,
  onPositionChange,
  introSweep = true,
  stiffness = SPRING_K,
  damping = SPRING_C,
  labels,
  snapOnDoubleClick = 50,
  reducedMotion,
  pauseWhenHidden = true,
  className,
  ...props
}: CompareRevealProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const topRef = React.useRef<HTMLDivElement | null>(null);
  const dividerRef = React.useRef<HTMLDivElement | null>(null);
  const handleRef = React.useRef<HTMLButtonElement | null>(null);
  const labelRefs = React.useRef<Array<HTMLElement | null>>([]);
  const paintRef = React.useRef<() => void>(() => {});

  const systemReduced = useReducedMotion();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  const still = reducedMotion === true || (hydrated && systemReduced);

  const onScreen = useVisibilityPause(rootRef, { threshold: 0.2 });
  const animate = !still && (!pauseWhenHidden || onScreen);

  const [pct, setPct] = useControllableState<number>({
    value: position,
    defaultValue: clamp(defaultPosition, 0, 100),
    onChange: (v) => onPositionChange?.(v),
  });

  const initialPct = clamp(position ?? defaultPosition, 0, 100);
  const sim = React.useRef({
    x: initialPct,
    v: 0,
    target: initialPct,
    dragging: false,
    pointerId: null as number | null,
    introActive: false,
    introDone: false,
    introStart: 0,
  });

  const params = React.useRef({ stiffness, damping, still, introSweep });
  params.current = { stiffness, damping, still, introSweep };

  const pctRef = React.useRef(pct);
  pctRef.current = pct;

  /* ---------------------------------------------------------------- loop -- */

  React.useEffect(() => {
    const paint = () => {
      const x = clamp(sim.current.x, 0, 100);
      const top = topRef.current;
      if (top) top.style.clipPath = `inset(0 ${(100 - x).toFixed(3)}% 0 0)`;
      const divider = dividerRef.current;
      if (divider) divider.style.left = `${x.toFixed(3)}%`;
      handleRef.current?.setAttribute("aria-valuenow", String(Math.round(x)));
      const l0 = labelRefs.current[0];
      const l1 = labelRefs.current[1];
      if (l0) l0.style.opacity = x > LABEL_FADE ? "1" : "0";
      if (l1) l1.style.opacity = x < 100 - LABEL_FADE ? "1" : "0";
    };
    paintRef.current = paint;
    paint();

    if (!animate) {
      sim.current.introDone = true;
      sim.current.introActive = false;
      return () => {
        if (sim.current.introActive) {
          sim.current.introActive = false;
          sim.current.introDone = false;
        }
      };
    }

    if (params.current.introSweep && !sim.current.introDone) {
      sim.current.introActive = true;
      sim.current.introStart = performance.now() / 1000;
    }

    let raf = 0;
    let last = performance.now();
    const frame = (ts: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (ts - last) / 1000));
      last = ts;
      const now = ts / 1000;
      const p = params.current;
      const s = sim.current;

      if (s.introActive) {
        const u = (now - s.introStart) / SWEEP_SECONDS;
        if (u >= 1) {
          s.introActive = false;
          s.introDone = true;
          s.target = clamp(pctRef.current, 0, 100);
        } else {
          s.target = sweepAt(u);
        }
      }
      s.v += ((s.target - s.x) * p.stiffness - s.v * p.damping) * dt;
      s.x += s.v * dt;
      if (s.x < 0) {
        s.x = 0;
        s.v = 0;
      }
      if (s.x > 100) {
        s.x = 100;
        s.v = 0;
      }
      paint();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (sim.current.introActive) {
        sim.current.introActive = false;
        sim.current.introDone = false;
        sim.current.target = clamp(pctRef.current, 0, 100);
      }
    };
  }, [animate]);

  const commit = React.useCallback(
    (next: number) => {
      const s = sim.current;
      s.introActive = false;
      s.introDone = true;
      setPct(clamp(next, 0, 100));
    },
    [setPct]
  );

  React.useEffect(() => {
    const s = sim.current;
    if (s.introActive) return;
    const t = clamp(pct, 0, 100);
    if (Math.abs(s.target - t) < 0.0001) return;
    s.target = t;
    if (params.current.still) {
      s.x = t;
      s.v = 0;
      paintRef.current();
    }
  }, [pct]);

  /* ------------------------------------------------------------- pointer -- */

  const positionFromEvent = (clientX: number) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    commit(((clientX - rect.left) / Math.max(1, rect.width)) * 100);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    sim.current.dragging = true;
    sim.current.pointerId = e.pointerId;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Gracefully handle if setPointerCapture is unsupported
    }
    positionFromEvent(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sim.current.dragging || e.pointerId !== sim.current.pointerId) return;
    positionFromEvent(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    sim.current.dragging = false;
    sim.current.pointerId = null;
    try {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      }
    } catch {
      // Gracefully handle if already released
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const base = sim.current.target;
    let next = base;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = base + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = base - step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    else return;
    e.preventDefault();
    commit(next);
  };

  const shown = Math.round(clamp(pct, 0, 100));

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={props["aria-label"] ?? "Photo comparison slider"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={() => commit(snapOnDoubleClick)}
      data-motion={still ? "static" : "animated"}
      className={cn(
        "relative w-full touch-none select-none overflow-hidden cursor-ew-resize",
        className
      )}
      style={{ touchAction: "none", ...props.style }}
      {...props}
    >
      {/* Background (After / Now Layer) */}
      <div className="absolute inset-0 h-full w-full">{renderSide(after)}</div>

      {/* Foreground (Before / Then Layer - Clipped) */}
      <div
        ref={topRef}
        className="absolute inset-0 h-full w-full will-change-[clip-path]"
        style={{ clipPath: `inset(0 ${100 - shown}% 0 0)` }}
      >
        {renderSide(before)}
      </div>

      {/* Corner Chips (Left / Right) */}
      {labels && (
        <>
          <div
            ref={(el) => {
              labelRefs.current[0] = el;
            }}
            aria-hidden="true"
            className="pointer-events-none absolute top-3 left-3 sm:top-5 sm:left-5 z-20 transition-opacity duration-200"
          >
            {labels[0]}
          </div>

          <div
            ref={(el) => {
              labelRefs.current[1] = el;
            }}
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-3 sm:top-5 sm:right-5 z-20 transition-opacity duration-200"
          >
            {labels[1]}
          </div>
        </>
      )}

      {/* Golden Elegant Divider Line */}
      <div
        ref={dividerRef}
        className="pointer-events-none absolute bottom-0 top-0 z-30 -ml-0.5 w-1 will-change-[left]"
        style={{
          left: `${shown}%`,
          background: "linear-gradient(to bottom, #f3a187 0%, #ffffff 35%, #f5c65d 65%, #f3a187 100%)",
          boxShadow: "0 0 10px rgba(245, 198, 93, 0.6), 0 0 2px rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Interactive Handle Slider Button */}
        <button
          ref={handleRef}
          type="button"
          role="slider"
          aria-label="Reveal divider, Then to Now"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
          aria-valuetext={`${shown}%`}
          onKeyDown={onKeyDown}
          className={cn(
            "pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-11 sm:h-12 sm:w-12 -translate-x-1/2 -translate-y-1/2",
            "cursor-ew-resize place-items-center rounded-full p-0 transition-transform duration-150 active:scale-95",
            "border-3 sm:border-4 border-[#f5c65d] bg-white text-[#49362d]",
            "shadow-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f5c65d] focus-visible:ring-offset-2",
            "touch-manipulation"
          )}
          style={{
            boxShadow:
              "0 0 0 4px rgba(245, 198, 93, 0.35), 0 8px 24px rgba(73, 54, 45, 0.28), 0 0 16px rgba(243, 161, 135, 0.4)",
          }}
        >
          {/* Dual Chevron Icons (< >) Styled for the Birthday Theme */}
          <div className="flex items-center justify-center gap-0.5 text-[#49362d]">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f3a187]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <div className="w-0.5 h-4 bg-[#f5c65d]/50 rounded-full" />
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f5c65d]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default CompareReveal;
