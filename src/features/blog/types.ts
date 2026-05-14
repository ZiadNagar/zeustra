export type BlogCategoryOption = {
  label: string;
  value: string;
};

export type BlogIndexPost = {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  publishDateLabel: string;
  publishDateISO: string;
  tags: string[];
  author: string;
  authorAvatars: Array<string | null>;
  category: string;
  categorySlug: string | null;
  image: string;
};
