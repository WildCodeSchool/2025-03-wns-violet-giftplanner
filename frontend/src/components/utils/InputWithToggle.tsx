import Input from "./Input";
import  ToggleSwitch from "./ToggleSwitch";

interface InputToggleProps extends React.ComponentProps<typeof Input> {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    label?: string;
    question? : string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

export default function InputWithToggle({ onChange, checked, onCheckedChange, theme = "light", label, question, ...props }: InputToggleProps) {
    return (
    <div className="flex flex-row w-full gap-1 justify-between items-center">
        {checked && (<Input theme={theme} {...props} placeholder={label} onChange={onChange} />)}
        {!checked && <span className="text-white">{question}</span>}
        <ToggleSwitch checked={checked} onChange={onCheckedChange} colour={theme} />
    </div>
    );
    }
