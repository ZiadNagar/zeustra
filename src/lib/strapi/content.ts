import type { TeamMember } from "@/features/about/data/aboutPageData";
import { classifyStrapiError, strapiClient } from "@/lib/strapi/client";
import type {
  StrapiEntity,
  StrapiStaffMemberRecord,
  StrapiTestimonialRecord,
} from "@/lib/strapi/types";
import { isRecord, toEntityRecord } from "@/lib/strapi/utils";
import { getServerEnv } from "@/utils/env";

export type TestimonialUiModel = {
  id: number | string;
  quote: string;
  author: string;
  position: string;
  category: string;
  image: string;
};

const TESTIMONIALS_ENDPOINT = "/api/testimonials/public";
const STAFF_PRIMARY_ENDPOINT = "/api/staff-members/team";
const STAFF_SECONDARY_ENDPOINT = "/api/staffmember";
const STAFF_PRIMARY_TIMEOUT_MS = 5000;
const STAFF_TOTAL_TIMEOUT_MS = 10000;
const CONTENT_TIMEOUT_MS = 10000;

type StrapiContentContext = "testimonials" | "staff";

type RequestFailure = {
  kind:
    | "timeout"
    | "network"
    | "http_404"
    | "http_5xx"
    | "http_other"
    | "unknown";
  statusCode: number | null;
};

type RuntimeConfig = {
  baseUrl: string;
  apiPath: string;
};

const classifyRequestFailure = (error: unknown): RequestFailure => {
  const normalized = classifyStrapiError(error);
  const statusCode = normalized.statusCode;

  if (statusCode === 404) {
    return { kind: "http_404", statusCode };
  }

  if (statusCode !== null && statusCode >= 500) {
    return { kind: "http_5xx", statusCode };
  }

  if (statusCode !== null) {
    return { kind: "http_other", statusCode };
  }

  if (normalized.reason === "timeout") {
    return { kind: "timeout", statusCode: null };
  }

  if (normalized.reason === "network") {
    return { kind: "network", statusCode: null };
  }

  return { kind: "unknown", statusCode: null };
};

const normalizeSegment = (value: string): string =>
  value.replace(/^\/+|\/+$/g, "");

const normalizeStrapiMediaUrl = (
  value: string | null,
): string | null => {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  return normalizedValue;
};

const resolveRenderableImage = (
  candidate: string | null,
  fallbackImage: string | undefined,
): string => {
  const normalizedCandidate = normalizeStrapiMediaUrl(candidate);
  if (normalizedCandidate) {
    return normalizedCandidate;
  }

  if (typeof fallbackImage === "string" && fallbackImage.trim()) {
    return fallbackImage;
  }

  return "";
};

const resolveEndpointPath = (
  endpoint: string,
  apiPath: string,
): string | null => {
  const normalizedEndpoint = normalizeSegment(endpoint.trim());
  const normalizedApiPath = normalizeSegment(apiPath.trim());

  if (!normalizedEndpoint || !normalizedApiPath) {
    return null;
  }

  if (
    normalizedEndpoint.includes("://") ||
    normalizedApiPath.includes("://") ||
    normalizedEndpoint.startsWith("?")
  ) {
    return null;
  }

  if (normalizedEndpoint.startsWith(`${normalizedApiPath}/`)) {
    return normalizeSegment(
      normalizedEndpoint.slice(normalizedApiPath.length + 1),
    );
  }

  if (normalizedEndpoint.startsWith("api/")) {
    return normalizeSegment(normalizedEndpoint.slice(4));
  }

  return normalizedEndpoint;
};

const warnFallback = (context: StrapiContentContext, reason: string): void => {
  console.warn(`[strapi-content:${context}] fallback_reason=${reason}`);
};

const getValidatedRuntimeConfig = (
  context: StrapiContentContext,
): RuntimeConfig | null => {
  const env = getServerEnv();
  const baseUrl = env.strapiBaseUrl.trim();

  if (!baseUrl) {
    warnFallback(context, "config_missing_base_url");
    return null;
  }

  try {
    new URL(baseUrl);
  } catch {
    warnFallback(context, "config_invalid_base_url");
    return null;
  }

  const apiPath = normalizeSegment(env.strapiApiPath);
  if (!apiPath || apiPath.includes("://")) {
    warnFallback(context, "config_invalid_api_path");
    return null;
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/g, ""),
    apiPath,
  };
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      const timeoutError = new Error(`Timed out after ${timeoutMs}ms`);
      timeoutError.name = "AbortError";
      reject(timeoutError);
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
};

const readString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
};

const readOptionalString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
};

const isLikelyUrl = (value: string | null): boolean => {
  if (!value) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const readNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const readStrapiId = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || undefined;
  }

  return undefined;
};

