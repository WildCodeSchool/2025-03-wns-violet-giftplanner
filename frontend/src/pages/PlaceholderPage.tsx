import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../generated/graphql-types";
import consoleErrorDev from "../hook/erreurMod";
import { useMyProfileStore } from "../zustand/myProfileStore";
import "./PlaceholderPage.css";

const PlaceholderPage = () => {
  const [logoutMutation] = useLogoutMutation();
  const { clearUserProfile, userProfile } = useMyProfileStore();
  const navigate = useNavigate();

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

  return (
    <div className="page">
      <header className="header">
        <h1>🚧 Page Provisoire</h1>
      </header>

      <main className="content">
        <div className="card warning">
          <h2>⚠️ À corriger</h2>
          <ul>
            <li>
              {" "}
              <p>À remplacer par la page principale</p>
              <code>/provisoir</code>
            </li>
            <li>
              {" "}
              <p>Vérifier</p> <code>app.tsx</code>
            </li>
            <li>
              {" "}
              <p>Vérifier</p> <code>LoginForm.tsx</code>
            </li>
            <li>
              {" "}
              <p>Vérifier</p> <code>notFound404Page.tsx</code>
            </li>
          </ul>
        </div>

        <div className="card action">
          <p>Ce bouton permet de se déconnecter. La logique pourra être réutilisée ailleurs.</p>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>

        {userProfile && (
          <div className="card profil">
            <h2>👤 Profil Utilisateur</h2>
            <div className="profil-grid">
              <p>
                <span>ID :</span> {userProfile.id}
              </p>
              <p>
                <span>Prénom :</span> {userProfile.firstName}
              </p>
              <p>
                <span>Nom :</span> {userProfile.lastName}
              </p>
              <p>
                <span>Email :</span> {userProfile.email}
              </p>
              <p>
                <span>Image :</span> {userProfile.image_url}
              </p>
              <p>
                <span>Admin :</span> {userProfile.isAdmin ? "Oui" : "Non"}
              </p>
              <p>
                <span>Vérifié :</span> {userProfile.isVerified ? "Oui" : "Non"}
              </p>
              <p>
                <span>Date de naissance :</span> {userProfile.date_of_birth}
              </p>
              <p>
                <span>Créé le :</span> {userProfile.createdAt}
              </p>
              <p>
                <span>Mis à jour le :</span> {userProfile.updatedAt}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PlaceholderPage;
