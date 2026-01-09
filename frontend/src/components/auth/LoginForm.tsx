import { useState } from "react";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../../generated/graphql-types";
import consoleErrorDev from "../../hooks/erreurMod";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import Button from "../utils/Button";
import Input from "../utils/Input";
import Title from "../utils/Title";
import AuthFooter from "./AuthFooter";

const LoginForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [messageError, setMessageError] = useState("");
  const navigate = useNavigate();
  const { setUserProfile } = useMyProfileStore();

  const [login] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({
        variables: { data: form },
      });

      // si la connexion a reussi
      if (res.data) {
        // on met a jour le profil dans le store
        setUserProfile(res.data.login);
        // rediriger vers la page d'accueil
        navigate("/dashboard");
      }
    } catch (err: any) {
      // si c'est une erreur GraphQL
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        // Erreur renvoyée par le serveur
        setMessageError(err.graphQLErrors[0].message);
        consoleErrorDev("Erreur GraphQL lors de la connexion :", err.graphQLErrors);
      } else {
        // Erreur réseau / autre
        setMessageError("Un problème est survenu, veuillez réessayer plus tard.");
        consoleErrorDev("Erreur lors de la connexion :", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-8 h-full px-5 md:px-24 min-h-0 py-4 md:py-0">
      <Title dark className="flex-shrink-0">
        Me connecter
      </Title>
      <div className="flex flex-col justify-start w-full px-5 md:px-0 md:w-auto flex-shrink-0">
        <form
          className="flex flex-col items-center gap-3 justify-center w-full max-w-[600px] md:w-auto md:max-w-none"
          onSubmit={handleSubmit}
        >
          {messageError.length > 0 ? <p className="error-message">{messageError}</p> : null}
          <Input
            theme="dark"
            type="text"
            name="email"
            placeholder="Entrez votre adresse email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            theme="dark"
            type="password"
            name="password"
            placeholder="Entrez votre mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button rounded colour="dark" className="text-xl px-[25px] py-[10px] mt-5" type="submit">
            Connexion
          </Button>
        </form>
        <AuthFooter to="/inscription" link="Inscription">
          Pas encore de compte ?{" "}
        </AuthFooter>
      </div>
    </div>
  );
};

export default LoginForm;
