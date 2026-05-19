const DEFAULT_CONTACT_ENDPOINT = "/send-mail.php";
const DEFAULT_SITE_ORIGIN = "https://zeustra.osloop.com";
const DEFAULT_LINKEDIN_URL = "https://linkedin.com/company/zeustra";
const DEFAULT_TWITTER_URL = "https://twitter.com/zeustra";
const DEFAULT_ZOOM_SCHEDULER_URL =
  "https://scheduler.zoom.us/zeustra/zeustra-intro-call";
const DEFAULT_STRAPI_BASE_URL = "https://strapi-admin-production-469f.up.railway.app";
const DEFAULT_STRAPI_API_PATH = "/api";
const DEFAULT_STRAPI_LOCALE = "en";
const DEFAULT_STRAPI_TIMEOUT_MS = "10000";

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/g, "");

export const publicEnv = {
  siteOrigin: trimTrailingSlash(
    import.meta.env.PUBLIC_SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN,
  ),
  contactEndpoint:
    import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? DEFAULT_CONTACT_ENDPOINT,
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL ?? "",
  contactPhone: import.meta.env.PUBLIC_CONTACT_PHONE ?? "",
  linkedinUrl: import.meta.env.PUBLIC_LINKEDIN_URL ?? DEFAULT_LINKEDIN_URL,
  twitterUrl: import.meta.env.PUBLIC_TWITTER_URL ?? DEFAULT_TWITTER_URL,
  zoomSchedulerUrl:
    import.meta.env.PUBLIC_ZOOM_SCHEDULER_URL ?? DEFAULT_ZOOM_SCHEDULER_URL,
};

export function getServerEnv() {
  return {
    jotformApiBase: import.meta.env.JOTFORM_API_BASE ?? "",
    jotformApiKey: import.meta.env.JOTFORM_API_KEY ?? "",
    jotformFormId: import.meta.env.JOTFORM_FORM_ID ?? "",
    jotformFullNameQid: import.meta.env.JOTFORM_FULL_NAME_QID ?? "",
    jotformEmailQid: import.meta.env.JOTFORM_EMAIL_QID ?? "",
    jotformMessageQid: import.meta.env.JOTFORM_MESSAGE_QID ?? "",
    strapiBaseUrl: trimTrailingSlash(
      import.meta.env.STRAPI_BASE_URL ?? DEFAULT_STRAPI_BASE_URL,
    ),
    strapiApiPath: import.meta.env.STRAPI_API_PATH ?? DEFAULT_STRAPI_API_PATH,
    strapiApiToken: import.meta.env.STRAPI_API_TOKEN ?? "",
    strapiLocale: import.meta.env.STRAPI_LOCALE ?? DEFAULT_STRAPI_LOCALE,
    strapiPreviewToken: import.meta.env.STRAPI_PREVIEW_TOKEN ?? "",
    strapiTimeoutMs:
      import.meta.env.STRAPI_TIMEOUT_MS ?? DEFAULT_STRAPI_TIMEOUT_MS,
  };
}
