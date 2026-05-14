import { createHash } from "node:crypto";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { classifyStrapiError, strapiClient } from "@/lib/strapi/client";
import type { StrapiQueryRecord } from "@/lib/strapi/types";
import {
  isNgrokUrl,
  isRecord,
  normalizeStrapiId,
  toEntityRecord,
} from "@/lib/strapi/utils";

export type StrapiBlogAuthorRecord = {
  name: string;
  avatar: string | null;
};

export type StrapiBlogCategoryRecord = {
  title: string;
  slug: string;
};

export type StrapiBlogSeoRecord = {
  title: string;
  description: string;
};

export type StrapiBlogCardRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  publishedAt: string;
  excerpt: string;
  coverImage: string | null;
  tags: string[];
  authors: StrapiBlogAuthorRecord[];
  category: StrapiBlogCategoryRecord | null;
};

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
};

export type TiptapDocument = {
  type: "doc";
  content: TiptapNode[];
};

export type StrapiBlogDetailRecord = StrapiBlogCardRecord & {
  content: TiptapDocument | string;
  seo: StrapiBlogSeoRecord;
};

export type StrapiBlogPaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiBlogListQuery = {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  exclude?: string;
};

export type StrapiBlogListPageResult = {
  data: StrapiBlogCardRecord[];
  pagination: StrapiBlogPaginationMeta;
};

export type StrapiBlogFooterContextRecord = {
  related: StrapiBlogCardRecord[];
  more: StrapiBlogCardRecord[];
};

const BLOG_FEATURED_ENDPOINT = "blogs/featured";
const BLOG_LIST_ENDPOINT = "blogs/list";
const BLOG_CATEGORIES_ENDPOINT = "categories";
const BLOGS_DEFAULT_PAGE = 1;
const BLOGS_DEFAULT_PAGE_SIZE = 9;
const BLOGS_MAX_PAGE_SIZE = 100;
const NGROK_SKIP_WARNING_HEADER = "ngrok-skip-browser-warning";
const STRAPI_MEDIA_CACHE_PUBLIC_BASE = "/assets/images/strapi-cache";
const STRAPI_MEDIA_CACHE_DIRECTORY = resolve(
  process.cwd(),
  "public",
  "assets",
  "images",
  "strapi-cache",
);
const ngrokMediaCache = new Map<string, Promise<string | null>>();

const readString = (value: unknown, allowEmpty = false): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (allowEmpty) {
    return normalized;
  }

  return normalized || null;
};

const readNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return readString(value, true);
};

const normalizeMediaUrl = (value: string): string => {
  return value;
};

const readMediaUrl = (value: unknown): string | null => {
  const rawValue = readNullableString(value);
  if (!rawValue) {
    return null;
  }

  return normalizeMediaUrl(rawValue);
};

const getMediaExtension = (
  contentType: string | null,
  pathName: string,
): string => {
  const fromPath = extname(pathName).toLowerCase();
  if (fromPath) {
    return fromPath;
  }

  const normalizedType = contentType?.toLowerCase() ?? "";
  if (normalizedType.includes("jpeg")) {
    return ".jpg";
  }

  if (normalizedType.includes("png")) {
    return ".png";
  }

  if (normalizedType.includes("webp")) {
    return ".webp";
  }

  if (normalizedType.includes("gif")) {
    return ".gif";
  }

  if (normalizedType.includes("svg")) {
    return ".svg";
  }

  if (normalizedType.includes("avif")) {
    return ".avif";
  }

  return ".img";
};

const cacheNgrokMediaUrl = async (url: string): Promise<string | null> => {
  const existingTask = ngrokMediaCache.get(url);
  if (existingTask) {
    return existingTask;
  }

  const cacheTask = (async () => {
    try {
      const response = await fetch(url, {
        headers: {
          [NGROK_SKIP_WARNING_HEADER]: "true",
        },
      });

      if (!response.ok) {
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.toLowerCase().startsWith("image/")) {
        return null;
      }

      const parsedUrl = new URL(url);
      const extension = getMediaExtension(contentType, parsedUrl.pathname);
      const fileHash = createHash("sha256")
        .update(url)
        .digest("hex")
        .slice(0, 24);
      const fileName = `${fileHash}${extension}`;
      const outputPath = join(STRAPI_MEDIA_CACHE_DIRECTORY, fileName);

      await mkdir(STRAPI_MEDIA_CACHE_DIRECTORY, { recursive: true });

      try {
        await stat(outputPath);
      } catch {
        const bytes = new Uint8Array(await response.arrayBuffer());
        await writeFile(outputPath, bytes);
      }

      return `${STRAPI_MEDIA_CACHE_PUBLIC_BASE}/${fileName}`;
    } catch {
      return null;
    }
  })();

  ngrokMediaCache.set(url, cacheTask);
  return cacheTask;
};

