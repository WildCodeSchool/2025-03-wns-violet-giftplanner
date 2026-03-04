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
  disabled?: boolean;
  dataTestId?: string;
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
  disabled = false,
  dataTestId,
  ...props
}: InputProps) {
  const baseStyles =
    "w-full p-2 rounded-lg font-inter-extra-bold text-lg outline-none transition-colors duration-200  placeholder:font-inter placeholder:font-bold";

  const themeStyles =
    theme === "dark"
      ? "border-dark border-[2.5px] text-dark focus:border-blue placeholder:text-dark/50"
      : "border-white border-[2.5px] text-white focus:border-white placeholder:text-white";

  const disabledStyles = disabled
    ? theme === "dark"
      ? "opacity-60 cursor-not-allowed bg-gray-50 border-gray-300 text-gray-600"
      : "opacity-60 cursor-not-allowed bg-gray-900/30 border-gray-500 text-gray-300 placeholder-gray-400"
    : "";

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
          disabled={disabled}
          className={`${baseStyles} ${themeStyles} ${disabledStyles} ${errorStyles} ${className}`}
          name={name}
          placeholder={placeholder}
          data-testid={dataTestId}
          {...props}
        />
        {icon && (
          <Icon
            icon={icon}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              error
                ? "text-orange"
                : disabled
                  ? (theme === "dark" ? "text-gray-400" : "text-gray-500")
                  : "text-white"
            } text-2xl ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          />
        )}
      </div>
      {error && <p className="text-orange font-bold text-sm pt-1">{error}</p>}
    </div>
  );
}
