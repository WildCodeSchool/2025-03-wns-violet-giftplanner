import LoginForm from "../components/auth/LoginForm";
import InfoHome from "../components/InfoHome";


const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1">
        <InfoHome />
      </div>
      <div className="flex-1 default-background">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
