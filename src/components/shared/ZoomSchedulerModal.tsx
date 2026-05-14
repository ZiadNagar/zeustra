import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getZoomSchedulerEmbedSrc } from "@/constants/scheduling";

type ZoomSchedulerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  schedulerUrl: string;
};

const getModalRoot = () =>
  document.getElementById("modal-root") || document.body;

const ZoomSchedulerModal = ({
  isOpen,
  onClose,
  schedulerUrl,
}: ZoomSchedulerModalProps) => {
  const titleId = useId();
  const scrollYRef = useRef<number>(0);
  const embedSrc = getZoomSchedulerEmbedSrc(schedulerUrl);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    scrollYRef.current = window.scrollY || window.pageYOffset || 0;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollYRef.current}px`;
    style.left = "0";
    style.right = "0";
    style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflow = "";
      window.scrollTo({
        top: scrollYRef.current,
        left: 0,
        behavior: "auto",
      });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-3 z-110 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 transition-opacity bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex flex-col w-full max-w-[min(92vw,960px)] h-[min(90vh,820px)] bg-[#111318] border border-[#23272F] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#23272F] shrink-0">
          <h2 id={titleId} className="pr-2 text-base font-semibold text-white">
            Schedule a call
          </h2>
          <div className="flex items-center gap-3">
            <a
              href={schedulerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors text-brand-blue-light hover:text-brand-blue-deep whitespace-nowrap"
            >
              Open in new tab
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 transition-colors rounded-md text-white/60 hover:text-white hover:bg-white/10"
              aria-label="Close scheduler"
            >
              <X size={20} aria-hidden />
            </button>
          </div>
        </div>

        <div className="relative flex-1 min-h-0 bg-black/40">
          {/*
            KB0083594: width 100%, min-height ~560–900px, border 0, embed=true
          */}
          <iframe
            src={embedSrc}
            title="Book an intro call with Zeustra via Zoom Scheduler"
            className="w-full h-full border-0 min-h-140"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>,
    getModalRoot(),
  );
};

export default ZoomSchedulerModal;
