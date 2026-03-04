import { useState } from "react";
import "./adminpage.css";
import { LuBan, LuSearch, LuShield, LuShieldCheck, LuTrash2 } from "react-icons/lu";
import {
  useBanUserMutation,
  useDeleteUserMutation,
  useGetAllUsersForAdminQuery,
  useUnbanUserMutation, // ← Ajoute cette import après avoir régénéré les types
} from "../graphql/generated/graphql-types";
import type { ModalConfig, User } from "../types/AdminPage";
import getProfilePictureUrl from "../utils/pictureProfileManager";
import { useMyProfileStore } from "../zustand/myProfileStore";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

// Local ConfirmModal using page CSS (no Tailwind)
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <button type="button" className="modal-overlay" onClick={onClose}>
      <button type="button" className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="modal-btn-cancel" onClick={onClose}>
            Annuler
          </button>
          <button type="button" className="modal-btn-confirm" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </button>
    </button>
  );
};

const AdminPage = () => {
  const { data, loading, error, refetch } = useGetAllUsersForAdminQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation(); // ← Nouvelle mutation
  const { userProfile } = useMyProfileStore();

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    type: null,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ← Modifier cette fonction pour accepter "unban"
  const openModal = (type: "delete" | "ban" | "unban", user: User) => {
    setSelectedUser(user);

    let title = "";
    let message = "";

    if (type === "delete") {
      title = "Supprimer l'utilisateur";
      message = `Voulez-vous supprimer définitivement ${user.firstName} ${user.lastName} ?`;
    } else if (type === "ban") {
      title = "Bannir l'utilisateur";
      message = `Voulez-vous bannir ${user.firstName} ${user.lastName} ?`;
    } else if (type === "unban") {
      title = "Débannir l'utilisateur";
      message = `Voulez-vous débannir ${user.firstName} ${user.lastName} ? Il pourra à nouveau se connecter.`;
    }

    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
    });

    setMessageError("");
    setMessageSuccess("");
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: null });
    setSelectedUser(null);
  };

  const handleConfirm = async () => {
    if (!selectedUser || !modalConfig.type) return;

    try {
      if (modalConfig.type === "delete") {
        const res = await deleteUser({
          variables: { userId: parseFloat(selectedUser.id) },
        });

        if (!res.data?.deleteUser.success) {
          setMessageError(res.data?.deleteUser.message || "Erreur inconnue");
        } else {
          setMessageSuccess("Utilisateur supprimé !");
        }
      }

      if (modalConfig.type === "ban") {
        const res = await banUser({
          variables: { userId: parseFloat(selectedUser.id) },
        });

        if (!res.data?.banUser.success) {
          setMessageError(res.data?.banUser.message || "Erreur inconnue");
        } else {
          setMessageSuccess("Utilisateur banni !");
        }
      }

      // ← Nouveau bloc pour débannir
      if (modalConfig.type === "unban") {
        const res = await unbanUser({
          variables: { userId: parseFloat(selectedUser.id) },
        });

        if (!res.data?.unbanUser.success) {
          setMessageError(res.data?.unbanUser.message || "Erreur inconnue");
        } else {
          setMessageSuccess("Utilisateur débanni !");
        }
      }

      refetch();
    } catch (e: any) {
      setMessageError(e.message);
    }

    closeModal();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;
  if (error) return <div className="admin-error">Erreur : {error.message}</div>;

  const users: User[] = (data?.getAllUsersForAdmin || []).map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    isAdmin: u.isAdmin,
    isBanned: u.isBanned,
    bannedAt: u.bannedAt,
    createdAt: u.createdAt,
    image_url: u.image_url ?? undefined,
  }));

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter((u) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(searchLower) ||
      u.lastName.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="admin-container">
      <div className="admin-container-scrollable">
        <div className="admin-header">
          <div className="admin-title">
            <LuShield className="admin-title-icon max-md:hidden" />
            <h1 className="admin-title-text">Gestion des utilisateurs</h1>
          </div>
          <div className="admin-search-section">
            <LuSearch className="admin-search-icon" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        <div className="admin-content">
          {messageError && (
            <div className="admin-message-div">
              <p className="admin-error-message">{messageError}</p>
            </div>
          )}
          {messageSuccess && (
            <div className="admin-message-div">
              <p className="admin-success-message">{messageSuccess}</p>
            </div>
          )}

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead className="mb-[16px]">
                <tr>
                  <th>Profil</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Création</th>
                  <th className="action-title">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className={`${u.isBanned ? "admin-user-banned" : ""}`}>
                    <td className="h-[77px]">
                      <img
                        src={getProfilePictureUrl(u.image_url)}
                        className="admin-user-img w-[48px] h-[48px] object-cover rounded-[50%]"
                        alt="profile"
                      />
                    </td>
                    <td>{`${u.firstName} ${u.lastName}`}</td>
                    <td>{u.email}</td>

                    <td className="h-[77px]">
                      <span className={`admin-role ${u.isAdmin ? "admin-role-admin" : ""}`}>
                        {u.isAdmin ? "ADMIN" : "USER"}
                      </span>
                    </td>

                    <td className="h-[77px]">
                      {u.isBanned ? (
                        <span className="admin-status-banned">Banni</span>
                      ) : (
                        <span className="admin-status-active">Actif</span>
                      )}
                    </td>

                    <td className="h-[77px]">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>

                    <td className="admin-actions h-[79px]">
                      {/* ← Modifier cette partie */}
                      {u.isBanned ? (
                        <button
                          type="button"
                          className="admin-btn-unban"
                          onClick={() => openModal("unban", u)}
                          style={{ visibility: u.id === userProfile?.id ? "hidden" : "visible" }}
                        >
                          <LuShieldCheck />
                          Débannir
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn-ban"
                          onClick={() => openModal("ban", u)}
                          style={{ visibility: u.id === userProfile?.id ? "hidden" : "visible" }}
                        >
                          <LuBan />
                          Bannir
                        </button>
                      )}

                      <button
                        type="button"
                        className="admin-btn-delete"
                        onClick={() => openModal("delete", u)}
                        style={{ visibility: u.id === userProfile?.id ? "hidden" : "visible" }}
                      >
                        <LuTrash2 />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal rendered with page CSS (no Tailwind) */}
        <ConfirmModal
          isOpen={modalConfig.isOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
        />
      </div>
    </div>
  );
};

export default AdminPage;
