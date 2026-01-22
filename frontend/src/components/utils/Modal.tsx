import { useEffect } from "react";
import type React from "react";
import clsx from "clsx";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string; // extra classes for the PANEL (not the overlay)
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  withPadding?: boolean
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-6xl",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
  closeOnOverlayClick = true,
  showCloseButton = true,
  withPadding = true
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    // lock background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 max-md:p-0"
      onMouseDown={() => {
        if (closeOnOverlayClick) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          // panel base
          "relative w-full bg-[#FDFBF6] shadow-xl",
          // desktop shape + sizing
          "rounded-2xl max-md:rounded-none",
          sizeClasses[size],
          // mobile full screen
          "max-md:h-full max-md:max-w-none",
          // if you want internal padding to live here (recommended)
          withPadding ? "p-6 max-md:p-6" : "p-0",
          className,
        )}
        onMouseDown={(e) => {
          // prevent overlay click when interacting inside panel
          e.stopPropagation();
        }}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-2xl font-bold text-[#200904] hover:text-[#EA4B09] max-md:hidden"
            aria-label="Fermer"
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
