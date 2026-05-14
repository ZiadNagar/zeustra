import { classifyStrapiError, strapiClient } from "@/lib/strapi/client";
import type {
  StrapiEntity,
  StrapiMeta,
  StrapiPositionDetailResult,
  StrapiPositionListResult,
  StrapiPositionRecord,
  StrapiPositionSectionRecord,
} from "@/lib/strapi/types";
import { isRecord, toEntityRecord } from "@/lib/strapi/utils";

type FetchPositionsOptions = {
  page?: number;
  pageSize?: number;
  activeOnly?: boolean;
  department?: string;
  employmentType?: string;
  jobType?: string;
  search?: string;
};

const POSITIONS_ENDPOINT = "positions";

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

  return value.trim() || null;
};

const readBoolean = (value: unknown): boolean | null => {
  if (typeof value === "boolean") {
    return value;
  }

  return null;
};

const readStringArray = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  const parsed = value
    .map((entry) => readString(entry))
    .filter((entry): entry is string => entry !== null);

  return parsed.length === value.length ? parsed : null;
};

const parseSectionRecord = (value: unknown): StrapiPositionSectionRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const heading = readString(value.heading);
  const items = readStringArray(value.items);

  if (!heading || items === null) {
    return null;
  }

  return { heading, items };
};

const readSections = (value: unknown): StrapiPositionSectionRecord[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  const parsed = value
    .map((entry) => parseSectionRecord(entry))
    .filter((entry): entry is StrapiPositionSectionRecord => entry !== null);

  return parsed.length === value.length ? parsed : null;
};

const parsePositionRecord = (value: unknown): StrapiPositionRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id) ?? readString(value.documentId);
  const title = readString(value.title);
  const subtitle = readString(value.subtitle);
  const slug = readString(value.slug);
  const compensation = readString(value.compensation);
  const employmentType = readString(value.employmentType);
  const jobType = readString(value.jobType);
  const department = readString(value.department);
  const isActive = readBoolean(value.isActive);
  const deadline = readOptionalString(value.deadline);
  const overview = readStringArray(value.overview);
  const sections = readSections(value.sections);

  if (
    !id ||
    !title ||
    !subtitle ||
    !slug ||
    !compensation ||
    !employmentType ||
    !jobType ||
    !department ||
    isActive === null ||
    overview === null ||
    sections === null
  ) {
    return null;
  }

  return {
    id,
    documentId: readOptionalString(value.documentId) ?? undefined,
    title,
    subtitle,
    slug,
    compensation,
    employmentType,
    jobType,
    department,
    isActive,
    deadline,
    overview,
    sections,
  };
};

const buildPositionsQuery = (
  options: FetchPositionsOptions,
): Record<string, string | number | boolean> => {
  const query: Record<string, string | number | boolean> = {};

  if (typeof options.page === "number" && options.page > 0) {
    query.page = options.page;
  }

  if (typeof options.pageSize === "number" && options.pageSize > 0) {
    query.pageSize = options.pageSize;
  }

  if (typeof options.activeOnly === "boolean") {
    query.activeOnly = options.activeOnly;
  }

  if (options.department?.trim()) {
    query.department = options.department.trim();
  }

  if (options.employmentType?.trim()) {
    query.employmentType = options.employmentType.trim();
  }

  if (options.jobType?.trim()) {
    query.jobType = options.jobType.trim();
  }

  if (options.search?.trim()) {
    query.search = options.search.trim();
  }

  return query;
};

const mapPositionEntities = (
  entities: Array<StrapiEntity<unknown>>,
): StrapiPositionRecord[] => {
  return entities
    .map((entity) => parsePositionRecord(toEntityRecord(entity)))
    .filter((entity): entity is StrapiPositionRecord => entity !== null);
};

export const fetchPositions = async (
  options: FetchPositionsOptions = {},
): Promise<StrapiPositionListResult> => {
  try {
    const query = buildPositionsQuery(options);
    const response = await strapiClient.fetchCollection<unknown>(
      POSITIONS_ENDPOINT,
      query,
    );

    const data = mapPositionEntities(response.data);
    const meta: StrapiMeta = isRecord(response.meta) ? response.meta : {};

    return { data, meta };
  } catch (error) {
    const normalizedError = classifyStrapiError(error);
    console.warn(
      `[strapi-careers] positions fetch failed: ${normalizedError.message}`,
    );
    return { data: [], meta: {} };
  }
};

export const fetchPositionBySlug = async (
  slug: string,
): Promise<StrapiPositionRecord | null> => {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  try {
    const response = await strapiClient.fetchSingleType<unknown>(
      `${POSITIONS_ENDPOINT}/${encodeURIComponent(normalizedSlug)}`,
    );

    const payload = isRecord(response) ? (response as StrapiPositionDetailResult) : null;
    if (!payload || !payload.data) {
      return null;
    }

    return parsePositionRecord(payload.data);
  } catch (error) {
    const normalizedError = classifyStrapiError(error);
    if (normalizedError.statusCode !== 404) {
      console.warn(
        `[strapi-careers] position detail fetch failed: ${normalizedError.message}`,
      );
    }
    return null;
  }
};

export type { FetchPositionsOptions };
