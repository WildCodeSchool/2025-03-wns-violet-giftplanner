import Icon from "./Icon";

interface TagProps {
  tag: string;
  type?: "info" | "warning" | "success" | "dark";
  className?: string;
  onClick: () => void;
}

const tagStyles = {
  info: "bg-blue text-white",
  warning: "bg-orange text-white",
  success: "bg-green text-white",
  dark: "bg-dark text-white",
};

export default function Tag({ tag, type = "info", onClick, className }: TagProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 w-fit rounded-full text-md pl-4 pr-2 py-1 font-medium ${tagStyles[type]} ${className}`}
    >
      <span>{tag}</span>

      <button
        type="button"
        className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/20 transition"
        onClick={onClick}
      >
        <Icon icon="delete" className="text-white text-lg cursor-pointer" />
      </button>
    </div>
  );
}
