// src/components/Wishlist.tsx
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  ADD_GIFT,
  DELETE_GIFT,
  MY_WISHLIST_ITEMS,
  UPDATE_GIFT,
} from "../graphql/operations/wishlistOperations";
import { useToggle } from "../hooks/useToggle";
import type { Gift } from "../types/Gift";
import { useMyProfileStore } from "../zustand/myProfileStore";
import Button from "./utils/Button";
import Icon from "./utils/Icon";
import Modal from "./utils/Modal";
import GiftCard, { GiftCardSkeleton } from "./wishlist/GiftCard";
import "./wishlist/Wishlist.css";

export default function Wishlist() {
  const { data, loading, error } = useQuery<{ myWishlistItems: Gift[] }>(MY_WISHLIST_ITEMS, {
    notifyOnNetworkStatusChange: true,
  });

  const items = data?.myWishlistItems ?? [];

  const user = useMyProfileStore((s) => s.userProfile);

  const [addGift, { loading: creating }] = useMutation(ADD_GIFT);

  const [deleteGift] = useMutation(DELETE_GIFT);

  const [updateGift, { loading: updating }] = useMutation(UPDATE_GIFT);

  // hooks
  const addModal = useToggle(false);
  const editModal = useToggle(false);

  // state
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    url: "",
  });
  const [formData, setFormData] = useState({ name: "", description: "", imageUrl: "", url: "" });
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  // helpers
  const closeAddModal = () => {
    addModal.close();
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      url: "",
    });
  };
  const closeEditModal = () => {
    editModal.close();
    setEditingGift(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error("Aucun identifiant utilisateur connecté disponible.");
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
      refetchQueries: [{ query: MY_WISHLIST_ITEMS }],
      awaitRefetchQueries: true,
    });

    setFormData({ name: "", description: "", imageUrl: "", url: "" });
    // setIsModalOpen(false);
    addModal.close();
  };

  const handleDeleteGift = async (gift: Gift) => {
    try {
      await deleteGift({
        variables: { id: Number(gift.id) },
        refetchQueries: [{ query: MY_WISHLIST_ITEMS }],
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
      refetchQueries: [{ query: MY_WISHLIST_ITEMS }],
      awaitRefetchQueries: true,
    });
    editModal.close();
    setEditingGift(null);
  };

  return (
    <div className="h-full p-10 flex flex-col bg-orange rounded-[18px] ml-10 overflow-hidden max-md:p-6 max-md:ml-0 max-md:rounded-none max-md:pb-20 max-md:relative">
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex justify-between items-start text-white mb-8 flex-shrink-0 max-md:flex-col max-md:gap-4 max-md:mt-4">
          <div className="flex items-center gap-4 max-md:justify-start max-md:w-full">
            <Icon icon="heart" className="text-[40px] max-md:hidden" />
            <h2 className="text-[32px] font-bold max-md:text-[24px]">Ma wishlist</h2>
          </div>
          <Button
            icon="plus"
            text="Nouvelle idée"
            colour="green"
            onClick={addModal.open}
            className="max-md:hidden"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto wishlist-content-mobile">
          {error ? (
            <div className="text-white bg-black/20 rounded-xl p-4">Erreur: {error.message}</div>
          ) : !loading && items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-white">
                <Icon icon="gift" className="text-7xl opacity-80 mb-3" />
                <p className="text-lg mb-8">Aucune idée pour l'instant.</p>
                <Button
                  type="button"
                  icon="plus"
                  text="Ajouter une idée"
                  colour="green"
                  onClick={addModal.open}
                  className="px-4 py-2 rounded-xl"
                />
              </div>
            </div>
          ) : (
            <ul className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] auto-rows-fr max-md:grid-cols-2">
              {loading && (
                <>
                  <li>
                    <GiftCardSkeleton />
                  </li>
                  <li>
                    <GiftCardSkeleton />
                  </li>
                  <li className="max-md:hidden">
                    <GiftCardSkeleton />
                  </li>
                  <li className="max-md:hidden">
                    <GiftCardSkeleton />
                  </li>
                </>
              )}

              {!loading &&
                items.map((gift) => (
                  <li key={gift.id} className="h-full">
                    <GiftCard
                      gift={gift}
                      className="h-full"
                      onDelete={handleDeleteGift}
                      onEdit={(gift) => {
                        setEditingGift(gift);
                        setEditFormData({
                          name: gift.name ?? "",
                          description: gift.description ?? "",
                          imageUrl: gift.imageUrl ?? "",
                          url: gift.url ?? "",
                        });
                        editModal.open();
                      }}
                    />
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Mobile button - positioned at bottom */}
      <div className="hidden max-md:block wishlist-mobile-button-container">
        <Button
          icon="plus"
          text="Nouvelle idée"
          colour="green"
          onClick={addModal.open}
          className="wishlist-mobile-button"
        />
      </div>

      {/* Modal when adding */}
      <Modal isOpen={addModal.isOpen} onClose={closeAddModal}>
        <div className="modal-mobile-content">
          <h2 className="text-xl font-bold text-dark mb-4">Ajouter une nouvelle idée</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-dark mb-1">
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-dark mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                maxLength={150}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
              <div className="text-xs text-gray-600 text-right">{formData.description.length}/150</div>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-dark mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-dark mb-1">
                Lien d'achat
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://exemple.com"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 modal-buttons">
              <Button
                type="submit"
                text={creating ? "Ajout…" : "Ajouter"}
                colour="green"
                className="rounded-[10px]"
                // If Button supports disabled:
                disabled={creating}
              />
              <Button type="button" colour="dark" onClick={closeAddModal} className="rounded-[10px]">
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* edit modal */}
      <Modal isOpen={editModal.isOpen} onClose={closeEditModal}>
        <div className="modal-mobile-content">
          <h2 className="text-xl font-bold text-dark mb-4">Modifier le cadeau</h2>
          <form onSubmit={handleEditSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-dark mb-1">
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-dark mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                rows={2}
                maxLength={150}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
              <div className="text-xs text-gray-600 text-right">{editFormData.description.length}/150</div>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-dark mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={editFormData.imageUrl}
                onChange={handleEditChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-dark mb-1">
                Lien d'achat
              </label>
              <input
                type="url"
                name="url"
                value={editFormData.url}
                onChange={handleEditChange}
                placeholder="https://exemple.com"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 modal-buttons">
              <Button type="submit" colour="green" className="rounded-[10px]">
                {updating ? "Mis à jour…" : "Mettre à jour"}
              </Button>
              <Button type="button" colour="dark" onClick={closeEditModal} className="rounded-[10px]">
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
