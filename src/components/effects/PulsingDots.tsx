import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type PulsingDot = {
  id: number | string;
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
};

type PulsingDotsProps = {
  dotCount?: number;
  dotSize?: number;
  color?: string;
  pulseSpeed?: number;
  pulseIntensity?: number;
  clusterProbability?: number;
  maxClusterSize?: number;
  className?: string;
  zIndex?: number;
  isActive?: boolean;
  pauseWhenOffscreen?: boolean;
};

const createDeterministicRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const getSeedFromValues = (values: Array<number | string | boolean>): number => {
  let hash = 2166136261;

  for (const value of values) {
    const text = String(value);
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
  }

  return hash >>> 0 || 1;
};

const PulsingDots = ({
  dotCount = 80,
  dotSize = 4,
  color = "#4DB5FF",
  pulseSpeed = 3,
  pulseIntensity = 0.6,
  clusterProbability = 0.3,
  maxClusterSize = 5,
  className = "",
  zIndex = 5,
  isActive = true,
  pauseWhenOffscreen = true,
}: PulsingDotsProps): ReactElement | null => {
  const [useTouchFallback, setUseTouchFallback] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const updateTouchFallback = (event: MediaQueryListEvent) => {
      setUseTouchFallback(event.matches);
    };

    setUseTouchFallback(mediaQuery.matches);

    mediaQuery.addEventListener("change", updateTouchFallback);
    return () => mediaQuery.removeEventListener("change", updateTouchFallback);
  }, []);

  useEffect(() => {
    if (!pauseWhenOffscreen) {
      setIsInViewport(true);
      return undefined;
    }

    const target = rootRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        setIsInViewport(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { threshold: 0, rootMargin: "160px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [pauseWhenOffscreen]);

  const shouldRenderDots = !pauseWhenOffscreen || isInViewport;
  const effectiveDotCount =
    useTouchFallback ? Math.max(36, Math.floor(dotCount * 0.6)) : dotCount;
  const effectiveDotSize =
    useTouchFallback ? Math.max(2.5, dotSize * 0.78) : dotSize;
  const effectivePulseSpeed = useTouchFallback ? pulseSpeed + 0.8 : pulseSpeed;
  const effectivePulseIntensity =
    useTouchFallback ? Math.min(pulseIntensity, 0.5) : pulseIntensity;
  const animationsEnabled = Boolean(isActive) && shouldRenderDots;

  const dots = useMemo(() => {
    if (!shouldRenderDots) {
      return [];
    }

    const random = createDeterministicRandom(
      getSeedFromValues([
        effectiveDotCount,
        effectiveDotSize,
        effectivePulseSpeed,
        clusterProbability,
        maxClusterSize,
        color,
        dotSize,
      ]),
    );
    const generatedDots: PulsingDot[] = [];

    for (let i = 0; i < effectiveDotCount; i++) {
      const isClusterCenter = random() < clusterProbability;
      const baseX = random() * 100;
      const baseY = random() * 100;

      if (isClusterCenter) {
        const clusterSize = Math.floor(random() * maxClusterSize) + 2;

        for (let j = 0; j < clusterSize; j++) {
          const offsetX = (random() - 0.5) * 8;
          const offsetY = (random() - 0.5) * 8;

          generatedDots.push({
            id: `${i}-${j}`,
            x: Math.max(0, Math.min(100, baseX + offsetX)),
            y: Math.max(0, Math.min(100, baseY + offsetY)),
            size: effectiveDotSize + random() * 2,
            delay: random() * effectivePulseSpeed,
            opacity: 0.4 + random() * 0.6,
          });
        }
      } else {
        generatedDots.push({
          id: i,
          x: baseX,
          y: baseY,
          size: effectiveDotSize + random() * 1.5,
          delay: random() * effectivePulseSpeed,
          opacity: 0.3 + random() * 0.5,
        });
      }
    }

    return generatedDots;
  }, [
    clusterProbability,
    effectiveDotCount,
    effectiveDotSize,
    effectivePulseSpeed,
    color,
    dotSize,
    maxClusterSize,
    shouldRenderDots,
  ]);

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 isolate overflow-hidden pointer-events-none will-change-transform-opacity ${className}`}
      style={{ zIndex }}
    >
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full will-change-transform-opacity"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: color,
            opacity:
              animationsEnabled ?
                dot.opacity
              : Math.max(0.16, dot.opacity * 0.45),
            animation: `dotPulse ${
              effectivePulseSpeed + dot.delay
            }s ease-in-out infinite`,
            animationDelay: `${dot.delay}s`,
            animationPlayState: animationsEnabled ? "running" : "paused",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      <style>{`
        @keyframes dotPulse {
          0%,
          100% {
            opacity: ${effectivePulseIntensity * 0.3};
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: ${effectivePulseIntensity};
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default PulsingDots;
