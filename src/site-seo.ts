/**
 * site-seo.ts — Single source of truth for all SEO configuration.
 *
 * Consumed by:
 *   1. src/seo/config.ts (runtime per-route SEO)
 */

import { publicEnv } from "@/utils/env";

// ─── Site Identity ───────────────────────────────────────────────────────────

export const SITE_ORIGIN = publicEnv.siteOrigin;
export const SITE_NAME = "Zeustra";
export const SITE_SHORT_NAME = "Zeustra";
export const ORG_SLOGAN =
  "AI-powered commercial real estate advisory and marketplace";
export const SITE_LANGUAGE = "en";
export const SITE_AUTHOR = "Zeustra";

// ─── Open Graph / Social Images ──────────────────────────────────────────────

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/zeustra-imgcontent.png`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const SITE_LOGO_URL = `${SITE_ORIGIN}/zeustra-icon.png`;

// ─── Keywords ────────────────────────────────────────────────────────────────

export const SITE_KEYWORDS = [
  "commercial real estate",
  "CRE advisory",
  "real estate marketplace",
  "AI powered real estate",
  "Zeustra",
];

// ─── Geo / Local SEO ────────────────────────────────────────────────────────

export const GEO_REGION = "US";
export const GEO_PLACENAME = "";
export const GEO_POSITION = "";

// ─── Social Profiles (for JSON-LD sameAs) ───────────────────────────────────

export const SOCIAL_PROFILES = [
  { platform: "LinkedIn", url: publicEnv.linkedinUrl },
];

// ─── Contact Information ────────────────────────────────────────────────────

export const CONTACT_PHONE = publicEnv.contactPhone;
export const CONTACT_EMAIL = publicEnv.contactEmail;

// ─── Site Verification ──────────────────────────────────────────────────────

export const VERIFICATION_GOOGLE = "";
export const VERIFICATION_BING = "";
export const VERIFICATION_PINTEREST = "";

// ─── Sitelinks Searchbox ────────────────────────────────────────────────────

export const SEARCH_ACTION_URL = null;

// ─── Per-Route SEO (derived from PAGE_SEO) ──────────────────────────────────

export const ROUTE_SEO = {
  "/": {
    title:
      "Zeustra | AI Powered Commercial Real Estate Advisory and Marketplace",
    description:
      "Zeustra is a product led commercial real estate advisory firm and marketplace combining proprietary data, AI powered intelligence, and transaction execution across medical, office, industrial, retail, and multifamily properties to help owners and investors create more value at sale.",
    keywords: [
      "commercial real estate advisory",
      "commercial real estate marketplace",
      "medical real estate",
      "office real estate",
      "industrial real estate",
      "retail real estate",
      "multifamily real estate",
      "AI powered real estate",
      "seller representation",
      "real estate intelligence",
    ],
    breadcrumb: "Home",
  },
  "/about": {
    title: "About Zeustra | Product Led Commercial Real Estate Advisory",
    description:
      "Zeustra combines commercial real estate expertise with proprietary data infrastructure and AI powered transaction intelligence across healthcare, office, industrial, retail, and multifamily assets to modernize advisory and execution.",
    keywords: [
      "commercial real estate advisory firm",
      "medical real estate experts",
      "office real estate advisory",
      "industrial real estate advisory",
      "retail real estate advisory",
      "multifamily advisory",
      "product led brokerage",
      "real estate technology company",
      "healthcare real estate expertise",
    ],
    breadcrumb: "About",
  },
  "/services": {
    title:
      "Commercial Real Estate Services | Sales, Leasing, Capital Markets, Advisory",
    description:
      "Zeustra provides commercial real estate services including seller representation, buyer representation, leasing, capital markets, consulting, asset management, and business sales across medical, office, industrial, retail, and multifamily properties.",
    keywords: [
      "commercial real estate services",
      "medical property sales",
      "office leasing",
      "industrial real estate sales",
      "retail property advisory",
      "multifamily investment sales",
      "seller representation",
      "capital markets real estate",
    ],
    breadcrumb: "Services",
  },
  "/products": {
    title: "Real Estate AI, Data, and Automation Products | Zeustra",
    description:
      "Zeustra's product ecosystem delivers AI powered intelligence, data infrastructure, and automation for commercial real estate across healthcare, office, industrial, retail, and multifamily sectors to improve execution and value creation.",
    keywords: [
      "real estate AI",
      "commercial real estate technology",
      "real estate automation",
      "medical real estate analytics",
      "office real estate data",
      "industrial real estate analytics",
      "retail analytics",
      "multifamily analytics",
    ],
    breadcrumb: "Products",
  },
  "/marketplace": {
    title: "Commercial Real Estate Transaction Marketplace | Zeustra",
    description:
      "Zeustra's marketplace connects owners, operators, and investors across medical, office, industrial, retail, and multifamily properties through data driven buyer targeting, competitive processes, and execution tools designed to increase value.",
    keywords: [
      "commercial real estate marketplace",
      "medical real estate marketplace",
      "office real estate buyers",
      "industrial real estate investors",
      "retail property marketplace",
      "multifamily buyers",
      "transaction marketplace",
      "deal execution platform",
    ],
    breadcrumb: "Marketplace",
  },
  "/blog": {
    title: "Commercial Real Estate Insights | Zeustra",
    description:
      "Insights on commercial real estate across medical, office, industrial, retail, and multifamily sectors including AI, transaction strategy, pricing, and market intelligence.",
    keywords: [
      "commercial real estate insights",
      "medical real estate",
      "office real estate trends",
      "industrial real estate trends",
      "retail real estate insights",
      "multifamily trends",
      "real estate AI",
      "market intelligence",
    ],
    breadcrumb: "Blog",
  },
};

// ─── Derived Home Values ────────────────────────────────────────────────────

export const HOME_TITLE = ROUTE_SEO["/"].title;
export const HOME_DESCRIPTION = ROUTE_SEO["/"].description;
export const HOME_KEYWORDS = ROUTE_SEO["/"].keywords ?? SITE_KEYWORDS;

// ─── Sitemap Entries ────────────────────────────────────────────────────────

export const SITEMAP_ENTRIES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/products", changefreq: "monthly", priority: "0.8" },
  { path: "/marketplace", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export function pageLoc(path: string): string {
  if (path === "/") return `${SITE_ORIGIN}/`;
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  return `${SITE_ORIGIN}${normalizedPath}`;
}
