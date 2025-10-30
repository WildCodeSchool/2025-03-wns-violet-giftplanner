interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    theme?: "light" | "dark";
    className?: string;
    placholder?: string;
    label?: string;
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
    ...props
}: InputProps) {
  const baseStyles =
    "w-full px-4 py-2 border-2 rounded-lg font-medium outline-none transition-colors duration-200";

  const themeStyles =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-400"
      : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500";

  const errorStyles = error ? "border-red-500 focus:border-red-500" : "";

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`${baseStyles} ${themeStyles} ${errorStyles} ${className}`}
        name={name}
        placeholder={placeholder}
        {...props}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
