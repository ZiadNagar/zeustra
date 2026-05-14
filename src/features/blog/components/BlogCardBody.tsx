import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type BlogCardBodyProps = {
  topSlot: ReactNode;
  title: string;
  excerpt: string;
  author: string;
  titleTag?: "h2" | "h3";
  titleHref?: string;
  className?: string;
  topSlotClassName?: string;
  authorPrefix?: ReactNode;
  authorRowClassName?: string;
};

export default function BlogCardBody({
  topSlot,
  title,
  excerpt,
  author,
  titleTag = "h3",
  titleHref,
  className,
  topSlotClassName,
  authorPrefix,
  authorRowClassName,
}: BlogCardBodyProps) {
  const TitleTag = titleTag;

  const titleContent = titleHref ? (
    <a
      href={titleHref}
      data-astro-prefetch
      className="transition-colors duration-200 hover:text-brand-blue-light"
    >
      {title}
    </a>
  ) : (
    title
  );

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className={cn("min-h-5", topSlotClassName)}>{topSlot}</div>

      <TitleTag className="text-heading-4 leading-normal font-semibold text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
        {titleContent}
      </TitleTag>

      <p className="text-body-base text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
        {excerpt}
      </p>

      <div
        className={cn(
          "mt-auto flex items-center gap-3 pt-5",
          authorRowClassName,
        )}
      >
        {authorPrefix}
        <p className="truncate text-body-base text-slate-300">{author}</p>
      </div>
    </div>
  );
}
