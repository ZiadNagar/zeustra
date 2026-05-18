import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Circle, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ContactModal from "@/components/shared/ContactModal";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { openScheduler } from "@/contexts/schedulerModalGlobals";

type HeaderSubItem = {
  href: string;
  label: string;
  description?: string;
  icon?: string;
  iconType?: string;
};

type HeaderNavItem = {
  label: string;
  href: string;
  hasDropdown: boolean;
  subItems?: HeaderSubItem[];
};

type HeaderInteractiveIslandProps = {
  currentPathname?: string;
};

const ICON_MAP: Record<string, LucideIcon> = {};

const getIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return Circle;
  return ICON_MAP[iconName] || Circle;
};

const normalizePathname = (pathname: string = "/"): string => {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

const getCurrentPathname = (): string => {
  if (typeof window === "undefined") {
    return "/";
  }

  return normalizePathname(window.location.pathname);
};

function HeaderInteractiveControls({
  currentPathname,
}: HeaderInteractiveIslandProps): ReactElement {
  const headerNavItems = NAVIGATION_ITEMS as HeaderNavItem[];
  const [pathname, setPathname] = useState<string>(() =>
    normalizePathname(currentPathname ?? getCurrentPathname()),
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const isActiveRoute = (href: string): boolean =>
    normalizePathname(href) === pathname;

  const isNavItemActive = (item: HeaderNavItem): boolean => {
    if (item.hasDropdown && item.subItems?.length) {
      return item.subItems.some((subItem) => isActiveRoute(subItem.href));
    }

    return isActiveRoute(item.href);
  };

  useEffect(() => {
    const syncPathname = () => {
      const nextPathname = getCurrentPathname();
      setPathname((current) =>
        current === nextPathname ? current : nextPathname,
      );
    };

    const schedulePathnameSync = () => {
      window.setTimeout(syncPathname, 0);
    };

    const onInternalLinkClickCapture = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      if (link.hasAttribute("download") || link.target === "_blank") {
        return;
      }

      const rawHref = link.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      const nextUrl = new URL(link.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) {
        return;
      }

      schedulePathnameSync();
    };

    const astroNavigationEvents = [
      "astro:before-preparation",
      "astro:before-swap",
      "astro:after-swap",
      "astro:page-load",
    ] as const;

    const browserNavigationEvents = [
      "popstate",
      "hashchange",
      "pageshow",
    ] as const;

    syncPathname();

    astroNavigationEvents.forEach((eventName) => {
      document.addEventListener(eventName, syncPathname);
    });

    browserNavigationEvents.forEach((eventName) => {
      window.addEventListener(eventName, syncPathname);
    });

    document.addEventListener("click", onInternalLinkClickCapture, {
      capture: true,
    });

    return () => {
      astroNavigationEvents.forEach((eventName) => {
        document.removeEventListener(eventName, syncPathname);
      });

      browserNavigationEvents.forEach((eventName) => {
        window.removeEventListener(eventName, syncPathname);
      });

      document.removeEventListener("click", onInternalLinkClickCapture, {
        capture: true,
      });
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdowns({});
  };

  const toggleDropdown = (itemLabel: string): void => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  const scrollYRef = useRef(0);
  const hadSavedScrollRef = useRef(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      scrollYRef.current = window.scrollY || window.pageYOffset || 0;
      hadSavedScrollRef.current = true;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (hadSavedScrollRef.current) {
        window.scrollTo(0, scrollYRef.current || 0);
        hadSavedScrollRef.current = false;
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="items-center hidden gap-3 sm:gap-4 nav:flex">
        <button
          type="button"
          onClick={() => openScheduler()}
          className="px-3 py-2 h-9 rounded-full bg-transparent text-white text-sm font-semibold leading-4 text-center tracking-[-2%] border border-transparent hover:text-[rgba(66,129,212,1)] hover:border-[rgba(66,129,212,1)] transition-all duration-300 shadow-[inset_0_-5px_9px_0_rgba(66,66,66,0.75)] whitespace-nowrap"
        >
          Schedule Meeting
        </button>

        <button
          type="button"
          onClick={() => setIsContactModalOpen(true)}
          className="px-4 py-2 h-9 rounded-full bg-linear-to-b from-brand-blue-light to-brand-blue text-neutral-950 text-sm font-semibold leading-4 text-center tracking-[-2%] hover:shadow-[0_0_20px_rgba(77,181,255,0.6)] transition-all duration-300 whitespace-nowrap"
        >
          Contact
        </button>
      </div>

      <button
        type="button"
        onClick={toggleMobileMenu}
        className="p-2 text-white transition-colors rounded-lg nav:hidden hover:bg-white/5"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        <div className="relative w-6 h-6">
          <span
            className={`absolute top-1 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 top-3" : "top-1"
            }`}
          />
          <span
            className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute top-5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 top-3" : "top-5"
            }`}
          />
        </div>
      </button>

      <div
        className={`fixed inset-0 z-9999 nav:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        <div
          className={`absolute top-0 right-0 h-dvh w-full sm:w-105 nav:w-130 lg:w-160 bg-black shadow-2xl transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4">
            <img
              src="/assets/images/brand/zeustra-logo.svg"
              alt="Zeustra"
              className="w-36"
            />
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col h-[calc(100dvh-120px)]">
            <div className="flex-1 p-6 overflow-y-auto">
              <nav className="space-y-0">
                {headerNavItems.map((item, index) => (
                  <div
                    key={item.label}
                    className={`py-2 ${index > 0 ? "border-t border-neutral-700" : ""}`}
                  >
                    {item.hasDropdown ? (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.label)}
                          className={`flex w-full items-center justify-between rounded-lg p-1 transition-colors hover:bg-white/5 ${
                            isNavItemActive(item) ? "bg-white/5" : ""
                          }`}
                        >
                          <span
                            className={`text-base font-medium ${
                              isNavItemActive(item)
                                ? "text-brand-blue-light"
                                : "text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isNavItemActive(item)
                                ? "text-brand-blue-light"
                                : "text-white/60"
                            } ${openDropdowns[item.label] ? "rotate-180" : ""}`}
                          />
                        </button>

                        <div
                          className={`ml-4 space-y-2 transition-all duration-300 overflow-hidden ${
                            openDropdowns[item.label]
                              ? "max-h-125 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {item.subItems?.map((subItem) => (
                            <a
                              key={`${subItem.href}-${subItem.label}`}
                              href={subItem.href}
                              onClick={closeMobileMenu}
                              className={`flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-white/5 ${
                                isActiveRoute(subItem.href) ? "bg-white/5" : ""
                              }`}
                            >
                              <div className="flex items-center justify-center w-10 h-10 border rounded-lg bg-neutral-900 border-white/20">
                                {subItem.iconType === "svg" && subItem.icon ? (
                                  <img
                                    src={subItem.icon}
                                    alt={subItem.label}
                                    className="w-5 h-5"
                                  />
                                ) : subItem.icon ? (
                                  (() => {
                                    const IconComponent = getIcon(subItem.icon);
                                    return (
                                      <IconComponent className="w-5 h-5 text-white/90" />
                                    );
                                  })()
                                ) : (
                                  <div className="w-5 h-5 rounded bg-white/10" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span
                                  className={`text-sm font-medium ${
                                    isActiveRoute(subItem.href)
                                      ? "text-brand-blue-light"
                                      : "text-white"
                                  }`}
                                >
                                  {subItem.label}
                                </span>
                                <span className="text-xs text-slate-300">
                                  {subItem.description || "Learn more"}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center rounded-lg p-3 transition-colors hover:bg-white/5 ${
                          isNavItemActive(item) ? "bg-white/5" : ""
                        }`}
                      >
                        <span
                          className={`text-base font-medium transition-colors ${
                            isNavItemActive(item)
                              ? "text-brand-blue-light"
                              : "text-white hover:text-brand-blue-light"
                          }`}
                        >
                          {item.label}
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="p-6 space-y-3 border-slate-500">
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  openScheduler();
                }}
                className="w-full px-4 py-3 text-base font-semibold text-white transition-all duration-300 bg-transparent border rounded-full border-white/20 hover:border-brand-blue-light hover:text-brand-blue-light"
              >
                Schedule Meeting
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setIsContactModalOpen(true);
                }}
                className="w-full px-4 py-3 rounded-full bg-linear-to-b from-brand-blue-light to-brand-blue text-neutral-950 text-base font-semibold hover:shadow-[0_0_20px_rgba(77,181,255,0.6)] transition-all duration-300"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}

export default function HeaderInteractiveIsland(
  props: HeaderInteractiveIslandProps,
): ReactElement {
  return <HeaderInteractiveControls {...props} />;
}
