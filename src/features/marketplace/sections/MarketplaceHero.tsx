import { useLayoutEffect, useRef } from "react";
import CTAButtons from "@/components/shared/CTAButtons";
import { MARKETPLACE_HERO } from "../data/marketplaceData";

const MARKETPLACE_HERO_BG = "/assets/images/wavy-lines-background.svg";

const MarketplaceHero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const existing = document.querySelector(
      `link[rel=preload][href='${MARKETPLACE_HERO_BG}']`,
    );

    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = MARKETPLACE_HERO_BG;
    link.setAttribute("data-injected", "marketplace-hero-preload");
    document.head.appendChild(link);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-start justify-start w-full overflow-visible bg-black"
    >
      <div
        className="absolute inset-0 z-0 w-screen h-full pointer-events-none "
        style={{
          backgroundImage: `url("${MARKETPLACE_HERO_BG}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-48 pointer-events-none md:h-64"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.95))",
        }}
      />
      <div className="relative z-20 max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-36 sm:mt-48 lg:mt-60">
        <header className="mx-auto text-center border-none">
          <h1 className="text-white text-display-xl">
            <span>{MARKETPLACE_HERO.heading}</span>
          </h1>
          <p className="text-[clamp(16px,2vw,24px)] text-slate-300 py-6 mx-auto max-w-4xl">
            {MARKETPLACE_HERO.subtitle}
          </p>
          <div className="flex flex-col items-center w-full gap-4 mt-8 sm:mt-10">
            <CTAButtons
              primaryText={MARKETPLACE_HERO.ctaPrimary}
              secondaryText={MARKETPLACE_HERO.ctaSecondary}
              alignment="center"
              showArrow={false}
              variant="large"
            />
          </div>
        </header>
      </div>
    </section>
  );
};

export default MarketplaceHero;
