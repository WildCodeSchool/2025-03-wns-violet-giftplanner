import Icon from "../../utils/Icon";
import Subtitle from "../../utils/Subtitle";

type MobileChatHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onMenuClick?: () => void;
};

export default function MobileChatHeader({ title, subtitle, onBack, onMenuClick }: MobileChatHeaderProps) {
  return (
    <div className="relative w-full h-[80px] bg-blue rounded-none flex-row flex justify-center items-center py-4">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-0 px-4 cursor-pointer"
        aria-label="Retour"
      >
        <Icon icon="arrowLeft" className="text-white text-xl" />
      </button>

      <div className="flex flex-col w-full items-center">
        <Subtitle>{title}</Subtitle>
        {subtitle && <p className="text-white text-xs sm:text-sm place-self-center">{subtitle}</p>}
      </div>

      <button
        type="button"
        onClick={onMenuClick}
        className="absolute right-0 px-4 cursor-pointer"
        aria-label="Menu"
      >
        <Icon icon="dots" className="text-white" />
      </button>
    </div>
  );
}
