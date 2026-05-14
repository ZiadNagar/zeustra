import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

type PulsingLightsProps = {
  pairs?: number;
  baseSize?: number;
  sizeIncrement?: number;
  horizontalOffset?: number;
  verticalSpacing?: number;
  leftColor?: string;
  rightColor?: string;
  pulseSpeed?: number;
  rotationSpeed?: number;
  blurAmount?: number;
  className?: string;
  zIndex?: number;
  reducedEffects?: boolean;
  isActive?: boolean;
  pauseWhenOffscreen?: boolean;
};

const PulsingLights = ({
  pairs = 3,
  baseSize = 200,
  sizeIncrement = 40,
  horizontalOffset = 60,
  verticalSpacing = 15,
  leftColor = "rgba(0, 238, 255, 0.4)",
  rightColor = "rgba(77, 181, 255, 0.35)",
  pulseSpeed = 4,
  rotationSpeed = 25,
  blurAmount = 18,
  className = "",
  zIndex = 5,
  reducedEffects = false,
  isActive = true,
  pauseWhenOffscreen = true,
}: PulsingLightsProps): ReactElement | null => {
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

  const shouldRenderLayers = !pauseWhenOffscreen || isInViewport;
  const shouldUseTouchFallback = useTouchFallback;
  const effectivePairs =
    reducedEffects || shouldUseTouchFallback ?
      Math.max(2, Math.ceil(pairs / (shouldUseTouchFallback ? 2 : 2)))
    : pairs;
  const effectiveBlur =
    shouldUseTouchFallback ? Math.max(10, Math.floor(blurAmount * 0.4))
    : reducedEffects ? Math.max(10, Math.floor(blurAmount * 0.5))
    : blurAmount;
  const effectivePulseSpeed =
    reducedEffects || shouldUseTouchFallback ? pulseSpeed + 1 : pulseSpeed;
  const effectiveRotationSpeed =
    shouldUseTouchFallback ? rotationSpeed + 18 : rotationSpeed;
  const shouldAnimate =
    isActive && shouldRenderLayers && !shouldUseTouchFallback;
  const staticBlur = Math.max(8, Math.floor(effectiveBlur * 0.6));
  const touchScale = shouldUseTouchFallback ? 0.82 : 1;
  const blendClassName = shouldUseTouchFallback ? "" : "mix-blend-screen";
  const touchOpacity = shouldUseTouchFallback ? 0.82 : 1;

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 isolate overflow-hidden pointer-events-none will-change-transform-opacity ${className}`}
      style={{ zIndex }}
    >
      {shouldRenderLayers &&
        Array.from({ length: effectivePairs }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 will-change-transform"
            style={{
              animation:
                shouldAnimate ?
                  `${i % 2 === 0 ? "spinSlow" : "spinSlowReverse"} ${
                    effectiveRotationSpeed + i * 8
                  }s linear infinite`
                : "none",
              transformOrigin: "50% 50%",
            }}
          >
            {/* Left light (x negative) */}
            <div
              className={`absolute rounded-full ${blendClassName}`}
              style={{
                width: `${(baseSize + i * sizeIncrement) * touchScale}px`,
                height: `${(baseSize + i * sizeIncrement) * touchScale}px`,
                left: `calc(50% - ${horizontalOffset + i * 15}px - ${
                  ((baseSize + i * sizeIncrement) * touchScale) / 2
                }px)`,
                top: `calc(50% - ${((baseSize + i * sizeIncrement) * touchScale) / 2}px + ${
                  i * verticalSpacing
                }px)`,
                background: `radial-gradient(circle at 50% 50%, ${leftColor}, transparent 65%)`,
                animation:
                  shouldAnimate ?
                    `pulseGlow ${
                      effectivePulseSpeed + i * 0.8
                    }s ease-in-out infinite`
                  : "none",
                filter: `blur(${shouldAnimate ? effectiveBlur : staticBlur}px)`,
                opacity: shouldAnimate ? touchOpacity : touchOpacity * 0.62,
              }}
            />

            {/* Right light (x positive) */}
            <div
              className={`absolute rounded-full ${blendClassName}`}
              style={{
                width: `${(baseSize - 20 + i * sizeIncrement) * touchScale}px`,
                height: `${(baseSize - 20 + i * sizeIncrement) * touchScale}px`,
                left: `calc(50% + ${horizontalOffset + i * 15}px - ${
                  ((baseSize - 20 + i * sizeIncrement) * touchScale) / 2
                }px)`,
                top: `calc(50% - ${((baseSize - 20 + i * sizeIncrement) * touchScale) / 2}px + ${
                  i * verticalSpacing + 10
                }px)`,
                background: `radial-gradient(circle at 50% 50%, ${rightColor}, transparent 65%)`,
                animation:
                  shouldAnimate ?
                    `pulseGlow ${
                      effectivePulseSpeed + 1 + i * 0.9
                    }s ease-in-out infinite`
                  : "none",
                filter: `blur(${shouldAnimate ? effectiveBlur + 3 : staticBlur + 2}px)`,
                opacity: shouldAnimate ? touchOpacity : touchOpacity * 0.62,
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default PulsingLights;
