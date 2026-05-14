/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_ORIGIN?: string;
  readonly PUBLIC_CONTACT_ENDPOINT?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_CONTACT_PHONE?: string;
  readonly PUBLIC_LINKEDIN_URL?: string;
  readonly PUBLIC_TWITTER_URL?: string;
  readonly PUBLIC_ZOOM_SCHEDULER_URL?: string;
  readonly JOTFORM_API_BASE?: string;
  readonly JOTFORM_API_KEY?: string;
  readonly JOTFORM_FORM_ID?: string;
  readonly JOTFORM_FULL_NAME_QID?: string;
  readonly JOTFORM_EMAIL_QID?: string;
  readonly JOTFORM_MESSAGE_QID?: string;
  readonly STRAPI_BASE_URL?: string;
  readonly STRAPI_API_PATH?: string;
  readonly STRAPI_API_TOKEN?: string;
  readonly STRAPI_LOCALE?: string;
  readonly STRAPI_PREVIEW_TOKEN?: string;
  readonly STRAPI_TIMEOUT_MS?: string;
}
