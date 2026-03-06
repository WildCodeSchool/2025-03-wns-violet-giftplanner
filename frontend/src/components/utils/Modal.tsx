import clsx from "clsx";
import type React from "react";
import { useEffect } from "react";
import type { ColourScheme } from "../../types/ColourScheme";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = {
  colour?: ColourScheme["colour"];
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string; // extra classes for the PANEL (not the overlay)
  overlayClassName?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  withPadding?: boolean;
  mobileFullscreen?: boolean;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md p-4",
  md: "max-w-2xl p-4",
  lg: "max-w-6xl h-full p-0 ",
};

const colourClasses: Record<NonNullable<ModalProps["colour"]>, string> = {
  dark: "bg-dark",
  light: "bg-light",
  green: "bg-green",
  yellow: "bg-yellow",
  blue: "bg-blue",
  orange: "bg-orange",
  white: "bg-white",
};

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
  overlayClassName,
  colour,
  closeOnOverlayClick = true,
  showCloseButton = true,
  withPadding = true,
  mobileFullscreen = true,
  ...rest
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: overlay click is pointer-only; keyboard users dismiss via Escape
    <div
      {...rest}
      className={clsx(
        "fixed inset-0 z-[1100] flex items-center justify-center bg-black/75",
        mobileFullscreen ? "max-md:p-0" : "max-md:px-2",
        overlayClassName,
      )}
      role="presentation"
      onMouseDown={() => {
        if (closeOnOverlayClick) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          // panel base (background applied below to avoid conflicts)
          "relative w-full shadow-xl",
          // desktop shape + sizing
          "rounded-2xl",
          sizeClasses[size],
          // mobile full screen
          mobileFullscreen && "max-md:h-full max-md:max-w-none max-md:rounded-none max-md:overflow-y-auto",
          // if you want internal padding to live here (recommended)
          withPadding ? "p-6 max-md:p-6" : "p-0",
          colour ? colourClasses[colour] : "bg-white",
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
            className="absolute top-3 right-4 text-2xl font-bold text-[#200904] hover:text-[#EA4B09] max-md:hidden cursor-pointer"
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
