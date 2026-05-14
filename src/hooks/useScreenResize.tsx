import { useState, useEffect } from "react";

// Match Tailwind custom screens defined in `tailwind.config.js`.
type BreakpointInfo = {
  device: "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs" | "xxs";
  width: number;
  is3xl: boolean;
  is2xl: boolean;
  isXl: boolean;
  isLg: boolean;
  isMd: boolean;
  isSm: boolean;
  isXs: boolean;
  isXxs: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isSmallMobile: boolean;
  scaleFactor: number;
  containerScale: number;
};

const getBreakpointInfo = (width: number): BreakpointInfo => {
  const is3xl = width >= 1536;
  const is2xl = width >= 1280 && width < 1536;
  const isXl = width >= 1024 && width < 1280;
  const isLg = width >= 768 && width < 1024;
  const isMd = width >= 640 && width < 768;
  const isSm = width >= 480 && width < 640;
  const isXs = width >= 375 && width < 480;
  const isXxs = width >= 320 && width < 375;

  // broader categories for compatibility with existing code
  const isDesktop = is3xl || is2xl || isXl;
  const isTablet = isLg || isMd;
  const isMobile = isSm || isXs;
  const isSmallMobile = isXxs || width < 320;

  // determine a primary device label
  const device = is3xl
    ? "3xl"
    : is2xl
      ? "2xl"
      : isXl
        ? "xl"
        : isLg
          ? "lg"
          : isMd
            ? "md"
            : isSm
              ? "sm"
              : isXs
                ? "xs"
                : "xxs";

  // scale factors tuned per breakpoint
  const scaleFactor = is3xl
    ? 1.05
    : is2xl
      ? 1
      : isXl
        ? 0.98
        : isLg
          ? 0.9
          : isMd
            ? 0.85
            : isSm
              ? 0.85
              : isXs
                ? 0.7
                : 0.65;

  const containerScale =
    is3xl || is2xl || isXl ? 1 : isLg ? 0.95 : isMd ? 0.9 : isSm ? 0.85 : 0.8;

  return {
    device,
    width,
    is3xl,
    is2xl,
    isXl,
    isLg,
    isMd,
    isSm,
    isXs,
    isXxs,
    isDesktop,
    isTablet,
    isMobile,
    isSmallMobile,
    scaleFactor,
    containerScale,
  };
};

export function useScreenResize() {
  const [breakpointInfo, setBreakpointInfo] = useState<BreakpointInfo>(() =>
    getBreakpointInfo(1280),
  );

  useEffect(() => {
    const handleResize = () => {
      setBreakpointInfo(getBreakpointInfo(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpointInfo;
}
