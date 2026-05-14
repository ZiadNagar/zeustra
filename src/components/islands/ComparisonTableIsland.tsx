import { useState, type ReactElement } from "react";
import { cn } from "@/utils/cn";

// Types
interface ComparisonRow {
  feature: string;
  zeustra: string;
  traditional: string;
  thirdPartyMarketplace: string;
  thirdPartySaas: string;
  thirdParty?: string;
}

interface ColumnHeaders {
  dimension: string;
  zeustra: string;
  traditional: string;
  traditionalSubtext?: string;
  thirdPartyMarketplace: string;
  thirdPartyMarketplaceSubtext?: string;
  thirdPartySaas: string;
  thirdPartySaasSubtext?: string;
  thirdParty?: string;
  thirdPartySubtext?: string;
}

interface ComparisonTableProps {
  subtitle?: string;
  comparisonHeadingHighlight?: string;
  comparisonHeadingSuffix?: string;
  tableRows: ComparisonRow[];
  footerText?: string;
  columnHeaders?: ColumnHeaders;
  isHomePage?: boolean;
}

// Utility functions
const getCellText = (row: ComparisonRow, isHomePage: boolean): string => {
  if (isHomePage) {
    return row.thirdPartyMarketplace;
  }
  return row.thirdParty || row.thirdPartyMarketplace;
};

const getEmojiColor = (text: string): string => {
  if (text.includes("✅")) return "emerald";
  if (text.includes("❌")) return "red";
  if (text.includes("⚠")) return "orange";
  return "neutral";
};

const parseCellContent = (
  text: string,
): { icon: string | null; content: string } => {
  const icon = text.includes("✅")
    ? "check"
    : text.includes("❌")
      ? "cross"
      : text.includes("⚠")
        ? "alert"
        : null;
  const content = text.replace(/^[✅❌⚠]\s*/, "").trim();
  return { icon, content };
};