const parseTestimonialRecord = (
  value: unknown,
): StrapiTestimonialRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const name = readString(value.name);
  const role = readString(value.role);
  const dealType = readString(value.dealType);
  const quote = readString(value.quote);

  if (!name || !role || !dealType || !quote) {
    return null;
  }

  return {
    id: readStrapiId(value.id),
    documentId: readOptionalString(value.documentId) ?? undefined,
    name,
    role,
    dealType,
    quote,
    sortOrder: readNumber(value.sortOrder) ?? 0,
    profilePic: readOptionalString(value.profilePic),
  };
};

const parseStaffRecord = (value: unknown): StrapiStaffMemberRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const name = readString(value.name);
  const title = readString(value.title);
  const bio = readOptionalString(value.bio);
  const email = readOptionalString(value.email);

  if (!name || !title) {
    return null;
  }

  const linkedinUrl = readOptionalString(value.linkedinUrl);
  const inferredLinkedinUrl =
    !linkedinUrl && isLikelyUrl(bio) ? bio : linkedinUrl;

  return {
    id: readStrapiId(value.id),
    documentId: readOptionalString(value.documentId) ?? undefined,
    name,
    title,
    bio,
    email,
    phoneNumber: readOptionalString(value.phoneNumber),
    linkedinUrl: inferredLinkedinUrl,
    sortOrder: readNumber(value.sortOrder) ?? 0,
    profilePic: readOptionalString(value.profilePic),
  };
};

const cloneTestimonials = (
  fallbackTestimonials: readonly TestimonialUiModel[],
): TestimonialUiModel[] => fallbackTestimonials.map((item) => ({ ...item }));

const cloneTeamMembers = (
  fallbackMembers: readonly TeamMember[],
): TeamMember[] => fallbackMembers.map((item) => ({ ...item }));

const getFallbackByIndex = <T>(
  items: readonly T[],
  index: number,
): T | undefined => {
  if (items.length === 0) {
    return undefined;
  }

  return items[index % items.length];
};

const toFailureReason = (prefix: string, failure: RequestFailure): string => {
  if (failure.kind === "http_5xx" && failure.statusCode !== null) {
    return `${prefix}_http_${failure.statusCode}`;
  }

  if (failure.kind === "http_other" && failure.statusCode !== null) {
    return `${prefix}_http_${failure.statusCode}`;
  }

  if (failure.kind === "http_404") {
    return `${prefix}_http_404`;
  }

  return `${prefix}_${failure.kind}`;
};

export const mapStrapiTestimonialToUi = (
  input: StrapiTestimonialRecord,
  index: number,
  fallbackItem?: TestimonialUiModel,
): TestimonialUiModel => {
  const stableId =
    input.id ??
    input.documentId ??
    fallbackItem?.id ??
    `testimonial-${index + 1}`;

  return {
    id: stableId,
    quote: input.quote,
    author: input.name,
    position: input.role,
    category: input.dealType,
    image: resolveRenderableImage(
      input.profilePic,
      fallbackItem?.image,
    ),
  };
};

export const mapStrapiStaffToUi = (
  input: StrapiStaffMemberRecord,
  fallbackItem?: TeamMember,
): TeamMember => ({
  name: input.name,
  title: input.title,
  image: resolveRenderableImage(
    input.profilePic,
    fallbackItem?.image,
  ),
  email: input.email ?? fallbackItem?.email ?? "",
  phone: input.phoneNumber ?? fallbackItem?.phone,
  linkedin: input.linkedinUrl ?? fallbackItem?.linkedin,
  bio:
    isLikelyUrl(input.bio)
      ? fallbackItem?.bio ?? ""
      : input.bio ?? fallbackItem?.bio ?? "",
});

const fetchCollectionEntities = async <T extends Record<string, unknown>>(
  endpoint: string,
  timeoutMs: number,
): Promise<Array<StrapiEntity<T>>> => {
  const response = await withTimeout(
    strapiClient.fetchCollection<T>(endpoint),
    timeoutMs,
  );

  if (!response || !Array.isArray(response.data)) {
    throw new Error("Malformed Strapi collection payload.");
  }

  return response.data;
};

const mapTestimonialsPayload = (
  entities: Array<StrapiEntity<StrapiTestimonialRecord>>,
  fallbackTestimonials: readonly TestimonialUiModel[],
): TestimonialUiModel[] | null => {
  if (entities.length === 0) {
    return null;
  }

  const parsedRecords = entities.map((entity) =>
    parseTestimonialRecord(toEntityRecord(entity)),
  );

  if (parsedRecords.some((record) => record === null)) {
    return null;
  }

  const validRecords = parsedRecords.filter(
    (record): record is StrapiTestimonialRecord => record !== null,
  );
  
  return validRecords.map((record, index) =>
    mapStrapiTestimonialToUi(
      record,
      index,
      getFallbackByIndex(fallbackTestimonials, index),
    ),
  );
};

