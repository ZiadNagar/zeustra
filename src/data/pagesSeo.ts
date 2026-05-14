export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  robots?: string;
}

export const PAGE_SEO: Record<string, PageSeo> = {
  home: {
    title: "Zeustra | AI Powered Commercial Real Estate Advisory and Marketplace",
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
    path: "/",
  },
  about: {
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
    path: "/about",
  },
  services: {
    title: "Commercial Real Estate Services | Sales, Leasing, Capital Markets, Advisory",
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
    path: "/services",
  },
  products: {
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
    path: "/products",
  },
  marketplace: {
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
    path: "/marketplace",
  },
  blog: {
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
    path: "/blog",
  },
  careers: {
    title: "Careers at Zeustra | Open Positions",
    description:
      "Explore open positions at Zeustra and apply to join our team building AI-powered commercial real estate intelligence and transaction infrastructure.",
    keywords: [
      "Zeustra careers",
      "commercial real estate jobs",
      "AI real estate jobs",
      "real estate technology careers",
      "open positions Zeustra",
      "product led brokerage careers",
    ],
    path: "/careers",
  },
  notFound: {
    title: "Page Not Found | Zeustra",
    description:
      "The page you requested could not be found. Explore Zeustra's commercial real estate advisory services, marketplace, and platform across all major property types.",
    keywords: ["Zeustra", "commercial real estate", "real estate advisory"],
    path: "/404",
    robots: "noindex,nofollow",
  },
};