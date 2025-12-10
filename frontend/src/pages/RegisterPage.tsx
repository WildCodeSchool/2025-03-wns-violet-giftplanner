import RegisterForm from "../components/auth/RegisterForm";
import InfoHome from "../components/InfoHome";
import "../components/auth/auth.css";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1">
        <InfoHome />
      </div>
      <div className="flex-1 default-background auth-page-mobile-wrapper">
        {/* Décorations mobiles - différentes de la page login */}
        <img className="auth-mobile-decoration auth-mobile-serpentin-register" src="/images/serpentin-jaune.png" alt="Serpentin Jaune" />
        <img className="auth-mobile-decoration auth-mobile-carre-register" src="/images/carre-vert.png" alt="Carré vert" />
        <img className="auth-mobile-decoration auth-mobile-etoile-register" src="/images/etoile-rose.png" alt="Etoile rose" />
        <img className="auth-mobile-decoration auth-mobile-cotillon-register" src="/images/cotillon-rouge.png" alt="Cotillon rouge" />

        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
