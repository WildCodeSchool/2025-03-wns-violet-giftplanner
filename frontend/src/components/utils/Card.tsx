type CardProps = {
  id?: number;
  title: string;
  img?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  large?: boolean;
  square?: boolean;
};

export default function Card({
  id,
  title,
  img = "papier-theme",
  onClick,
  large = false,
  square = false,
  children,
}: CardProps) {
  return (
    <button
      type="button"
      className={`flex items-center bg-white rounded-lg p-4 mr-4 shadow cursor-pointer ${
        large ? "min-h-[100px]" : "min-h-[75px]"
      }`}
      onClick={onClick}
      key={id}
    >
      <img
        src={`/images/${img}.jpg`}
        alt={title}
        className={`h-12 w-12 ${square ? "rounded-xl" : "rounded-full"} object-cover mr-4`}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <h2 className="font-bold text-gray-900 truncate">{title}</h2>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">{children}</div>
      </div>
    </button>
  );
}