const resolveMediaUrlForRender = async (
  value: string | null,
): Promise<string | null> => {
  if (!value) {
    return null;
  }

  if (!isNgrokUrl(value)) {
    return value;
  }

  return cacheNgrokMediaUrl(value);
};

const hydrateBlogCardMedia = async (
  card: StrapiBlogCardRecord,
): Promise<StrapiBlogCardRecord> => {
  const [coverImage, authors] = await Promise.all([
    resolveMediaUrlForRender(card.coverImage),
    Promise.all(
      card.authors.map(async (author) => ({
        ...author,
        avatar: await resolveMediaUrlForRender(author.avatar),
      })),
    ),
  ]);

  return {
    ...card,
    coverImage,
    authors,
  };
};

const hydrateBlogCardsMedia = async (
  cards: StrapiBlogCardRecord[],
): Promise<StrapiBlogCardRecord[]> =>
  Promise.all(cards.map((card) => hydrateBlogCardMedia(card)));

const hydrateBlogDetailMedia = async (
  detail: StrapiBlogDetailRecord,
): Promise<StrapiBlogDetailRecord> => {
  const hydratedCard = await hydrateBlogCardMedia(detail);

  return {
    ...detail,
    coverImage: hydratedCard.coverImage,
    authors: hydratedCard.authors,
  };
};

const readStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => readString(entry))
    .filter((entry): entry is string => Boolean(entry));
};

const readFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const parseBlogAuthor = (value: unknown): StrapiBlogAuthorRecord | null => {
  // Handle Strapi's nested data structure: { data: { id, name, avatar } }
  const record = toEntityRecord(value);
  const dataValue = record.data;
  const entityRecord = isRecord(dataValue) ? dataValue : toEntityRecord(value);

  const name = readString(entityRecord.name);
  if (!name) {
    return null;
  }

  return {
    name,
    avatar: readMediaUrl(entityRecord.avatar),
  };
};

const parseBlogCategory = (value: unknown): StrapiBlogCategoryRecord | null => {
  if (value === null || value === undefined) {
    return null;
  }

  // Handle Strapi's nested data structure: { data: { id, title, slug } }
  const record = toEntityRecord(value);
  const dataValue = record.data;
  const entityRecord = isRecord(dataValue) ? dataValue : toEntityRecord(value);

  const title = readString(entityRecord.title);
  const slug = readString(entityRecord.slug);

  if (!title || !slug) {
    return null;
  }

  return {
    title,
    slug,
  };
};

const parseBlogCardRecord = (value: unknown): StrapiBlogCardRecord | null => {
  const record = toEntityRecord(value);

  const id = normalizeStrapiId(record.id ?? record.documentId);
  const title = readString(record.title);
  const slug = readString(record.slug);
  const publishedAt = readString(record.publishedAt);

  if (!id || !title || !slug || !publishedAt) {
    return null;
  }

  if (Number.isNaN(Date.parse(publishedAt))) {
    return null;
  }

  const excerpt = readString(record.excerpt, true);
  const authors =
    Array.isArray(record.authors) ?
      record.authors
        .map((author) => parseBlogAuthor(author))
        .filter((author): author is StrapiBlogAuthorRecord => author !== null)
    : [];

  return {
    id,
    title,
    subtitle: readNullableString(record.subtitle),
    slug,
    publishedAt,
    excerpt: excerpt ?? "",
    coverImage: readMediaUrl(record.coverImage),
    tags: readStringArray(record.tags),
    authors,
    category: parseBlogCategory(record.category),
  };
};

const parseSeoRecord = (value: unknown): StrapiBlogSeoRecord | null => {
  const record = toEntityRecord(value);
  const title = readString(record.title, true);
  const description = readString(record.description, true);

  if (title === null || description === null) {
    return null;
  }

  return {
    title,
    description,
  };
};

const isTiptapDocument = (value: unknown): value is TiptapDocument => {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as Record<string, unknown>).type === "doc" &&
    "content" in value &&
    Array.isArray((value as Record<string, unknown>).content)
  );
};

const parseBlogDetailRecord = (
  value: unknown,
): StrapiBlogDetailRecord | null => {
  const base = parseBlogCardRecord(value);
  if (!base) {
    return null;
  }

  const record = toEntityRecord(value);

  let content: TiptapDocument | string | null = null;

  if (isTiptapDocument(record.content)) {
    content = record.content as TiptapDocument;
  } else {
    const stringContent = readString(record.content, true);
    if (stringContent !== null) {
      content = stringContent;
    }
  }

  if (content === null) {
    return null;
  }

  const seo = parseSeoRecord(record.seo) ?? {
    title: base.title,
    description: base.excerpt,
  };

  return {
    ...base,
    content,
    seo,
  };
};

