import { useRef } from "react";
import CTAButtons from "@/components/shared/CTAButtons";

const ServicesHero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-start justify-start w-full overflow-hidden"
    >
      <div className="relative z-20 px-4 py-20 mx-auto max-w-360 sm:px-6 lg:px-8 mt-36 sm:mt-48 lg:mt-60">
        <header className="mx-auto text-center">
          <h1 className="text-white text-display-xl">
            <span>Value Reimagined</span>
          </h1>
          <p className="text-[clamp(16px,2vw,24px)] text-slate-300 py-6">
            Execution services that drive competition, shape outcomes, and
            maximize value across all transactions.
          </p>
          <div className="flex flex-col items-center w-full gap-4 mt-8 sm:mt-10">
            <CTAButtons
              primaryText="Schedule Meeting"
              secondaryText="Talk To Us"
              alignment="center"
              showArrow={true}
              variant="large"
            />
            <p className="text-[clamp(12px,2vw,16px)] text-slate-300">
              Zero‑Cost SaaS: software is free when you transact with Zeustra.
            </p>
          </div>
        </header>
      </div>
    </section>
  );
};

export default ServicesHero;
