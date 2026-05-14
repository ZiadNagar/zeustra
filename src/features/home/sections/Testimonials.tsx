import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
  type TouchEvent,
} from "react";
import { TESTIMONIALS_DATA, SECTION_HEADERS } from "../data/homePageData";
import BlueParticles from "@/components/effects/BlueParticles";
import useReducedEffects from "@/hooks/useReducedEffects";
import useInViewport from "@/hooks/useInViewport";

type ArrowState = "idle" | "hover" | "active";
type ArrowPosition = "left" | "right";

type TestimonialItem = Omit<(typeof TESTIMONIALS_DATA)[number], "id"> & {
  id: number | string;
};

type TestimonialsProps = {
  testimonials?: readonly TestimonialItem[];
};

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedEffects = useReducedEffects();
  const isInViewport = useInViewport(sectionRef, { threshold: 0.1 });
  const resolvedTestimonials: readonly TestimonialItem[] =
    testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS_DATA;

  // Create extended array for infinite
  const extendedTestimonials = [
    ...resolvedTestimonials.slice(-1),
    ...resolvedTestimonials,
    ...resolvedTestimonials.slice(0, 1),
  ];

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [slideChangeCounter, setSlideChangeCounter] = useState(0);
  const [leftArrowState, setLeftArrowState] = useState<ArrowState>("idle");
  const [rightArrowState, setRightArrowState] = useState<ArrowState>("idle");

  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideChangeCounter((prev) => prev + 1); // Trigger particle movement

    setCurrentSlide((prev) => prev + 1);

    setTimeout(() => {
      setIsTransitioning(false);
      // If we're at the duplicate first slide at the end, jump to real first slide
      setCurrentSlide((prev) => {
        if (prev === extendedTestimonials.length - 1) {
          setTimeout(() => setCurrentSlide(1), 0);
          return prev;
        }
        return prev;
      });
    }, 700);
  }, [isTransitioning, extendedTestimonials.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideChangeCounter((prev) => prev + 1); // Trigger particle movement

    setCurrentSlide((prev) => prev - 1);

    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentSlide((prev) => {
        if (prev === 0) {
          setTimeout(() => setCurrentSlide(extendedTestimonials.length - 2), 0);
          return prev;
        }
        return prev;
      });
    }, 700);
  }, [isTransitioning, extendedTestimonials.length]);

  // Auto-slide functionality with pause on hover
  useEffect(() => {
    if (isPaused || !isInViewport) return;

    const interval = setInterval(() => {
      setSlideChangeCounter((prev) => prev + 1); // Trigger particle movement
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide, isPaused, isInViewport]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index + 1); // Add 1 because first real slide is at index 1
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning],
  );

  // Get the current real slide index for indicators
  const getRealSlideIndex = (): number => {
    if (currentSlide === 0) return resolvedTestimonials.length - 1; // Duplicate last slide
    if (currentSlide === extendedTestimonials.length - 1) return 0; // Duplicate first slide
    return currentSlide - 1; // Real slides (subtract 1 because we start at index 1)
  };

  // Touch event handlers for swipe functionality
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide(); // Swipe left = next slide
    } else if (isRightSwipe) {
      prevSlide(); // Swipe right = previous slide
    }
  };

  const getArrowStyle = (
    position: ArrowPosition,
    state: ArrowState,
  ): CSSProperties => {
    const baseBorder = "1.563px solid rgba(255, 255, 255, 0.12)";
    const hoverBorder = "1.563px solid #4DB5FF";
    const activeBorder = "1.563px solid #00EEFF";

    const border =
      state === "active" ? activeBorder
      : state === "hover" ? hoverBorder
      : baseBorder;

    const boxShadow =
      state === "active" ?
        "0px 0px 15px 0px #00EEFF, inset 0px 0px 25px 0px #00EEFF"
      : state === "hover" ?
        "0px 0px 10px 0px #4DB5FF, inset 0px 0px 20px 0px #4DB5FF"
      : "none";

    const style: CSSProperties = {
      width: "65.625px",
      height: "65.625px",
      borderRadius: "18.75px",
      border,
      opacity: "0.75",
      background: "rgba(255, 255, 255, 0.02)",
      backdropFilter: reducedEffects ? "blur(2px)" : "blur(3.125px)",
      boxShadow,
    };

    if (position === "left") {
      style.left = "10vw";
    } else {
      style.right = "10vw";
    }

    return style;
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 overflow-hidden bg-transparent md:py-24 lg:py-32"
    >
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 100% 60% at 50% 50%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 80%),
              radial-gradient(ellipse 80% 50% at 30% 80%, rgba(15, 15, 15, 0.3) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 90%),
              radial-gradient(ellipse 90% 40% at 70% 20%, rgba(20, 20, 20, 0.25) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 85%),
              linear-gradient(135deg, rgba(0, 0, 0, 0.15) 0%, rgba(10, 10, 15, 0.25) 30%, rgba(0, 0, 0, 0.2) 70%, rgba(5, 5, 10, 0.1) 100%),
              linear-gradient(45deg, rgba(77, 181, 255, 0.03) 0%, rgba(0, 238, 255, 0.02) 50%, rgba(77, 181, 255, 0.01) 100%)
            `,
            backdropFilter:
              reducedEffects ?
                "blur(24px) saturate(1.05)"
              : "blur(48px) saturate(1.15)",
            border: "none",
            margin: "0",
            boxShadow: `
              inset 0 1px 0 rgba(255, 255, 255, 0.02),
              0 4px 30px rgba(0, 0, 0, 0.3),
              0 8px 60px rgba(0, 0, 0, 0.2)
            `,
          }}
        />

        {/* Additional dark glassmorphism layer for enhanced depth */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(10, 10, 15, 0.08) 0%, transparent 45%),
              radial-gradient(circle at 50% 80%, rgba(0, 0, 0, 0.12) 0%, transparent 40%),
              linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0%, rgba(5, 5, 10, 0.08) 50%, rgba(0, 0, 0, 0.05) 100%)
            `,
            backdropFilter: reducedEffects ? "blur(10px)" : "blur(14px)",
            margin: "0",
            opacity: 0.8,
          }}
        />

        {/* Subtle blue accent overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 40% 60%, rgba(77, 181, 255, 0.02) 0%, transparent 50%),
              radial-gradient(ellipse 50% 30% at 60% 40%, rgba(0, 238, 255, 0.015) 0%, transparent 50%)
            `,
            margin: "0",
            opacity: 1,
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 10 }}>
        <div className="px-4 mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-6xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-medium text-neutral-100 leading-tight lg:leading-18 tracking-tight lg:tracking-[-2.16px]">
                What Our{" "}
                <span
                  className="font-bold text-transparent bg-linear-to-r from-brand-cyan to-brand-blue-light bg-clip-text"
                  style={{
                    textShadow: "var(--shadow-heading-glow)",
                  }}
                >
                  {SECTION_HEADERS.testimonials.highlightWord}
                </span>{" "}
                Say
              </h2>
              <p className="text-sm sm:text-lg lg:text-[24px] font-normal text-slate-300 px-4">
                {SECTION_HEADERS.testimonials.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full mt-12 sm:mt-14">
          {/* Blue Particles Background Effect - Constrained to slider area */}
          <BlueParticles
            slideChange={slideChangeCounter}
            constrainHeight={true}
            topOffset="0px"
            bottomOffset="0px"
            reducedEffects={reducedEffects}
            isActive={isInViewport}
          />

          <div
            className="relative py-0 overflow-hidden lg:py-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Mobile Layout - Vertical Stack */}
            <div
              className="block xl:hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="max-w-md px-4 mx-auto md:max-w-lg lg:max-w-xl">
                {/* Show only current testimonial on mobile */}
                {resolvedTestimonials.map((testimonial, index) => {
                  const realSlideIndex = getRealSlideIndex();
                  if (index !== realSlideIndex) return null;

                  return (
                    <div
                      key={testimonial.id}
                      className="flex flex-col items-center space-y-6"
                    >
                      {/* Mobile Image - Top */}
                      <div className="relative w-full max-w-75 md:max-w-100 lg:max-w-125 h-50 md:h-62.5 lg:h-75 rounded-2xl overflow-hidden shadow-2xl">
                        <img
                          src={testimonial.image}
                          alt={`${testimonial.author} testimonial`}
                          className="object-cover w-full h-full"
                        />
                        {/* Category Badge */}
                        <div className="absolute flex items-center px-3 py-2 space-x-2 rounded-full bottom-3 left-3 bg-black/30 backdrop-blur-[50px]">
                          <div className="w-2 h-2 rounded-full bg-teal" />
                          <span className="text-xs font-medium text-white">
                            {testimonial.category}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Text Content - Bottom */}
                      <div className="flex flex-col justify-center px-2 space-y-4 text-center min-h-50 md:min-h-55 lg:min-h-60">
                        <blockquote className="text-lg md:text-xl lg:text-2xl text-white leading-[1.4] font-light px-4 min-h-30 md:min-h-35 lg:min-h-40 flex items-center justify-center">
                          &quot;{testimonial.quote}&quot;
                        </blockquote>
                        <div className="space-y-1">
                          <div className="text-base font-medium text-white md:text-lg lg:text-xl">
                            {testimonial.author}
                          </div>
                          <div className="text-sm md:text-base lg:text-lg text-slate-300">
                            {testimonial.position}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Layout - Horizontal Sliding Container */}
            <div className="hidden xl:block">
              <div className="relative w-full h-150">
                <div
                  className={`flex h-full ${
                    isTransitioning ?
                      "transition-transform duration-700 ease-in-out"
                    : ""
                  }`}
                  style={{
                    transform: `translateX(calc(-${
                      currentSlide * 70
                    }vw + 15vw))`,
                    width: `${extendedTestimonials.length * 70}vw`,
                  }}
                >
                  {extendedTestimonials.map((testimonial, index) => {
                    // Determine if this slide is the current active slide
                    const isActiveSlide = index === currentSlide;
                    const slideKey =
                      index === 0 ? `clone-leading-${testimonial.id}`
                      : index === extendedTestimonials.length - 1 ?
                        `clone-trailing-${testimonial.id}`
                      : `slide-${testimonial.id}`;

                    return (
                      <div
                        key={slideKey}
                        className={`shrink-0 w-[70vw] h-full flex items-center justify-center relative transition-opacity duration-700 ${
                          isActiveSlide ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {/* Testimonial Content Sections */}
                        <div className="flex items-center w-full h-full">
                          {/* Left Section - Client Image (will be partially visible from previous card) */}
                          <div className="flex items-center justify-end w-full h-full pr-2">
                            <div className="relative w-full max-w-137.5 h-87.5 lg:h-100 rounded-2xl overflow-hidden shadow-2xl">
                              <img
                                src={testimonial.image}
                                alt={`${testimonial.author} testimonial`}
                                className="object-fill w-full h-full"
                              />
                              {/* Category Badge */}
                              <div className="absolute flex items-center px-3 py-2 space-x-2 rounded-full bottom-4 left-4 bg-black/30 backdrop-blur-[50px]">
                                <div className="w-2 h-2 rounded-full bg-teal" />
                                <span className="text-sm font-medium text-white">
                                  {testimonial.category}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Testimonial Text (will be partially visible in next card) */}
                          <div className="flex items-center justify-start w-full h-full pl-6">
                            <div className="max-w-xl space-y-6 text-left">
                              <blockquote className="text-xl lg:text-[24px] xl:text-[26px] text-white leading-[1.4] font-light">
                                &quot;{testimonial.quote}&quot;
                              </blockquote>
                              <div className="space-y-2">
                                <div className="text-lg lg:text-[20px] xl:text-[20px] font-medium text-white">
                                  {testimonial.author}
                                </div>
                                <div className="text-sm text-slate-300 lg:text-base xl:text-lg">
                                  {testimonial.position}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 lg:mt-auto">
              <div className="flex flex-col items-center">
                {/* Dots Indicators */}
                <div className="relative flex items-center px-2 py-3 bg-transparent border rounded-full shadow-2xl backdrop-blur-sm border-gray-400/20">
                  {/* Inner glass highlight */}
                  <div className="absolute bg-transparent rounded-full pointer-events-none inset-px" />

                  {resolvedTestimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      onClick={() => goToSlide(index)}
                      className={`mx-2 w-3 h-3 rounded-full transition-all duration-300 border shadow-2xl backdrop-blur-sm border-gray-400/20 ${
                        index === getRealSlideIndex() ?
                          "bg-brand-blue-light shadow-[0_0_12px_rgba(77,181,255,0.8)]"
                        : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Large Desktop Only */}
          <button
            onClick={prevSlide}
            className="absolute z-30 items-center justify-center hidden text-white transition-all duration-200 -translate-y-1/2 xl:flex top-1/2 hover:text-brand-blue-light active:text-brand-cyan"
            style={getArrowStyle("left", leftArrowState)}
            onMouseEnter={() => setLeftArrowState("hover")}
            onMouseLeave={() => setLeftArrowState("idle")}
            onMouseDown={() => setLeftArrowState("active")}
            onMouseUp={() => setLeftArrowState("hover")}
          >
            <svg
              className="w-5 h-5 transition-colors duration-200 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute z-30 items-center justify-center hidden text-white transition-all duration-200 -translate-y-1/2 xl:flex top-1/2 hover:text-brand-blue-light active:text-brand-cyan"
            style={getArrowStyle("right", rightArrowState)}
            onMouseEnter={() => setRightArrowState("hover")}
            onMouseLeave={() => setRightArrowState("idle")}
            onMouseDown={() => setRightArrowState("active")}
            onMouseUp={() => setRightArrowState("hover")}
          >
            <svg
              className="w-5 h-5 transition-colors duration-200 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
