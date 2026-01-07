import type React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 max-md:bg-[#FDFBF6]">
      <div
        className={`bg-[#FDFBF6] rounded-2xl shadow-xl w-10/12 h-10/12 mx-4 relative max-md:max-w-none max-md:h-full max-md:rounded-none max-md:mx-0 max-md:flex max-md:flex-col max-md:p-10 ${className || ""}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-dark text-2xl font-bold hover:text-orange max-md:hidden"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
