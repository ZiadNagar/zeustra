import type { ReactElement } from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import { FEATURES_DATA, SECTION_HEADERS } from "../data/homePageData";

const DEFAULT_FEATURE_ID = FEATURES_DATA[0]?.id ?? "explore";

type FeatureRecord = (typeof FEATURES_DATA)[number];
type AnimationPhase = "idle" | "fadeOut" | "fadeIn";

const isVideoAsset = (assetPath: string = ""): boolean =>
  assetPath.toLowerCase().endsWith(".mp4");

const Features = (): ReactElement => {
  const [activeFeature, setActiveFeature] = useState(DEFAULT_FEATURE_ID);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedDescription, setDisplayedDescription] = useState("");
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [resolvedVideoSources, setResolvedVideoSources] = useState<
    Record<string, string>
  >({});
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoBlobUrlsRef = useRef<Map<string, string>>(new Map());
  const pendingVideoFetchesRef = useRef<Map<string, Promise<string | null>>>(
    new Map(),
  );
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const loadVideoRef = useRef<
    ((feature: FeatureRecord) => Promise<string | null>) | null
  >(null);

  const syncResolvedSource = (featureId: string, sourceUrl: string): void => {
    setResolvedVideoSources((currentSources) => {
      if (currentSources[featureId] === sourceUrl) {
        return currentSources;
      }

      return {
        ...currentSources,
        [featureId]: sourceUrl,
      };
    });
  };

  // Lazy-load media when container enters viewport.
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { root: null, threshold: 0.25 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (animationPhase === "idle") {
      const currentFeature =
        FEATURES_DATA.find((feature) => feature.id === activeFeature) ??
        FEATURES_DATA[0];
      setDisplayedDescription(currentFeature.description);
    }
  }, [activeFeature, animationPhase]);

  // Handle animation phases when activeFeature changes.
  useEffect(() => {
    if (animationPhase === "fadeOut") {
      const timer = setTimeout(() => {
        const newFeature =
          FEATURES_DATA.find((feature) => feature.id === activeFeature) ??
          FEATURES_DATA[0];
        setDisplayedDescription(newFeature.description);
        setAnimationPhase("fadeIn");
      }, 200);

      return () => clearTimeout(timer);
    }

    if (animationPhase === "fadeIn") {
      const timer = setTimeout(() => {
        setAnimationPhase("idle");
        setIsTransitioning(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [animationPhase, activeFeature]);

  useEffect(() => {
    let isMounted = true;

    const loadVideo = async (
      feature: FeatureRecord,
    ): Promise<string | null> => {
      if (!isVideoAsset(feature.backgroundImage)) return null;

      const cachedObjectUrl = videoBlobUrlsRef.current.get(feature.id);
      if (cachedObjectUrl) {
        syncResolvedSource(feature.id, cachedObjectUrl);
        return cachedObjectUrl;
      }

      const pendingRequest = pendingVideoFetchesRef.current.get(feature.id);
      if (pendingRequest) {
        return pendingRequest;
      }

      const controller = new AbortController();
      abortControllersRef.current.set(feature.id, controller);

      const request = fetch(feature.backgroundImage, {
        cache: "force-cache",
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to preload video "${feature.id}" (${response.status})`,
            );
          }

          return response.blob();
        })
        .then((videoBlob) => {
          const existingObjectUrl = videoBlobUrlsRef.current.get(feature.id);
          if (existingObjectUrl) {
            return existingObjectUrl;
          }

          const objectUrl = URL.createObjectURL(videoBlob);
          videoBlobUrlsRef.current.set(feature.id, objectUrl);

          if (isMounted) {
            syncResolvedSource(feature.id, objectUrl);
          }

          return objectUrl;
        })
        .catch((error: unknown) => {
          if (!(error instanceof Error)) {
            return null;
          }
          if (error.name === "AbortError") {
            return null;
          }

          console.error(error);
          return null;
        })
        .finally(() => {
          pendingVideoFetchesRef.current.delete(feature.id);
          abortControllersRef.current.delete(feature.id);
        });

      pendingVideoFetchesRef.current.set(feature.id, request);
      return request;
    };

    loadVideoRef.current = loadVideo;

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const initialFeature =
      FEATURES_DATA.find((feature) => feature.id === DEFAULT_FEATURE_ID) ??
      FEATURES_DATA[0];

    if (!initialFeature || !loadVideoRef.current) return;

    void loadVideoRef.current(initialFeature);
  }, []);

  useEffect(() => {
    const loadVideo = loadVideoRef.current;
    if (!isInView || !loadVideo) return;

    FEATURES_DATA.filter(
      (feature) =>
        isVideoAsset(feature.backgroundImage) &&
        feature.id !== DEFAULT_FEATURE_ID,
    ).forEach((feature) => {
      void loadVideo(feature);
    });
  }, [isInView]);

  useEffect(() => {
    const abortControllers = abortControllersRef.current;
    const videoBlobUrls = videoBlobUrlsRef.current;
    const pendingVideoFetches = pendingVideoFetchesRef.current;

    return () => {
      abortControllers.forEach((controller) => controller.abort());
      abortControllers.clear();

      videoBlobUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
      videoBlobUrls.clear();
      pendingVideoFetches.clear();
    };
  }, []);

  const featuresData = useMemo(() => {
    const activeFeatureData =
      FEATURES_DATA.find((feature) => feature.id === activeFeature) ??
      FEATURES_DATA[0];

    return {
      active: {
        ...activeFeatureData,
        isVideo: isVideoAsset(activeFeatureData.backgroundImage),
      },
      tabs: FEATURES_DATA.map((feature) => ({
        ...feature,
        isActive: feature.id === activeFeature,
        labelColor:
          feature.id === activeFeature ? feature.accentColor : "#e0e0e0",
      })),
    };
  }, [activeFeature]);

  const activeVideoSource =
    featuresData.active.isVideo ?
      resolvedVideoSources[featuresData.active.id]
    : null;

  useEffect(() => {
    if (!activeVideoRef.current || !activeVideoSource) return;

    activeVideoRef.current.currentTime = 0;

    const playback = activeVideoRef.current.play();
    if (typeof playback?.catch === "function") {
      playback.catch(() => {});
    }
  }, [activeFeature, activeVideoSource]);

  const handleTabClick = (featureId: string): void => {
    if (featureId === activeFeature || isTransitioning) return;

    setIsTransitioning(true);
    setAnimationPhase("fadeOut");
    setActiveFeature(featureId);
  };

  return (
    <section className="flex items-center min-h-0 py-16 bg-transparent md:py-24 lg:py-32">
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
          <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-medium leading-tight lg:leading-18 tracking-tight lg:tracking-[-2.16px] text-neutral-100">
              The{" "}
              <span
                className="font-bold text-transparent bg-linear-to-r from-brand-cyan to-brand-blue-light bg-clip-text"
                style={{
                  textShadow: "var(--shadow-heading-glow)",
                }}
              >
                {SECTION_HEADERS.features.highlightWord}
              </span>{" "}
              of Brokerage
            </h2>
            <p className="text-sm sm:text-lg lg:text-[24px] font-normal text-slate-300 px-4">
              {SECTION_HEADERS.features.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center w-full space-y-8 sm:space-y-10 lg:space-y-8">
          <div
            ref={containerRef}
            className="relative w-full max-w-6xl aspect-video rounded-2xl"
          >
            <div
              className="absolute inset-2 rounded-[20px] sm:rounded-[25px] lg:rounded-[29px] object-cover overflow-hidden"
              style={{
                border: `1px solid ${featuresData.active.accentColor}`,
                boxShadow: `0px 0px 30px 0px ${featuresData.active.accentColor}60`,
              }}
            >
              {featuresData.active.isVideo ?
                activeVideoSource ?
                  <video
                    ref={activeVideoRef}
                    className="w-full h-full object-cover rounded-[18px] sm:rounded-[23px] lg:rounded-[28px]"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src={activeVideoSource}
                  />
                : <div className="flex h-full w-full items-center justify-center rounded-[18px] bg-neutral-950/80 text-sm text-neutral-500 sm:rounded-[23px] lg:rounded-[28px]">
                    Loading preview...
                  </div>

              : <div
                  key={featuresData.active.id}
                  className="w-full h-full bg-cover bg-center rounded-[18px] sm:rounded-[23px] lg:rounded-[28px]"
                  style={{
                    backgroundImage: `url("${featuresData.active.backgroundImage}")`,
                  }}
                />
              }
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full space-y-4 lg:space-y-4">
            <div className="flex flex-wrap items-center justify-center w-full max-w-5xl gap-3 px-4 sm:gap-4 lg:gap-4">
              {featuresData.tabs.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleTabClick(feature.id)}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`relative bg-neutral-850 px-4 sm:px-5 lg:px-5.5 py-2.5 sm:py-3 lg:py-3.5 rounded-md lg:rounded-lg h-9.5 sm:h-10 lg:h-10.75 flex items-center justify-center border-2 border-transparent ${
                    feature.id === "drag-drop" ?
                      "w-30 sm:w-32.5 lg:w-34"
                    : "w-21.25 sm:w-23.75 lg:w-28"
                  } transition-all duration-300 text-sm lg:text-base shrink-0`}
                  style={
                    feature.isActive || hoveredFeature === feature.id ?
                      {
                        border: `2px solid ${feature.accentColor}`,
                        boxShadow: `0px 0px 8px 0px ${feature.accentColor}80, inset 0px 0px 12px 0px ${feature.accentColor}40`,
                      }
                    : undefined
                  }
                >
                  <div
                    className="font-normal leading-tight text-center whitespace-nowrap"
                    style={{ color: feature.labelColor }}
                  >
                    {feature.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="w-full max-w-3xl px-4">
              <div
                className={`text-base sm:text-lg lg:text-[20px] font-normal leading-relaxed lg:leading-[29.25px] text-center transition-all duration-200 ease-in-out ${
                  animationPhase === "fadeOut" ?
                    "opacity-0 transform -translate-x-4"
                  : animationPhase === "fadeIn" ?
                    "opacity-100 transform translate-x-0"
                  : "opacity-100 transform translate-x-0"
                }`}
                style={{ color: featuresData.active.accentColor }}
              >
                {displayedDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