const mapStaffPayload = (
  entities: Array<StrapiEntity<StrapiStaffMemberRecord>>,
  fallbackMembers: readonly TeamMember[],
): TeamMember[] | null => {
  if (entities.length === 0) {
    return null;
  }

  const parsedRecords = entities.map((entity) =>
    parseStaffRecord(toEntityRecord(entity)),
  );

  if (parsedRecords.some((record) => record === null)) {
    return null;
  }

  const validRecords = parsedRecords.filter(
    (record): record is StrapiStaffMemberRecord => record !== null,
  );
  
  return validRecords.map((record, index) =>
    mapStrapiStaffToUi(
      record,
      getFallbackByIndex(fallbackMembers, index),
    ),
  );
};

export const fetchTestimonialsWithFallback = async (
  fallbackTestimonials: readonly TestimonialUiModel[],
): Promise<TestimonialUiModel[]> => {
  const fallback = cloneTestimonials(fallbackTestimonials);
  const runtimeConfig = getValidatedRuntimeConfig("testimonials");

  if (!runtimeConfig) {
    return fallback;
  }

  const endpoint = resolveEndpointPath(
    TESTIMONIALS_ENDPOINT,
    runtimeConfig.apiPath,
  );
  if (!endpoint) {
    warnFallback("testimonials", "config_invalid_testimonials_endpoint");
    return fallback;
  }

  try {
    const entities = await fetchCollectionEntities<StrapiTestimonialRecord>(
      endpoint,
      CONTENT_TIMEOUT_MS,
    );

    const mapped = mapTestimonialsPayload(
      entities,
      fallbackTestimonials,
    );
    if (!mapped) {
      warnFallback("testimonials", "payload_malformed");
      return fallback;
    }

    return mapped;
  } catch (error) {
    const failure = classifyRequestFailure(error);
    warnFallback("testimonials", toFailureReason("request", failure));
    return fallback;
  }
};

export const fetchTeamMembersWithFallback = async (
  fallbackMembers: readonly TeamMember[],
): Promise<TeamMember[]> => {
  const fallback = cloneTeamMembers(fallbackMembers);
  const runtimeConfig = getValidatedRuntimeConfig("staff");

  if (!runtimeConfig) {
    return fallback;
  }

  const primaryEndpoint = resolveEndpointPath(
    STAFF_PRIMARY_ENDPOINT,
    runtimeConfig.apiPath,
  );
  const secondaryEndpoint = resolveEndpointPath(
    STAFF_SECONDARY_ENDPOINT,
    runtimeConfig.apiPath,
  );

  if (!primaryEndpoint || !secondaryEndpoint) {
    warnFallback("staff", "config_invalid_staff_endpoint");
    return fallback;
  }

  const startedAt = Date.now();

  try {
    const primaryEntities =
      await fetchCollectionEntities<StrapiStaffMemberRecord>(
        primaryEndpoint,
        STAFF_PRIMARY_TIMEOUT_MS,
      );

    const primaryMapped = mapStaffPayload(
      primaryEntities,
      fallbackMembers,
    );
    if (!primaryMapped) {
      warnFallback("staff", "payload_malformed_primary");
      return fallback;
    }

    return primaryMapped;
  } catch (primaryError) {
    const primaryFailure = classifyRequestFailure(primaryError);

    if (primaryFailure.kind !== "http_404") {
      warnFallback("staff", toFailureReason("primary", primaryFailure));
      return fallback;
    }

    const elapsedMs = Date.now() - startedAt;
    const remainingBudgetMs = STAFF_TOTAL_TIMEOUT_MS - elapsedMs;
    if (remainingBudgetMs <= 0) {
      warnFallback("staff", "failover_budget_exhausted");
      return fallback;
    }

    try {
      const secondaryEntities =
        await fetchCollectionEntities<StrapiStaffMemberRecord>(
          secondaryEndpoint,
          remainingBudgetMs,
        );

      const secondaryMapped = mapStaffPayload(
        secondaryEntities,
        fallbackMembers,
      );
      if (!secondaryMapped) {
        warnFallback("staff", "payload_malformed_secondary");
        return fallback;
      }

      return secondaryMapped;
    } catch (secondaryError) {
      const secondaryFailure = classifyRequestFailure(secondaryError);
      warnFallback("staff", toFailureReason("secondary", secondaryFailure));
      return fallback;
    }
  }
};

// =============================================================================
// Direct fetch functions (no fallback) - for Strapi-controlled content
// =============================================================================

