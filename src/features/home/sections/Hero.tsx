import { TypeAnimation } from "react-type-animation";
import { memo, useRef } from "react";
import CTAButtons from "@/components/shared/CTAButtons";
import ThreadWaveCanvas from "./ThreadsWaves";
import useReducedEffects from "@/hooks/useReducedEffects";
import useInViewport from "@/hooks/useInViewport";

const HERO_TYPING_STYLE = {
  display: "inline-block",
  fontSize: "clamp(28px, 6vw, 95px)",
  fontWeight: 600,
  color: "var(--color-neutral-50, #F2F2F2)",
  lineHeight: "1.1",
  letterSpacing: "inherit",
};

const HeroTyping = memo(function HeroTyping() {
  return (
    <TypeAnimation
      sequence={["Broker", 1100, "Workspace", 1100, "Marketplace", 1100]}
      speed={{ type: "keyStrokeDelayInMs", value: 300 }}
      deletionSpeed={{ type: "keyStrokeDelayInMs", value: 280 }}
      repeat={Infinity}
      cursor={true}
      wrapper="span"
      style={HERO_TYPING_STYLE}
      className="text-display-xl text-center"
    />
  );
});

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedEffects = useReducedEffects();
  const isInViewport = useInViewport(sectionRef, { threshold: 0.2 });

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* ThreadsWaves animated background */}
      <div className="absolute inset-0 z-0 opacity-50 sm:opacity-60 xl:opacity-75 pointer-events-none mix-blend-screen mask-image-fade">
        {isInViewport && (
          <ThreadWaveCanvas
            reducedEffects={reducedEffects}
            isActive={isInViewport}
          />
        )}
      </div>
      <div className="relative z-20 flex items-center justify-center w-full min-h-dvh pt-20 sm:pt-22 md:pt-25 pb-8 sm:pb-10 md:pb-12">
        <div
          className="absolute inset-0 hidden pointer-events-none 2xl:block"
          style={{
            background:
              "radial-gradient(ellipse 40% 100% at 50% 45%, rgba(0,0,0,1) 15%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 block pointer-events-none 2xl:hidden"
          style={{
            background:
              "radial-gradient(ellipse 55% 30% at 50% 55%, rgba(0,0,0,1) 15%, transparent 100%)",
          }}
        />
        <div className="w-full px-4 py-6 mx-auto max-w-350 sm:px-6 sm:py-8 lg:px-8 lg:py-12 xl:py-16">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <div className="relative w-full">
              <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10">
                <div className="flex flex-col items-center min-w-full gap-6 sm:gap-8">
                  <h1 className="text-display-xl text-center w-full max-w-7xl mx-auto">
                    <div className="px-2 mx-auto sm:px-0">
                      <span
                        className="block text-white/95"
                        style={{
                          textShadow: "var(--shadow-hero-title)",
                        }}
                      >
                        Zeustra is an AI Powered
                      </span>
                      <span
                        className="block text-transparent bg-linear-to-r from-brand-cyan via-brand-blue-std to-brand-blue-light bg-clip-text"
                        style={{
                          textShadow: "var(--shadow-hero-accent)",
                        }}
                      >
                        Real Estate
                      </span>
                    </div>
                  </h1>

                  {/* Animated Typing Container */}
                  <div className="relative flex justify-center w-full">
                    <div className="w-fit min-w-[10ch] sm:min-w-[11ch] px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-3 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-brand-blue-deep/30 border border-brand-blue-deep/60 flex items-center justify-center transition-all duration-300 ease-out">
                      <div className="flex items-center justify-center overflow-hidden">
                        <HeroTyping />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="z-20 flex flex-col items-center w-full gap-6 sm:gap-8 lg:gap-8">
              <p
                className="text-[clamp(16px,2vw,24px)] text-neutral-50 text-center max-w-4xl px-4 sm:px-6 lg:px-0 leading-relaxed drop-shadow-xl"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
              >
                A commercial real estate world model and marketplace engineered
                to multiply value across every transaction.
              </p>

              <CTAButtons
                primaryText="Schedule Meeting"
                secondaryText="Learn More"
                onSecondaryClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.assign("/marketplace/");
                  }
                }}
                alignment="center"
                showArrow={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
