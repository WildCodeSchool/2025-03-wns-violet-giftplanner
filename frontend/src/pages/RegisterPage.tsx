import RegisterForm from "../components/auth/RegisterForm";
import InfoHome from "../components/InfoHome";
import "../components/auth/auth.css";

const RegisterPage = () => {
  return (
    <div className="flex h-dvh md:h-screen w-screen overflow-hidden">
      {/* Left column */}
      <div className="display-hidden md:w-1/2">
        <InfoHome />
      </div>

      {/* Right column */}
      <div className="w-full md:w-1/2 h-full relative overflow-hidden">
        <RegisterForm />
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

export default RegisterPage;
