import BlogIndexSection from "@/features/blog/sections/BlogIndexSection";
import type { BlogCategoryOption, BlogIndexPost } from "@/features/blog/types";

export type { BlogIndexPost } from "@/features/blog/types";

type BlogIndexIslandProps = {
  feedPosts: BlogIndexPost[];
  featuredPosts: BlogIndexPost[];
  categories: BlogCategoryOption[];
};

export default function BlogIndexIsland({
  feedPosts,
  featuredPosts,
  categories,
}: BlogIndexIslandProps) {
  return (
    <BlogIndexSection
      feedPosts={feedPosts}
      featuredPosts={featuredPosts}
      categories={categories}
    />
  );
}
