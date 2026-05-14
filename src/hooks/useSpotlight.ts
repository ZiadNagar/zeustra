import { useState, useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";

type SpotlightOptions = {
  spotlightSize?: number;
  spotlightColor?: string;
  fadeOutDistance?: number;
  enableBorderAnimation?: boolean;
  enableBorder?: boolean;
  borderColor?: string;
  highlightColor?: string;
  animationDuration?: number;
  defaultBorderColor?: string;
  enableHighlight?: boolean;
};

type SpotlightState = {
  x: number;
  y: number;
};

type SpotlightResult<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  mousePosition: SpotlightState;
  isHovered: boolean;
  spotlightStyle: CSSProperties;
  borderStyle: CSSProperties | null;
  enableBorder: boolean;
  enableBorderAnimation: boolean;
};

const useSpotlight = <T extends HTMLElement>(
  options: SpotlightOptions = {},
): SpotlightResult<T> => {
  const {
    spotlightSize = 600,
    spotlightColor = "rgba(77, 181, 255, 0.12)",
    fadeOutDistance = 40,
    enableBorderAnimation = false,
    enableBorder = true,
    borderColor = "rgba(0, 238, 255, 0.5)",
    highlightColor = "rgba(77, 181, 255, 0.8)",
    animationDuration = 4,
    defaultBorderColor = "#999999",
    enableHighlight = false,
  } = options;

  const [mousePosition, setMousePosition] = useState<SpotlightState>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Spotlight effect styles
  const spotlightStyle: CSSProperties = {
    background: `
      radial-gradient(
        ${spotlightSize}px circle at ${mousePosition.x}px ${mousePosition.y}px,
        ${spotlightColor},
        transparent ${fadeOutDistance}%
      )
    `,
    opacity: isHovered ? 1 : 0,
    transition: "opacity 300ms ease",
  };

  // Border animation styles
  const borderStyle: CSSProperties | null =
    enableBorderAnimation && enableHighlight
      ? {
          background: `
          linear-gradient(
            90deg,
            transparent 0%,
            ${borderColor} 25%,
            ${highlightColor} 50%,
            ${borderColor} 75%,
            transparent 100%
          )
        `,
          backgroundSize: "200% 100%",
          animation: `spotlight ${animationDuration}s ease-in-out infinite`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 500ms ease",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "subtract",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          padding: "1px",
        }
      : enableBorder
      ? {
          border: `1px solid ${defaultBorderColor}`,
          transition: "border-color 300ms ease",
        }
      : null;

  return {
    ref: elementRef,
    mousePosition,
    isHovered,
    spotlightStyle,
    borderStyle,
    enableBorder,
    enableBorderAnimation,
  };
};

export default useSpotlight;
