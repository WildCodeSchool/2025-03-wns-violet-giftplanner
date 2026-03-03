import { useMutation } from "@apollo/client";
import { useEffect, useId, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { LuHeart, LuPencil, LuTrash2 } from "react-icons/lu";
import {
  useAddGiftToGroupListMutation,
  useDeleteGiftMutation,
  useUpdateGiftMutation,
} from "../../graphql/generated/graphql-types";
import { TOGGLE_GIFT_LIKE } from "../../graphql/operations/wishlistOperations";
import type { Gift } from "../../types/Gift";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import Button from "../utils/Button";
import DropdownMenu from "../utils/DropdownMenu";
import Modal from "../utils/Modal";
import "../wishlist/Wishlist.css";

type Props = {
  groupId: number;
  beneficiaryItems: Gift[];
  groupItems: Gift[];
  onAddIdea?: () => void;
};

type CardProps = {
  gift: Gift;
  isOwner?: boolean;
  likeState: { count: number; liked: boolean };
  onEdit?: () => void;
  onDelete?: () => void;
  onLikeToggle: () => void;
};

function WishlistCard({ gift, isOwner, likeState, onEdit, onDelete, onLikeToggle }: CardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const isExternal = gift.imageUrl?.startsWith("http");
  const imgSrc = isExternal ? (gift.imageUrl as string) : "/images/papier-theme.jpg";

  return (
    <div className="relative bg-white rounded-[8px] shadow-sm flex items-center gap-3 p-2 pr-10">
      {/* Photo avec marges blanches */}
      <div className="flex-shrink-0 w-20 h-20 bg-[#FDFBF6] rounded-[8px] p-1">
        <img
          src={imgSrc}
          alt={gift.name}
          className="w-full h-full object-cover rounded-[6px]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/papier-theme.jpg";
          }}
        />
      </div>

      {/* Titre + description */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-dark text-sm leading-tight line-clamp-1">{gift.name}</p>
        {gift.description && <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{gift.description}</p>}
      </div>

      {/* Trois points + dropdown (propriétaire uniquement) */}
      {isOwner && (
        <div ref={menuRef} className="absolute top-2 right-2">
          <button
            type="button"
            className="p-1 text-dark"
            aria-label="Menu"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
          >
            <HiDotsVertical className="text-lg" />
          </button>
          {isMenuOpen && (
            <DropdownMenu
              width={165}
              items={[
                {
                  label: "Modifier",
                  icon: <LuPencil />,
                  onClick: () => {
                    setIsMenuOpen(false);
                    onEdit?.();
                  },
                },
                {
                  label: "Supprimer",
                  icon: <LuTrash2 />,
                  danger: true,
                  onClick: () => {
                    setIsMenuOpen(false);
                    onDelete?.();
                  },
                },
              ]}
            />
          )}
        </div>
      )}

      {/* Bouton like — bas droite, aligné avec les trois points */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle();
        }}
        className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-[6px] bg-dark text-xs font-semibold transition-colors"
      >
        <LuHeart
          className={`text-sm ${likeState.liked ? "text-[#EA4B09]" : "text-white"}`}
          style={likeState.liked ? { fill: "currentColor" } : undefined}
        />
        <span className={likeState.liked ? "text-[#EA4B09]" : "text-white"}>{likeState.count}</span>
      </button>
    </div>
  );
}

