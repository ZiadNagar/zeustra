import type { SyntheticEvent } from "react";
import { getAuthorNames } from "@/features/blog/utils/blogHelpers";
import { getBadgeColors } from "@/features/blog/utils/badgeColors";
import type { BlogIndexPost } from "@/features/blog/types";
import BlogCardBody from "@/features/blog/components/BlogCardBody";

type BlogPostFeedProps = {
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

export default function BlogPostFeed({ posts }: BlogPostFeedProps) {
  return (
    <section className="space-y-4">
      {posts.length > 0 ?
        posts.map((post) => {
          const authorNames = getAuthorNames(post.author);
          const visibleAuthorNames =
            authorNames.length > 0 ? authorNames : [DEFAULT_AUTHOR_NAME];

          const authorPrefix = (
            <div className="flex -space-x-2">
              {visibleAuthorNames.length > 0 ?
                visibleAuthorNames.map((name, index) => {
                  const avatarSrc =
                    post.authorAvatars[index] ?? BLOG_AUTHOR_FALLBACK_AVATAR;

                  return (
                    <img
                      key={`${post.slug}-${name}`}
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
                })
              : <img
                  src={BLOG_AUTHOR_FALLBACK_AVATAR}
                  alt="Zeustra Team"
                  loading="lazy"
                  decoding="async"
                  onError={(event) =>
                    applyFallbackSrc(event, BLOG_AUTHOR_FALLBACK_AVATAR)
                  }
                  className="h-8 w-8 rounded-full border border-black bg-[#0F1623] object-cover"
                />
              }
            </div>
          );

          const badgeColors = getBadgeColors();

          return (
            <article
              key={post.slug}
              className="group h-full overflow-hidden rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%)] p-4 sm:p-5"
            >
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px] md:items-stretch">
                <div className="flex h-full flex-col">
                  <BlogCardBody
                    topSlot={
                      <div className="flex items-center gap-x-4">
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
                        <time
                          className="shrink-0 text-slate-400 text-sm"
                          dateTime={post.publishDateISO}
                        >
                          {post.publishDateLabel}
                        </time>
                      </div>
                    }
                    title={post.title}
                    titleTag="h3"
                    titleHref={`/blog/${post.slug}/`}
                    excerpt={post.excerpt}
                    author={post.author}
                    authorPrefix={authorPrefix}
                    className="h-full"
                  />
                </div>

                <a
                  href={`/blog/${post.slug}/`}
                  data-astro-prefetch
                  className="block aspect-4/3 overflow-hidden rounded-xl border border-white/10"
                >
                  <img
                    src={post.image || BLOG_POST_FALLBACK_IMAGE}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    onError={(event) =>
                      applyFallbackSrc(event, BLOG_POST_FALLBACK_IMAGE)
                    }
                    className="h-full w-full bg-[#181818] object-cover"
                  />
                </a>
              </div>
            </article>
          );
        })
      : <div className="rounded-lg border border-[rgba(255,255,255,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%)] p-8 text-center">
          <h3 className="text-heading-5 font-semibold text-white">
            No matching posts
          </h3>
          <p className="mt-2 text-body-base text-slate-300">
            Try a different category or search phrase.
          </p>
        </div>
      }
    </section>
  );
}
