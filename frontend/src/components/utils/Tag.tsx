import Icon from "./Icon";

interface TagProps {
  tag: string;
  type?: "info" | "warning" | "success" | "dark";
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

const tagStyles = {
  info: "bg-blue text-white",
  warning: "bg-orange text-white",
  success: "bg-green text-white",
  dark: "bg-dark text-white",
};

const disabledTagStyles = {
  info: "bg-blue/50 text-white/70",
  warning: "bg-orange/50 text-white/70",
  success: "bg-green/50 text-white/70",
  dark: "bg-dark/50 text-white/70",
};

export default function Tag({ tag, type = "info", onClick, className, disabled = false }: TagProps) {
  const baseStyles = disabled ? disabledTagStyles[type] : tagStyles[type];

  return (
    <div
      className={`inline-flex items-center gap-2 w-fit rounded-full text-md pl-4 pr-2 py-1 font-medium ${baseStyles} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`}
    >
      <span>{tag}</span>

      <button
        type="button"
        disabled={disabled}
        className={`flex items-center justify-center w-5 h-5 rounded-full transition ${
          disabled ? "cursor-not-allowed" : "hover:bg-white/20 cursor-pointer"
        }`}
        onClick={disabled ? undefined : onClick}
      >
        <Icon
          icon="delete"
          className={`text-white text-lg ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        />
      </button>
    </div>
  );
}
