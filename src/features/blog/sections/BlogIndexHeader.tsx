import BlogCategoriesAside from "@/features/blog/sections/BlogCategoriesAside";
import type { BlogCategoryOption } from "@/features/blog/types";

type BlogIndexHeaderProps = {
  categories: BlogCategoryOption[];
  activeCategory: string;
  onSelectCategory: (categoryLabel: string) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
};

export default function BlogIndexHeader({
  categories,
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchTermChange,
}: BlogIndexHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1
          className="inline-flex items-end gap-2.5 text-heading-1 leading-none font-medium text-transparent bg-linear-to-r from-brand-blue-std via-brand-blue-vivid to-brand-blue-light bg-clip-text"
          style={{
            textShadow: "var(--shadow-hero-accent)",
          }}
        >
          BLOG
          <span className="inline-flex items-end self-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M5.625 15.0109C5.625 15.5081 5.42746 15.9851 5.07583 16.3367C4.72419 16.6883 4.24728 16.8859 3.75 16.8859C3.25272 16.8859 2.77581 16.6883 2.42417 16.3367C2.07254 15.9851 1.875 15.5081 1.875 15.0109C1.875 14.5136 2.07254 14.0367 2.42417 13.685C2.77581 13.3334 3.25272 13.1359 3.75 13.1359C4.24728 13.1359 4.72419 13.3334 5.07583 13.685C5.42746 14.0367 5.625 14.5136 5.625 15.0109ZM1.875 0.648361C10.6613 0.970861 17.79 8.09836 18.1125 16.8859H15.9875C15.6625 9.28336 9.47625 3.09711 1.875 2.77336V0.648361Z"
                fill="url(#paint0_linear_3664_536)"
                stroke="url(#paint1_linear_3664_536)"
                strokeWidth="1.25"
              />
              <path
                d="M1.875 6.52837C7.4125 6.84587 11.915 11.3484 12.2325 16.8859H10.2287C10.0781 14.72 9.14959 12.6816 7.61441 11.1465C6.07922 9.61128 4.04084 8.68278 1.875 8.53212V6.52837Z"
                fill="url(#paint2_linear_3664_536)"
                stroke="url(#paint3_linear_3664_536)"
                strokeWidth="1.25"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_3664_536"
                  x1="-6.1331"
                  y1="0.584074"
                  x2="19.0866"
                  y2="4.00441"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="0.52" stopColor="#3E6AF8" />
                  <stop offset="1" stopColor="#4DB5FF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_3664_536"
                  x1="-6.1331"
                  y1="0.584074"
                  x2="19.0866"
                  y2="4.00441"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="0.52" stopColor="#3E6AF8" />
                  <stop offset="1" stopColor="#4DB5FF" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_3664_536"
                  x1="-3.23317"
                  y1="6.48736"
                  x2="12.8538"
                  y2="8.66911"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="0.52" stopColor="#3E6AF8" />
                  <stop offset="1" stopColor="#4DB5FF" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_3664_536"
                  x1="-3.23317"
                  y1="6.48736"
                  x2="12.8538"
                  y2="8.66911"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#3B82F6" />
                  <stop offset="0.52" stopColor="#3E6AF8" />
                  <stop offset="1" stopColor="#4DB5FF" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>{" "}
      </div>

      <div className="w-full shrink-0 lg:max-w-92 xl:max-w-70.75">
        <div className="flex items-center gap-2">
          <BlogCategoriesAside
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
            variant="dropdown"
            className="xl:hidden"
          />

          <label htmlFor="blog-search" className="relative min-w-0 flex-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(148,151,158,1)]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.2-4.2" />
            </svg>
            <input
              id="blog-search"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search..."
              className="h-8 w-full rounded-lg border border-white/10 bg-[#0c0d0d6e] pl-10 pr-3 text-body-sm text-[rgba(148,151,158,1)] outline-none transition-colors duration-200 placeholder:text-[rgba(148,151,158,1)] focus:border-brand-blue-light/55"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
