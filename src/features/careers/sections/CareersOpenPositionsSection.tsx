import type { ReactElement } from "react";
import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { StrapiPositionRecord } from "@/lib/strapi/types";
import PositionApplyForm from "@/features/careers/components/PositionApplyForm";
import Modal from "@/components/shared/Modal";

type CareersOpenPositionsSectionProps = {
  positions: StrapiPositionRecord[];
  applicationEndpoint: string;
};

const normalizeHeadingKey = (heading: string): string =>
  heading.trim().toLowerCase().replace(/\s+/g, "-");

const formatDeadline = (deadline: string | null): string => {
  if (!deadline) {
    return "No deadline";
  }

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const CareersOpenPositionsSection = ({
  positions,
  applicationEndpoint,
}: CareersOpenPositionsSectionProps): ReactElement => {
  const [expandedPositionSlug, setExpandedPositionSlug] = useState<string>(
    positions[0]?.slug ?? "",
  );
  const [activeApplicationPosition, setActiveApplicationPosition] =
    useState<StrapiPositionRecord | null>(null);

  if (positions.length === 0) {
    return (
      <section className="px-4 pb-24 sm:px-6 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-card-lg border border-border-glass bg-gradient-card p-8 text-center backdrop-blur-card sm:p-12">
            <h2 className="text-heading-2 text-white">
              No open positions currently
            </h2>
            <p className="mt-4 text-body-lg text-slate-300">
              We are not actively hiring right now. Please check back soon for
              future opportunities.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 pb-16 sm:px-6 md:px-8 md:pb-24">
      <div className="container mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-display-lg text-white">
            Open
            <span className="bg-gradient-text bg-clip-text text-transparent">
              {" "}
              Positions
            </span>
          </h1>
          <p className="mt-4 text-body-lg text-slate-300">
            Join Zeustra and help transform commercial real estate transactions
            with product-led execution and AI-powered intelligence.
          </p>
        </header>

        <Accordion.Root
          type="single"
          collapsible
          value={expandedPositionSlug}
          onValueChange={setExpandedPositionSlug}
          className="mt-10 space-y-4 lg:mt-14"
        >
          {positions.map((position) => (
            <Accordion.Item
              key={position.id}
              value={position.slug}
              className="overflow-hidden rounded-[24px] border border-[#1A2333] bg-[#0A101A]/95 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 data-[state=open]:border-[#2C3D57] data-[state=open]:shadow-[0_16px_38px_rgba(0,0,0,0.45)]"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-start justify-between gap-4 border-b border-[#151E2B] p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-light/60 sm:p-6">
                  <div className="min-w-0">
                    <h2 className="text-[32px] font-bold leading-tight text-[#E7EBEF] sm:text-[42px]">
                      {position.title}
                    </h2>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[#8A96A8]">
                      {position.subtitle}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#2A384E] bg-[#131D2B] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#9FB1C9]">
                        {position.jobType}
                      </span>
                      <span className="rounded-full border border-[#2A384E] bg-[#131D2B] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#9FB1C9]">
                        {position.employmentType}
                      </span>
                      <span className="rounded-full border border-[#2A384E] bg-[#131D2B] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#9FB1C9]">
                        {position.department}
                      </span>
                    </div>
                    {position.deadline ?
                      <p className="mt-2 text-body-xs text-[#73829A]">
                        Deadline: {formatDeadline(position.deadline)}
                      </p>
                    : null}
                  </div>
                  <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#263449] bg-[#0D1623] text-[#8AA6C8] transition-colors duration-300 group-data-[state=open]:border-[#3B78C7] group-data-[state=open]:text-[#4DB5FF]">
                    <ChevronDown
                      aria-hidden="true"
                      className="h-4.5 w-4.5 transition-transform duration-300 group-data-[state=open]:rotate-180"
                    />
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content className="px-5 pb-7 pt-6 sm:px-7">
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2EB6FF]">
                    Role Overview
                  </p>
                  {position.overview.length > 0 ?
                    <div className="space-y-3">
                      {position.overview.map((line) => (
                        <p
                          key={line}
                          className="text-[15px] leading-[1.65] text-[#A3AFBF] sm:text-[17px]"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  : <p className="text-body-base text-[#A3AFBF]">
                      {position.subtitle}
                    </p>
                  }
                </div>

                {position.sections.length > 0 ?
                  <div className="mt-8 grid gap-x-8 gap-y-7 lg:grid-cols-2">
                    {position.sections.map((section) => (
                      <section key={section.heading}>
                        <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#2EB6FF]">
                          {section.heading}
                        </h3>
                        <ul className="mt-3 space-y-2.5 text-[15px] leading-[1.6] text-[#A5B2C4] sm:text-base">
                          {section.items.map((item) => (
                            <li
                              key={`${normalizeHeadingKey(section.heading)}-${item}`}
                              className="flex gap-3"
                            >
                              <span className="mt-[0.56em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#11A8FF]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                : null}

                <section className="mt-8 rounded-2xl border border-[#1F2B3D] bg-[#121A28] p-4 sm:p-5">
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#2EB6FF]">
                    Compensation
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-[#A5B2C4]">
                    {position.compensation}
                  </p>
                </section>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveApplicationPosition(position)}
                    aria-label={`Apply now for ${position.title}`}
                    className="inline-flex h-13 min-w-37 items-center justify-center rounded-[14px] border border-[#4DB5FF]/70 bg-linear-to-b from-[#4DB5FF] to-[#3E6AF8] px-8 text-base font-semibold text-[#041220] shadow-[0_0_24px_rgba(62,106,248,0.45)] transition-all duration-300 hover:shadow-[0_0_34px_rgba(77,181,255,0.8)]"
                  >
                    Apply Now
                  </button>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>

      <Modal
        isOpen={activeApplicationPosition !== null}
        onClose={() => setActiveApplicationPosition(null)}
      >
        {activeApplicationPosition ?
          <PositionApplyForm
            applicationEndpoint={applicationEndpoint}
            positionId={activeApplicationPosition.id ?? ""}
            positionTitle={activeApplicationPosition.title}
            onSuccess={() => setActiveApplicationPosition(null)}
          />
        : null}
      </Modal>
    </section>
  );
};

export default CareersOpenPositionsSection;
