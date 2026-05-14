type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  highlightWord?: string;
  highlightPosition?: string | number;
  highlightFromColor?: string;
  highlightToColor?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  containerClassName?: string;
  maxWidth?: string;
};

const SectionHeader = ({
  title,
  subtitle,
  highlightWord,
  highlightPosition = "before",
  highlightFromColor = "var(--color-brand-cyan)",
  highlightToColor = "var(--color-brand-blue-light)",
  titleClassName = "",
  subtitleClassName = "",
  containerClassName = "",
  maxWidth = "max-w-2xl",
}: SectionHeaderProps) => {
  // Split title to place highlight word
  const renderTitle = () => {
    if (!highlightWord) {
      return <span>{title}</span>;
    }

    const words = title.split(" ");
    const highlightIndex = words.findIndex((word) =>
      word.toLowerCase().includes(highlightWord.toLowerCase()),
    );

    if (highlightIndex === -1) {
      return <span>{title}</span>;
    }

    const beforeWords = words.slice(0, highlightIndex);
    const afterWords = words.slice(highlightIndex + 1);
    const highlightWordText = words[highlightIndex];

    if (!highlightWordText) {
      return <span>{title}</span>;
    }

    return (
      <>
        {beforeWords.length > 0 && <span>{beforeWords.join(" ")} </span>}
        <span
          className="font-bold text-transparent bg-linear-to-r bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, ${highlightFromColor}, ${highlightToColor})`,
            textShadow: "var(--shadow-heading-glow)",
          }}
        >
          {highlightWordText}
        </span>
        {afterWords.length > 0 && <span> {afterWords.join(" ")}</span>}
      </>
    );
  };

  const renderGradientOverlay = () => {
    if (!highlightWord) return null;

    return (
      <div className="relative mt-6">
        <h3
          className="text-5xl font-medium bg-linear-to-r bg-clip-text text-transparent leading-normal tracking-[-4.5%]"
          style={{
            backgroundImage: `linear-gradient(to right, ${highlightFromColor}, ${highlightToColor})`,
            textShadow: "var(--shadow-heading-glow)",
            filter: "blur(var(--blur-heading-soft))",
          }}
        >
          {highlightWord}
        </h3>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 sm:gap-6 text-center ${containerClassName}`}
    >
      <div
        className={`flex flex-col items-center justify-center gap-4 sm:gap-6 ${maxWidth} mx-auto`}
      >
        <h2
          className={`text-2xl sm:text-3xl lg:text-[48px] font-medium text-neutral-100 leading-tight lg:leading-18 tracking-tight lg:tracking-[-2.16px] ${titleClassName}`}
        >
          {renderTitle()}
        </h2>
        {subtitle && (
          <p
            className={`text-sm sm:text-lg lg:text-[24px] font-normal text-slate-300 px-4 ${subtitleClassName}`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {highlightPosition === "separate" && renderGradientOverlay()}
    </div>
  );
};

export default SectionHeader;
