import type { ReactElement } from "react";
import { useState, useEffect, useRef } from "react";

type TrailDot = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
};

type TrailEntry = {
  id: number;
  x: number;
  y: number;
  timestamp: number;
  dots: TrailDot[];
};

type MouseTrailProps = {
  dotCount?: number;
  dotSize?: number;
  trailRadius?: number;
  dotColor?: string;
  lightColor?: string;
  lightSize?: number;
  flashDuration?: number;
  lightBlur?: number;
  enabled?: boolean;
  className?: string;
  zIndex?: number;
};

const MouseTrail = ({
  dotCount = 8,
  dotSize = 4,
  trailRadius = 60,
  dotColor = "#00EEFF",
  lightColor = "rgba(0, 238, 255, 0.4)",
  lightSize = 120,
  flashDuration = 0.8,
  lightBlur = 25,
  enabled = true,
  className = "",
  zIndex = 100,
}: MouseTrailProps): ReactElement | null => {
  const [trails, setTrails] = useState<TrailEntry[]>([]);
  const trailIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const generateDotsAroundPosition = (
      centerX: number,
      centerY: number,
    ): TrailDot[] => {
      const dots: TrailDot[] = [];
      for (let i = 0; i < dotCount; i++) {
        const angle = (Math.PI * 2 * i) / dotCount + Math.random() * 0.5;
        const distance = Math.random() * trailRadius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        dots.push({
          id: i,
          x,
          y,
          size: dotSize + Math.random() * 2,
          delay: Math.random() * 0.3,
          opacity: 0.6 + Math.random() * 0.4,
        });
      }
      return dots;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const rect = container.getBoundingClientRect();

      // Check if mouse is within the container bounds
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return; // Don't create trail if mouse is outside container
      }

      // Calculate position relative to the container
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const trailEntry: TrailEntry = {
        id: trailIdRef.current++,
        x: position.x,
        y: position.y,
        timestamp: Date.now(),
        dots: generateDotsAroundPosition(position.x, position.y),
      };

      setTrails((prev) => [...prev, trailEntry]);

      setTimeout(() => {
        setTrails((prev) =>
          prev.filter((trail) => trail.id !== trailEntry.id),
        );
      }, flashDuration * 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, dotCount, trailRadius, dotSize, flashDuration]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex }}
    >
      {trails.map((trail) => (
        <div key={trail.id}>
          {/* Gradient light effect */}
          <div
            className="absolute rounded-full mix-blend-screen"
            style={{
              left: trail.x - lightSize / 2,
              top: trail.y - lightSize / 2,
              width: lightSize,
              height: lightSize,
              background: `radial-gradient(circle at 50% 50%, ${lightColor}, transparent 70%)`,
              filter: `blur(${lightBlur}px)`,
              animation: `mouseTrailLight ${flashDuration}s ease-out forwards`,
            }}
          />

          {/* Flashing dots */}
          {trail.dots.map((dot) => (
            <div
              key={dot.id}
              className="absolute rounded-full"
              style={{
                left: dot.x - dot.size / 2,
                top: dot.y - dot.size / 2,
                width: dot.size,
                height: dot.size,
                backgroundColor: dotColor,
                opacity: dot.opacity,
                animation: `mouseTrailDot ${flashDuration}s ease-out forwards`,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}
        </div>
      ))}

      <style>{`
        @keyframes mouseTrailDot {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          20% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
        }

        @keyframes mouseTrailLight {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          30% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default MouseTrail;
