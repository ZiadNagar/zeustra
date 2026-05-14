import { publicEnv } from "@/utils/env";

export type InfoCard = {
  title: string;
  icon: string;
  description: string;
};

export type TeamMember = {
  name: string;
  title: string;
  image: string;
  email: string;
  phone?: string;
  linkedin?: string;
  bio: string;
};

export type SocialChannel = {
  name: string;
  description: string;
  cta: string;
  href: string;
  icon: string;
  borderTone: string;
};

export const infoCards: InfoCard[] = [
  {
    title: "Our Mission",
    icon: "/assets/icons/about/mission-icon.svg",
    description:
      "To replace the traditional brokerage model and its dependence on third-party data platforms and marketplaces with proprietary, product-led transactional infrastructure that generates more value at the point of sale than the cost of our service while optimizing outcomes across the entire asset lifecycle.",
  },
  {
    title: "Our Value",
    icon: "/assets/icons/about/value-icon.svg",
    description:
      "We transform a standard brokerage fee into enterprise value by delivering a proprietary platform and marketplace, at no additional cost, that unifies real estate intelligence, increases pricing power, and delivers more value at sale than the cost of our service.",
  },
];

export const socialChannels: SocialChannel[] = [
  {
    name: "LinkedIn",
    description: "Network and discover opportunities.",
    cta: "Follow and learn",
    href: publicEnv.linkedinUrl,
    icon: "/assets/icons/social/linkedin-card-icon.svg",
    borderTone: "border-brand-blue-light/80",
  },
];
