type CardProps = {
  id?: number;
  title: string;
  img?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  large?: boolean;
  square?: boolean;
  active?: boolean;
};

export default function Card({
  id,
  title,
  img = "papier-theme",
  onClick,
  large = false,
  square = false,
  children,
  active = false,
}: CardProps) {
  return (
    <button
      type="button"
      className={`flex items-center rounded-2xl p-4 shadow cursor-pointer transition-all duration-300 ease-in-out ${
        large ? "min-h-[100px]" : "min-h-[75px]"
      } ${active ? "bg-[#CECFEB]" : "bg-white"}`}
      onClick={onClick}
      key={id}
    >
      <img
        src={`/images/${img}.jpg`}
        alt={title}
        className={`h-12 w-12 ${square ? "rounded-xl" : "rounded-full"} object-cover mr-4`}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <h2 className="font-inter-extra-bold text-gray-900 truncate">{title}</h2>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">{children}</div>
      </div>
    </button>
  );
}
