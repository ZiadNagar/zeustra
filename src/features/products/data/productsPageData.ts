export const HERO_CONTENT = {
  heading: "Product-Led Real Estate",
  subtitle:
    "A complete transaction platform powered by intelligent automation. Zero-Cost SaaS: software is free when you transact with Zeustra",
  ctaPrimary: "Talk To Us",
  ctaSecondary: "Schedule Demo",
};
export const PRODUCTS_TECH_STACK_DATA = {
  title: "The Zeustra System Architecture",
  subtitle:
    "A connected operating system where data, intelligence, execution, and marketplace activity operate as one.",
  highlightWord: "Architecture",
  sections: {
    artificialIntelligence: {
      id: "artificial-intelligence",
      title: "Artificial Intelligence",
      color: "#8E58E6",
      icon: "/assets/icons/home/diagram-ai-icon.svg",
      position: { top: "5%", left: "50%", transform: "translate(-50%, -50%)" },
      tags: [
        { label: "Copilot", color: "#8E58E6" },
        { label: "AI Agents", color: "#8E58E6" },
        { label: "Language Models", color: "#8E58E6" },
        { label: "Generative", color: "#8E58E6" },
        { label: "Predictive", color: "#8E58E6" },
        { label: "Smart Search", color: "#8E58E6" },
        { label: "Recommendations", color: "#8E58E6" },
      ],
    },
    workspaces: {
      id: "workspaces",
      title: "Workspaces",
      color: "#70EDAE",
      icon: "/assets/icons/home/diagram-workspaces-icon.svg",
      position: { top: "50%", left: "2%", transform: "translate(-50%, -50%)" },
      tags: [
        { label: "CRM", color: "#70EDAE" },
        { label: "Deals", color: "#70EDAE" },
        { label: "Messaging", color: "#70EDAE" },
        { label: "Pipelines", color: "#70EDAE" },
        { label: "Prospecting", color: "#70EDAE" },
        { label: "Advertising", color: "#70EDAE" },
        { label: "Social", color: "#70EDAE" },
      ],
    },
    marketplace: {
      id: "marketplace",
      title: "Marketplace",
      color: "#FFD85C",
      icon: "/assets/icons/home/diagram-marketplaces-icon.svg",
      position: { top: "50%", right: "2%", transform: "translate(50%, -50%)" },
      tags: [
        { label: "Buying", color: "#FFD85C" },
        { label: "Selling", color: "#FFD85C" },
        { label: "Leasing", color: "#FFD85C" },
        { label: "Financing", color: "#FFD85C" },
        { label: "Properties", color: "#FFD85C" },
        { label: "Products", color: "#FFD85C" },
        { label: "Services", color: "#FFD85C" },
      ],
    },
    data: {
      id: "data",
      title: "Data",
      color: "#50CEFA",
      icon: "/assets/icons/home/diagram-data-icon.svg",
      position: {
        bottom: "5%",
        left: "50%",
        transform: "translate(-50%, 50%)",
      },
      tags: [
        { label: "Serverless", color: "#50CEFA" },
        { label: "Secure", color: "#50CEFA" },
        { label: "Governance", color: "#50CEFA" },
        { label: "Enrichment", color: "#50CEFA" },
        { label: "Analytics", color: "#50CEFA" },
        { label: "Scalable", color: "#50CEFA" },
        { label: "Unified", color: "#50CEFA" },
      ],
    },
  },
};

