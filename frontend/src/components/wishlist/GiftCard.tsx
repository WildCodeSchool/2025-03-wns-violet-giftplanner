import clsx from "clsx";
import type { Gift } from "../../types/Gift";
import Icon from "../utils/Icon";

type GiftCardProps = {
  gift: Gift;
  className?: string;
  // optional in case actions are not desired in certain context when GiftCard is re-used
  onEdit?: (gift: Gift) => void;
  onDelete?: (gift: Gift) => void;
};

export default function GiftCard({ gift, className, onEdit, onDelete }: GiftCardProps) {
  const { name, description, imageUrl, url } = gift;

  return (
    <div
      className={clsx(
        "group relative h-full bg-[#FDFBF6] rounded-lg shadow overflow-hidden flex flex-col hover:shadow-lg transition",
        className,
      )}
    >
      {/* Clickable content */}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block h-full">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-50 object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-50 bg-[#FDFBF6]">
              <Icon icon="gift" className="text-9xl text-[#EA4B09] opacity-70" />
            </div>
          )}
          <div className="p-3 flex-1 flex flex-col">
            <h5 className="text-lg font-semibold text-[#200904] mb-2 leading-tight">{name}</h5>
            {description && <p className="text-sm text-[#200904] opacity-80 flex-1">{description}</p>}
          </div>
        </a>
      ) : (
        <div className="h-full">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-50 object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-50 bg-[#FDFBF6]">
              <Icon icon="gift" className="text-9xl text-[#EA4B09] opacity-70" />
            </div>
          )}
          <div className="p-3 flex-1 flex flex-col">
            <h5 className="text-lg font-semibold text-[#200904] mb-2">{name}</h5>
            {description && <p className="text-sm text-[#200904] opacity-80 flex-1">{description}</p>}
          </div>
        </div>
      )}

      {/* Hover/Focus overlay with actions */}
      <div className="pointer-events-none absolute inset-0 transition group-hover:bg-black/10 group-[&:has(:focus-visible)]:bg-black/10">
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 group-[&:has(:focus-visible)]:opacity-100 pointer-events-auto">
          <button
            type="button"
            aria-label="Modifier"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(gift);
            }}
            className="px-3 py-1 rounded-md bg-white/95 text-[#200904] text-sm shadow hover:bg-white"
          >
            Modifier
          </button>
          <button
            type="button"
            aria-label="Supprimer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(gift);
            }}
            className="px-3 py-1 rounded-md bg-[#A74228] text-white text-sm shadow hover:bg-[#7A2F1C]"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/** Skeleton cards for loading states */
export function GiftCardSkeleton() {
  return (
    <div className="bg-[#FDFBF6] rounded-lg shadow overflow-hidden animate-pulse">
      <div className="w-full h-50 bg-gray-200" />
      <div className="p-3">
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}