// Icon Components
const CheckIcon = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <svg
    className={cn(
      "w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 transition-all duration-300",
      isActive ? `text-${color}-400` : "grayscale saturate-0 opacity-50 text-neutral-500",
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const CrossIcon = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <svg
    className={cn(
      "w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 transition-all duration-300",
      isActive ? `text-${color}-500` : "grayscale saturate-0 opacity-50 text-neutral-500",
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const AlertIcon = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <svg
    className={cn(
      "w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 transition-all duration-300",
      isActive ? `text-${color}-400` : "grayscale saturate-0 opacity-50 text-neutral-500",
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

// ComparisonCell Component
const ComparisonCell = ({
  text,
  isActive,
}: {
  text: string;
  isActive: boolean;
}): ReactElement => {
  const color = getEmojiColor(text);
  const { icon, content } = parseCellContent(text);

  return (
    <div className="flex items-start justify-center gap-2.5 text-left w-full">
      {icon === "check" && <CheckIcon color={color} isActive={isActive} />}
      {icon === "cross" && <CrossIcon color={color} isActive={isActive} />}
      {icon === "alert" && <AlertIcon color={color} isActive={isActive} />}
      <span
        className={cn(
          "text-xs xl:text-sm font-semibold leading-relaxed transition-all duration-300",
          isActive
            ? `text-${color}-300`
            : "grayscale saturate-0 opacity-60 text-neutral-400",
        )}
      >
        {content}
      </span>
    </div>
  );
};

// Main Component
const ComparisonTableIsland = ({
  subtitle = "",
  comparisonHeadingHighlight = "Zeustra",
  comparisonHeadingSuffix = "vs. Traditional Platforms",
  tableRows,
  footerText = "Comprehensive feature comparison across all major real estate platform categories",
  columnHeaders = {
    dimension: "Feature",
    zeustra: "Zeustra",
    traditional: "Traditional Brokers",
    traditionalSubtext: "(CBRE, JLL, Cushman, M&M)",
    thirdPartyMarketplace: "3rd-Party Marketplaces",
    thirdPartyMarketplaceSubtext: "(LoopNet, Crexi)",
    thirdPartySaas: "Paid SaaS Platforms",
    thirdPartySaasSubtext: "(CoStar, Yardi)",
  },
  isHomePage = true,
}: ComparisonTableProps): ReactElement => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Column width classes
  const dimensionWidth = isHomePage ? "w-[200px]" : "w-[190px]";
  const zeustraWidth = isHomePage ? "w-[320px]" : "w-[325px]";
  const traditionalWidth = isHomePage ? "w-[280px]" : "w-[260px]";
  const thirdPartyWidth = isHomePage ? "w-[300px]" : "w-[260px]";

  return (
    <section className="bg-transparent py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="space-y-4 text-center">
          <div className="mx-auto max-w-6xl space-y-4">
            <h2 className="text-2xl leading-tight font-medium tracking-tight text-slate-50 sm:text-3xl lg:text-[48px] lg:leading-18 lg:tracking-[-2.16px]">
              <span
                className="bg-linear-to-r from-brand-cyan to-brand-blue-light bg-clip-text font-bold text-transparent"
                style={{
                  textShadow:
                    "0px 0px 30px rgba(0,238,255,0.8),0px 0px 60px rgba(77,181,255,0.6)",
                }}
              >
                {comparisonHeadingHighlight}
              </span>{" "}
              {comparisonHeadingSuffix}
            </h2>
            {subtitle && (
              <p className="px-4 text-sm font-normal text-slate-300 sm:text-lg lg:text-[24px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-[rgba(59,130,246,0.2)] bg-[rgba(15,23,42,0.8)] shadow-[0px_0px_50px_0px_rgba(5,5,39,0.5)] backdrop-blur-[10px]">
          {/* Table Header Card */}
          <div className="flex flex-col border-b border-[rgba(59,130,246,0.2)] p-4 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <h3 className="bg-linear-to-r from-brand-blue-deep to-brand-blue-light bg-clip-text text-center text-lg font-bold text-transparent sm:text-left md:text-2xl">
              Platform Comparison Matrix
            </h3>
            <div className="mt-3 flex items-center justify-center space-x-2 sm:mt-0 sm:justify-start">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-neutral-400 md:text-sm">
                Live Analysis
              </span>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto p-4 md:p-6">
            <table className="w-full min-w-60 border-collapse">
              <thead>
                <tr className="border-b border-[rgba(96,165,250,0.5)]">
                  {/* Dimension Column */}
                  <th
                    className={cn(
                      "shrink-0 bg-linear-to-r from-[rgba(30,41,59,0.5)] to-[rgba(51,65,85,0.5)] p-4 text-left text-sm font-bold text-blue-200 xl:p-6 xl:text-base",
                      dimensionWidth,
                    )}
                  >
                    {columnHeaders.dimension}
                  </th>

                  {/* Zeustra Column */}
                  <th
                    className={cn(
                      "relative shrink-0 bg-linear-to-r from-[rgba(6,78,59,0.3)] to-[rgba(20,83,45,0.3)] p-4 text-center xl:p-6",
                      zeustraWidth,
                    )}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-[rgba(16,185,129,0.1)] to-[rgba(34,197,94,0.1)]" />
                    <div className="relative z-10 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-200 xl:text-base">
                        {columnHeaders.zeustra}
                      </span>
                    </div>
                  </th>

                  {/* Traditional Brokers Column */}
                  <th
                    className={cn(
                      "shrink-0 bg-linear-to-r from-[rgba(30,41,59,0.3)] to-[rgba(51,65,85,0.3)] p-4 text-center xl:p-6",
                      traditionalWidth,
                    )}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-blue-200 xl:text-base">
                        {columnHeaders.traditional}
                      </span>
                      {columnHeaders.traditionalSubtext && (
                        <p className="mt-1 text-xs text-blue-200/75">
                          {columnHeaders.traditionalSubtext}
                        </p>
                      )}
                    </div>
                  </th>

                  {/* Conditional Third Party Columns */}
                  {isHomePage ? (
                    <>
                      {/* Third Party Marketplace */}
                      <th
                        className={cn(
                          "shrink-0 bg-linear-to-r from-[rgba(30,41,59,0.3)] to-[rgba(51,65,85,0.3)] p-4 text-center xl:p-6",
                          thirdPartyWidth,
                        )}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-sm font-bold text-blue-200 xl:text-base">
                            {columnHeaders.thirdPartyMarketplace}
                          </span>
                          {columnHeaders.thirdPartyMarketplaceSubtext && (
                            <p className="mt-1 text-xs text-blue-200/75">
                              {columnHeaders.thirdPartyMarketplaceSubtext}
                            </p>
                          )}
                        </div>
                      </th>

                      {/* Third Party SaaS */}
                      <th
                        className={cn(
                          "shrink-0 bg-linear-to-r from-[rgba(30,41,59,0.3)] to-[rgba(51,65,85,0.3)] p-4 text-center xl:p-6",
                          thirdPartyWidth,
                        )}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-sm font-bold text-blue-200 xl:text-base">
                            {columnHeaders.thirdPartySaas}
                          </span>
                          {columnHeaders.thirdPartySaasSubtext && (
                            <p className="mt-1 text-xs text-blue-200/75">
                              {columnHeaders.thirdPartySaasSubtext}
                            </p>
                          )}
                        </div>
                      </th>
                    </>
                  ) : (
                    <th
                      className={cn(
                        "shrink-0 bg-linear-to-r from-[rgba(30,41,59,0.3)] to-[rgba(51,65,85,0.3)] p-4 text-center xl:p-6 rounded-tr-lg",
                        thirdPartyWidth,
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-blue-200 xl:text-base">
                          {columnHeaders.thirdParty ||
                            "3rd‑Party Marketplaces/SaaS"}
                        </span>
                        {columnHeaders.thirdPartySubtext && (
                          <p className="mt-1 text-xs text-blue-200/75">
                            {columnHeaders.thirdPartySubtext}
                          </p>
                        )}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {tableRows.map((row, index) => {
                  // Default: only first row (index 0) is active
                  // On hover: only hovered row is active
                  const isActive = hoveredRow === null ? index === 0 : hoveredRow === index;

                  return (
                    <tr
                      key={index}
                      className={cn(
                        "group border-b border-white/5 transition-all duration-300",
                        isActive ? "bg-transparent" : "bg-slate-900/20",
                      )}
                      onMouseEnter={() => setHoveredRow(index)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Dimension Cell */}
                      <td
                        className={cn(
                          "relative shrink-0 bg-linear-to-r from-[rgba(30,41,59,0.2)] to-[rgba(51,65,85,0.2)] p-4 xl:p-6",
                          dimensionWidth,
                        )}
                      >
                        <h5 className={cn(
                          "text-sm font-bold xl:text-base transition-all duration-300",
                          isActive ? "text-slate-50" : "grayscale saturate-0 opacity-60 text-neutral-400"
                        )}>
                          {row.feature}
                        </h5>
                      </td>

                      {/* Zeustra Cell */}
                      <td
                        className={cn(
                          "relative shrink-0 bg-linear-to-r from-[rgba(6,78,59,0.1)] to-[rgba(20,83,45,0.1)] p-4 xl:p-6",
                          zeustraWidth,
                        )}
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-[rgba(16,185,129,0.05)] to-[rgba(34,197,94,0.05)]" />
                        <div className="relative z-10">
                          <ComparisonCell
                            text={row.zeustra}
                            isActive={isActive}
                          />
                        </div>
                      </td>

                      {/* Traditional Cell */}
                      <td
                        className={cn(
                          "relative shrink-0 bg-transparent p-4 xl:p-6",
                          traditionalWidth,
                        )}
                      >
                        <ComparisonCell
                          text={row.traditional}
                          isActive={isActive}
                        />
                      </td>

                      {/* Conditional Third Party Cells */}
                      {isHomePage ? (
                        <>
                          <td
                            className={cn(
                              "relative shrink-0 bg-transparent p-4 xl:p-6",
                              thirdPartyWidth,
                            )}
                          >
                            <ComparisonCell
                              text={row.thirdPartyMarketplace}
                              isActive={isActive}
                            />
                          </td>
                          <td
                            className={cn(
                              "relative shrink-0 bg-transparent p-4 xl:p-6",
                              thirdPartyWidth,
                            )}
                          >
                            <ComparisonCell
                              text={row.thirdPartySaas}
                              isActive={isActive}
                            />
                          </td>
                        </>
                      ) : (
                        <td
                          className={cn(
                            "relative shrink-0 bg-transparent p-4 xl:p-6",
                            thirdPartyWidth,
                          )}
                        >
                          <ComparisonCell
                            text={getCellText(row, isHomePage)}
                            isActive={isActive}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {footerText && (
            <div className="border-t border-[rgba(59,130,246,0.2)] p-4 text-center md:p-6 lg:p-8">
              <p className="text-xs text-neutral-400 md:text-sm">
                {footerText}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTableIsland;