export const PRODUCT_LAYERS = [
  {
    id: "unified-data",
    title: "Unified Data Platform",
    subheading: "The intelligence foundation behind every transaction.",
    description:
      "Zeustra aggregates property, ownership, market, and behavioral data into a unified model designed  specifically for commercial real estate. By combining  proprietary datasets with client data, the platform  reveals ownership signals, buyer demand patterns,  and emerging opportunities that traditional brokerage workflows cannot detect.",
    icon: "/assets/icons/products/products-icon-01.svg",
    image: "/assets/images/products/products-card-01.webp",
    color: "#4DB5FF",
  },
  {
    id: "copilot",
    title: "Copilot",
    subheading: "Artificial intelligence embedded across the platform.",
    description:
      "Zeustra Copilot is the AI intelligence layer that powers recommendations, automation, and decision support across every Zeustra product. Acting as a large  language model router, Copilot interprets system  data and market signals to assist with prospecting,  asset positioning, buyer identification, and strategic decision-making throughout the transaction lifecycle.",
    icon: "/assets/icons/products/products-icon-02.svg",
    image: "/assets/images/products/products-card-02.webp",
    color: "#22D3EE",
  },
  {
    id: "marketplace",
    title: "Marketplace",
    subheading: "A governed marketplace designed to create competition.",
    description:
      "Zeustra connects qualified buyers, investors, and capital sources through a structured marketplace where assets are matched with the most relevant capital pools. By activating targeted buyer networks and real-time demand signals, the marketplace helps generate stronger competition and maximize transaction outcomes.",
    icon: "/assets/icons/products/products-icon-03.svg",
    image: "/assets/images/products/products-card-03.webp",
    color: "#A78BFA",
  },
  {
    id: "advertisement",
    title: "Advertisement",
    subheading: "Precision marketing powered by audience intelligence.",
    description:
      "Zeustra Advertisement enables owners, tenants, lenders,and vendors to target specific audiences directly from the platform using advanced audience matching technology. Campaigns can be launched across digital channels with defined budgets, audience parameters, and analytics to measure engagement and performance.",
    icon: "/assets/icons/products/products-icon-04.svg",
    image: "/assets/images/products/products-card-04.webp",
    color: "#F472B6",
  },
  {
    id: "connect",
    title: "Connect",
    subheading: "Structured workflows designed to accelerate transactions.",
    description:
      "Zeustra Connect is an AI-powered communication platform where conversations are anchored directly to system data and objects such as properties, companies, contacts, and transactions. This ensures discussions, documents, and decisions remain organized and connected to the underlying deal.",
    icon: "/assets/icons/products/products-icon-05.svg",
    image: "/assets/images/products/products-card-05.webp",
    color: "#34D399",
  },
  {
    id: "stream",
    title: "Stream",
    subheading: "AI-driven property valuation using comparable sales.",
    description:
      "Zeustra Media Studio uses generative media technology to instantly create property visuals, videos, and marketing materials tailored to each opportunity. This enables assets to be presented quickly and professionally across investor and marketplace channels.",
    icon: "/assets/icons/products/products-icon-06.svg",
    image: "/assets/images/products/products-card-06.webp",
    color: "#FBBF24",
  },
  {
    id: "media-studio",
    title: "Media Studio",
    subheading: "Streamlined lease management from proposal to renewal.",
    description:
      "Zeustra organizes transactions within a governed execution framework that coordinates advisors, investors, lenders, attorneys, and stakeholders across the lifecycle of a deal. This structure increases transparency, reduces friction, and helps move transactions efficiently toward closing.",
    icon: "/assets/icons/products/products-icon-07.svg",
    image: "/assets/images/products/products-card-07.webp",
    color: "#FB923C",
  },
  {
    id: "execution-engine",
    title: "Execution Engine",
    subheading:
      "Integrated financing solutions with real-time rate comparisons.",
    description:
      "Zeustra organizes transactions within a governed execution framework that coordinates advisors, investors, lenders, attorneys, and stakeholders across the lifecycle of a deal. This structure increases transparency, reduces friction, and helps move transactions efficiently toward closing. summarization, and structured artifact generation directly within workflows.",
    icon: "/assets/icons/products/products-icon-08.svg",
    image: "/assets/images/products/products-card-08.webp",
    color: "#60A5FA",
  },
  {
    id: "payments-banking",
    title: "Payments & Banking",
    subheading: "Comprehensive dashboards with actionable insights.",
    description:
      "Zeustra provides an integrated payment and banking layer designed to automate financial activity related to real estate transactions. From commissions and advisory fees to investor payments, the platform simplifies and secures financial workflows.",
    icon: "/assets/icons/products/products-icon-09.svg",
    image: "/assets/images/products/products-card-09.webp",
    color: "#C084FC",
  },
  {
    id: "security-permissions",
    title: "Security & Permissions",
    subheading: "Seamless connectivity with 200+ industry tools.",
    description:
      "Zeustra protects client data through granular permissions, role-based visibility, and controlled access across the platform. Owners, investors, advisors, and marketplace participants can collaborate and transact confidently within a secure and governed environment.",
    icon: "/assets/icons/products/products-icon-10.svg",
    image: "/assets/images/products/products-card-10.webp",
    color: "#2DD4BF",
  },
];

