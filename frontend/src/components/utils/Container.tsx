import type React from "react";
import Title from "./Title";

type ContainerProps = {
  colour: "blue" | "green" | "red" | "orange" | "yellow";
  title: string;
  button?: React.ReactNode;
  children?: React.ReactNode;
};

export default function Container({ colour, title, button, children }: ContainerProps) {
  return (
    <div
      className={`bg-${colour} py-4 pb-8 px-8 rounded-2xl w-[40vw] aspect-[415/300] max-w-[450px] flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-4">
        <Title>{title}</Title>
        {button}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1">{children}</div>
    </div>
  );
}
