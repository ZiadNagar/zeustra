export { strapiClient } from "@/lib/strapi/client";
export {
  fetchAllBlogCards,
  fetchBlogCategories,
  fetchBlogDetailBySlug,
  fetchBlogFooterContextBySlug,
  fetchBlogListPage,
  fetchFeaturedBlogCards,
} from "@/lib/strapi/blog";
export {
  fetchTeamMembersWithFallback,
  fetchTestimonialsWithFallback,
  fetchTeamMembers,
  fetchTestimonials,
  mapStrapiStaffToUi,
  mapStrapiTestimonialToUi,
} from "@/lib/strapi/content";
export {
  fetchTermsAndConditions,
  fetchPrivacyPolicy,
  type LegalPageData,
} from "@/lib/strapi/legal";
export {
  fetchPositionBySlug,
  fetchPositions,
  type FetchPositionsOptions,
} from "@/lib/strapi/careers";
export type {
  StrapiBlogAuthorRecord,
  StrapiBlogCardRecord,
  StrapiBlogCategoryRecord,
  StrapiBlogDetailRecord,
  StrapiBlogFooterContextRecord,
  StrapiBlogListPageResult,
  StrapiBlogListQuery,
  StrapiBlogPaginationMeta,
  StrapiBlogSeoRecord,
  TiptapDocument,
  TiptapNode,
} from "@/lib/strapi/blog";
export type {
  StrapiApplicationSubmitPayload,
  StrapiCollectionResponse,
  StrapiEntity,
  StrapiPublicListResponse,
  StrapiPositionDetailResult,
  StrapiPositionListResult,
  StrapiPositionRecord,
  StrapiPositionSectionRecord,
  StrapiStaffMemberRecord,
  StrapiStaffTeamResponse,
  StrapiMeta,
  StrapiQueryInput,
  StrapiQueryPrimitive,
  StrapiQueryRecord,
  StrapiSingleResponse,
  StrapiTestimonialRecord,
  StrapiTestimonialsPublicResponse,
} from "@/lib/strapi/types";
export type { TestimonialUiModel } from "@/lib/strapi/content";
