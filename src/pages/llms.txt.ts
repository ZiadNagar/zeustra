import type { APIRoute } from "astro";
import { publicEnv } from "@/utils/env";

const pageUrl = (path: string): string =>
  path === "/" ? `${publicEnv.siteOrigin}/` : `${publicEnv.siteOrigin}${path}/`;

export const GET: APIRoute = () =>
  new Response(
    `# Zeustra

> Global commercial real estate advisor: data-to-value solutions, predictive analytics, SSOT, and AI for owners, investors, and institutions.

## Key pages

- [Home](${pageUrl("/")}): Data-to-value CRE positioning, capabilities overview, and how Zeustra serves the marketplace.
- [About](${pageUrl("/about")}): Mission, leadership, and innovation culture.
- [Services](${pageUrl("/services")}): Sales, acquisitions, leasing, finance, management, development, and digital transformation.
- [Products](${pageUrl("/products")}): AI, automation, digital twins, and platforms that support a single source of truth.
- [Marketplace](${pageUrl("/marketplace")}): Integrations and partner ecosystem extending Zeustra's data and workflow stack.
- [Blog](${pageUrl("/blog")}): Insights on commercial real estate, technology, and data-driven strategy.

## Contact

Canonical site: ${pageUrl("/")}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