const toErrorReason = (error: unknown): string => {
  const normalized = classifyStrapiError(error);
  const statusCode = normalized.statusCode;
  if (statusCode !== null) {
    return `http_${statusCode}`;
  }

  if (normalized.reason === "timeout") {
    return "timeout";
  }

  if (normalized.reason === "network") {
    return "network";
  }

  return "unknown";
};

const warnFallback = (reason: string): void => {
  console.warn(`[strapi-blog] fallback_reason=${reason}`);
};

const sanitizePage = (value: number | undefined): number => {
  if (!Number.isInteger(value) || !value || value < 1) {
    return BLOGS_DEFAULT_PAGE;
  }

  return value;
};

const sanitizePageSize = (value: number | undefined): number => {
  if (!Number.isInteger(value) || !value || value < 1) {
    return BLOGS_DEFAULT_PAGE_SIZE;
  }

  return Math.min(value, BLOGS_MAX_PAGE_SIZE);
};

const toListQueryRecord = (query: StrapiBlogListQuery): StrapiQueryRecord => {
  const page = sanitizePage(query.page);
  const pageSize = sanitizePageSize(query.pageSize);

  return {
    page,
    pageSize,
    category: query.category,
    search: query.search,
    exclude: query.exclude,
  };
};

const dedupeBySlug = (
  cards: StrapiBlogCardRecord[],
): StrapiBlogCardRecord[] => {
  const bySlug = new Map<string, StrapiBlogCardRecord>();

  for (const card of cards) {
    if (!bySlug.has(card.slug)) {
      bySlug.set(card.slug, card);
    }
  }

  return Array.from(bySlug.values());
};

const sortByPublishedAtDesc = (
  cards: StrapiBlogCardRecord[],
): StrapiBlogCardRecord[] =>
  [...cards].sort((left, right) => {
    const leftTs = Date.parse(left.publishedAt);
    const rightTs = Date.parse(right.publishedAt);

    if (Number.isNaN(leftTs) || Number.isNaN(rightTs)) {
      return 0;
    }

    return rightTs - leftTs;
  });

const parseCardsFromPayload = (
  payload: unknown,
): StrapiBlogCardRecord[] | null => {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    return null;
  }

  const parsed = payload.data
    .map((entry) => parseBlogCardRecord(entry))
    .filter((entry): entry is StrapiBlogCardRecord => entry !== null);

  if (payload.data.length > 0 && parsed.length === 0) {
    return null;
  }

  return dedupeBySlug(parsed);
};

const parseCategoriesFromPayload = (
  payload: unknown,
): StrapiBlogCategoryRecord[] | null => {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    return null;
  }

  const categories = payload.data
    .map((entry) => parseBlogCategory(entry))
    .filter((entry): entry is StrapiBlogCategoryRecord => entry !== null);

  if (payload.data.length > 0 && categories.length === 0) {
    return null;
  }

  return categories;
};

const parsePaginationFromPayload = (
  payload: unknown,
  fallbackPage: number,
  fallbackPageSize: number,
  fallbackTotal: number,
): StrapiBlogPaginationMeta => {
  const meta =
    isRecord(payload) && isRecord(payload.meta) ? payload.meta : null;
  const pagination = meta && isRecord(meta.pagination) ? meta.pagination : null;

  const page =
    (pagination && readFiniteNumber(pagination.page)) ?? fallbackPage;
  const pageSize =
    (pagination && readFiniteNumber(pagination.pageSize)) ?? fallbackPageSize;
  const pageCount =
    (pagination && readFiniteNumber(pagination.pageCount)) ??
    Math.ceil(fallbackTotal / Math.max(fallbackPageSize, 1));
  const total =
    (pagination && readFiniteNumber(pagination.total)) ?? fallbackTotal;

  return {
    page: Math.max(Math.trunc(page), 1),
    pageSize: Math.max(Math.trunc(pageSize), 1),
    pageCount: Math.max(Math.trunc(pageCount), 0),
    total: Math.max(Math.trunc(total), 0),
  };
};

export const fetchFeaturedBlogCards = async (): Promise<
  StrapiBlogCardRecord[] | null
> => {
  try {
    const payload = await strapiClient.fetchCollection<unknown>(
      BLOG_FEATURED_ENDPOINT,
    );
    const cards = parseCardsFromPayload(payload);

    if (cards === null) {
      warnFallback("featured_payload_malformed");
      return null;
    }

    return await hydrateBlogCardsMedia(cards);
  } catch (error) {
    warnFallback(`featured_${toErrorReason(error)}`);
    return null;
  }
};

