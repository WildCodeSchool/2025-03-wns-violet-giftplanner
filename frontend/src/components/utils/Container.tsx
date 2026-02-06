import type React from "react";
import type { ColourScheme } from "../../types/ColourScheme";
import Subtitle from "./Subtitle";

type ContainerProps = {
  colour: ColourScheme["colour"];
  title: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
  children?: React.ReactNode;
  classNameTitle?: string;
};

export default function Container({ colour, title, icon, button, children, classNameTitle }: ContainerProps) {
  return (
    <div
      className={`bg-${colour} py-6 pb-6 px-6 rounded-2xl w-[40vw] aspect-[415/300] max-w-[450px] flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-4">
        <div className="flex items-center gap-2">
          {icon}
          <Subtitle className={classNameTitle}>{title}</Subtitle>
        </div>
        {button}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 -mr-4 pr-2 scrollbar-thin">{children}</div>
    </div>
  );
}
