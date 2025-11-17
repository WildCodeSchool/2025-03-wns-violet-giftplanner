// src/components/Wishlist.tsx
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Icon from "./utils/Icon";
import Button from "./utils/Button";
import Modal from "./utils/Modal";
import type { Gift } from "../types/Gift";
import { WISHLIST_ITEMS, ADD_GIFT, DELETE_GIFT, UPDATE_GIFT } from "../graphql/operations";
import { useMyProfileStore } from "../zustand/myProfileStore";
import GiftCard, { GiftCardSkeleton } from "./wishlist/GiftCard";

export default function Wishlist() {
  const { data, loading, error } = useQuery<{ wishlistItems: Gift[] }>(WISHLIST_ITEMS, {
    notifyOnNetworkStatusChange: true,
  });
  const items = data?.wishlistItems ?? [];

  const user = useMyProfileStore((s) => s.userProfile);

  const [addGift, { loading: creating }] = useMutation(ADD_GIFT);

  const [deleteGift] = useMutation(DELETE_GIFT);

  const [updateGift, { loading: updating }] = useMutation(UPDATE_GIFT);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    url: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", imageUrl: "", url: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error("No logged-in user id available.");
      return;
    }
    await addGift({
      variables: {
        data: {
          name: formData.name,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          url: formData.url || undefined,
          userId: Number(user.id),
        },
      },
      refetchQueries: [{ query: WISHLIST_ITEMS }],
      awaitRefetchQueries: true,
    });

    setFormData({ name: "", description: "", imageUrl: "", url: "" });
    setIsModalOpen(false);
  };

  const handleDeleteGift = async (gift: Gift) => {
    try {
      await deleteGift({
        variables: { id: Number(gift.id) },
        refetchQueries: [{ query: WISHLIST_ITEMS }],
        awaitRefetchQueries: true,
      });
    } catch (err) {
      console.error("Erreur lors de la suppression du cadeau :", err);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGift) return;

    await updateGift({
      variables: {
        id: Number(editingGift.id),
        data: {
          name: editFormData.name,
          description: editFormData.description || null,
          imageUrl: editFormData.imageUrl || null,
          url: editFormData.url || null,
        },
      },
      refetchQueries: [{ query: WISHLIST_ITEMS }],
      awaitRefetchQueries: true,
    });

    setEditModalOpen(false);
    setEditingGift(null);
  }


  return (
    <div className="h-full p-3 px-2 flex flex-col mx-auto bg-[#EA4B09] rounded-2xl">
      {/* Header */}
      <div className="flex justify-between text-[#FDFBF6] p-3 pb-6">
        <div className="flex items-center">
          <Icon icon="heart" className="mr-2 text-2xl" />
          <h2 className="text-2xl font-bold tracking-wide">Ma wishlist</h2>
        </div>
        <Button
          icon="plus"
          text="Nouvelle idée"
          colour="green"
          onClick={() => setIsModalOpen(true)}
        />

      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-5">
        {error ? (
          <div className="text-[#FDFBF6] bg-black/20 rounded-xl p-4">Erreur: {error.message}</div>
        ) : (
          <ul className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-stretch">
            {loading && (
              <>
                <li><GiftCardSkeleton /></li>
                <li><GiftCardSkeleton /></li>
                <li><GiftCardSkeleton /></li>
                <li><GiftCardSkeleton /></li>
              </>
            )}

            {!loading && items.length === 0 && (
              <li className="col-span-full">
                <div className="flex flex-col items-center justify-center py-16 text-[#FDFBF6]">
                  <Icon icon="gift" className="text-7xl opacity-80 mb-3" />
                  <p className="text-lg mb-4">Aucune idée pour l’instant.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-[#019645] text-[#FDFBF6] font-semibold px-4 py-2 rounded-xl hover:bg-[#01803b] transition"
                  >
                    <Icon icon="plus" />
                    Ajouter une idée
                  </button>
                </div>
              </li>
            )}

            {!loading &&
              items.map((gift) => (
                <li key={gift.id} className="h-full">
                  <GiftCard 
                    gift={gift} 
                    onDelete={handleDeleteGift} 
                    onEdit={(gift) => {
                      setEditingGift(gift);
                      setEditFormData({
                        name: gift.name ?? "",
                        description: gift.description ?? "",
                        imageUrl: gift.imageUrl ?? "",
                        url: gift.url ?? "",
                      });
                      setEditModalOpen(true);
                    }}/>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Modal when adding */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold text-[#200904] mb-4">Ajouter une nouvelle idée</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[#200904] mb-1">Nom</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
          </div>
          <div>
            <label className="block text-[#200904] mb-1">Description</label>
            <textarea
              name="description" value={formData.description} onChange={handleChange} rows={2}
              maxLength={150}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
            <div className="text-xs text-gray-600 text-right">{formData.description.length}/150</div>
          </div>
          <div>
            <label className="block text-[#200904] mb-1">Image URL</label>
            <input
              type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
          </div>
          <div>
            <label className="block text-[#200904] mb-1">Lien d'achat</label>
            <input
              type="url" name="url" value={formData.url} onChange={handleChange}
              placeholder="https://exemple.com"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button" onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-400 text-[#200904] hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit" disabled={creating}
              className="px-4 py-2 rounded-lg bg-[#019645] text-[#FDFBF6] font-semibold hover:bg-[#01803b]"
            >
              {creating ? "Ajout…" : "Ajouter"}
            </button>
          </div>
        </form>
      </Modal>

      {/* edit modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <h2 className="text-xl font-bold text-[#200904] mb-4">Modifier le cadeau</h2>
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <div>
            <label className="block text-[#200904] mb-1">Nom</label>
            <input
              type="text" name="name" value={editFormData.name} onChange={handleEditChange} required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
          </div>
          <div>
            <label className="block text-[#200904] mb-1">Description</label>
            <textarea
              name="description" value={editFormData.description} onChange={handleEditChange} rows={2}
              maxLength={150}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
            <div className="text-xs text-gray-600 text-right">{editFormData.description.length}/150</div>
          </div>
          <div>
            <label className="block text-[#200904] mb-1">Image URL</label>
            <input
              type="url" name="imageUrl" value={editFormData.imageUrl} onChange={handleEditChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
          </div>
          <div>
            <label className="block text-[#200904] mb-1">Lien d'achat</label>
            <input
              type="url" name="url" value={editFormData.url} onChange={handleEditChange}
              placeholder="https://exemple.com"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button" onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-400 text-[#200904] hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit" disabled={updating}
              className="px-4 py-2 rounded-lg bg-[#019645] text-[#FDFBF6] font-semibold hover:bg-[#01803b]"
            >
              {updating ? "Mis à jour…" : "Mettre à jour"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
