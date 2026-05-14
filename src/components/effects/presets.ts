type SmoothEffectsVariant = "hero" | "cta" | "wide";

type SmoothDotsPreset = {
  dotCount: number;
  dotSize: number;
  color: string;
  pulseSpeed: number;
  clusterProbability: number;
};

type SmoothLightsPreset = {
  pairs: number;
  baseSize: number;
  sizeIncrement: number;
  horizontalOffset: number;
  verticalSpacing: number;
  leftColor: string;
  rightColor: string;
  pulseSpeed: number;
  rotationSpeed: number;
  blurAmount: number;
};

const DOT_COLOR = "#3E6AF8";
const LIGHT_LEFT_COLOR = "rgba(66, 129, 212, 0.58)";
const LIGHT_RIGHT_COLOR = "rgba(77, 181, 255, 0.3)";

export const PARTICLE_CANVAS_BG = "/assets/images/backgrounds/particle-canvas.webp";

export const getSmoothDotsPreset = (
  reducedEffects: boolean,
  variant: SmoothEffectsVariant = "cta",
): SmoothDotsPreset => {
  switch (variant) {
    case "hero":
      return {
        dotCount: reducedEffects ? 52 : 82,
        dotSize: reducedEffects ? 14 : 18,
        color: DOT_COLOR,
        pulseSpeed: reducedEffects ? 1.6 : 1.1,
        clusterProbability: reducedEffects ? 0.24 : 0.34,
      };
    case "wide":
      return {
        dotCount: reducedEffects ? 50 : 74,
        dotSize: reducedEffects ? 13 : 16,
        color: DOT_COLOR,
        pulseSpeed: reducedEffects ? 1.7 : 1.2,
        clusterProbability: reducedEffects ? 0.22 : 0.3,
      };
    case "cta":
    default:
      return {
        dotCount: reducedEffects ? 52 : 72,
        dotSize: reducedEffects ? 13 : 15,
        color: DOT_COLOR,
        pulseSpeed: reducedEffects ? 1.7 : 1.25,
        clusterProbability: reducedEffects ? 0.22 : 0.28,
      };
  }
};

export const getSmoothLightsPreset = (
  reducedEffects: boolean,
  variant: SmoothEffectsVariant = "cta",
): SmoothLightsPreset => {
  switch (variant) {
    case "hero":
      return {
        pairs: reducedEffects ? 2 : 3,
        baseSize: reducedEffects ? 380 : 460,
        sizeIncrement: reducedEffects ? 640 : 860,
        horizontalOffset: reducedEffects ? 280 : 360,
        verticalSpacing: reducedEffects ? 120 : 170,
        leftColor: "rgba(66, 129, 212, 0.6)",
        rightColor: LIGHT_RIGHT_COLOR,
        pulseSpeed: reducedEffects ? 6 : 5,
        rotationSpeed: reducedEffects ? 42 : 34,
        blurAmount: reducedEffects ? 18 : 22,
      };
    case "wide":
      return {
        pairs: reducedEffects ? 2 : 2,
        baseSize: reducedEffects ? 430 : 520,
        sizeIncrement: reducedEffects ? 620 : 760,
        horizontalOffset: reducedEffects ? 320 : 460,
        verticalSpacing: reducedEffects ? 130 : 180,
        leftColor: LIGHT_LEFT_COLOR,
        rightColor: LIGHT_RIGHT_COLOR,
        pulseSpeed: reducedEffects ? 6.5 : 5.8,
        rotationSpeed: reducedEffects ? 44 : 36,
        blurAmount: reducedEffects ? 16 : 20,
      };
    case "cta":
    default:
      return {
        pairs: reducedEffects ? 2 : 3,
        baseSize: reducedEffects ? 360 : 420,
        sizeIncrement: reducedEffects ? 620 : 760,
        horizontalOffset: reducedEffects ? 260 : 340,
        verticalSpacing: reducedEffects ? 110 : 150,
        leftColor: LIGHT_LEFT_COLOR,
        rightColor: LIGHT_RIGHT_COLOR,
        pulseSpeed: reducedEffects ? 6.3 : 5.6,
        rotationSpeed: reducedEffects ? 42 : 34,
        blurAmount: reducedEffects ? 18 : 22,
      };
  }
};
