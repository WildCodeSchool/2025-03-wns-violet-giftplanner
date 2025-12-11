import Input from "./Input";
import  ToggleSwitch from "./ToggleSwitch";

interface InputToggleProps extends React.ComponentProps<typeof Input> {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    label?: string;
    }

export default function InputWithToggle({ checked, onCheckedChange, theme = "light", label, ...props }: InputToggleProps) {
    return (
    <div className="flex flex-row w-full gap-1 justify-between items-center">
        {checked && (<Input theme={theme} {...props} placeholder={label} />)}
        {!checked && <span className="text-white">{label}</span>}
        <ToggleSwitch checked={checked} onChange={onCheckedChange} colour={theme} />
    </div>
    );
    }
