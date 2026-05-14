import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  SyntheticEvent as ReactSyntheticEvent,
} from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import useReducedEffects from "@/hooks/useReducedEffects";
import type { TeamMember } from "@/features/about/data/aboutPageData";

const TEAM_MEMBER_FALLBACK_IMAGE =
  "/assets/images/brand/zeustra-logo-minimal.svg";

type NavArrowState = "idle" | "hover" | "active";
type NavArrowPosition = "left" | "right";

type TeamMemberModalProps = {
  members: TeamMember[];
  memberIndex: number | null;
  isOpen: boolean;
  onNavigate: (index: number) => void;
  onClose: () => void;
};

const getNavArrowChrome = (
  state: NavArrowState,
  reducedEffects: boolean,
): CSSProperties => {
  const baseBorder = "1.563px solid rgba(255, 255, 255, 0.12)";
  const hoverBorder = "1.563px solid #4DB5FF";
  const activeBorder = "1.563px solid #00EEFF";

  const border =
    state === "active"
      ? activeBorder
      : state === "hover"
        ? hoverBorder
        : baseBorder;

  const boxShadow =
    state === "active"
      ? "0px 0px 15px 0px #00EEFF, inset 0px 0px 25px 0px #00EEFF"
      : state === "hover"
        ? "0px 0px 10px 0px #4DB5FF, inset 0px 0px 20px 0px #4DB5FF"
        : "none";

  return {
    width: "65.625px",
    height: "65.625px",
    borderRadius: "18.75px",
    border,
    opacity: "0.75",
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: reducedEffects ? "blur(2px)" : "blur(3.125px)",
    boxShadow,
  };
};

const getNavArrowSideStyle = (
  position: NavArrowPosition,
  state: NavArrowState,
  reducedEffects: boolean,
): CSSProperties => {
  const sideStyle: CSSProperties =
    position === "left"
      ? { left: "clamp(0.75rem, 5vw, 5rem)" }
      : { right: "clamp(0.75rem, 5vw, 5rem)" };

  return {
    ...getNavArrowChrome(state, reducedEffects),
    ...sideStyle,
  };
};

const hasPhoneDigits = (value: string): boolean =>
  value.replace(/\D/g, "").length >= 7;

const decodePhone = (encoded?: string): string => {
  if (!encoded) return "";

  const normalizedInput = encoded.trim();
  if (!normalizedInput) return "";

  const canBeBase64 = /^[A-Za-z0-9+/=]+$/.test(normalizedInput);
  if (!canBeBase64) return normalizedInput;

  try {
    const paddedInput = normalizedInput.padEnd(
      Math.ceil(normalizedInput.length / 4) * 4,
      "=",
    );
    const decoded = atob(paddedInput).trim();

    return hasPhoneDigits(decoded) ? decoded : normalizedInput;
  } catch {
    return normalizedInput;
  }
};

