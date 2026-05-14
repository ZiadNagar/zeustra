import type { ReactElement } from "react";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import PulsingLights from "@/components/effects/PulsingLights";
import PulsingDots from "@/components/effects/PulsingDots";
import useReducedEffects from "@/hooks/useReducedEffects";
import { infoCards } from "@/features/about/data/aboutPageData";

const HERO_BG = "/assets/images/backgrounds/particle-canvas.webp";

const HeroSection = (): ReactElement => {
  const reducedEffects = useReducedEffects();
  const [imageLoaded, setImageLoaded] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const [isInViewport, setIsInViewport] = useState(true);

  // Intersection Observer - only render heavy effects when hero is visible
  useEffect(() => {
    const target = heroRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        // Start rendering effects when hero is 20% visible
        // Stop when fully scrolled past (0% visible)
        setIsInViewport(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { threshold: 0, rootMargin: "100px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    // Inject a preload link so the browser starts fetching the image early.
    const existing = document.querySelector(
      `link[rel=preload][href='${HERO_BG}']`,
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = HERO_BG;
      link.setAttribute("data-injected", "hero-preload");
      document.head.appendChild(link);
    }

    // Track when the image finishes decoding so effects render only after
    // the background is ready — eliminates the flash of effects on a blank canvas.
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = HERO_BG;

    // Cached images fire synchronously; onload may not trigger.
    if (img.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 overflow-hidden bg-black mt-52 md:mt-20 sm:px-6 md:px-8 lg:px-28 transform-gpu"
    >
      {/* Effects layer — behind the image, only rendered once the image is loaded */}
      {imageLoaded && isInViewport && (
        <div className="absolute inset-0 z-0 w-full h-full">
          <PulsingDots
            dotCount={reducedEffects ? 52 : 82}
            dotSize={reducedEffects ? 14 : 18}
            color="#3E6AF8"
            pulseSpeed={reducedEffects ? 1.6 : 1.1}
            clusterProbability={reducedEffects ? 0.24 : 0.34}
            zIndex={0}
          />
          <PulsingLights
            pairs={reducedEffects ? 2 : 3}
            baseSize={reducedEffects ? 380 : 460}
            sizeIncrement={reducedEffects ? 640 : 860}
            horizontalOffset={reducedEffects ? 280 : 360}
            verticalSpacing={reducedEffects ? 120 : 170}
            leftColor="rgba(66, 129, 212, 0.6)"
            rightColor="rgba(77, 181, 255, 0.3)"
            pulseSpeed={reducedEffects ? 6 : 5}
            rotationSpeed={reducedEffects ? 42 : 34}
            blurAmount={reducedEffects ? 18 : 22}
            zIndex={0}
            reducedEffects={reducedEffects}
          />
        </div>
      )}

      {/* Background image — above effects, below content */}
      <div
        className="absolute inset-0 z-10 bg-center bg-cover"
        style={{ backgroundImage: `url("${HERO_BG}")` }}
        aria-hidden="true"
      />

      {/* Content layer — above everything */}
      <div className="relative z-20 mx-auto max-w-350">
        <header className="mx-auto text-center">
          <h1 className="text-white text-display-xl">
            <span>Product-Led Transactional Brokerage</span>
          </h1>
          <p className="max-w-4xl px-4 mx-auto mt-6 text-[clamp(16px,2vw,24px)] text-neutral-50 text-center leading-relaxed sm:px-6 lg:px-0">
            Traditional brokers just broker. Zeustra sells a product that adds
            more value than the cost of our service.
          </p>
        </header>

        <div className="grid gap-6 px-4 mx-auto mt-12 max-w-7xl md:mt-24 justify-items-center md:grid-cols-2">
          {infoCards.map((card) => (
            <article
              key={card.title}
              className="w-full p-6 transition-all duration-200 ease-out border md:p-8 rounded-card-lg border-border-glass bg-gradient-card backdrop-blur-card transform-gpu md:hover:-translate-y-1 md:hover:shadow-glow-blue md:hover:border-brand-blue-std/70"
            >
              <div className="flex items-center justify-center border w-11 h-11 rounded-xl border-white/20">
                <img
                  src={card.icon}
                  alt=""
                  className="w-5 h-5"
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-5 font-bold text-neutral-100 text-heading-5">
                {card.title}
              </h2>
              <p className="mt-3 text-slate-300 text-body-base">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