export const ProductsFlowCarouselData = [
  {
    id: 1,
    title: "Data Platform",
    description:
      "Organizes market intelligence into structured, actionable layers.",
    icon: "/assets/icons/products/products-icon-01.svg",
  },
  {
    id: 2,
    title: "Copilot",
    description:
      "Interprets data and guides strategy with contextual reasoning.",
    icon: "/assets/icons/products/products-icon-02.svg",
  },
  {
    id: 3,
    title: "Marketplace",
    description:
      "Connects assets with capital through governed access and discovery.",
    icon: "/assets/icons/products/products-icon-03.svg",
  },
  {
    id: 4,
    title: "Advertisement",
    description:
      "Activates targeted market outreach across qualified audiences.",
    icon: "/assets/icons/products/products-icon-04.svg",
  },
  {
    id: 5,
    title: "Transaction Management",
    description:
      "Coordinates stakeholders through every phase of the deal lifecycle.",
    icon: "/assets/icons/products/products-icon-05.svg",
  },
  {
    id: 6,
    title: "Valuation",
    description:
      "AI-driven property valuation using comparable sales and market trends.",
    icon: "/assets/icons/products/products-icon-06.svg",
  },
  {
    id: 7,
    title: "Leasing",
    description: "Streamlined lease management from proposal through renewal.",
    icon: "/assets/icons/products/products-icon-07.svg",
  },
  {
    id: 8,
    title: "Financing",
    description:
      "Integrated financing solutions with real-time rate comparisons.",
    icon: "/assets/icons/products/products-icon-08.svg",
  },
  {
    id: 9,
    title: "Analytics",
    description:
      "Predictive market intelligence and real-time dashboards for decisions.",
    icon: "/assets/icons/products/products-icon-09.svg",
  },
  {
    id: 10,
    title: "Integration",
    description:
      "Open API ecosystem for seamless connectivity across your tech stack.",
    icon: "/assets/icons/products/products-icon-10.svg",
  },
];

export const ProductsGridData = [
  {
    id: 1,
    icon: "/assets/icons/products/products-icon-01.svg",
    heading: "Unified Data Foundation",
    paragraph:
      "A unified data foundation that connects the assets, relationships, and context driving every transaction.",
    image: "/assets/images/products/products-value-prop-card-01.webp",
    stat: { value: "100%", label: "Data Unity" },
  },
  {
    id: 2,
    icon: "/assets/icons/products/products-icon-04.svg",
    heading: "Governed Execution",
    paragraph:
      "A governed execution framework for milestones, responsibilities, documentation, and coordinated progress.",
    image: "/assets/images/products/products-value-prop-card-02.webp",
    stat: { value: "360°", label: "Oversight" },
  },
  {
    id: 3,
    icon: "/assets/icons/products/products-icon-07.svg",
    heading: "Embedded Intelligence",
    paragraph:
      "Embedded intelligence and automation applied where it strengthens performance, with clear human oversight.",
    image: "/assets/images/products/products-value-prop-card-03.webp",
    stat: { value: "10x", label: "Acceleration" },
  },
  {
    id: 4,
    icon: "/assets/icons/products/products-icon-11.svg",
    heading: "Scalable Infrastructure",
    paragraph:
      "A scalable transaction infrastructure that supports a single workflow or the full lifecycle with structural consistency.",
    image: "/assets/images/products/products-value-prop-card-04.webp",
    stat: { value: "1", label: "Platform" },
  },
];
