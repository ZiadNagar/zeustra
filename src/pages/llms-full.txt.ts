import type { APIRoute } from "astro";
import { publicEnv } from "@/utils/env";

const pageUrl = (path: string): string =>
  path === "/" ? `${publicEnv.siteOrigin}/` : `${publicEnv.siteOrigin}${path}/`;

export const GET: APIRoute = () =>
  new Response(
    `# Zeustra

> AI-powered commercial real estate advisory and marketplace combining proprietary data, AI powered intelligence, and transaction execution.

## About

Zeustra is a product-led commercial real estate advisory firm and marketplace. We combine proprietary data infrastructure, AI-powered transaction intelligence, and execution expertise across medical, office, industrial, retail, and multifamily properties to help owners and investors create more value at sale.

## Key pages

- [Home](${pageUrl("/")}): Data-to-value CRE positioning, capabilities overview, and how Zeustra serves the marketplace.
- [About](${pageUrl("/about")}): Mission, leadership, and innovation culture.
- [Services](${pageUrl("/services")}): Sales, acquisitions, leasing, finance, management, development, and digital transformation.
- [Products](${pageUrl("/products")}): AI, automation, digital twins, and platforms that support a single source of truth.
- [Marketplace](${pageUrl("/marketplace")}): Integrations and partner ecosystem extending Zeustra's data and workflow stack.
- [Blog](${pageUrl("/blog")}): Insights on commercial real estate, technology, and data-driven strategy.

## Core capabilities

1. **Seller Representation**: Data-driven pricing, buyer targeting, and competitive process design to maximize sale value across all major CRE property types.
2. **Buyer Representation**: Market intelligence, deal sourcing, and acquisition advisory powered by proprietary data and AI analytics.
3. **Leasing Advisory**: Strategic leasing solutions for medical, office, industrial, retail, and multifamily assets with market-driven positioning.
4. **Capital Markets**: Structured finance, investment sales, and capital advisory for complex CRE transactions.
5. **Asset & Property Management**: Operational optimization and value-add strategies for CRE portfolios.
6. **Digital Transformation**: AI, automation, and data platforms that modernize CRE workflows and decision-making.

## Who we serve

- **Property Owners**: Maximize value at sale through data-driven pricing, competitive processes, and qualified buyer targeting.
- **Investors**: Access deal flow, market intelligence, and acquisition advisory across medical, office, industrial, retail, and multifamily sectors.
- **Operators**: Leverage technology and data infrastructure to improve operational efficiency and portfolio performance.
- **Institutions**: Partner with a product-led advisory firm that combines CRE expertise with AI-powered intelligence.

## Property types

- **Medical/Healthcare**: Hospitals, medical office buildings, senior living, outpatient facilities
- **Office**: Class A/B/C office buildings, corporate campuses, co-working spaces
- **Industrial**: Warehouses, distribution centers, manufacturing facilities, flex space
- **Retail**: Shopping centers, strip malls, standalone retail, mixed-use developments
- **Multifamily**: Apartment complexes, student housing, senior housing, build-to-rent communities

## Contact

- **Website**: ${pageUrl("/")}
- **Email**: ${publicEnv.contactEmail}
- **LinkedIn**: ${publicEnv.linkedinUrl}
- **Twitter**: ${publicEnv.twitterUrl}
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
