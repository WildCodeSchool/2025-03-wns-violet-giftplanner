import { useEffect, useState, useRef } from "react";
import "./userprofile.css";
import Icon from "../components/utils/Icon";
import { defaultPictureProfile } from "../data/pictureDefault";
import { useUpdateMyProfileMutation, useDeleteMyProfileMutation, useLogoutMutation } from "../generated/graphql-types";
import { useMyProfileStore } from "../zustand/myProfileStore";
import { useNavigate } from "react-router-dom";
import { LuSettings, LuPencil, LuTrash2, LuLogOut } from "react-icons/lu";
import { useIsMobile } from "../hooks/useIsMobile";
import { toast } from "react-toastify";
import consoleErrorDev from "../hooks/erreurMod";

function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const UserProfilePage = () => {
  const { userProfile, setUserProfile, clearUserProfile } = useMyProfileStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [imageUrl, setImageUrl] = useState(defaultPictureProfile);
  const [image, setImage] = useState<null | File>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState({
    lastName: userProfile?.lastName || "",
    firstName: userProfile?.firstName || "",
    email: userProfile?.email || "",
    phone_number: userProfile?.phone_number || "",
    date_of_birth: userProfile?.date_of_birth || "",
    image_url: userProfile?.image_url || "",
    password: "",
    passwordConfirmation: "",
  });
  const [profileBackup] = useState(profile);
  const [updateMyProfile] = useUpdateMyProfileMutation();
  const [deleteMyProfile] = useDeleteMyProfileMutation();
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    setTimeout(() => {
      setProfile({
        lastName: userProfile?.lastName || "",
        firstName: userProfile?.firstName || "",
        email: userProfile?.email || "",
        phone_number: userProfile?.phone_number || "",
        date_of_birth: userProfile?.date_of_birth || "",
        image_url: userProfile?.image_url || "",
        password: "",
        passwordConfirmation: "",
      });
      setImageUrl(userProfile?.image_url || defaultPictureProfile);
    }, 300);
  }, [userProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImageUrl = URL.createObjectURL(file);
    setImageUrl(newImageUrl);
    setImage(file);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessageError("");
    setMessageSuccess("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setProfile({ ...profileBackup });
    setImageUrl(userProfile?.image_url || defaultPictureProfile);
    setMessageError("");
    setMessageSuccess("");
  };

  const handleSaveClick = async () => {
    setMessageError("");
    setMessageSuccess("");

    if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.date_of_birth.trim()) {
      setMessageError("Tous les champs obligatoires doivent être remplis");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(profile.email)) {
      setMessageError("Adresse email invalide");
      return;
    }

    if (profile.password || profile.passwordConfirmation) {
      if (profile.password.length < 6) {
        setMessageError("Mot de passe trop court (minimum 6 caractères)");
        return;
      }

      if (profile.password.length > 100) {
        setMessageError("Mot de passe trop long");
        return;
      }

      if (profile.password !== profile.passwordConfirmation) {
        setMessageError("Les mots de passe ne correspondent pas");
        return;
      }
    }

    setIsEditing(false);
    if (!userProfile) {
      setMessageError("Vous devez être connecté pour modifier votre profil");
      return;
    }

    const response = await updateMyProfile({
      variables: {
        data: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone_number: profile.phone_number,
          date_of_birth: profile.date_of_birth,
          password: profile.password,
          pictureBase64: image ? ((await toBase64(image)) as string) : undefined,
        },
      },
    });

    // todo corriger ça
    if (!response || !response.data?.UpdateMyProfile) {
      setMessageError("Erreur inattendue lors de la mise à jour du profil");
      return;
    }

    setUserProfile(response.data.UpdateMyProfile);
    // setUserProfile(response.data?.updateMyProfile);
    setMessageSuccess("Profil mis à jour avec succès !");
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setMessageError("");
    setMessageSuccess("");
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteMyProfile();

      if (!response.data?.deleteMyProfile.success) {
        setMessageError(response.data?.deleteMyProfile.message || "Erreur lors de la suppression");
        setIsDeleteModalOpen(false);
        return;
      }

      setUserProfile(null);
      navigate("/", { state: { accountDeleted: true } });
    } catch (error: any) {
      setMessageError(error.message || "Erreur lors de la suppression du profil");
      setIsDeleteModalOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutMutation();
      if (res.data?.logout) {
        clearUserProfile();
        navigate("/");
      } else {
        toast.error("La déconnexion a échoué");
      }
    } catch (err) {
      toast.error("Erreur lors de la déconnexion");
      consoleErrorDev("Erreur de déconnexion :", err);
    }
  };

  const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{title}</h2>
          <p>{message}</p>
          <div className="modal-actions">
            <button className="modal-btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button className="modal-btn-confirm" onClick={onConfirm}>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-container-scrollable">
        {/* Header avec titre et photo */}
        <div className="profile-header">
          <div className="profile-title">
            <Icon icon="user" className="icon-image max-md:hidden" />
            <h1 className="profile-title-text">Mon profil</h1>
            {isMobile && (
              <div className="profile-menu-container" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="profile-menu-button"
                >
                  <LuSettings />
                </button>
                {isMenuOpen && (
                  <div className="profile-menu-dropdown">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleEditClick();
                        }}
                        className="profile-menu-item"
                      >
                        <LuPencil />
                        Modifier mes infos
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsDeleteModalOpen(true);
                      }}
                      className="profile-menu-item profile-menu-item-danger"
                    >
                      <LuTrash2 />
                      Supprimer mon profil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="profile-menu-item"
                    >
                      <LuLogOut />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="profile-image-wrapper">
            <img
              src={imageUrl}
              alt="Profile"
              className="profile-image"
              onClick={() => isEditing && document.getElementById("file-input")?.click()}
            />
            {isEditing && (
              <button
                type="button"
                className="profile-image-edit-icon"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <LuPencil />
              </button>
            )}
            <input
              id="file-input"
              type="file"
              accept="image/*"
              disabled={!isEditing}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Conteneur principal */}
        <div className="profile-content">
          {messageError && <p className="error-message">{messageError}</p>}

          {messageSuccess && <p className="profile-success-message">{messageSuccess}</p>}

          {/* Grille des champs */}
          <div className="profile-form-grid">
            {/* Prénom */}
            <div className="profile-field">
              <label className="profile-field-label">Prénom</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                disabled={!isEditing}
                className={`profile-input ${isEditing ? "editable" : ""}`}
              />
            </div>

            {/* Nom */}
            <div className="profile-field">
              <label className="profile-field-label">Nom</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                disabled={!isEditing}
                className={`profile-input ${isEditing ? "editable" : ""}`}
              />
            </div>

            {/* Email */}
            <div className="profile-field">
              <label className="profile-field-label">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
                className={`profile-input ${isEditing ? "editable" : ""}`}
              />
            </div>

            {/* Téléphone */}
            <div className="profile-field">
              <label className="profile-field-label">Téléphone</label>
              <input
                type="text"
                value={profile.phone_number}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                disabled={!isEditing}
                className={`profile-input ${isEditing ? "editable" : ""}`}
              />
            </div>

            {/* Date de naissance */}
            <div className="profile-field">
              <label className="profile-field-label">Date de naissance</label>
              <input
                type={isEditing ? "date" : "text"}
                value={
                  isEditing
                    ? profile.date_of_birth
                    : new Date(profile.date_of_birth).toLocaleDateString("fr-FR")
                }
                onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                disabled={!isEditing}
                className={`profile-input ${isEditing ? "editable" : ""}`}
              />
            </div>

            {/* Mot de passe */}
            <div className="profile-field">
              <label className="profile-field-label">Mot de passe</label>
              {!isEditing ? (
                <input type="text" value="****************" disabled className="profile-input" />
              ) : (
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={profile.password}
                  onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  className="profile-input editable"
                />
              )}
            </div>

            {/* Confirmation mot de passe (uniquement en édition) */}
            {isEditing && (
              <div className="profile-field profile-field-full">
                <label className="profile-field-label">Confirmation du mot de passe</label>
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={profile.passwordConfirmation}
                  onChange={(e) => setProfile({ ...profile, passwordConfirmation: e.target.value })}
                  className="profile-input editable profile-password-confirm"
                />
              </div>
            )}
          </div>
          {/* Boutons d'action */}
          {isEditing && (
            <div className="profile-actions">
              <button type="button" onClick={handleCancelClick} className="profile-cancel-button">
                Annuler
              </button>
              <button type="button" onClick={handleSaveClick} className="profile-save-button">
                Enregistrer
              </button>
            </div>
          )}

          {!isEditing && (
            <div className="profile-button-group">
              <button type="button" onClick={handleEditClick} className="profile-editer-button">
                Modifier mes infos
              </button>
              <button type="button" onClick={handleDeleteClick} className="profile-delete-button">
                Supprimer mon profil
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer votre profil"
        message="Êtes-vous sûr de vouloir faire ça ? Cette action est irréversible et toutes vos données seront effacées."
      />
    </div>
  );
};

export default UserProfilePage;
