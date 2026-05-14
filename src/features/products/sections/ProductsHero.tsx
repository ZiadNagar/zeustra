import { useRef } from "react";
import CTAButtons from "@/components/shared/CTAButtons";

const ProductsHero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-start justify-start w-full overflow-visible bg-black"
    >
      {/* Wavy background */}
      <div
        className="absolute inset-0 z-0 w-screen h-full pointer-events-none "
        style={{
          backgroundImage: 'url("/assets/images/wavy-lines-background.svg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Bottom fade gradient - blends into TechStack */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-48 pointer-events-none md:h-64"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.95))",
        }}
      />
      <div className="relative z-20 flex items-center justify-center w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-20 mt-60">
        <div className="w-full max-w-350 mx-auto">
          <header className="mx-auto text-center">
            <h1 className="text-white/95 text-display-xl">
              <span>The Transaction Operating System</span>
            </h1>
            <p className="text-[clamp(16px,2vw,24px)] text-neutral-50 py-6 sm:py-8 mx-auto max-w-6xl leading-relaxed">
              A proprietary platform and marketplace that functions as the
              operating system for real estate transactions, proven to create
              substantially more value than the cost of our service.
            </p>
            <div className="flex flex-col items-center w-full gap-6 sm:gap-8 mt-6 sm:mt-8">
              <CTAButtons
                primaryText="Schedule Meeting"
                secondaryText="Talk To Us"
                alignment="center"
                showArrow={false}
                variant="large"
              />
              <p className="text-[clamp(12px,2vw,16px)] text-slate-300">
                The use of our platform is free when you transact with Zeustra.
              </p>
            </div>
          </header>
        </div>
      </div>
    </section>
  );
};

export default ProductsHero;
