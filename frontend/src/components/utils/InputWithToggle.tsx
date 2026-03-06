import Input from "./Input";
import ToggleSwitch from "./ToggleSwitch";

interface InputToggleProps extends React.ComponentProps<typeof Input> {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label?: string;
  question?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function InputWithToggle({
  onChange,
  checked,
  onCheckedChange,
  theme = "light",
  label,
  question,
  disabled = false,
  ...props
}: InputToggleProps) {
  return (
    <div className="flex flex-col w-full">
      {checked && label && (
        <span className={`font-semibold text-lg mb-2.5 ${theme === "light" ? "text-white" : "text-dark"}`}>
          {label}
        </span>
      )}
      <div className="flex flex-row w-full gap-4 justify-between items-center">
        {checked && (
          <Input
            theme={theme}
            {...props}
            placeholder={label}
            onChange={onChange}
            disabled={disabled}
            className="placeholder:!text-blue placeholder:!font-bold !text-white !font-bold pr-2"
          />
        )}
        {!checked && <span className="text-white font-bold text-lg">{question}</span>}
        <ToggleSwitch checked={checked} onChange={onCheckedChange} colour={theme} />
      </div>
    </div>
  );
}