const mapTestimonialsDirect = (
  entities: Array<StrapiEntity<StrapiTestimonialRecord>>,
): TestimonialUiModel[] | null => {
  if (entities.length === 0) {
    return [];
  }

  const parsedRecords = entities.map((entity) =>
    parseTestimonialRecord(toEntityRecord(entity)),
  );

  if (parsedRecords.some((record) => record === null)) {
    return [];
  }

  const validRecords = parsedRecords.filter(
    (record): record is StrapiTestimonialRecord => record !== null,
  );

  return validRecords.map((record, index) =>
    mapStrapiTestimonialToUi(record, index),
  );
};

const mapStaffDirect = (
  entities: Array<StrapiEntity<StrapiStaffMemberRecord>>,
): TeamMember[] | null => {
  if (entities.length === 0) {
    return [];
  }

  const parsedRecords = entities.map((entity) =>
    parseStaffRecord(toEntityRecord(entity)),
  );

  if (parsedRecords.some((record) => record === null)) {
    return [];
  }

  const validRecords = parsedRecords.filter(
    (record): record is StrapiStaffMemberRecord => record !== null,
  );

  return validRecords.map((record) => mapStrapiStaffToUi(record));
};

/**
 * Fetch testimonials directly from Strapi without any fallback.
 * Returns empty array if Strapi is unavailable.
 */
export const fetchTestimonials = async (): Promise<TestimonialUiModel[]> => {
  const runtimeConfig = getValidatedRuntimeConfig("testimonials");

  if (!runtimeConfig) {
    console.warn("[strapi-content:testimonials] config unavailable, returning empty");
    return [];
  }

  const endpoint = resolveEndpointPath(
    TESTIMONIALS_ENDPOINT,
    runtimeConfig.apiPath,
  );
  if (!endpoint) {
    console.warn("[strapi-content:testimonials] invalid endpoint config");
    return [];
  }

  try {
    const entities = await fetchCollectionEntities<StrapiTestimonialRecord>(
      endpoint,
      CONTENT_TIMEOUT_MS,
    );

    const mapped = mapTestimonialsDirect(entities);
    return mapped ?? [];
  } catch (error) {
    const failure = classifyRequestFailure(error);
    console.warn(`[strapi-content:testimonials] fetch failed: ${toFailureReason("request", failure)}`);
    return [];
  }
};

/**
 * Fetch team members directly from Strapi without any fallback.
 * Returns empty array if Strapi is unavailable.
 */
export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const runtimeConfig = getValidatedRuntimeConfig("staff");

  if (!runtimeConfig) {
    console.warn("[strapi-content:staff] config unavailable, returning empty");
    return [];
  }

  const primaryEndpoint = resolveEndpointPath(
    STAFF_PRIMARY_ENDPOINT,
    runtimeConfig.apiPath,
  );
  const secondaryEndpoint = resolveEndpointPath(
    STAFF_SECONDARY_ENDPOINT,
    runtimeConfig.apiPath,
  );

  if (!primaryEndpoint || !secondaryEndpoint) {
    console.warn("[strapi-content:staff] invalid endpoint config");
    return [];
  }

  const startedAt = Date.now();

  // Try primary endpoint first
  try {
    const primaryEntities = await fetchCollectionEntities<StrapiStaffMemberRecord>(
      primaryEndpoint,
      STAFF_PRIMARY_TIMEOUT_MS,
    );

    const primaryMapped = mapStaffDirect(primaryEntities);
    if (primaryMapped) {
      return primaryMapped;
    }
  } catch (primaryError) {
    const primaryFailure = classifyRequestFailure(primaryError);

    // Only try secondary if primary returns 404
    if (primaryFailure.kind !== "http_404") {
      console.warn(`[strapi-content:staff] primary fetch failed: ${toFailureReason("primary", primaryFailure)}`);
      return [];
    }

    // Failover to secondary endpoint
    const elapsedMs = Date.now() - startedAt;
    const remainingBudgetMs = STAFF_TOTAL_TIMEOUT_MS - elapsedMs;
    if (remainingBudgetMs <= 0) {
      console.warn("[strapi-content:staff] failover budget exhausted");
      return [];
    }

    try {
      const secondaryEntities = await fetchCollectionEntities<StrapiStaffMemberRecord>(
        secondaryEndpoint,
        remainingBudgetMs,
      );

      const secondaryMapped = mapStaffDirect(secondaryEntities);
      return secondaryMapped ?? [];
    } catch (secondaryError) {
      const secondaryFailure = classifyRequestFailure(secondaryError);
      console.warn(`[strapi-content:staff] secondary fetch failed: ${toFailureReason("secondary", secondaryFailure)}`);
      return [];
    }
  }

  return [];
};
