import { useRef, useState, type CSSProperties } from "react";
import { PRODUCTS_TECH_STACK_DATA } from "../data/productsPageData";
import SectionHeader from "@/components/shared/SectionHeaderReact";
import PulsingLights from "@/components/effects/PulsingLights";
import PulsingDots from "@/components/effects/PulsingDots";
import {
  getSmoothDotsPreset,
  getSmoothLightsPreset,
  PARTICLE_CANVAS_BG,
} from "@/components/effects/presets";
import {
  PULSING_HEADER_CONTAINER_CLASS,
  PULSING_HEADING_CLASS,
  PULSING_SUBTITLE_CLASS,
} from "@/components/effects/pulsingSectionStyles";
import TechStackDiagram from "@/components/effects/TechStackDiagram";
import { useScreenResize } from "@/hooks/useScreenResize";
import useReducedEffects from "@/hooks/useReducedEffects";
import useInViewport from "@/hooks/useInViewport";
import useParticleCanvasReady from "@/hooks/useParticleCanvasReady";

type ProductsTechStackData = typeof PRODUCTS_TECH_STACK_DATA;
type ProductsTechStackSection =
  ProductsTechStackData["sections"][keyof ProductsTechStackData["sections"]];
type ProductsTechStackTag = ProductsTechStackSection["tags"][number];
type PositionKey = "top" | "left" | "right" | "bottom" | "transform";
type SectionPosition = Partial<Record<PositionKey, string>>;
type CardStyleVariables = CSSProperties & {
  "--section-color": string;
  "--card-scale": number;
};

