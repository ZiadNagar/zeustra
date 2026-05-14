import type { StrapiEntity } from "@/lib/strapi/types";

const NGROK_HOST_SUFFIXES = [
  "ngrok-free.dev",
  "ngrok-free.app",
  "ngrok.app",
  "ngrok.io",
];

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const toEntityRecord = <T extends Record<string, unknown>>(
  entity: StrapiEntity<T> | unknown,
): Record<string, unknown> => {
  if (!isRecord(entity)) {
    return {};
  }

  return entity;
};

export const normalizeStrapiId = (value: unknown): string | null => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized || null;
  }

  return null;
};

export const isAbortLikeError = (error: unknown): boolean => {
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }

  return error instanceof Error && error.name === "AbortError";
};

export const isNgrokHostName = (hostName: string): boolean =>
  NGROK_HOST_SUFFIXES.some(
    (suffix) => hostName === suffix || hostName.endsWith(`.${suffix}`),
  );

export const isNgrokUrl = (value: string): boolean => {
  try {
    const hostName = new URL(value).hostname.toLowerCase();
    return isNgrokHostName(hostName);
  } catch {
    return false;
  }
};
