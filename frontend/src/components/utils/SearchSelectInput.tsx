import { useEffect, useId, useRef, useState } from "react";
import type { IconTypes } from "./Icon";
import Icon from "./Icon";

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
  icon,
  className = "",
}: SearchableSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Filter options
  const filtered = options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open) return;

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
    "w-full px-4 py-2 border-2 rounded-lg font-inter font-bold text-md outline-none transition-colors duration-200 focus:border-4 cursor-pointer";

  const themeInput =
    theme === "dark"
      ? "border-dark text-dark focus:border-dark bg-white"
      : "bg-transparent border-white text-white placeholder-white-100 focus:placeholder-white";

  const errorInput = error ? "border-orange focus:border-orange" : "";

  const dropdownStyles =
    theme === "dark" ? "bg-black border-white text-white" : "bg-white border-white border-4 text-dark";

  return (
    <div ref={containerRef} className="flex flex-col w-full" onKeyDown={handleKeyDown}>
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
            className={`${baseInput} ${themeInput} ${errorInput} ${className} flex justify-between items-center`}
            onClick={() => setOpen(true)}
          >
            <span className={value ? "" : "opacity-50"}>
              {value ? options.find((o) => o.value === value)?.label : placeholder}
            </span>

            {icon && <Icon icon={icon} className={`text-2xl ${error ? "text-orange" : "text-white"}`} />}
          </div>
        )}

        {/* WHEN OPEN → show SEARCH BAR in place of the input */}
        {open && (
          <input
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
        {open && (
          <div
            className={`
              absolute left-0 right-0 mt-2 border-2 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto
              ${dropdownStyles}
            `}
          >
            {/* OPTIONS */}
            {filtered.length === 0 && <div className="p-3 opacity-60 italic">Pas de résultats...</div>}

            {filtered.map((option, index) => {
              const selected = option.value === value;
              const focused = index === focusedIndex;

              return (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
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
