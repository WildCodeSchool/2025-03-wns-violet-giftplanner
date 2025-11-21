import { useId } from "react";
import type { IconTypes } from "./Icon";
import Icon from "./Icon";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  theme?: "light" | "dark";
  className?: string;
  placholder?: string;
  label?: string;
  icon?: IconTypes;
}

export default function Input({
  type,
  name,
  value,
  onChange,
  error,
  theme = "light",
  label,
  className = "",
  placeholder,
  icon,
  ...props
}: InputProps) {
  const baseStyles =
    "w-full px-4 py-2 border-2 rounded-lg font-inter font-bold text-md outline-none transition-colors duration-200";

  const themeStyles =
    theme === "dark"
      ? " border-dark text-dark focus:border-blue"
      : "bg-transparent border-white-100 text-white placeholder-white-100 focus:placeholder-white ";

  const errorStyles = error ? "border-orange focus:border-orange" : "";

  const id = useId();

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={id} className="font-semibold text-md text-white dark:text-dark">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`${baseStyles} ${themeStyles} ${errorStyles} ${className}`}
          name={name}
          placeholder={placeholder}
          {...props}
        />
        {icon && (
          <Icon
            icon={icon}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${error ? "text-orange" : "text-white"} text-2xl cursor-pointer`}
          />
        )}
      </div>
      {error && <p className="text-orange font-inter text-sm pt-1">{error}</p>}
    </div>
  );
}
