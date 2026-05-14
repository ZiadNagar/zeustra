import { getServerEnv } from "@/utils/env";
import type {
  StrapiCollectionResponse,
  StrapiQueryInput,
  StrapiQueryValue,
  StrapiQueryRecord,
  StrapiSingleResponse,
} from "@/lib/strapi/types";
import { isAbortLikeError, isNgrokHostName } from "@/lib/strapi/utils";

export class StrapiRequestError extends Error {
  statusCode: number | null;
  reason: "timeout" | "network" | "http";
  endpoint: string;
  details: string;

  constructor({
    endpoint,
    statusCode,
    reason,
    message,
    details = "",
  }: {
    endpoint: string;
    statusCode: number | null;
    reason: "timeout" | "network" | "http";
    message: string;
    details?: string;
  }) {
    super(message);
    this.name = "StrapiRequestError";
    this.endpoint = endpoint;
    this.statusCode = statusCode;
    this.reason = reason;
    this.details = details;
  }
}

const appendQueryValue = (
  params: URLSearchParams,
  key: string,
  value: StrapiQueryValue,
): void => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      appendQueryValue(params, `${key}[${index}]`, entry);
    });
    return;
  }

  if (typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendQueryValue(params, `${key}[${childKey}]`, childValue);
    });
    return;
  }

  params.set(key, String(value));
};

const toQueryString = (query?: StrapiQueryInput): string => {
  if (!query) {
    return "";
  }

  if (typeof query === "string") {
    return query.startsWith("?") ? query.slice(1) : query;
  }

  if (query instanceof URLSearchParams) {
    return query.toString();
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    appendQueryValue(params, key, value);
  });

  return params.toString();
};

const normalizeSegment = (value: string): string =>
  value.replace(/^\/+|\/+$/g, "");

const isNgrokHost = (baseUrl: string): boolean => {
  try {
    const hostname = new URL(baseUrl).hostname.toLowerCase();
    return isNgrokHostName(hostname);
  } catch {
    return false;
  }
};

const joinUrl = (
  baseUrl: string,
  apiPath: string,
  endpoint: string,
): string => {
  const base = baseUrl.replace(/\/+$/g, "");
  const api = normalizeSegment(apiPath);
  const path = normalizeSegment(endpoint);

  return `${base}/${api}/${path}`;
};

const getStrapiRuntimeConfig = () => {
  const env = getServerEnv();

  if (!env.strapiBaseUrl) {
    throw new Error("Missing STRAPI_BASE_URL environment variable.");
  }

  const parsedTimeout = Number.parseInt(env.strapiTimeoutMs, 10);
  const timeoutMs =
    Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 10000;

  return {
    baseUrl: env.strapiBaseUrl,
    apiPath: env.strapiApiPath,
    apiToken: env.strapiApiToken,
    locale: env.strapiLocale,
    timeoutMs,
  };
};

const strapiFetch = async <T>(
  endpoint: string,
  query?: StrapiQueryInput,
  init?: RequestInit,
): Promise<T> => {
  const config = getStrapiRuntimeConfig();
  const queryString = toQueryString(query);
  const url = queryString
    ? `${joinUrl(config.baseUrl, config.apiPath, endpoint)}?${queryString}`
    : joinUrl(config.baseUrl, config.apiPath, endpoint);

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), config.timeoutMs);

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  headers.set("Cache-Control", "no-cache");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (config.apiToken) {
    headers.set("Authorization", `Bearer ${config.apiToken}`);
  }

  // Free ngrok tunnels return a warning page unless this header is present.
  if (isNgrokHost(config.baseUrl)) {
    headers.set("ngrok-skip-browser-warning", "true");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      cache: "no-store",
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (isAbortLikeError(error)) {
      throw new StrapiRequestError({
        endpoint,
        statusCode: null,
        reason: "timeout",
        message: `Strapi request timed out for ${endpoint}`,
      });
    }

    throw new StrapiRequestError({
      endpoint,
      statusCode: null,
      reason: "network",
      message: `Strapi request failed for ${endpoint}`,
      details: error instanceof Error ? error.message : "",
    });
  } finally {
    clearTimeout(timeoutHandle);
  }

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new StrapiRequestError({
      endpoint,
      statusCode: response.status,
      reason: "http",
      details,
      message: `Strapi request failed (${response.status} ${response.statusText}) for ${endpoint}`,
    });
  }

  return (await response.json()) as T;
};

const withLocale = (
  query: StrapiQueryInput | undefined,
  locale: string,
): StrapiQueryInput => {
  if (!query) {
    return { locale };
  }

  if (typeof query === "string") {
    const normalized = query.startsWith("?") ? query.slice(1) : query;
    return normalized
      ? `${normalized}&locale=${encodeURIComponent(locale)}`
      : `locale=${encodeURIComponent(locale)}`;
  }

  if (query instanceof URLSearchParams) {
    const params = new URLSearchParams(query);
    if (!params.has("locale")) {
      params.set("locale", locale);
    }
    return params;
  }

  return {
    locale,
    ...query,
  } as StrapiQueryRecord;
};

export const strapiClient = {
  async fetchCollection<T>(
    contentType: string,
    query?: StrapiQueryInput,
  ): Promise<StrapiCollectionResponse<T>> {
    const { locale } = getStrapiRuntimeConfig();
    return strapiFetch<StrapiCollectionResponse<T>>(
      contentType,
      withLocale(query, locale),
    );
  },

  async fetchSingleType<T>(
    singleType: string,
    query?: StrapiQueryInput,
  ): Promise<StrapiSingleResponse<T>> {
    const { locale } = getStrapiRuntimeConfig();
    return strapiFetch<StrapiSingleResponse<T>>(
      singleType,
      withLocale(query, locale),
    );
  },

  async fetchBySlug<T>(
    contentType: string,
    slug: string,
    query?: StrapiQueryInput,
  ): Promise<StrapiCollectionResponse<T>> {
    const { locale } = getStrapiRuntimeConfig();

    const params = new URLSearchParams();
    const queryString = toQueryString(withLocale(query, locale));

    if (queryString) {
      const existing = new URLSearchParams(queryString);
      existing.forEach((value, key) => params.set(key, value));
    }

    params.set("filters[slug][$eq]", slug);

    return strapiFetch<StrapiCollectionResponse<T>>(contentType, params);
  },
};

export const classifyStrapiError = (error: unknown): StrapiRequestError => {
  if (error instanceof StrapiRequestError) {
    return error;
  }

  if (isAbortLikeError(error)) {
    return new StrapiRequestError({
      endpoint: "unknown",
      statusCode: null,
      reason: "timeout",
      message: "Strapi request timed out.",
    });
  }

  if (error instanceof Error) {
    return new StrapiRequestError({
      endpoint: "unknown",
      statusCode: null,
      reason: "network",
      message: error.message,
    });
  }

  return new StrapiRequestError({
    endpoint: "unknown",
    statusCode: null,
    reason: "network",
    message: "Unknown Strapi request failure.",
  });
};
