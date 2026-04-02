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
  nbNewMessages?: number;
};

export default function Container({
  colour,
  title,
  icon,
  button,
  children,
  classNameTitle,
  nbNewMessages,
}: ContainerProps) {
  return (
    <div className={`bg-${colour} py-6 pb-6 px-6 rounded-2xl w-full min-w-0 h-full flex flex-col`}>
      {/* Header */}
      <div className="flex justify-between items-center pb-4">
        <div className="flex items-center gap-2">
          {icon}
          <div className="relative flex items-center gap-2">
            <Subtitle className={classNameTitle}>{title}</Subtitle>
            {nbNewMessages && nbNewMessages > 0 && (
              <p className="w-[25px] h-[25px] flex align-middle justify-center font-semibold bg-[var(--color-orange)] rounded-[50%] text-white">
                {nbNewMessages}
              </p>
            )}
          </div>
        </div>
        {button}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 -mr-4 pr-4 scrollbar-thin">{children}</div>
    </div>
  );
}