export const fetchBlogCategories = async (): Promise<
  StrapiBlogCategoryRecord[] | null
> => {
  try {
    const payload = await strapiClient.fetchCollection<unknown>(
      BLOG_CATEGORIES_ENDPOINT,
    );
    const categories = parseCategoriesFromPayload(payload);

    if (categories === null) {
      warnFallback("categories_payload_malformed");
      return null;
    }

    return categories;
  } catch (error) {
    warnFallback(`categories_${toErrorReason(error)}`);
    return null;
  }
};

export const fetchBlogListPage = async (
  query: StrapiBlogListQuery,
): Promise<StrapiBlogListPageResult | null> => {
  const normalizedQuery = toListQueryRecord(query);

  try {
    const payload = await strapiClient.fetchCollection<unknown>(
      BLOG_LIST_ENDPOINT,
      normalizedQuery,
    );
    const cards = parseCardsFromPayload(payload);

    if (cards === null) {
      warnFallback("list_payload_malformed");
      return null;
    }

    const hydratedCards = await hydrateBlogCardsMedia(cards);

    const pagination = parsePaginationFromPayload(
      payload,
      sanitizePage(query.page),
      sanitizePageSize(query.pageSize),
      hydratedCards.length,
    );

    return {
      data: hydratedCards,
      pagination,
    };
  } catch (error) {
    warnFallback(`list_${toErrorReason(error)}`);
    return null;
  }
};

export const fetchAllBlogCards = async (): Promise<
  StrapiBlogCardRecord[] | null
> => {
  const featuredCards = await fetchFeaturedBlogCards();
  const featuredSlugs = new Set((featuredCards ?? []).map((card) => card.slug));

  let page = BLOGS_DEFAULT_PAGE;
  const listedCards: StrapiBlogCardRecord[] = [];

  while (true) {
    const query: StrapiBlogListQuery = {
      page,
      pageSize: BLOGS_MAX_PAGE_SIZE,
    };

    if (featuredSlugs.size > 0) {
      query.exclude = Array.from(featuredSlugs).join(",");
    }

    const pageResult = await fetchBlogListPage({
      ...query,
    });

    if (!pageResult) {
      if (page > BLOGS_DEFAULT_PAGE) {
        break;
      }

      if (!featuredCards || featuredCards.length === 0) {
        return null;
      }

      return sortByPublishedAtDesc(featuredCards);
    }

    listedCards.push(...pageResult.data);
    const pageCount = Math.max(pageResult.pagination.pageCount, 1);
    if (page >= pageCount) {
      break;
    }

    page += 1;
  }

  const combined = dedupeBySlug([...(featuredCards ?? []), ...listedCards]);
  if (combined.length === 0) {
    return null;
  }

  return sortByPublishedAtDesc(combined);
};

export const fetchBlogDetailBySlug = async (
  slug: string,
): Promise<StrapiBlogDetailRecord | null> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  try {
    const payload = await strapiClient.fetchSingleType<unknown>(
      `blogs/${encodeURIComponent(normalizedSlug)}`,
    );

    if (!isRecord(payload) || !payload.data) {
      return null;
    }

    const parsed = parseBlogDetailRecord(payload.data);
    if (!parsed) {
      warnFallback("detail_payload_malformed");
      return null;
    }

    return await hydrateBlogDetailMedia(parsed);
  } catch (error) {
    const statusCode = classifyStrapiError(error).statusCode;
    if (statusCode === 404) {
      return null;
    }

    warnFallback(`detail_${toErrorReason(error)}`);
    return null;
  }
};

export const fetchBlogFooterContextBySlug = async (
  slug: string,
  relatedLimit = 3,
): Promise<StrapiBlogFooterContextRecord | null> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const safeRelatedLimit = Math.max(Math.trunc(relatedLimit), 1);

  try {
    const payload = await strapiClient.fetchSingleType<unknown>(
      `blogs/${encodeURIComponent(normalizedSlug)}/recommendations`,
    );

    if (!isRecord(payload) || !Array.isArray(payload.data)) {
      return null;
    }

    const related = payload.data
      .map((entry) => parseBlogCardRecord(entry))
      .filter((entry): entry is StrapiBlogCardRecord => entry !== null)
      .slice(0, safeRelatedLimit);

    const hydratedRelated = await hydrateBlogCardsMedia(dedupeBySlug(related));

    return {
      related: hydratedRelated,
      more: [],
    };
  } catch (error) {
    const statusCode = classifyStrapiError(error).statusCode;
    if (statusCode === 404) {
      return null;
    }

    warnFallback(`recommendations_${toErrorReason(error)}`);
    return null;
  }
};
