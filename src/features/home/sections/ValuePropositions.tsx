import { useState } from "react";
import { VALUE_PROPOSITIONS_DATA, SECTION_HEADERS } from "../data/homePageData";

const ValuePropositions = () => {
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  return (
    <section className="py-16 bg-transparent md:py-24 lg:py-32">
      <div className="max-w-6xl px-4 mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-medium text-neutral-100 leading-tight lg:leading-18 tracking-tight lg:tracking-[-2.16px] mb-4 sm:mb-6">
            Why We&apos;re{" "}
            <span
              className="font-bold text-transparent bg-linear-to-r from-brand-cyan to-brand-blue-light bg-clip-text"
              style={{
                textShadow: "var(--shadow-heading-glow)",
              }}
            >
              {SECTION_HEADERS.valuePropositions.highlightWord}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-[24px] font-normal text-slate-300 leading-relaxed max-w-3xl">
            {SECTION_HEADERS.valuePropositions.subtitle}
          </p>
        </div>

        {/* Content spacing - Responsive spacing from subtitle to main content */}
        <div className="mt-8 sm:mt-12 lg:mt-14"></div>

        {/* Value Propositions Grid */}
        <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-2 md:gap-8 lg:gap-10">
          {VALUE_PROPOSITIONS_DATA.map((prop) => (
            <div
              key={prop.id}
              className="group relative transition-all duration-300 ease-in-out hover:backdrop-blur-[3.5px] w-full p-4 sm:p-6 md:p-7.25"
              style={{
                borderRadius: "16px",
                border: `1px solid ${
                  hoveredCardId === prop.id ?
                    prop.hoverColor
                  : "rgba(255, 255, 255, 0.10)"
                }`,
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0.25) 100%)",
                boxShadow:
                  hoveredCardId === prop.id ?
                    `0px 0px 50px 0px ${prop.hoverColor}80`
                  : "none",
              }}
              onMouseEnter={() => setHoveredCardId(prop.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <div className="flex flex-col h-full">
                {/* Icon Container */}
                <div className="flex items-start mb-4 sm:mb-6">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                    {/* Background with border */}
                    <div
                      className="absolute inset-0 border border-[rgba(255,255,255,0.2)] rounded-[10px] sm:rounded-xl"
                      aria-hidden="true"
                    />
                    {/* Icon */}
                    <div className="absolute left-1/2 top-1/2 w-5 h-5 sm:w-[22.5px] sm:h-[22.5px] -translate-x-1/2 -translate-y-1/2">
                      <img
                        src={prop.iconPath}
                        alt=""
                        className="block w-full h-full max-w-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-bold text-slate-100 leading-[1.4]">
                    {prop.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <p className="text-sm sm:text-[15px] text-slate-300 leading-normal sm:leading-[1.55]">
                    {prop.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositions;
