import type { ReactElement } from "react";
import { useRef } from "react";
import MouseTrail from "@/components/effects/MouseTrail";
import PulsingDots from "@/components/effects/PulsingDots";
import PulsingLights from "@/components/effects/PulsingLights";
import {
  getSmoothDotsPreset,
  getSmoothLightsPreset,
} from "@/components/effects/presets";
import useInViewport from "@/hooks/useInViewport";
import useParticleCanvasReady from "@/hooks/useParticleCanvasReady";
import useReducedEffects from "@/hooks/useReducedEffects";

const NotFoundEffectsIsland = (): ReactElement | null => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reducedEffects = useReducedEffects();
  const imageReady = useParticleCanvasReady();
  const isInViewport = useInViewport(rootRef, { threshold: 0, rootMargin: "140px" });
  const dotsPreset = getSmoothDotsPreset(reducedEffects, "wide");
  const lightsPreset = getSmoothLightsPreset(reducedEffects, "wide");

  return (
    <div ref={rootRef} className="absolute inset-0 z-0 w-full h-full">
      <PulsingDots
        {...dotsPreset}
        zIndex={0}
        isActive={imageReady && isInViewport}
      />
      <PulsingLights
        {...lightsPreset}
        zIndex={0}
        reducedEffects={reducedEffects}
        isActive={imageReady && isInViewport}
      />
      <MouseTrail
        dotCount={1}
        dotSize={20}
        trailRadius={50}
        dotColor="#3E6AF8"
        lightColor="rgba(66, 129, 212, 0.6)"
        lightSize={100}
        flashDuration={1}
        lightBlur={50}
        zIndex={0}
      />
    </div>
  );
};

export default NotFoundEffectsIsland;
