import { useId } from "react";
import Icon from "./Icon";
import Input from "./Input";
import Tag from "./Tag";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onClick"> {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  theme?: "light" | "dark";
  className?: string;
  placeholder?: string;
  label?: string;
  onClick: (tag: string) => void;
  onAddTag?: (tag: string) => void;
  items: string[];
  disabled?: boolean;
}

export default function SearchInput({
  name,
  value,
  onChange,
  items,
  onClick,
  onAddTag,
  placeholder,
  label,
  theme = "light",
  type = "text",
  error,
  className,
  disabled = false,
  ...props
}: SearchInputProps) {
  const baseStyles =
    "w-full p-2 border-2 focus:border-3 rounded-lg font-inter font-bold text-md outline-none transition-colors duration-200";

  const themeStyles =
    theme === "dark"
      ? "border-dark text-dark focus:border-dark text-dark"
      : "border-white text-white focus:border-white placeholder:text-white focus:placeholder:text-white ";

  const errorStyles = error ? "border-orange focus:border-orange text-orange" : "";

  const id = useId();

  function handleAddTag() {
    if (disabled) return;
    if (value.trim() !== "" && onAddTag) {
      onAddTag(value.trim());
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === "Enter" && value.trim() !== "") {
      e.preventDefault();
      handleAddTag();
    }
  }

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      {label && (
        <label
          htmlFor={id}
          className={`font-semibold text-lg mb-2.5 ${theme === "dark" ? "text-dark" : "text-white"}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          name={name}
          disabled={disabled}
          theme="dark"
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className={`${baseStyles} ${themeStyles} ${errorStyles} ${className}`}
          placeholder={placeholder}
          {...props}
        />

        <button
          type="button"
          onClick={handleAddTag}
          disabled={disabled}
          className={`absolute right-0 top-0 h-full px-3 ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <Icon
            icon={value ? "plus" : "search"}
            className={`${
              error ? "text-orange" : disabled ? "text-gray-400" : "text-dark"
            } text-2xl ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${theme === "dark" ? "text-dark" : "text-white"}`}
          />
        </button>
      </div>
      {error && <p className="text-orange font-inter text-sm pt-1">{error}</p>}
      <div className="flex flex-wrap w-full flex-1 min-h-0 gap-1 py-2 overflow-y-auto pr-1 scrollbar-thin">
        {items.map((item) => (
          <Tag
            key={item}
            tag={item}
            type="dark"
            disabled={disabled}
            onClick={() => !disabled && onClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
