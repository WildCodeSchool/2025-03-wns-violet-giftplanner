import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import type { Gift } from "../../types/Gift";
import DropdownMenu from "../utils/DropdownMenu";
import "./giftcard.css";
import "./Wishlist.css";

type GiftCardProps = {
  gift: Gift;
  className?: string;
  // optional in case actions are not desired in certain context when GiftCard is re-used
  onEdit?: (gift: Gift) => void;
  onDelete?: (gift: Gift) => void;
};

export default function GiftCard({ gift, className, onEdit, onDelete }: GiftCardProps) {
  const { name, description, imageUrl, url } = gift;
  const [errorImageUrl, setErrorImageUrl] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;
      img.onerror = () => setErrorImageUrl(true);
      img.onload = () => setErrorImageUrl(false);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const imageContent = (
    <img
      src={imageUrl && !errorImageUrl ? imageUrl : "/images/papier-theme.jpg"}
      alt={name}
      className="w-full h-40 object-cover"
    />
  );

  return (
    <div
      className={clsx(
        "group relative bg-white rounded-xl shadow flex flex-col hover:shadow-lg transition",
        isMenuOpen && "z-50",
        className,
      )}
    >
      {/* Image area — overflow-hidden here to preserve rounded corners on image */}
      <div className="overflow-hidden rounded-t-xl">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="block">
            {imageContent}
          </a>
        ) : (
          imageContent
        )}
      </div>

      {/* Content area */}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <div className="p-3 flex-1 flex flex-col">
            <h5 className="text-lg font-semibold text-dark mb-2 leading-tight">{name}</h5>
            {description && <p className="text-sm text-dark opacity-80 flex-1">{description}</p>}
          </div>
        </a>
      ) : (
        <div className="div-content-giftcard">
          <h5 className="text-lg font-semibold text-dark mb-2">{name}</h5>
          {description && <p className="text-sm break-all text-dark opacity-80 flex-1">{description}</p>}
        </div>
      )}

      {/* Three-dot menu — mobile only */}
      {(onEdit || onDelete) && (
        <div ref={menuRef} className="giftcard-menu-container md:hidden">
          <button
            type="button"
            className="giftcard-menu-button"
            aria-label="Menu"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
          >
            <HiDotsVertical />
          </button>
          {isMenuOpen && (
            <DropdownMenu
              width={165}
              items={[
                ...(onEdit
                  ? [
                      {
                        label: "Modifier",
                        icon: <LuPencil />,
                        onClick: () => {
                          setIsMenuOpen(false);
                          onEdit(gift);
                        },
                      },
                    ]
                  : []),
                ...(onDelete
                  ? [
                      {
                        label: "Supprimer",
                        icon: <LuTrash2 />,
                        danger: true,
                        onClick: () => {
                          setIsMenuOpen(false);
                          onDelete(gift);
                        },
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      )}

      {/* Hover/Focus overlay with actions — desktop only */}
      <div className="pointer-events-none absolute inset-0 transition group-hover:bg-black/10 group-[&:has(:focus-visible)]:bg-black/10 max-md:hidden">
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 group-[&:has(:focus-visible)]:opacity-100 pointer-events-auto">
          <button
            type="button"
            aria-label="Modifier"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(gift);
            }}
            className="px-3 py-1 rounded-md bg-white/95 text-dark text-sm font-bold shadow hover:bg-white cursor-pointer"
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
            className="px-3 py-1 rounded-md bg-[#A74228] text-white text-sm font-bold shadow cursor-pointer"
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
    <div className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-gray-200" />
      <div className="p-3">
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}
