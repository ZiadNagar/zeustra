import { useState, useEffect, useRef } from "react";
import { PRODUCT_LAYERS } from "../data/productsPageData";

type ProductLayer = (typeof PRODUCT_LAYERS)[number];

type LayerCardProps = {
  layer: ProductLayer;
  isActive: boolean;
  isContent?: boolean;
};

const LayerCard = ({ layer, isActive, isContent = true }: LayerCardProps) => {
  if (!isContent) {
    return (
      <div
        className={`relative transition-all duration-500 ease-out flex items-center justify-center h-full ${
          isActive ? "opacity-100" : "opacity-40"
        }`}
      >
        <div className="relative flex items-center justify-center w-full h-full p-2 bg-neutral-950/30 rounded-2xl">
          <img
            src={layer.image}
            alt={layer.title}
            className="object-contain w-full h-full rounded-xl"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative transition-all duration-500 ease-out h-full ${
        isActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="relative h-full p-5 border bg-neutral-950 border-brand-blue-deep/60 shadow-[0px_0px_20px_0px_rgba(77,181,255,0.3)] rounded-2xl backdrop-blur-sm group md:p-10">
        <div className="flex flex-wrap items-center min-w-0 gap-3 mb-4">
          {layer.icon && (
            <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-lg bg-brand-blue-deep/10">
              <img src={layer.icon} alt="" className="w-8 h-8" aria-hidden />
            </div>
          )}
          <h3 className="text-[30px] font-bold text-slate-100 leading-7 min-w-0 flex-1">
            {layer.title}
          </h3>
        </div>

        <p className="mb-6 text-[18px] font-semibold text-brand-blue-deep">
          {layer.subheading}
        </p>

        <p className="text-[18px] text-slate-300">{layer.description}</p>
      </div>
    </div>
  );
};

const ProductsLayers = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef(0);
  const isTimelineActiveRef = useRef(true);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const updateProgress = () => {
      if (!isTimelineActiveRef.current) return;

      const timelineRect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const viewportMiddle = windowHeight / 2;

      const progress =
        (viewportMiddle - timelineRect.top) / timelineRect.height;
      const clampedProgress = Math.max(0, Math.min(1, progress));
      setScrollProgress((previous) =>
        Math.abs(previous - clampedProgress) > 0.002 ?
          clampedProgress
        : previous,
      );

      let newActiveIndex = 0;
      let minDistance = Infinity;

      layerRefs.current.forEach((layer, index) => {
        if (layer) {
          const layerRect = layer.getBoundingClientRect();
          const layerCenter = layerRect.top + layerRect.height / 2;
          const distance = Math.abs(layerCenter - viewportMiddle);

          if (distance < minDistance) {
            minDistance = distance;
            newActiveIndex = index;
          }
        }
      });

      setActiveIndex((previous) =>
        previous === newActiveIndex ? previous : newActiveIndex,
      );
    };

    const scheduleUpdateProgress = () => {
      if (rafRef.current || !isTimelineActiveRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        updateProgress();
      });
    };

    const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";
    const observer =
      hasIntersectionObserver ?
        new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;

            isTimelineActiveRef.current =
              entry.isIntersecting || entry.intersectionRatio > 0;

            if (isTimelineActiveRef.current) {
              scheduleUpdateProgress();
            }
          },
          { threshold: 0, rootMargin: "320px 0px" },
        )
      : null;

    observer?.observe(timeline);

    scheduleUpdateProgress();

    window.addEventListener("scroll", scheduleUpdateProgress, {
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdateProgress);

    return () => {
      observer?.disconnect();

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }

      window.removeEventListener("scroll", scheduleUpdateProgress);
      window.removeEventListener("resize", scheduleUpdateProgress);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden md:py-32"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(77, 181, 255, 0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      <div
        className="absolute top-0 left-0 right-0 z-10 h-24 pointer-events-none md:h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
        }}
      />

      <div className="relative z-10 w-full px-4 mx-auto max-w-350 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16 text-center md:mb-20">
          <h2 className="text-display-lg-alt">
            <span
              className="text-transparent bg-linear-to-r from-brand-cyan via-brand-blue-std to-brand-blue-light bg-clip-text text-display-lg-alt"
              style={{
                textShadow: "var(--shadow-hero-accent)",
                fontWeight: 700,
              }}
            >
              Architecture{" "}
            </span>
            <span className="text-white">is the AI</span>
          </h2>
          <p className="text-slate-300 text-[clamp(16px,2vw,24px)] mx-auto mt-4 sm:mt-6 leading-relaxed">
            A unified system of data, workflows, and intelligence designed to
            power and optimize every transaction.
          </p>
        </div>

        <div ref={timelineRef} className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-0.5 hidden xl:block z-10">
            <div className="absolute inset-0 rounded-full bg-neutral-800" />
            <div
              className="absolute top-0 left-0 w-full transition-all duration-150 ease-out rounded-full bg-brand-blue-light"
              style={{
                height: `${scrollProgress * 100}%`,
              }}
            />
          </div>

          <div className="space-y-8 md:space-y-40">
            {PRODUCT_LAYERS.map((layer, index) => {
              const isActive = activeIndex >= index;
              const isOdd = index % 2 === 0;

              return (
                <div
                  key={layer.id}
                  ref={(el) => {
                    layerRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="relative"
                >
                  <div
                    className={`flex flex-col xl:flex-row gap-12 px-4 sm:px-12 xl:px-0 md:gap-20 xl:gap-32 items-stretch h-full`}
                  >
                    <div
                      className={`flex-1 flex ${isOdd ? "md:order-1" : "xl:order-2"}`}
                    >
                      <LayerCard
                        layer={layer}
                        isActive={isActive}
                        isContent={true}
                      />
                    </div>

                    <div
                      className={`flex-1 flex ${isOdd ? "md:order-2" : "md:order-1"}`}
                    >
                      <LayerCard
                        layer={layer}
                        isActive={isActive}
                        isContent={false}
                      />
                    </div>
                  </div>

                  <div className="absolute z-20 hidden transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 md:flex">
                    <div
                      className={`w-6 h-6 rounded-full transition-all duration-150 ease-out ${isActive ? "bg-brand-blue-deep" : "bg-neutral-600"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsLayers;
