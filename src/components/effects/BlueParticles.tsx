import type { ReactElement } from "react";
import { useEffect, useState } from "react";

type BlueParticlePosition = {
  x: number;
  y: number;
};

type BlueParticlesProps = {
  className?: string;
  constrainHeight?: boolean;
  topOffset?: string;
  bottomOffset?: string;
  slideChange?: number;
  reducedEffects?: boolean;
  isActive?: boolean;
};

const BlueParticles = ({
  className = "",
  constrainHeight = false,
  topOffset = "0px",
  bottomOffset = "0px",
  slideChange = 0,
  reducedEffects = false,
  isActive = true,
}: BlueParticlesProps): ReactElement | null => {
  const baseScale = reducedEffects ? 0.7 : 1;
  const opacityScale = reducedEffects ? 0.75 : 1;

  const [particlePositions, setParticlePositions] = useState<
    BlueParticlePosition[]
  >([
    { x: 50, y: 60 }, // Center
    { x: 75, y: 60 }, // Safe distance from edges
  ]);

  // Update particle positions when slide changes
  useEffect(() => {
    if (slideChange > 0) {
      setParticlePositions((prev) =>
        prev.map((pos) => ({
          x: (pos.x + 25) % 100, // Move 25% to the right, wrap around
          y: Math.max(20, Math.min(80, pos.y + (Math.random() - 0.5) * 20)), // Keep safe distance from top/bottom edges
        }))
      );
    }
  }, [slideChange]);

  // Insert particle animation styles into document head
  useEffect(() => {
    const particleStyles = `
      @keyframes particleMove {
        0% {
          transform: translateX(0) translateY(0) scale(1) rotate(0deg);
        }
        50% {
          transform: translateX(25vw) translateY(-10px) scale(1.1) rotate(180deg);
        }
        100% {
          transform: translateX(0) translateY(0) scale(1) rotate(360deg);
        }
      }

      @keyframes particleGlow {
        0%, 100% {
          box-shadow: 0 0 30px rgba(77, 181, 255, 0.6), 0 0 60px rgba(0, 238, 255, 0.4);
        }
        50% {
          box-shadow: 0 0 50px rgba(0, 238, 255, 0.8), 0 0 100px rgba(77, 181, 255, 0.6);
        }
      }

      .particle-fixed {
        position: absolute;
        transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .particle-moving {
        animation: particleMove 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      .particle-glow {
        animation: particleGlow 3s ease-in-out infinite;
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.id = "blue-particles-styles";
    styleElement.textContent = particleStyles;

    const existingStyles = document.getElementById("blue-particles-styles");
    if (!existingStyles) {
      document.head.appendChild(styleElement);
    }

    return () => {
      const stylesElement = document.getElementById("blue-particles-styles");
      if (stylesElement && document.head.contains(stylesElement)) {
        document.head.removeChild(stylesElement);
      }
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      className={`${
        constrainHeight ? "absolute" : "fixed"
      } inset-0 w-full overflow-hidden pointer-events-none ${className}`}
      style={{
        zIndex: 0, // Under the glassmorphism layer
        top: constrainHeight ? topOffset : "0",
        bottom: constrainHeight ? bottomOffset : "0",
        height: constrainHeight ? "auto" : "100vh",
      }}
    >
      {/* Large Fixed Particles - Only 3 */}
      {particlePositions.map((position, i) => (
        <div
          key={`particle-${i}`}
          className="particle-fixed particle-glow"
          style={{
            width: `${(200 + i * 50) * baseScale}px`,
            height: `${(200 + i * 50) * baseScale}px`,
            left: `${position.x}%`,
            top: `${position.y}%`,
            background: `radial-gradient(circle, rgba(77, 181, 255, 0.9) 0%, rgba(77, 181, 255, 0.7) 20%, rgba(0, 238, 255, 0.5) 50%, rgba(0, 238, 255, 0.3) 70%, transparent 100%)`,
            borderRadius: "50%",
            filter: `blur(${Math.max(4, (8 + i * 2) * baseScale)}px)`,
            transform: `translate(-50%, -50%)`,
            opacity: (0.15 + i * 0.05) * opacityScale,
          }}
        />
      ))}

      {/* Smaller accent particles that complement the main 3 */}
      {[0, 1].map((i) => (
        <div
          key={`accent-${i}`}
          className="particle-fixed particle-glow"
          style={{
            width: `${(80 + i * 20) * baseScale}px`,
            height: `${(80 + i * 20) * baseScale}px`,
            left: `${30 + i * 40}%`, // Safe positions (30% and 70%)
            top: `${35 + i * 30}%`, // Safe vertical positions (35% and 65%)
            background: `radial-gradient(circle, rgba(0, 238, 255, 0.9) 0%, rgba(0, 238, 255, 0.7) 25%, rgba(77, 181, 255, 0.5) 60%, rgba(77, 181, 255, 0.2) 80%, transparent 100%)`,
            borderRadius: "50%",
            filter: `blur(${Math.max(3, 6 * baseScale)}px)`,
            transform: `translate(-50%, -50%)`,
            opacity: 0.1 * opacityScale,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default BlueParticles;