const TeamMemberModal = ({
  members,
  memberIndex,
  isOpen,
  onNavigate,
  onClose,
}: TeamMemberModalProps) => {
  const reducedEffects = useReducedEffects();
  const [isEntering, setIsEntering] = useState(false);
  const [leftArrowState, setLeftArrowState] = useState<NavArrowState>("idle");
  const [rightArrowState, setRightArrowState] = useState<NavArrowState>("idle");
  const [isEmailPopoverOpen, setIsEmailPopoverOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isPhonePopoverOpen, setIsPhonePopoverOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const bioScrollRef = useRef<HTMLDivElement | null>(null);
  const emailPopoverRef = useRef<HTMLDivElement | null>(null);
  const phonePopoverRef = useRef<HTMLDivElement | null>(null);

  const member: TeamMember | null =
    memberIndex !== null && memberIndex >= 0 && memberIndex < members.length
      ? members[memberIndex]
      : null;

  const decodedPhone = decodePhone(member?.phone);

  const canNavigate = members.length > 1;

  const applyImageFallback = (
    event: ReactSyntheticEvent<HTMLImageElement>,
  ): void => {
    if (event.currentTarget.dataset.fallbackApplied === "true") {
      return;
    }

    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = TEAM_MEMBER_FALLBACK_IMAGE;
  };

  const goPrev = useCallback(() => {
    if (!canNavigate || memberIndex === null) return;
    onNavigate((memberIndex - 1 + members.length) % members.length);
  }, [canNavigate, memberIndex, members.length, onNavigate]);

  const goNext = useCallback(() => {
    if (!canNavigate || memberIndex === null) return;
    onNavigate((memberIndex + 1) % members.length);
  }, [canNavigate, memberIndex, members.length, onNavigate]);

  useEffect(() => {
    if (!isOpen || memberIndex === null) return undefined;
    if (bioScrollRef.current) bioScrollRef.current.scrollTop = 0;
    setIsEmailPopoverOpen(false);
    setCopiedEmail(false);
    setIsPhonePopoverOpen(false);
    setCopiedPhone(false);
  }, [isOpen, memberIndex]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateSupportsHover = (event: MediaQueryListEvent) => {
      setSupportsHover(event.matches);
    };

    setSupportsHover(mediaQuery.matches);

    mediaQuery.addEventListener("change", updateSupportsHover);
    return () => mediaQuery.removeEventListener("change", updateSupportsHover);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (!canNavigate) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onWindowKeyDown);
    const animationFrameId = window.requestAnimationFrame(() => {
      setIsEntering(true);
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onWindowKeyDown);
      window.cancelAnimationFrame(animationFrameId);
      setIsEntering(false);
    };
  }, [isOpen, onClose, canNavigate, goPrev, goNext]);

  useEffect(() => {
    if (!isEmailPopoverOpen) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        emailPopoverRef.current?.contains(event.target)
      ) {
        return;
      }
      setIsEmailPopoverOpen(false);
      setCopiedEmail(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isEmailPopoverOpen]);

  useEffect(() => {
    if (!isPhonePopoverOpen) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        phonePopoverRef.current?.contains(event.target)
      ) {
        return;
      }
      setIsPhonePopoverOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isPhonePopoverOpen]);

  if (!isOpen || !member) return null;

  const handleCopyEmail = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!member.email || !navigator?.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(member.email);
      setCopiedEmail(true);
      window.setTimeout(() => {
        setCopiedEmail(false);
      }, 1600);
    } catch {
      setCopiedEmail(false);
    }
  };

  const maskPhoneNumber = (phone: string): string => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    const last4 = digits.slice(-4);
    return `(***) ***-${last4}`;
  };

  const handleCopyPhone = async (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!decodedPhone || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(decodedPhone);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 1600);
    } catch {
      setCopiedPhone(false);
    }
  };

  const handleModalKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab" && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 py-6 z-120 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onKeyDown={handleModalKeyDown}
        className="relative flex flex-col items-center w-full outline-none"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className={`relative w-full max-w-lg sm:max-w-xl md:max-w-4xl lg:max-w-screen-2xl h-[85dvh] md:h-[75dvh] max-h-[95dvh] overflow-hidden bg-neutral-800 border-2 border-brand-blue-std rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.4)] transform transition-all duration-300 ease-out ${
            isEntering
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-6 opacity-0 scale-95"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-member-modal-title"
        >
          <button
            type="button"
            aria-label="Close team member modal"
            onClick={onClose}
            className="absolute z-10 inline-flex items-center justify-center text-white transition-colors duration-200 border-2 right-4 top-4 h-11 w-11 rounded-2xl border-brand-blue-std bg-black/25 hover:text-brand-blue-light focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std md:right-6 md:top-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
          <div className="grid grid-cols-1 md:grid-cols-[40%_60%] h-full grid-rows-[40%_60%] md:grid-rows-1">
            <div className="overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
              <div className="relative block w-full h-full md:hidden">
                <img
                  src={member.image || TEAM_MEMBER_FALLBACK_IMAGE}
                  alt={member.name}
                  className="absolute inset-0 object-cover w-full h-full"
                  loading="eager"
                  decoding="async"
                  onError={applyImageFallback}
                />
              </div>

              <div className="hidden w-full h-full md:block">
                <img
                  src={member.image || TEAM_MEMBER_FALLBACK_IMAGE}
                  alt={member.name}
                  className="block object-cover w-full h-full"
                  loading="eager"
                  decoding="async"
                  onError={applyImageFallback}
                />
              </div>
            </div>

            <div className="flex flex-col h-full min-h-0 p-4 md:p-10">
              <h3
                id="team-member-modal-title"
                className="text-3xl leading-tight text-white md:text-4xl lg:text-5xl lg:leading-tight"
              >
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-slate-300 md:text-base lg:text-lg">
                {member.title}
              </p>

              <div className="flex flex-wrap items-center gap-4 py-4 md:py-6">
                {decodedPhone && (
                  <div
                    ref={phonePopoverRef}
                    className="relative"
                    onMouseEnter={() => {
                      if (supportsHover) {
                        setIsPhonePopoverOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (supportsHover) {
                        setIsPhonePopoverOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Show phone options for ${member.name}`}
                      aria-expanded={isPhonePopoverOpen}
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsPhonePopoverOpen((prev) => !prev);
                      }}
                      className="inline-flex items-center transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-brand-blue-std focus-visible:ring-offset-2"
                    >
                      <span className="flex items-center justify-center mr-3 text-base font-semibold transition-colors duration-200 border-2 w-11 h-11 rounded-2xl border-brand-blue-std md:w-12 md:h-12 md:mr-4 md:text-xl text-(--color-brand-blue)">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-(--color-brand-blue) transition-colors duration-200"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.02l-2.2 2.2z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="text-sm leading-snug text-white md:text-base lg:text-lg transition-colors duration-200 group-hover:text-(--color-brand-blue)">
                        Phone
                      </span>
                    </button>

                    {/* Phone popover — always rendered, CSS-controlled visibility */}
                    <div
                      className={`absolute left-0 top-full z-20 mt-3 min-w-65 max-w-[min(80vw,22rem)] rounded-3xl border-2 border-brand-blue-std bg-neutral-800/95 p-4 shadow-[0_0_30px_rgba(59,130,246,0.28)] backdrop-blur-sm transition-opacity duration-150 ease-out ${isPhonePopoverOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    >
                      <div
                        className="absolute inset-x-0 h-3 -top-3"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                        Contact
                      </p>

                      {/* Mobile: Call + Text buttons */}
                      {!supportsHover && (
                        <div className="flex flex-col gap-2 mt-3">
                          <a
                            href={`tel:${decodedPhone}`}
                            onClick={(event) => event.stopPropagation()}
                            className="flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium text-white transition-colors duration-200 border rounded-2xl border-white/10 bg-white/5 hover:text-brand-blue-light hover:border-brand-blue-std focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                            Call
                          </a>
                          <a
                            href={`sms:${decodedPhone}`}
                            onClick={(event) => event.stopPropagation()}
                            className="flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium text-white transition-colors duration-200 border rounded-2xl border-white/10 bg-white/5 hover:text-brand-blue-light hover:border-brand-blue-std focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            Text
                          </a>
                        </div>
                      )}

                      {/* Desktop: Masked number + Copy */}
                      {supportsHover && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex-1 min-w-0 px-3 py-2 font-mono text-sm tracking-wide text-white border rounded-2xl border-white/10 bg-white/5">
                            <span className="block truncate">
                              {maskPhoneNumber(decodedPhone)}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={`Copy ${member.name}'s phone number`}
                            onClick={handleCopyPhone}
                            className="inline-flex items-center justify-center px-3 text-sm font-medium text-white transition-colors duration-200 border h-11 shrink-0 rounded-2xl border-brand-blue-std bg-black/25 hover:text-brand-blue-light focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std"
                          >
                            {copiedPhone ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {member.email && (
                  <div
                    ref={emailPopoverRef}
                    className="relative"
                    onMouseEnter={() => {
                      if (supportsHover) {
                        setIsEmailPopoverOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (supportsHover) {
                        setIsEmailPopoverOpen(false);
                        setCopiedEmail(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Show email options for ${member.name}`}
                      aria-expanded={isEmailPopoverOpen}
                      onClick={(event) => {
                        event.stopPropagation();
                        setCopiedEmail(false);
                        setIsEmailPopoverOpen((prev) => !prev);
                      }}
                      className="inline-flex items-center transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-brand-blue-std focus-visible:ring-offset-2"
                    >
                      <span className="flex items-center justify-center mr-3 text-base font-semibold transition-colors duration-200 border-2 w-11 h-11 rounded-2xl border-brand-blue-std md:w-12 md:h-12 md:mr-4 md:text-xl text-(--color-brand-blue)">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-(--color-brand-blue) transition-colors duration-200"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20H4.5A2.5 2.5 0 012 17.5v-11zM4.5 6a.5.5 0 00-.5.5V7l8.5 5L20.5 7v-.5a.5.5 0 00-.5-.5h-15zM20.5 8.8l-7.6 4.4a1 1 0 01-1 0L4.5 8.8V17.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5V8.8z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="text-sm leading-snug text-white md:text-base lg:text-lg transition-colors duration-200 group-hover:text-(--color-brand-blue)">
                        Email
                      </span>
                    </button>

                    {/* Email popover — always rendered, CSS-controlled visibility */}
                    <div
                      className={`absolute left-0 top-full z-20 mt-3 min-w-65 max-w-[min(80vw,22rem)] rounded-3xl border-2 border-brand-blue-std bg-neutral-800/95 p-4 shadow-[0_0_30px_rgba(59,130,246,0.28)] backdrop-blur-sm transition-opacity duration-150 ease-out ${isEmailPopoverOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                    >
                      <div
                        className="absolute inset-x-0 h-3 -top-3"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                        Email Address
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(event) => event.stopPropagation()}
                          className="flex-1 min-w-0 px-3 py-2 text-sm text-white transition-colors duration-200 border rounded-2xl border-white/10 bg-white/5 hover:text-brand-blue-light focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std"
                        >
                          <span className="block truncate">{member.email}</span>
                        </a>
                        <button
                          type="button"
                          aria-label={`Copy ${member.email}`}
                          onClick={handleCopyEmail}
                          className="inline-flex items-center justify-center px-3 text-sm font-medium text-white transition-colors duration-200 border h-11 shrink-0 rounded-2xl border-brand-blue-std bg-black/25 hover:text-brand-blue-light focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std"
                        >
                          {copiedEmail ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${member.name}'s LinkedIn (opens in new tab)`}
                    className="inline-flex items-center transition-colors duration-200 group focus-visible:ring-2 focus-visible:ring-brand-blue-std focus-visible:ring-offset-2"
                  >
                    <span className="flex items-center justify-center mr-3 transition-colors duration-200 border-2 w-11 h-11 rounded-2xl border-brand-blue-std group-hover:border-brand-blue-std md:w-12 md:h-12 md:mr-4">
                      <img
                        src="/assets/icons/social/linkedin-icon.svg"
                        alt="LinkedIn"
                        className="w-6 h-6"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-base leading-snug text-white md:text-lg lg:text-xl transition-colors duration-200 group-hover:text-(--color-brand-blue)">
                      LinkedIn
                    </span>
                  </a>
                )}
              </div>

              <div className="flex-1 min-h-0 text-sm max-w-300 text-neutral-600 md:text-base lg:text-lg">
                <div
                  ref={bioScrollRef}
                  className="h-full pr-2 space-y-4 overflow-auto modal-scrollbar"
                >
                  {member.bio.split("\n\n").map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {canNavigate ? (
          <>
            {/* Mobile: centered row under the modal */}
            <div className="flex items-center justify-center w-full gap-6 mt-4 shrink-0 md:hidden">
              <button
                type="button"
                aria-label="Previous team member"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="flex items-center justify-center text-white transition-all duration-200 shrink-0 hover:text-brand-blue-light active:text-brand-cyan focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std"
                style={getNavArrowChrome(leftArrowState, reducedEffects)}
                onMouseEnter={() => setLeftArrowState("hover")}
                onMouseLeave={() => setLeftArrowState("idle")}
                onMouseDown={() => setLeftArrowState("active")}
                onMouseUp={() => setLeftArrowState("hover")}
              >
                <svg
                  className="w-5 h-5 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next team member"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="flex items-center justify-center text-white transition-all duration-200 shrink-0 hover:text-brand-blue-light active:text-brand-cyan focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std"
                style={getNavArrowChrome(rightArrowState, reducedEffects)}
                onMouseEnter={() => setRightArrowState("hover")}
                onMouseLeave={() => setRightArrowState("idle")}
                onMouseDown={() => setRightArrowState("active")}
                onMouseUp={() => setRightArrowState("hover")}
              >
                <svg
                  className="w-5 h-5 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* md+: fixed gutters like Testimonials */}
            <button
              type="button"
              aria-label="Previous team member"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="hidden text-white transition-all duration-200 pointer-events-auto hover:text-brand-blue-light active:text-brand-cyan focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std md:fixed md:z-121 md:flex md:-translate-y-1/2 md:items-center md:justify-center md:top-1/2"
              style={getNavArrowSideStyle(
                "left",
                leftArrowState,
                reducedEffects,
              )}
              onMouseEnter={() => setLeftArrowState("hover")}
              onMouseLeave={() => setLeftArrowState("idle")}
              onMouseDown={() => setLeftArrowState("active")}
              onMouseUp={() => setLeftArrowState("hover")}
            >
              <svg
                className="w-5 h-5 transition-colors duration-200 lg:h-6 lg:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next team member"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="hidden text-white transition-all duration-200 pointer-events-auto hover:text-brand-blue-light active:text-brand-cyan focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-blue-std md:fixed md:z-121 md:flex md:-translate-y-1/2 md:items-center md:justify-center md:top-1/2"
              style={getNavArrowSideStyle(
                "right",
                rightArrowState,
                reducedEffects,
              )}
              onMouseEnter={() => setRightArrowState("hover")}
              onMouseLeave={() => setRightArrowState("idle")}
              onMouseDown={() => setRightArrowState("active")}
              onMouseUp={() => setRightArrowState("hover")}
            >
              <svg
                className="w-5 h-5 transition-colors duration-200 lg:h-6 lg:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default TeamMemberModal;
