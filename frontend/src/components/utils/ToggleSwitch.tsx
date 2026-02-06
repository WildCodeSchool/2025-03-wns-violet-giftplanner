import type { ColourScheme } from "../../types/ColourScheme";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  colour?: ColourScheme["colour"];
  mode?: "light" | "dark";
}

// const colourClasses: Record<string, string> = {
//   orange: "bg-red",
//   blue: "bg-blue",
//   green: "bg-green",
//   yellow: "bg-yellow",
//   light: "bg-light-gray",

//   // add more as needed
// };

export default function ToggleSwitch({ checked, onChange, mode = "light" }: ToggleProps) {
  const borderColour = mode === "dark" ? "border-dark" : "border-white";
  // When checked: solid fill, when unchecked: transparent (outline only)
  const bgColour = checked ? (mode === "dark" ? "bg-dark" : "bg-white") : "bg-transparent";
  // Bullet border color: when checked on light mode, use green so it's visible against white bg
  const bulletBorderColour = checked
    ? mode === "dark"
      ? "border-white"
      : "border-green"
    : mode === "dark"
      ? "border-dark"
      : "border-white";

  return (
    <div
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      className={`
        shrink-0
        basis-auto
        cursor-pointer flex items-center rounded-full
        transition-colors duration-300 border-[3.5px] ${borderColour} ${bgColour}

        /* base (mobile) */
        w-14 h-8

        /* tablet & desktop */
        sm:w-16 sm:h-9
      `}
    >
      {/* Hollow bullet - just border, transparent inside */}
      <div
        className={`
          shrink-0
          bg-transparent rounded-full transform transition-all duration-300
          ${bulletBorderColour} border-[3px]

          /* base bullet */
          w-5 h-5 ${checked ? "translate-x-6" : "translate-x-0.5"}

          /* tablet & desktop bullet */
          sm:w-6 sm:h-6 ${checked ? "sm:translate-x-7" : "sm:translate-x-0.5"}
        `}
      />
    </div>
  );
}
