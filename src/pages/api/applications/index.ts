import type { APIRoute } from "astro";
import { getServerEnv } from "@/utils/env";

const normalizeSegment = (value: string): string =>
  value.replace(/^\/+|\/+$/g, "");

const buildApplicationsEndpoint = (): string => {
  const env = getServerEnv();
  const baseUrl = env.strapiBaseUrl.replace(/\/+$/g, "");
  const apiPath = normalizeSegment(env.strapiApiPath);
  return `${baseUrl}/${apiPath}/applications`;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const env = getServerEnv();
    const endpoint = buildApplicationsEndpoint();

    const headers = new Headers();
    if (env.strapiApiToken.trim()) {
      headers.set("Authorization", `Bearer ${env.strapiApiToken.trim()}`);
    }

    const upstreamResponse = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers,
    });

    const responseBody = await upstreamResponse.text();
    const responseContentType =
      upstreamResponse.headers.get("content-type") ?? "application/json";

    return new Response(responseBody, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type": responseContentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to proxy career application submit", error);
    return new Response(
      JSON.stringify({
        error: {
          message: "Application service is temporarily unavailable.",
        },
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
};