const ProductsTechStack = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hoveredTagKey, setHoveredTagKey] = useState<string | null>(null);
  const reducedEffects = useReducedEffects();
  const imageReady = useParticleCanvasReady();
  const isInViewport = useInViewport(sectionRef, { threshold: 0.1 });
  const dotsPreset = getSmoothDotsPreset(reducedEffects, "wide");
  const lightsPreset = getSmoothLightsPreset(reducedEffects, "wide");
  const { sections, title, subtitle, highlightWord } = PRODUCTS_TECH_STACK_DATA;

  const renderAnimatedBackground = () => {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Background effects layer - PulsingLights first (behind) */}
        <PulsingLights
          {...lightsPreset}
          zIndex={1}
          reducedEffects={reducedEffects}
          isActive={isInViewport && imageReady}
        />
        {/* PulsingDots layer (middle) */}
        <PulsingDots
          {...dotsPreset}
          zIndex={5}
          isActive={isInViewport && imageReady}
        />
        {/* Background image overlay (top of background stack) */}
        <div
          className="absolute inset-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `url("${PARTICLE_CANVAS_BG}")`,
            zIndex: 10,
          }}
        />
      </div>
    );
  };

  const {
    containerScale,
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
  } = useScreenResize();

  const getLayoutSettings = () => {
    if (is3xl) {
      return {
        containerHeight: "600px",
        maxWidth: "1100px",
        positionMultiplier: 1,
        cardPaddingClass: "p-8",
        logoSize: 240,
        cardScale: 1,
        fontSize: "text-xl",
        tagFontSize: "text-sm",
      };
    }

    if (is2xl || isXl) {
      return {
        containerHeight: "400px",
        maxWidth: "750px",
        positionMultiplier: 0.9,
        cardPaddingClass: "p-4",
        logoSize: 208,
        cardScale: 0.75,
        fontSize: "text-md",
        tagFontSize: "text-sm",
      };
    }

    if (isLg || isMd) {
      return {
        containerHeight: "370px",
        maxWidth: "560px",
        positionMultiplier: 0.85,
        cardPaddingClass: "p-2",
        logoSize: 160,
        cardScale: 0.75,
        fontSize: "text-sm",
        tagFontSize: "text-xs",
      };
    }

    if (isSm) {
      return {
        containerHeight: "440px",
        maxWidth: "480px",
        positionMultiplier: 0.75,
        cardPaddingClass: "p-2",
        logoSize: 150,
        cardScale: 0.5,
        fontSize: "text-sm",
        tagFontSize: "text-sm",
      };
    }

    if (isXs || isXxs) {
      return {
        containerHeight: "350px",
        maxWidth: "480px",
        positionMultiplier: 0.7,
        cardPaddingClass: "p-3",
        logoSize: 120,
        cardScale: 0.45,
        fontSize: "text-sm",
        tagFontSize: "text-xs",
      };
    }

    // fallback: treat as mobile
    return {
      containerHeight: "300px",
      maxWidth: "420px",
      positionMultiplier: 0.9,
      cardPaddingClass: "p-2",
      logoSize: 120,
      cardScale: 0.4,
      fontSize: "text-sm",
      tagFontSize: "text-xs",
    };
  };

  const {
    containerHeight,
    maxWidth,
    cardPaddingClass,
    logoSize,
    cardScale,
    fontSize,
    tagFontSize,
  } = getLayoutSettings();

  // Parse numeric maxWidth (e.g. '1200px' -> 1200)
  const adjustPosition = (
    pos: SectionPosition = {},
    sectionId: ProductsTechStackSection["id"],
  ): SectionPosition => {
    const adjusted: SectionPosition = { ...pos };

    // Apply position adjustments based on device size
    (["top", "left", "right", "bottom"] as const).forEach((key) => {
      const positionValue = pos[key];
      if (typeof positionValue === "string" && positionValue.endsWith("%")) {
        const value = parseFloat(positionValue);

        // Special handling for left and right positions to prevent cutoff
        if (key === "left" || key === "right") {
          // For left/right cards, ensure they don't get cut off on smaller screens
          if (key === "left") {
            // Left card: ensure minimum distance from left edge
            const minLeftPosition = isDesktop
              ? value
              : isTablet
                ? Math.max(value, 6)
                : isMobile
                  ? Math.max(value, 6)
                  : Math.max(value, 8);
            adjusted[key] = `${minLeftPosition}%`;
          } else if (key === "right") {
            // Right card: ensure minimum distance from right edge
            const minRightPosition = isDesktop
              ? value
              : isTablet
                ? Math.max(value, 6)
                : isMobile
                  ? Math.max(value, 6)
                  : Math.max(value, 8);
            adjusted[key] = `${minRightPosition}%`;
          }
        } else if (key === "top" || key === "bottom") {
          // Special handling for top/bottom cards to account for wider width
          if (sectionId === "artificial-intelligence" || sectionId === "data") {
            // For wider top/bottom cards, adjust positioning to center them properly
            if (isDesktop) {
              adjusted[key] = `${value}%`;
            } else if (isTablet) {
              // Slight adjustment for tablet to account for wider cards
              adjusted[key] = `${value * 2}%`;
            } else if (isMobile) {
              // Mobile: top card down, bottom card up
              if (key === "top") {
                adjusted[key] = `${value * 3.75}%`; // Move top card down slightly
              } else if (key === "bottom") {
                adjusted[key] = `${value * 4.5}%`; // Move bottom card up slightly
              }
            } else {
              // Small mobile: top card down, bottom card up
              if (key === "top") {
                adjusted[key] = `${value * 1.9}%`; // Move top card down slightly
              } else if (key === "bottom") {
                adjusted[key] = `${value * 1.7}%`; // Move bottom card up slightly
              }
            }
          } else {
            // For other cards, use standard positioning
            const adjustedMultiplier = isDesktop
              ? 1
              : isTablet
                ? 0.95
                : isMobile
                  ? 0.95
                  : 0.9;
            adjusted[key] = `${value * adjustedMultiplier}%`;
          }
        }
      }
    });

    if (typeof pos.transform === "string") {
      adjusted.transform = pos.transform;
    }

    return adjusted;
  };

  const renderTag = (
    tag: ProductsTechStackTag,
    index: number,
    sectionColor: string,
  ) => {
    const tagKey = `${sectionColor}-${index}-${tag.label}`;
    const isHovered = hoveredTagKey === tagKey;

    return (
      <div
        key={`tag-${index}`}
        className={`flex items-center justify-center px-3 py-1 ${tagFontSize} text-white cursor-pointer transition-all duration-300 hover:scale-105 whitespace-nowrap`}
        style={{
          backgroundColor: `${sectionColor}25`,
          border: `1px solid ${sectionColor}`,
          borderRadius: "16px",
          minHeight: isDesktop ? "32px" : isTablet ? "28px" : "24px",
          boxShadow: isHovered
            ? `0 4px 20px ${sectionColor}60, 0 2px 10px ${sectionColor}40`
            : "none",
        }}
        onMouseEnter={() => setHoveredTagKey(tagKey)}
        onMouseLeave={() => setHoveredTagKey(null)}
      >
        {tag.label}
      </div>
    );
  };

  const renderSection = (section: ProductsTechStackSection) => {
    const adjustedPos = adjustPosition(section.position, section.id);

    return (
      <div
        key={section.id}
        className="absolute flex flex-col items-center"
        style={{ ...adjustedPos, zIndex: 30 }}
      >
        <div
          className={`tech-stack-card relative ${cardPaddingClass} overflow-hidden`}
          style={
            {
              // expose variables for CSS-based hover effects
              "--section-color": section.color,
              "--card-scale": cardScale,
              background: "#1A1E28",
              border: `1px solid ${section.color}`,
              // Responsive width adjustments based on card position
              width: isDesktop
                ? "auto"
                : isTablet
                  ? section.id === "artificial-intelligence" ||
                    section.id === "data"
                    ? "400px"
                    : "200px"
                  : isMobile
                    ? section.id === "artificial-intelligence" ||
                      section.id === "data"
                      ? "400px"
                      : "200px"
                    : section.id === "artificial-intelligence" ||
                        section.id === "data"
                      ? "400px"
                      : "200px",
              maxWidth: isDesktop
                ? "none"
                : isTablet
                  ? section.id === "artificial-intelligence" ||
                    section.id === "data"
                    ? "400px"
                    : "200px"
                  : isMobile
                    ? section.id === "artificial-intelligence" ||
                      section.id === "data"
                      ? "400px"
                      : "200px"
                    : section.id === "artificial-intelligence" ||
                        section.id === "data"
                      ? "400px"
                      : "200px",
            } as CardStyleVariables
          }
        >
          <div className="flex items-center justify-center mb-4">
            {section.icon && (
              <img
                src={section.icon}
                alt={section.title}
                className="w-6 h-6 mr-3"
                style={{ filter: `drop-shadow(0 0 8px ${section.color})` }}
              />
            )}
            <h3 className={`${fontSize} font-bold tracking-wider text-white`}>
              {section.title}
            </h3>
          </div>

          <div className="flex flex-col items-center gap-3">
            {/* Desktop: Keep original 2-row layout */}
            {isDesktop ? (
              <>
                <div className="flex justify-center gap-3">
                  {section.tags
                    .slice(0, 4)
                    .map((tag, index) => renderTag(tag, index, section.color))}
                </div>

                {section.tags.length > 4 && (
                  <div className="flex justify-center gap-3">
                    {section.tags
                      .slice(4)
                      .map((tag, index) =>
                        renderTag(tag, index + 4, section.color),
                      )}
                  </div>
                )}
              </>
            ) : (
              /* Responsive layouts based on card position */
              <>
                {/* Top and Bottom cards: Use flex-wrap for wider layout */}
                {section.id === "artificial-intelligence" ||
                section.id === "data" ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    {section.tags.map((tag, index) =>
                      renderTag(tag, index, section.color),
                    )}
                  </div>
                ) : (
                  /* Left and Right cards: Single column layout on mobile */
                  <div
                    className={`flex ${
                      isMobile ? "flex-col" : "flex-wrap"
                    } justify-center gap-2`}
                  >
                    {section.tags.map((tag, index) =>
                      renderTag(tag, index, section.color),
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCentralLogo = () => {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative" style={{ zIndex: 50 }}>
          <div className="flex items-center justify-center w-full h-full">
            <img
              src="/assets/icons/home/diagram-main-card-icon.png"
              alt="Main Card Icon"
              style={{
                width: `${logoSize}px`,
                height: `${logoSize}px`,
                transform: `scale(${cardScale})`,
                transformOrigin: "center",
              }}
              className="block"
            />
            {/* For very small screens, we keep the mobile layout's header logo instead of this central one */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative px-4 py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.7) 100%)",
        }}
      >
        {/* Top fade gradient - blends from Hero */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-6"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
          }}
        />

        {/* Bottom fade gradient - blends into Layers */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-6"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
          }}
        />

        {renderAnimatedBackground()}
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className={PULSING_HEADER_CONTAINER_CLASS}>
            <SectionHeader
              title={title}
              subtitle={subtitle}
              highlightWord={highlightWord}
              titleClassName={PULSING_HEADING_CLASS}
              subtitleClassName={PULSING_SUBTITLE_CLASS}
              maxWidth="max-w-350"
            />
          </div>
          <div
            className="relative mx-auto mt-12 lg:mt-16"
            style={{
              height: containerHeight,
              maxWidth,
              transform: `scale(${containerScale})`,
              transformOrigin: "center top",
              paddingLeft: isDesktop
                ? "0"
                : isTablet
                  ? "30px"
                  : isMobile
                    ? "30px"
                    : "25px",
              paddingRight: isDesktop
                ? "0"
                : isTablet
                  ? "30px"
                  : isMobile
                    ? "30px"
                    : "25px",
            }}
          >
            <TechStackDiagram
              className="z-10"
              opacity={0.8}
              showCenterLogo={false}
            />
            {renderCentralLogo()}
            {Object.values(sections).map((section) => renderSection(section))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsTechStack;
