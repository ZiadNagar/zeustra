import { useMemo, useState, type ComponentProps } from "react";
import BlogCategoriesAside from "@/features/blog/sections/BlogCategoriesAside";
import BlogFeaturedPosts from "@/features/blog/sections/BlogFeaturedPosts";
import BlogIndexHeader from "@/features/blog/sections/BlogIndexHeader";
import BlogPostFeed from "@/features/blog/sections/BlogPostFeed";
import BlogSubscribeCard from "@/features/blog/sections/BlogSubscribeCard";
import type { BlogCategoryOption, BlogIndexPost } from "@/features/blog/types";
import { ALL_POSTS, filterBlogPosts } from "@/features/blog/utils/blogHelpers";

type BlogIndexSectionProps = {
  feedPosts: BlogIndexPost[];
  featuredPosts: BlogIndexPost[];
  categories: BlogCategoryOption[];
};

type FormSubmitHandler = NonNullable<ComponentProps<"form">["onSubmit"]>;

export default function BlogIndexSection({
  feedPosts,
  featuredPosts,
  categories,
}: BlogIndexSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_POSTS);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [didSubscribe, setDidSubscribe] = useState<boolean>(false);

  const filteredPosts = useMemo(
    () => filterBlogPosts(feedPosts, activeCategory, searchTerm),
    [activeCategory, feedPosts, searchTerm],
  );

  const featuredSlugSet = useMemo(
    () => new Set(featuredPosts.map((post) => post.slug)),
    [featuredPosts],
  );
  const visibleFeedPosts = useMemo(
    () => filteredPosts.filter((post) => !featuredSlugSet.has(post.slug)),
    [featuredSlugSet, filteredPosts],
  );

  const handleSubscribe: FormSubmitHandler = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setDidSubscribe(true);
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-300 px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="grid items-start gap-10 xl:grid-cols-[150px_minmax(0,1fr)]">
        <BlogCategoriesAside
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          variant="sidebar"
          className="hidden xl:block"
        />

        <div className="space-y-10 xl:col-start-2">
          <section className="space-y-8">
            <BlogIndexHeader
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />

            <BlogFeaturedPosts posts={featuredPosts} />
          </section>

          <BlogSubscribeCard
            email={email}
            didSubscribe={didSubscribe}
            onEmailChange={setEmail}
            onSubscribe={handleSubscribe}
          />

          <BlogPostFeed posts={visibleFeedPosts} />
        </div>
      </div>
    </section>
  );
}
