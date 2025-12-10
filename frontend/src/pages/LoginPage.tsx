import LoginForm from "../components/auth/LoginForm";
import InfoHome from "../components/InfoHome";
import "../components/auth/auth.css";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1">
        <InfoHome />
      </div>
      <div className="flex-1 default-background auth-page-mobile-wrapper">
        {/* Décorations mobiles */}
        <img className="auth-mobile-decoration auth-mobile-serpentin" src="/images/serpentin-jaune.png" alt="Serpentin Jaune" />
        <img className="auth-mobile-decoration auth-mobile-carre" src="/images/carre-vert.png" alt="Carré vert" />
        <img className="auth-mobile-decoration auth-mobile-etoile" src="/images/etoile-rose.png" alt="Etoile rose" />
        <img className="auth-mobile-decoration auth-mobile-cotillon" src="/images/cotillon-bleu.png" alt="Cotillon bleu" />

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
