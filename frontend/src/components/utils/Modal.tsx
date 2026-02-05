import type React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
};

export default function Modal({ isOpen, onClose, children, className, hideCloseButton }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 max-md:bg-transparent">
      <div
        className={`bg-white rounded-2xl shadow-xl w-10/12 h-10/12 mx-4 relative max-md:max-w-none max-md:h-full max-md:w-full max-md:rounded-none max-md:mx-0 max-md:flex max-md:flex-col max-md:p-0 max-md:shadow-none ${className || ""}`}
      >
        {/* Desktop close button */}
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-dark text-2xl font-bold hover:text-orange max-md:hidden"
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
