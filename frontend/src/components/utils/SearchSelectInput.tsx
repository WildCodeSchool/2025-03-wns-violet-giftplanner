import { useEffect, useId, useRef, useState } from "react";
import type { IconTypes } from "./Icon";
import Icon from "./Icon";
import Input from "./Input";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  error?: string;
  theme?: "light" | "dark";
  icon?: IconTypes;
  className?: string;
  disabled?: boolean;
}

export default function SearchSelectInput({
  // name,
  value,
  onChange,
  options,
  placeholder = "Select option...",
  label,
  error,
  theme = "light",
  disabled = false,
  icon,
  className = "",
  name,
}: SearchableSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Filter options
  const filtered = options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

  // Close dropdown if disabled
  useEffect(() => {
    if (disabled && open) {
      setOpen(false);
      setQuery("");
    }
  }, [disabled, open]);

  // Close dropdown on click outside
  useEffect(() => {
    if (disabled) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [disabled]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled || !open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0) {
        onChange(filtered[focusedIndex].value);
        setQuery("");
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  // Styles (copied from your Input component)
  const baseInput =
    "w-full p-2 rounded-lg font-inter font-bold text-lg outline-none transition-colors duration-200 cursor-pointer placeholder:font-bold";

  const themeInput =
    theme === "dark"
      ? "border-dark border-[3.5px] text-dark focus:border-blue bg-white placeholder:text-dark/50"
      : "bg-transparent border-white border-[3.5px] text-white placeholder:text-white/70";

  const disabledStyles = disabled
    ? theme === "dark"
      ? "opacity-60 cursor-not-allowed bg-gray-50 border-gray-300 text-gray-600"
      : "opacity-60 cursor-not-allowed bg-gray-900/30 border-gray-500 text-gray-300"
    : "cursor-pointer";

  const errorInput = error ? "border-orange focus:border-orange" : "";

  const dropdownStyles =
    theme === "dark" ? "bg-black border-white text-white" : "bg-white border-white border-4 text-dark";

  return (
    <div
      tabIndex={disabled ? -1 : 0}
      ref={containerRef}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-disabled={disabled}
      className="flex flex-col w-full"
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label htmlFor={id} className="font-semibold text-md text-white dark:text-dark">
          {label}
        </label>
      )}

      {/* INPUT BOX */}
      <div className="relative">
        {/* WHEN CLOSED → show regular input */}
        {!open && (
          <div
            className={`${baseInput} ${themeInput} ${disabledStyles} ${errorInput} ${className} flex justify-between items-center`}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setOpen(true)}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === "Enter") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          >
            <span className={value ? "" : "opacity-70"}>
              {value ? options.find((o) => o.value === value)?.label : placeholder}
            </span>

            {icon && (
              <Icon
                icon={icon}
                className={`text-2xl ${
                  error
                    ? "text-orange"
                    : disabled
                      ? (theme === "dark" ? "text-gray-400" : "text-gray-500")
                      : "text-white"
                } ${disabled ? "cursor-not-allowed" : ""}`}
              />
            )}
          </div>
        )}

        {/* WHEN OPEN → show SEARCH BAR in place of the input */}
        {open && !disabled && (
          <Input
            name={name}
            disabled={disabled}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocusedIndex(-1);
            }}
            className={`${baseInput} ${themeInput} ${errorInput} ${className}`}
            placeholder="Search..."
            onKeyDown={handleKeyDown}
          />
        )}

        {/* DROPDOWN LIST */}
        {open && !disabled && (
          <div
            className={`
              absolute left-0 right-0 mt-2 border-2 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto
              ${dropdownStyles}
            `}
            role="listbox"
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            {/* OPTIONS */}
            {filtered.length === 0 && (
              <div className="p-3 opacity-60 italic" role="option" tabIndex={0} aria-selected={false}>
                Pas de résultats...
              </div>
            )}

            {filtered.map((option, index) => {
              const selected = option.value === value;
              const focused = index === focusedIndex;

              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={selected}
                  tabIndex={0}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }
                  }}
                  className={`
                    px-4 py-2 cursor-pointer transition
                    ${selected ? "opacity-100 font-bold" : "opacity-80"}
                    ${focused ? "bg-white/20" : ""}
                  `}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && <p className="text-orange font-inter text-sm pt-1">{error}</p>}
    </div>
  );
}
