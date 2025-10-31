import React from "react";
import Icon from "./Icon";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm`}
    >
      {/* Modal content container */}
      <div className={`relative w-[75vw] h-[40vw] rounded-2xl shadow-2xl bg-white`}>
        {/* Close button (top-right corner) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 shadow-none hover:shadow-none rounded-full"
        >
          <Icon icon="close" className="text-4xl font-light text-green"/>

        </button>

        {/* Modal body */}
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