export default function Wishlist({ groupId, beneficiaryItems, groupItems, onAddIdea }: Props) {
  const user = useMyProfileStore((s) => s.userProfile);
  const currentUserId = user?.id;

  const uid = useId();
  const nameId = `${uid}-name`;
  const descriptionId = `${uid}-description`;
  const imageUrlId = `${uid}-imageUrl`;
  const urlId = `${uid}-url`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", imageUrl: "", url: "" });
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  // État local des likes (mise à jour optimiste)
  const [localLikes, setLocalLikes] = useState<Record<string, { count: number; liked: boolean }>>({});

  useEffect(() => {
    const initial: Record<string, { count: number; liked: boolean }> = {};
    for (const gift of [...groupItems, ...beneficiaryItems]) {
      initial[gift.id] = { count: gift.likeCount ?? 0, liked: gift.likedByMe ?? false };
    }
    setLocalLikes(initial);
  }, [groupItems, beneficiaryItems]);

  const getLikeState = (gift: Gift) =>
    localLikes[gift.id] ?? { count: gift.likeCount ?? 0, liked: gift.likedByMe ?? false };

  const [addGiftToGroupList, { loading: creating }] = useAddGiftToGroupListMutation();
  const [updateGift, { loading: updating }] = useUpdateGiftMutation();
  const [deleteGift] = useDeleteGiftMutation();
  const [toggleGiftLike] = useMutation(TOGGLE_GIFT_LIKE);

  const openAddModal = () => {
    setEditingGift(null);
    setFormData({ name: "", description: "", imageUrl: "", url: "" });
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGift) {
        await updateGift({
          variables: {
            id: Number(editingGift.id),
            data: {
              name: formData.name,
              description: formData.description || undefined,
              imageUrl: formData.imageUrl || undefined,
              url: formData.url || undefined,
            },
          },
        });
      } else {
        await addGiftToGroupList({
          variables: {
            groupId,
            data: {
              name: formData.name,
              description: formData.description || undefined,
              imageUrl: formData.imageUrl || undefined,
              url: formData.url || undefined,
            },
          },
        });
      }
      setFormData({ name: "", description: "", imageUrl: "", url: "" });
      setIsModalOpen(false);
      onAddIdea?.();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  const handleDelete = async (gift: Gift) => {
    try {
      await deleteGift({ variables: { id: Number(gift.id) } });
      onAddIdea?.();
    } catch (error) {
      console.error("Erreur lors de la suppression du cadeau :", error);
    }
  };

  const handleLikeToggle = async (gift: Gift) => {
    const current = getLikeState(gift);
    const newLiked = !current.liked;
    const newCount = newLiked ? current.count + 1 : Math.max(0, current.count - 1);

    // Mise à jour optimiste
    setLocalLikes((prev) => ({ ...prev, [gift.id]: { count: newCount, liked: newLiked } }));

    try {
      await toggleGiftLike({ variables: { giftId: Number(gift.id), groupId } });
    } catch (err) {
      console.error("Erreur like :", err);
      // Rollback en cas d'erreur
      setLocalLikes((prev) => ({ ...prev, [gift.id]: current }));
    }
  };

  // Tri décroissant par nombre de likes
  const sortedGroupItems = [...groupItems].sort((a, b) => getLikeState(b).count - getLikeState(a).count);

  return (
    <div className="w-full h-full flex flex-col md:bg-orange md:rounded-2xl md:py-6 md:px-6">
      {/* Titre principal — desktop uniquement */}
      <div className="hidden md:flex justify-between items-center mb-4">
        <h2 className="text-white font-inter-extra-bold text-[1.125rem]">Wishlist du groupe</h2>
        <Button text="Proposer une idée" icon="plus" colour="green" small onClick={openAddModal} />
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6 md:-mr-4 md:pr-4 scrollbar-thin pb-24 md:pb-0">
        {/* Section bénéficiaire */}
        <section>
          <h3 className="font-inter-extra-bold text-[18px] mb-3 text-white/90">
            <span className="md:hidden">Wishlist du bénéficiaire</span>
            <span className="hidden md:inline text-dark">Idées du bénéficiaire</span>
          </h3>

          {beneficiaryItems.length === 0 ? (
            <p className="text-white/70 md:text-dark text-sm">Aucune idée ajoutée par le bénéficiaire.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {beneficiaryItems.map((gift) => (
                <WishlistCard
                  key={gift.id}
                  gift={gift}
                  likeState={getLikeState(gift)}
                  onLikeToggle={() => handleLikeToggle(gift)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section idées du groupe — triée par likes décroissants */}
        <section>
          <h3 className="font-inter-extra-bold text-[18px] mb-3 text-white/90">
            <span className="md:hidden">Wishlist du groupe</span>
            <span className="hidden md:inline text-dark">Idées proposées par le groupe</span>
          </h3>

          {sortedGroupItems.length === 0 ? (
            <p className="text-white/70 md:text-dark text-sm">Aucune idée proposée pour le moment.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {sortedGroupItems.map((gift) => {
                const isOwner =
                  gift.user?.id != null && currentUserId != null && gift.user?.id === currentUserId;
                return (
                  <WishlistCard
                    key={gift.id}
                    gift={gift}
                    isOwner={isOwner}
                    likeState={getLikeState(gift)}
                    onLikeToggle={() => handleLikeToggle(gift)}
                    onEdit={() => {
                      setEditingGift(gift);
                      setFormData({
                        name: gift.name,
                        description: gift.description || "",
                        imageUrl: gift.imageUrl || "",
                        url: gift.url || "",
                      });
                      setIsModalOpen(true);
                    }}
                    onDelete={() => handleDelete(gift)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Bouton mobile flottant en bas */}
      <div className="wishlist-mobile-button-container md:hidden">
        <button type="button" className="wishlist-mobile-button mobile-subview-button" onClick={openAddModal}>
          + Proposer une idée
        </button>
      </div>

      {/* Modal ajout / édition */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-mobile-content">
          <h2 className="text-xl font-bold text-[#200904] mb-4">
            {editingGift ? "Modifier l'idée" : "Proposer une idée"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor={nameId} className="block text-[#200904] mb-1">
                Nom
              </label>
              <input
                id={nameId}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
              />
            </div>

            <div>
              <label htmlFor={descriptionId} className="block text-[#200904] mb-1">
                Description
              </label>
              <textarea
                id={descriptionId}
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                maxLength={150}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
              />
              <div className="text-xs text-gray-600 text-right">{formData.description.length}/150</div>
            </div>

            <div>
              <label htmlFor={imageUrlId} className="block text-[#200904] mb-1">
                Image URL
              </label>
              <input
                id={imageUrlId}
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
              />
            </div>

            <div>
              <label htmlFor={urlId} className="block text-[#200904] mb-1">
                Lien d'achat
              </label>
              <input
                id={urlId}
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://exemple.com"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 modal-buttons">
              <button
                type="submit"
                disabled={creating || updating}
                className="px-4 py-2 rounded-[10px] bg-[#019645] text-[#FDFBF6] font-semibold hover:bg-[#01803b]"
              >
                {creating || updating ? "Enregistrement…" : editingGift ? "Modifier" : "Ajouter"}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-[10px] bg-[#200904] text-[#FDFBF6] font-semibold hover:bg-[#463835]"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
