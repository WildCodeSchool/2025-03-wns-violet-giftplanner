import LoginForm from "../components/forms/auth/LoginForm";
import InfoHome from "../components/InfoHome";
import "../components/forms/auth/auth.css";

const LoginPage = () => {
  return (
    <div className="flex h-dvh md:h-screen w-screen overflow-hidden">
      {/* Left column */}
      <div className="display-hidden md:w-1/2">
        <InfoHome />
      </div>

      {/* Right column */}
      <div className="w-full md:w-1/2 h-full relative overflow-hidden">
        <LoginForm />
        {/* Décorations mobiles - différentes de la page login */}
        <img
          className="auth-mobile-decoration auth-mobile-serpentin-register"
          src="/images/serpentin-jaune.png"
          alt="Serpentin Jaune"
        />
        <img
          className="auth-mobile-decoration auth-mobile-cotillon-register"
          src="/images/cotillon-rouge.png"
          alt="Cotillon rouge"
        />
      </div>
    </div>
  );
};

export default LoginPage;
