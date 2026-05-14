import { useLayoutEffect, useState } from "react";
import { MARKETPLACE_FEATURES } from "../data/marketplaceData";

const MarketplaceFeatureCard = () => {
  const backgroundImageUrl = "/assets/images/why-zeustra-solutions-bg.webp";
  const [imageLoaded, setImageLoaded] = useState(false);

  useLayoutEffect(() => {
    const existing = document.querySelector(
      `link[rel=preload][href='${backgroundImageUrl}']`,
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = backgroundImageUrl;
      link.setAttribute("data-injected", "marketplace-preload");
      document.head.appendChild(link);
    }

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = backgroundImageUrl;

    if (img.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <section className="relative px-4 py-12 overflow-hidden sm:px-6">
      <div className="relative mx-auto space-y-6 max-w-350 sm:space-y-8">
        {MARKETPLACE_FEATURES.map((feature) => (
          <div key={feature.id} className="relative">
            {/* Placeholder shown while image loads */}
            {!imageLoaded && (
              <div className="absolute inset-0 rounded-[28px] bg-neutral-950" />
            )}
            {/* Gradient border - only render after image loads */}
            {imageLoaded && (
              <div
                className="relative rounded-[28px] p-px"
                style={{
                  background:
                    "linear-gradient(200deg, rgba(77, 181, 255, 1) 0%, rgba(32, 33, 33, 1) 72%)",
                }}
              >
                <div
                  className="relative rounded-[28px] overflow-hidden bg-neutral-950/40"
                  style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Grid Layout: 50/50 Split */}
                  <div className="grid items-center justify-center gap-8 p-5 sm:p-8 md:gap-10 lg:grid-cols-2 lg:gap-12 lg:p-10">
                    <div className="min-w-0 space-y-6">
                      {/* Heading Section */}
                      <div className="space-y-4 ">
                        <h2 className="text-[clamp(20px,4vw,48px)] font-medium leading-tight text-white">
                          {feature.heading.main}{" "}
                          <span
                            className="font-bold text-transparent bg-linear-to-r from-brand-cyan to-brand-blue-light bg-clip-text"
                            style={{
                              textShadow:
                                "0px 0px 60px rgba(59, 130, 246, 0.8), 0px 0px 20px rgba(59, 130, 246, 0.4)",
                            }}
                          >
                            {feature.heading.highlight}
                          </span>
                        </h2>

                        <p className="text-pretty text-[clamp(0.875rem,2.8vw,1.125rem)] leading-relaxed text-[#7E8A9A]">
                          {feature.paragraph}
                        </p>
                      </div>

                      {/* STATS SECTION: HORIZONTAL WITH DIVIDERS */}
                      {feature.stats && feature.stats.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
                          {feature.stats.map((stat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center min-w-0 gap-4 sm:gap-6"
                            >
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <span className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
                                  {stat.value}
                                </span>
                                <span className="text-[10px] font-medium tracking-widest text-neutral-500 sm:text-xs">
                                  {stat.label}
                                </span>
                              </div>
                              {idx < feature.stats.length - 1 && (
                                <div className="hidden w-px h-10 bg-neutral-800 lg:block" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA/Learn More */}
                      <a
                        href={feature.link.href}
                        className="inline-flex min-h-11 items-center gap-2 py-2 text-pretty text-sm font-medium text-[#7E8A9A] transition-all hover:text-brand-blue-light group/link"
                      >
                        {feature.link.text}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transition-transform group-hover/link:translate-x-1 text-brand-blue-light"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>

                    {/* Right Side: Image replacement for Badges */}
                    <div className="flex items-center justify-center min-w-0">
                      <div className="group/img relative aspect-square w-full max-w-[min(100%,320px)] sm:max-w-90 lg:max-w-105">
                        {/* Diagram placeholder or actual image if provided */}
                        <img
                          src={feature.graphic}
                          alt={feature.heading.main}
                          className="object-contain w-full h-full transition-all duration-500 mix-blend-lighten motion-safe:group-hover/img:scale-110"
                        />
                        {/* Subtle glow behind the graphic */}
                        <div className="absolute inset-0 bg-brand-blue-light/10 blur-[60px] -z-10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarketplaceFeatureCard;
