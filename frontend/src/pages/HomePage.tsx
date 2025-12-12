import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  useEffect(() => {
    if (location.state?.accountDeleted) {
      setShowDeleteMessage(true);
      // Nettoyer le state de navigation
      window.history.replaceState({}, document.title);

      // Masquer le message après 5 secondes
      const timer = setTimeout(() => {
        setShowDeleteMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="infohome-background-red">
      <img className="infohome-logo" src="/images/logo-clair.png" alt="Logo" />
      <img className="infohome-serpentin" src="/images/serpentin-jaune.png" alt="Serpentin Jaune" />
      <img className="infohome-carre" src="/images/carre-vert.png" alt="Carré vert" />
      <img className="infohome-etoile" src="/images/etoile-rose.png" alt="Etoile rose" />
      <img className="infohome-cotillon" src="/images/cotillon-bleu.png" alt="Cotillon rouge" />

      {showDeleteMessage && (
        <div className="homepage-success-notification">Votre profil a bien été supprimé.</div>
      )}

      <div className="infohome-content">
        <h1 className="infohome-content-text-home">
          Le site magique pour ne plus se prendre la tête pour les cadeaux communs.
        </h1>

        <div className="div-bouton-homepage">
          <a href="/connexion" className="button-white-home">
            Connexion
          </a>
          <a href="/inscription" className="button-black-home">
            Inscription
          </a>
        </div>
      </div>

      <footer className="homepage-footer">
        <p className="homepage-footer-text">
          Vous avez quelconque question sur notre projet ou la gestion de votre compte?{" "}
          <a href="/contact" className="homepage-footer-link">
            Contactez nous
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
