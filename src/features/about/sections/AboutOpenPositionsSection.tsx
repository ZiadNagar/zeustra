import type { ReactElement } from "react";
import { useRef } from "react";
import PulsingLights from "@/components/effects/PulsingLights";
import PulsingDots from "@/components/effects/PulsingDots";
import {
  getSmoothDotsPreset,
  getSmoothLightsPreset,
  PARTICLE_CANVAS_BG,
} from "@/components/effects/presets";
import {
  PULSING_CONTENT_WRAPPER_CLASS,
  PULSING_CTA_WRAP_CLASS,
  PULSING_EDGE_FADE_BOTTOM_CLASS,
  PULSING_EDGE_FADE_TOP_CLASS,
  PULSING_HEADER_CLASS,
  PULSING_HEADING_CLASS,
  PULSING_HIGHLIGHT_CLASS,
  PULSING_PRIMARY_LINK_CLASS,
  PULSING_SECTION_PADDING_CLASS,
  PULSING_SUBTITLE_CLASS,
} from "@/components/effects/pulsingSectionStyles";
import useInViewport from "@/hooks/useInViewport";
import useParticleCanvasReady from "@/hooks/useParticleCanvasReady";
import useReducedEffects from "@/hooks/useReducedEffects";

const AboutOpenPositionsSection = (): ReactElement => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedEffects = useReducedEffects();
  const imageReady = useParticleCanvasReady();
  const isInViewport = useInViewport(sectionRef, {
    threshold: 0,
    rootMargin: "120px",
  });
  const dotsPreset = getSmoothDotsPreset(reducedEffects, "cta");
  const lightsPreset = getSmoothLightsPreset(reducedEffects, "cta");

  return (
    <section ref={sectionRef} className={PULSING_SECTION_PADDING_CLASS}>
      <div className="absolute inset-0 z-0 h-full w-full">
        <PulsingDots
          {...dotsPreset}
          zIndex={10}
          isActive={imageReady && isInViewport}
        />
        <PulsingLights
          {...lightsPreset}
          zIndex={1}
          reducedEffects={reducedEffects}
          isActive={imageReady && isInViewport}
        />
      </div>

      <div
        className="absolute inset-0 z-10 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: `url("${PARTICLE_CANVAS_BG}")`,
        }}
        aria-hidden="true"
      />
      <div className={PULSING_EDGE_FADE_TOP_CLASS} aria-hidden="true" />
      <div className={PULSING_EDGE_FADE_BOTTOM_CLASS} aria-hidden="true" />

      <div className={PULSING_CONTENT_WRAPPER_CLASS}>
        <div className={PULSING_HEADER_CLASS}>
          <h2 className={PULSING_HEADING_CLASS}>
            BECOME A PART OF THE{" "}
            <span
              className={PULSING_HIGHLIGHT_CLASS}
              style={{
                textShadow: "var(--shadow-hero-accent)",
                fontWeight: 700,
              }}
            >
              TEAM
            </span>
          </h2>
          <p className={PULSING_SUBTITLE_CLASS}>
            We're looking for people who care deeply about quality to build with
            us.
          </p>
        </div>

        <div className={PULSING_CTA_WRAP_CLASS}>
          <a
            href="/careers/"
            data-astro-reload=""
            className={PULSING_PRIMARY_LINK_CLASS}
          >
            View Open Positions
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutOpenPositionsSection;
