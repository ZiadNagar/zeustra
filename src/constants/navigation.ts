import { publicEnv } from "@/utils/env";

export type NavigationItem = {
  label: string;
  href: string;
  hasDropdown: boolean;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSocialLink = FooterLink & {
  icon: string;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    hasDropdown: false,
  },
  {
    label: "Services",
    href: "/services/",
    hasDropdown: false,
  },
  {
    label: "Products",
    href: "/products/",
    hasDropdown: false,
  },
  {
    label: "Marketplace",
    href: "/marketplace/",
    hasDropdown: false,
  },
  {
    label: "Blog",
    href: "/blog/",
    hasDropdown: false,
  },
  {
    label: "About Us",
    href: "/about/",
    hasDropdown: false,
  },
];

/**
 * Footer link configuration
 */
export const FOOTER_LINKS: {
  company: FooterLink[];
  social: FooterSocialLink[];
} = {
  company: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
    // { label: "Blog", href: "/blog/" },
    { label: "Careers", href: "/careers/" },
    { label: "Contact Sales", href: "/contact/" },
    { label: "Partners", href: "/partners/" },
    { label: "Security", href: "/security/" },
  ],
  social: [
    {
      label: "LinkedIn",
      href: publicEnv.linkedinUrl,
      icon: "Linkedin",
    },
  ],
};
