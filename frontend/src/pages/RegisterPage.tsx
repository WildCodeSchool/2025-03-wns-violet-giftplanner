import RegisterForm from "../components/auth/RegisterForm";
import InfoHome from "../components/InfoHome";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1">
        <InfoHome />
      </div>
      <div className="flex-1 default-background">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
