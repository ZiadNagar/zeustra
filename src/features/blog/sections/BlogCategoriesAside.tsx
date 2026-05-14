import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import type { BlogCategoryOption } from "@/features/blog/types";

type BlogCategoriesAsideProps = {
  categories: BlogCategoryOption[];
  activeCategory: string;
  onSelectCategory: (categoryValue: string) => void;
  variant?: "sidebar" | "dropdown";
  className?: string;
};

export default function BlogCategoriesAside({
  categories,
  activeCategory,
  onSelectCategory,
  variant = "sidebar",
  className,
}: BlogCategoriesAsideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const activeCategoryLabel =
    categories.find((category) => category.value === activeCategory)?.label ??
    "All Posts";

  useEffect(() => {
    if (variant !== "dropdown" || !isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, variant]);

  if (variant === "dropdown") {
    return (
      <div ref={dropdownRef} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="blog-categories-dropdown"
          className={cn(
            "flex h-10 items-center justify-between gap-3 rounded-lg border border-[rgba(255,255,255,0.1)] bg-linear-to-b from-[rgba(255,255,255,0.03)] to-[rgba(0,0,0,0.25)] px-4 text-[14px] font-medium text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4db5ff] backdrop-blur-[4px]",
            isOpen ?
              "border-[#4db5ff] text-[#4db5ff]"
            : "hover:border-[#4db5ff] hover:text-[#4db5ff]",
          )}
        >
          <span className="max-w-40 truncate">{activeCategoryLabel}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" />
          </svg>
        </button>

        {isOpen && (
          <div
            id="blog-categories-dropdown"
            role="menu"
            aria-label="Blog categories"
            className="absolute left-0 top-[calc(100%+0.5rem)] z-30 max-h-72 min-w-60 w-max max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#181818] p-2 shadow-xl backdrop-blur-sm"
          >
            <ul className="space-y-1">
              {categories.map((category) => {
                const isActive = category.value === activeCategory;

                return (
                  <li key={category.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCategory(category.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center rounded-md px-3 py-2 text-left text-[14px] font-medium transition-colors duration-200",
                        isActive ?
                          "bg-[#4db5ff]/10 text-[#4db5ff]"
                        : "text-[#e4e5e7] hover:bg-white/5 hover:text-[#4db5ff]",
                      )}
                    >
                      <span className="pr-2 text-left whitespace-normal wrap-break-word">
                        {category.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "xl:fixed xl:top-32 xl:max-h-[calc(100vh-9rem)] xl:w-37.5 xl:max-w-37.5 xl:overflow-y-auto",
        className,
      )}
    >
      <nav aria-label="Blog categories">
        <ul className="flex gap-3 overflow-x-auto pb-4 xl:block xl:space-y-3 xl:overflow-visible xl:pb-0">
          {categories.map((category) => {
            const isActive = category.value === activeCategory;

            return (
              <li key={category.value} className="shrink-0 xl:w-full">
                <button
                  type="button"
                  onClick={() => onSelectCategory(category.value)}
                  className={cn(
                    "flex h-10.5 w-full items-center justify-center rounded-lg border border-transparent bg-linear-to-b from-[rgba(255,255,255,0.03)] to-[rgba(0,0,0,0.25)] px-4 py-2 text-center transition-all duration-300",
                    isActive ?
                      "border-[#4db5ff] text-[#4db5ff] shadow-[0px_0px_9.375px_0px_rgba(76,145,255,0.2)] backdrop-blur-[4px]"
                    : "text-[#e4e5e7] hover:border-[#4db5ff] hover:text-[#4db5ff] backdrop-blur-[4px]",
                  )}
                >
                  <span className="max-w-full truncate text-[14px] font-medium leading-[normal]">
                    {category.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
