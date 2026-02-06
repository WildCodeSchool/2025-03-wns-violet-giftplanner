import { useState } from "react";
import {
  useAddGiftToGroupListMutation,
  useDeleteGiftMutation,
  useUpdateGiftMutation,
} from "../../graphql/generated/graphql-types";
import type { Gift } from "../../types/Gift";
import { useMyProfileStore } from "../../zustand/myProfileStore";
// import type { WishlistItemProps } from "../../types/Groups";
import Button from "../utils/Button";
import Card from "../utils/Card";
import Container from "../utils/Container";
import Modal from "../utils/Modal";

type Props = {
  groupId: number;
  beneficiaryItems: Gift[];
  groupItems: Gift[];
  onAddIdea?: () => void; // later for opening modal ?
};

export default function Wishlist({ groupId, beneficiaryItems, groupItems, onAddIdea }: Props) {
  const user = useMyProfileStore((s) => s.userProfile);
  const currentUserId = user?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", imageUrl: "", url: "" });

  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  const [addGiftToGroupList, { loading: creating }] = useAddGiftToGroupListMutation();

  const [updateGift, { loading: updating }] = useUpdateGiftMutation();

  const [deleteGift, { loading: deleting }] = useDeleteGiftMutation();

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

      // reset + close
      setFormData({ name: "", description: "", imageUrl: "", url: "" });
      setIsModalOpen(false);

      // ask parent to refresh list
      onAddIdea?.();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  const handleDelete = async (gift: Gift) => {
    try {
      await deleteGift({
        variables: {
          id: Number(gift.id),
        },
      });

      onAddIdea?.();
    } catch (error) {
      console.error("Erreur lors de la suppression du cadeau :", error);
    }
  };

  return (
    <Container
      colour="orange"
      title="Wishlist du groupe"
      classNameTitle="text-[1.125rem]"
      button={
        <Button
          text="Proposer une idée"
          icon="plus"
          colour="green"
          onClick={() => {
            setEditingGift(null);
            setFormData({ name: "", description: "", imageUrl: "", url: "" });
            setIsModalOpen(true);
          }}
        />
      }
    >
      {/* Beneficiary wishlist */}
      <section className="mb-6">
        <h3 className="text-md font-inter-extra-bold mb-2 text-dark">Idées du bénéficiaire</h3>

        {beneficiaryItems.length === 0 ? (
          <p className="text-dark text-sm">Aucune idée ajoutée par le bénéficiaire.</p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {beneficiaryItems.map((gift) => (
              <Card
                key={gift.id}
                id={Number(gift.id)}
                title={gift.name}
                img={gift.imageUrl || "papier-theme"}
                url={gift.url}
                large
                square
              >
                <p className="text-gray-600 text-xs sm:text-sm">{gift.description}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Group suggestions */}
      <section>
        <h3 className="text-md font-inter-extra-bold mb-2 text-dark">Idées proposées par le groupe</h3>

        {groupItems.length === 0 ? (
          <p className="text-dark text-sm">Aucune idée proposée pour le moment.</p>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {groupItems.map((gift) => {
              const isOwner =
                gift.user?.id != null && currentUserId != null && gift.user?.id === currentUserId;

              return (
                <Card
                  key={gift.id}
                  id={Number(gift.id)}
                  title={gift.name}
                  img={gift.imageUrl || "papier-theme"}
                  url={gift.url}
                  large
                  square
                  actions={
                    isOwner ? (
                      <>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            setEditingGift(gift);
                            setFormData({
                              name: gift.name,
                              description: gift.description || "",
                              imageUrl: gift.imageUrl || "",
                              url: gift.url || "",
                            });
                            setIsModalOpen(true);
                          }}
                          icon="dots"
                          colour="dark"
                          className="px-2 py-1 rounded-md bg-[#E9A800] text-white text-sm shadow"
                          disabled={updating}
                        />

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDelete(gift);
                          }}
                          icon="delete"
                          colour="orange"
                          className="px-2 py-1 rounded-md bg-[#A74228] text-white text-sm shadow cursor-pointer"
                          disabled={deleting}
                        />
                      </>
                    ) : null
                  }
                >
                  <p className="text-gray-600 text-xs sm:text-sm">{gift.description}</p>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Add idea modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-mobile-content">
          <h2 className="text-xl font-bold text-[#200904] mb-4">Proposer une idée</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-[#200904] mb-1">
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-[#200904] mb-1">
                Description
              </label>
              <textarea
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
              <label htmlFor="imageUrl" className="block text-[#200904] mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#EA4B09]"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-[#200904] mb-1">
                Lien d'achat
              </label>
              <input
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
                disabled={creating}
                className="px-4 py-2 rounded-[10px] bg-[#019645] text-[#FDFBF6] font-semibold hover:bg-[#01803b]"
              >
                {creating ? "Ajout…" : "Ajouter"}
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
    </Container>
  );
}
