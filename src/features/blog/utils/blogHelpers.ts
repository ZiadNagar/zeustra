import type { BlogCategoryOption, BlogIndexPost } from "@/features/blog/types";

export const ALL_POSTS = "__all_posts__";

const normalize = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "");

export const buildBlogCategories = (
  posts: BlogIndexPost[],
): BlogCategoryOption[] => {
  const categoryMap = new Map<string, { label: string; count: number }>();

  for (const post of posts) {
    if (!post.categorySlug || !post.category) {
      continue;
    }

    const current = categoryMap.get(post.categorySlug);
    if (current) {
      current.count += 1;
      continue;
    }

    categoryMap.set(post.categorySlug, {
      label: post.category,
      count: 1,
    });
  }

  const sortedCategories = Array.from(categoryMap.entries())
    .sort(([, left], [, right]) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.label.localeCompare(right.label);
    })
    .map(([value, category]) => ({
      label: category.label,
      value,
    }));

  return [{ label: "All Posts", value: ALL_POSTS }, ...sortedCategories];
};

export const filterBlogPosts = (
  posts: BlogIndexPost[],
  activeCategory: string,
  searchTerm: string,
): BlogIndexPost[] => {
  const normalizedTerm = normalize(searchTerm);
  const normalizedActiveCategory = normalize(activeCategory);

  return posts.filter((post) => {
    const normalizedCategorySlug = normalize(post.categorySlug ?? "");
    const normalizedCategoryLabel = normalize(post.category);

    const matchesCategory =
      activeCategory === ALL_POSTS ||
      normalizedCategorySlug === normalizedActiveCategory ||
      normalizedCategoryLabel === normalizedActiveCategory;

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedTerm) {
      return true;
    }

    // Match the public API behavior: search is against title and subtitle.
    const haystack = [post.title, post.subtitle ?? ""].join(" ");

    return normalize(haystack).includes(normalizedTerm);
  });
};

export const getAuthorNames = (author: string): string[] =>
  author
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

export const getInitials = (name: string): string => {
  const chunks = name
    .split(" ")
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    return "ZT";
  }

  if (chunks.length === 1) {
    return chunks[0].slice(0, 2).toUpperCase();
  }

  return `${chunks[0][0] ?? ""}${chunks[1][0] ?? ""}`.toUpperCase();
};
