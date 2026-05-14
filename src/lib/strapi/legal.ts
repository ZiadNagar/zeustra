import { strapiClient } from "@/lib/strapi/client";
import { renderTiptapToHtml, isTiptapDocument } from "@/lib/tiptap";
import type { TiptapDocument } from "@/lib/strapi/blog";

type LegalHeader = {
  id: number;
  effectiveDate: string;
  intro: string | null;
};

export type LegalContent = {
  id: string;
  header: LegalHeader;
  content: string | TiptapDocument | null;
};

export type LegalPageData = {
  id: string;
  htmlContent: string | null;
  effectiveDate: string | null;
  intro: string | null;
  isEmpty: boolean;
  error: string | null;
};

function normalizeContent(
  content: string | TiptapDocument | null,
): string | null {
  if (content === null || content === undefined) {
    return null;
  }

  if (typeof content === "string") {
    return content.trim() || null;
  }

  if (isTiptapDocument(content)) {
    const html = renderTiptapToHtml(content);
    return html.trim() || null;
  }

  return null;
}

export async function fetchTermsAndConditions(): Promise<LegalPageData> {
  try {
    const response = await strapiClient.fetchSingleType<LegalContent>(
      "terms-and-condition",
    );

    if (!response.data) {
      return {
        id: "",
        htmlContent: null,
        effectiveDate: null,
        intro: null,
        isEmpty: true,
        error: null,
      };
    }

    const htmlContent = normalizeContent(response.data.content);

    return {
      id: response.data.id,
      htmlContent,
      effectiveDate: response.data.header.effectiveDate,
      intro: response.data.header.intro,
      isEmpty: !htmlContent,
      error: null,
    };
  } catch (error) {
    console.error("[legal] Failed to fetch terms and conditions:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load content";
    return {
      id: "",
      htmlContent: null,
      effectiveDate: null,
      intro: null,
      isEmpty: true,
      error: errorMessage,
    };
  }
}

export async function fetchPrivacyPolicy(): Promise<LegalPageData> {
  try {
    const response =
      await strapiClient.fetchSingleType<LegalContent>("privacy-policy");

    if (!response.data) {
      return {
        id: "",
        htmlContent: null,
        effectiveDate: null,
        intro: null,
        isEmpty: true,
        error: null,
      };
    }

    const htmlContent = normalizeContent(response.data.content);

    return {
      id: response.data.id,
      htmlContent,
      effectiveDate: response.data.header.effectiveDate,
      intro: response.data.header.intro,
      isEmpty: !htmlContent,
      error: null,
    };
  } catch (error) {
    console.error("[legal] Failed to fetch privacy policy:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load content";
    return {
      id: "",
      htmlContent: null,
      effectiveDate: null,
      intro: null,
      isEmpty: true,
      error: errorMessage,
    };
  }
}
