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
  const borderColour = mode === "dark" ? "border-gray-300" : "border-white";
  const bulletColour = mode === "dark" ? "bg-gray-200" : "bg-white";

  return (
    <div
      onClick={() => onChange(!checked)}
      aria-role="switch"
      className={`
        shrink-0
        basis-auto
        w-[56px]
        cursor-pointer flex items-center rounded-full p-[1px]
        transition-colors duration-300 border-2 ${borderColour}

        /* base (mobile) */
        w-12 h-7

        /* tablet */
        sm:w-14 sm:h-8 

        /* desktop */
        md:w-16 md:h-9 
      `}
    >
      <div
        className={`
          shrink-0 
          ${bulletColour} rounded-full shadow-md transform transition-transform duration-300

          /* base bullet */
          w-5 h-5 ${checked ? "translate-x-5" : "translate-x-0"}

          /* tablet bullet */
          sm:w-6 sm:h-6 ${checked ? "sm:translate-x-6" : "sm:translate-x-0"}

          /* desktop bullet */
          md:w-7 md:h-7 ${checked ? "md:translate-x-7" : "md:translate-x-0"}
        `}
      />
    </div>
  );
}
