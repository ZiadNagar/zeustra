import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4 z-100">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#111318] border border-[#23272F] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute z-10 p-2 transition-colors rounded-md top-4 right-4 text-white/60 hover:text-white hover:bg-white/10"
        >
          <X size={20} />
        </button>

        <div className="max-h-[90vh] overflow-y-auto modal-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") || document.body,
  );
};

export default Modal;
