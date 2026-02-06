type CardProps = {
  id?: number;
  title: string;
  img?: string;
  url?: string;
  children?: React.ReactNode;
  large?: boolean;
  square?: boolean;
  nbNewMessages?: number;
  active?: boolean;
  actions?: React.ReactNode;
};

export default function Card({
  id,
  title,
  img = "papier-theme",
  url,
  large = false,
  square = false,
  children,
  nbNewMessages,
  active = false,
  actions,
}: CardProps) {
  const isExternalImage = img?.startsWith("http");

  if (!url) {
    return (
      <div
        key={id}
        className={`group relative flex items-center bg-white rounded-lg p-4 mr-4 shadow ${
          large ? "min-h-[100px]" : "min-h-[75px]"
        }`}
      >
        <img
          src={isExternalImage ? img : `/images/${img}.jpg`}
          alt={title}
          className={`h-12 w-12 ${square ? "rounded-xl" : "rounded-full"} object-cover mr-4`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/papier-theme.jpg";
          }}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 truncate">{title}</h2>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{children}</div>
        </div>

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-lg transition group-hover:bg-black/10">
          {actions && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 pointer-events-auto">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <a
      key={id}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center bg-white rounded-lg p-4 mr-4 shadow transition ${
        large ? "min-h-[100px]" : "min-h-[75px]"
      } ${active ? "bg-[#CECFEB]" : "bg-white"}`}
    >
      <div className="relative">
        <img
          src={isExternalImage ? img : `/images/${img}.jpg`}
          alt={title}
          className={`h-12 w-12 ${square ? "rounded-xl" : "rounded-full"} object-cover mr-4`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/papier-theme.jpg";
          }}
        />

        {nbNewMessages && nbNewMessages > 0 ? (
          <p className="absolute w-[25px] h-[25px] font-semibold bg-[var(--color-orange)] rounded-[50%] text-white top-[-7px] right-[10px]">
            {" "}
            {nbNewMessages}{" "}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h2 className="font-inter-extra-bold text-gray-900 truncate">{title}</h2>
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">{children}</div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-lg transition group-hover:bg-black/10">
        {actions && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 pointer-events-auto">
            {actions}
          </div>
        )}
      </div>
    </a>
  );
}
