import { useState } from "react";
import "./userprofile.css";
import Icon from "../components/utils/Icon";
import { useMyProfileStore } from "../zustand/myProfileStore";

const UserProfilePage = () => {
    const { userProfile, setUserProfile } = useMyProfileStore();
    const [imageUrl, setImageUrl] = useState(userProfile?.image_url || "/default-profile.png"); const [isEditing, setIsEditing] = useState(false);
    const [messageError, setMessageError] = useState("");
    const [messageSuccess, setMessageSuccess] = useState("");


    const [profile, setProfile] = useState({
        lastName: "",
        firstName: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        image_url: "",
    });

    const [editForm, setEditForm] = useState({ ...profile });


    const [passwordForm, setPasswordForm] = useState({
        password: "",
        passwordConfirmation: "",
    });

/*     const handleImageClick = () => {
        if (isEditing) {
            document.getElementById('file-input')?.click();
        }
    }; */

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newImageUrl = URL.createObjectURL(file);
        setImageUrl(newImageUrl);

        // MAJ instantanée du store pour Navigation
        if (userProfile) {
            setUserProfile({ ...userProfile, image_url: newImageUrl });
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditForm({ ...profile });
        setPasswordForm({ password: "", passwordConfirmation: "" });
        setMessageError("");
        setMessageSuccess("");
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditForm({ ...profile });
        setPasswordForm({ password: "", passwordConfirmation: "" });
        setMessageError("");
        setMessageSuccess("");
    };

    const handleSaveClick = () => {
        setMessageError("");
        setMessageSuccess("");

        if (!editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.date_of_birth.trim()) {
            setMessageError("Tous les champs obligatoires doivent être remplis");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(editForm.email)) {
            setMessageError("Adresse email invalide");
            return;
        }

        if (passwordForm.password || passwordForm.passwordConfirmation) {
            if (passwordForm.password.length < 6) {
                setMessageError("Mot de passe trop court (minimum 6 caractères)");
                return;
            }

            if (passwordForm.password.length > 100) {
                setMessageError("Mot de passe trop long");
                return;
            }

            if (passwordForm.password !== passwordForm.passwordConfirmation) {
                setMessageError("Les mots de passe ne correspondent pas");
                return;
            }
        }

        setProfile({ ...editForm });
        setIsEditing(false);
        setPasswordForm({ password: "", passwordConfirmation: "" });
        setMessageSuccess("Profil mis à jour avec succès !");

        console.log("Données sauvegardées:", editForm);
        if (passwordForm.password) {
            console.log("Nouveau mot de passe:", passwordForm.password);
        }
    };

    return (
        <div className="profile-container">
            {/* Header avec titre et photo */}
            <div className="profile-header">
                <h1 className="profile-title">
                    <Icon icon="user" className="icon-image" />
                    Mon profil
                </h1>

                <div className="profile-image-wrapper">
                    <img
                        src={imageUrl}
                        alt="Profile"
                        className="profile-image"
                        onClick={() => document.getElementById("file-input")?.click()}
                    />
                    {isEditing && (
                        <div className="profile-image-edit-icon">
                            ✏️
                        </div>
                    )}
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            {/* Conteneur principal */}
            <div className="profile-content">


                {messageError && (
                    <p className="error-message">
                        {messageError}
                    </p>
                )}

                {messageSuccess && (
                    <p className="profile-success-message">
                        {messageSuccess}
                    </p>
                )}

                {/* Grille des champs */}
                <div className="profile-form-grid">
                    {/* Prénom */}
                    <div className="profile-field">
                        <label className="profile-field-label">Prénom</label>
                        <input
                            type="text"
                            value={isEditing ? editForm.firstName : profile.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            disabled={!isEditing}
                            className={`profile-input ${isEditing ? 'editable' : ''}`}
                        />
                    </div>

                    {/* Nom */}
                    <div className="profile-field">
                        <label className="profile-field-label">Nom</label>
                        <input
                            type="text"
                            value={isEditing ? editForm.lastName : profile.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            disabled={!isEditing}
                            className={`profile-input ${isEditing ? 'editable' : ''}`}
                        />
                    </div>

                    {/* Email */}
                    <div className="profile-field">
                        <label className="profile-field-label">Email</label>
                        <input
                            type="email"
                            value={isEditing ? editForm.email : profile.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            disabled={!isEditing}
                            className={`profile-input ${isEditing ? 'editable' : ''}`}
                        />
                    </div>

                    {/* Téléphone */}
                    <div className="profile-field">
                        <label className="profile-field-label">Téléphone</label>
                        <input
                            type="text"
                            value={isEditing ? editForm.phone_number : profile.phone_number}
                            onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                            disabled={!isEditing}
                            className={`profile-input ${isEditing ? 'editable' : ''}`}
                        />
                    </div>

                    {/* Date de naissance */}
                    <div className="profile-field">
                        <label className="profile-field-label">Date de naissance</label>
                        <input
                            type={isEditing ? "date" : "text"}
                            value={isEditing ? editForm.date_of_birth : new Date(profile.date_of_birth).toLocaleDateString('fr-FR')}
                            onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                            disabled={!isEditing}
                            className={`profile-input ${isEditing ? 'editable' : ''}`}
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className="profile-field">
                        <label className="profile-field-label">Mot de passe</label>
                        {!isEditing ? (
                            <input
                                type="text"
                                value="****************"
                                disabled
                                className="profile-input"
                            />
                        ) : (
                            <input
                                type="password"
                                placeholder="Nouveau mot de passe"
                                value={passwordForm.password}
                                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
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
                                value={passwordForm.passwordConfirmation}
                                onChange={(e) => setPasswordForm({ ...passwordForm, passwordConfirmation: e.target.value })}
                                className="profile-input editable profile-password-confirm"
                            />
                        </div>
                    )}

                </div>
                {/* Bouton Enregistrer */}
                {isEditing && (
                    <div className="profile-actions">
                        <button onClick={handleSaveClick} className="profile-save-button">
                            Enregistrer
                        </button>
                        <button onClick={handleCancelClick} className="profile-cancel-button">
                            Annuler
                        </button>
                    </div>
                )}


                {!isEditing && (
                    <button onClick={handleEditClick} className="profile-editer-button">
                        Modifier mes infos
                    </button>
                )}</div>

        </div>
    );
};

export default UserProfilePage;