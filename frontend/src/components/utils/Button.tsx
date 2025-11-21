import type { IconProps } from "./Icon";
import Icon from "./Icon";

type ButtonType = HTMLButtonElement["type"];
type ButtonProps = {
  onClick?: () => void;
  text?: string;
  colour?: "blue" | "green" | "red" | "orange" | "yellow" | "dark" | "white";
  icon?: IconProps["icon"];
  rounded?: boolean;
  className?: string;
  children?: React.ReactNode;
  type?: ButtonType;
  big?: boolean;
};

export default function Button({
  onClick,
  text,
  colour = "green",
  icon,
  rounded = false,
  className,
  children,
  type = "button",
}: ButtonProps) {
  const backgroundColours = {
    blue: "bg-blue",
    green: "bg-green",
    red: "bg-red",
    orange: "bg-orange",
    yellow: "bg-yellow",
    dark: "bg-dark",
    white: "bg-white",
  };

  const backgroundColour = backgroundColours[colour] || backgroundColours.green;

  return (
    <button
      type={type}
      className={`${backgroundColour} text-white font-inter-extra-bold ${rounded ? "rounded-full p-2" : "rounded-lg py-2 px-4"} flex items-center gap-1 font-medium shadow-md hover:brightness-110 hover:scale-[1.02] active:scale-[0.97] active:brightness-95 transition-all duration-200 ease-in-out ${className}  `}
      onClick={onClick}
    >
      {children}
      {icon && <Icon icon={icon} text={text} />}
    </button>
  );
}
