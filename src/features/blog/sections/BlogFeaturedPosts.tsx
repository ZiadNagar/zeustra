import type { SyntheticEvent } from "react";
import type { BlogIndexPost } from "@/features/blog/types";
import BlogCardBody from "@/features/blog/components/BlogCardBody";
import { getAuthorNames } from "@/features/blog/utils/blogHelpers";
import { getBadgeColors } from "@/features/blog/utils/badgeColors";

type BlogFeaturedPostsProps = {
  posts: BlogIndexPost[];
};

const BLOG_AUTHOR_FALLBACK_AVATAR =
  "/assets/images/brand/zeustra-logo-minimal.svg";
const BLOG_POST_FALLBACK_IMAGE = "/assets/images/blogs/blog-thumb01.png";
const DEFAULT_AUTHOR_NAME = "Zeustra Team";

const applyFallbackSrc = (
  event: SyntheticEvent<HTMLImageElement>,
  fallbackSrc: string,
): void => {
  const target = event.currentTarget;

  if (target.dataset.fallbackApplied === "true") {
    return;
  }

  target.dataset.fallbackApplied = "true";
  target.src = fallbackSrc;
};

export default function BlogFeaturedPosts({ posts }: BlogFeaturedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="grid auto-rows-fr gap-4 lg:grid-cols-2">
      {posts.map((post) => {
        const authorNames = getAuthorNames(post.author);
        const visibleAuthorNames =
          authorNames.length > 0 ? authorNames : [DEFAULT_AUTHOR_NAME];
        const badgeColors = getBadgeColors();

        const authorPrefix = (
          <div className="flex -space-x-2">
            {visibleAuthorNames.map((name, index) => {
              const avatarSrc =
                post.authorAvatars[index] ?? BLOG_AUTHOR_FALLBACK_AVATAR;

              return (
                <img
                  key={`${post.slug}-featured-author-${name}-${index}`}
                  src={avatarSrc}
                  alt={name}
                  loading="lazy"
                  decoding="async"
                  onError={(event) =>
                    applyFallbackSrc(event, BLOG_AUTHOR_FALLBACK_AVATAR)
                  }
                  className="h-8 w-8 rounded-full border border-black bg-[#0F1623] object-cover"
                />
              );
            })}
          </div>
        );

        return (
          <article
            key={`featured-${post.slug}`}
            className="group h-full overflow-hidden rounded-lg border border-[rgba(255,255,255,0.05)] transition-colors duration-200 hover:border-brand-blue-light/45"
          >
            <a
              href={`/blog/${post.slug}/`}
              data-astro-prefetch
              className="flex h-full flex-col"
            >
              <div className="aspect-[1.4/1] overflow-hidden border-b border-white/10">
                <img
                  src={post.image || BLOG_POST_FALLBACK_IMAGE}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  onError={(event) =>
                    applyFallbackSrc(event, BLOG_POST_FALLBACK_IMAGE)
                  }
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%)] p-5">
                <BlogCardBody
                  topSlot={
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full border ${badgeColors.borderColorClass} w-fit`}
                    >
                      <div
                        className={`w-2 h-2 ${badgeColors.badgeColorClass} rounded-full mr-3 shadow-inner`}
                      />
                      <span className="text-sm font-semibold text-white">
                        {post.category}
                      </span>
                    </div>
                  }
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  authorPrefix={authorPrefix}
                  titleTag="h2"
                  className="h-full"
                  authorRowClassName="pt-1"
                />
              </div>
            </a>
          </article>
        );
      })}
    </div>
  );
}
