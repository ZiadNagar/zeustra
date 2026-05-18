import { useState } from "react";
import ContactModal from "./ContactModal";
import { openScheduler } from "@/contexts/schedulerModalGlobals";

type CTAButtonsAlignment = "center" | "left";
type CTAButtonsVariant = "default" | "large";

type CTAButtonsProps = {
  primaryText?: string;
  secondaryText?: string;
  onSecondaryClick?: () => void;
  alignment?: CTAButtonsAlignment;
  className?: string;
  variant?: CTAButtonsVariant;
  showArrow?: boolean;
};

const CTAButtons = ({
  primaryText = "Schedule Meeting",
  secondaryText = "Learn More",
  onSecondaryClick = () => {},
  alignment = "center",
  className = "",
  variant = "default",
}: CTAButtonsProps) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleButtonClick = (text: string, originalOnClick?: () => void) => {
    const normalizedText = text?.toLowerCase().trim();
    if (normalizedText === "contact" || normalizedText === "talk to us") {
      setIsContactModalOpen(true);
    } else if (originalOnClick) {
      originalOnClick();
    }
  };
  const alignmentClasses = {
    center: "justify-center",
    left: "justify-start",
  } as const;

  const sizeClasses = {
    default: "h-[50px] px-6 sm:px-7",
    large: "h-full px-8 py-4",
  } as const;

  const buttonSize = sizeClasses[variant];

  const primaryBtnClass = `${buttonSize} rounded-full bg-gradient-to-b from-brand-blue-light to-brand-blue-vivid text-neutral-950 font-semibold text-base lg:text-[17px] leading-[1.032] tracking-[0.103%] hover:shadow-[0_0_25px_rgba(77,181,255,0.7)] transition-all duration-300 border-[1.25px] border-brand-blue-light`;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg px-10 sm:px-0 ${alignmentClasses[alignment]} ${className}`}
    >
      <button
        type="button"
        onClick={() => handleButtonClick(secondaryText, onSecondaryClick)}
        className={`w-full sm:flex-1 min-w-0 flex items-center justify-center whitespace-nowrap ${buttonSize} rounded-full bg-transparent text-neutral-50 font-semibold text-base lg:text-[17px] leading-[1.024] tracking-[0.102%] border border-transparent hover:text-brand-blue-deep hover:border-brand-blue-deep transition-all duration-300 backdrop-blur-sm shadow-button-inner order-2 sm:order-1`}
      >
        <span>{secondaryText}</span>
      </button>

      <button
        type="button"
        onClick={() => openScheduler()}
        className={`w-full sm:flex-1 min-w-0 flex items-center justify-center whitespace-nowrap ${primaryBtnClass} order-1 sm:order-2`}
      >
        <span>{primaryText}</span>
      </button>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default CTAButtons;
