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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-[#FDFBF6] rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative ${className || ""}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-[#200904] text-2xl font-bold hover:text-[#EA4B09]"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
