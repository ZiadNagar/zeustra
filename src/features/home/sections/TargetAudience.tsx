import { useState } from "react";
import { TARGET_AUDIENCES, SECTION_HEADERS } from "../data/homePageData";

const TargetAudience = () => {
  const [hoveredAudienceId, setHoveredAudienceId] = useState<string | null>(
    null,
  );

  return (
    <section className="py-16 bg-transparent md:py-24 lg:py-32">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
          <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-[48px] font-medium text-neutral-100 leading-tight lg:leading-18 tracking-tight lg:tracking-[-2.16px]">
              <span
                className="font-bold text-transparent bg-linear-to-r from-brand-cyan to-brand-blue-light bg-clip-text"
                style={{
                  textShadow: "var(--shadow-heading-glow)",
                }}
              >
                {SECTION_HEADERS.targetAudience.highlightWord}
              </span>{" "}
              We Serve
            </h2>
            <p className="text-sm sm:text-lg lg:text-[24px] font-normal text-slate-300 px-4">
              {SECTION_HEADERS.targetAudience.subtitle}
            </p>
          </div>
        </div>

        {/* Target Audience Cards */}
        <div className="grid w-full grid-cols-1 gap-4 mx-auto mt-12 sm:mt-14 md:grid-cols-4 md:gap-6 lg:gap-6">
          {TARGET_AUDIENCES.map((audience, index) => {
            const colorSchemes = [
              {
                hoverColor: "#4DB5FF",
                badgeColorClass: "bg-brand-blue",
                borderColorClass: "border-brand-blue-light",
              },
              {
                hoverColor: "#70EDAE",
                badgeColorClass: "bg-mint",
                borderColorClass: "border-mint",
              },
              {
                hoverColor: "#DF8DFB",
                badgeColorClass: "bg-purple-magenta",
                borderColorClass: "border-purple-magenta",
              },
              {
                hoverColor: "#00AD8B",
                badgeColorClass: "bg-emerald",
                borderColorClass: "border-emerald",
              },
            ];

            const colors = colorSchemes[index] ?? colorSchemes[0];

            return (
              <div
                key={audience.id}
                className="group transition-all duration-300 ease-in-out hover:backdrop-blur-[3.5px] w-full p-6 sm:p-6 md:p-6 lg:p-8 mb-6"
                style={{
                  borderRadius: "16px",
                  border: `1px solid ${
                    hoveredAudienceId === audience.id ?
                      colors.hoverColor
                    : "rgba(255, 255, 255, 0.12)"
                  }`,
                  background:
                    "radial-gradient(120% 120% at 20% 0%, #0F141B 0%, #0D1218 100%)",
                  boxShadow:
                    hoveredAudienceId === audience.id ?
                      `0px 0px 50px 0px ${colors.hoverColor}80`
                    : "none",
                }}
                onMouseEnter={() => setHoveredAudienceId(audience.id)}
                onMouseLeave={() => setHoveredAudienceId(null)}
              >
                {/* Badge */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full border ${colors.borderColorClass} w-fit`}
                  >
                    <div
                      className={`w-2 h-2 ${colors.badgeColorClass} rounded-full mr-3 shadow-inner`}
                    />
                    <span className="text-sm font-semibold text-white">
                      {audience.title}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-100 leading-[1.4]">
                    {audience.subtitle}
                  </h3>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-slate-300 leading-[1.55]">
                    {audience.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
