import React from "react";
import  Button  from "./Button"; // adjust import path to your project

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
      <div className={`relative w-[75vw] h-[40vw] mx-4 rounded-2xl shadow-2xl bg-white`}>
        {/* Close button (top-right corner) */}
        <Button
          icon="close"
          rounded
          onClick={onClose}
          className="absolute top-4 right-4 z-50"
          colour="dark"
        />

        {/* Modal body */}
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
