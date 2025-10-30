import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "../../generated/graphql-types";
import consoleErrorDev from "../../hooks/erreurMod";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import "../auth/auth.css";

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
    <div className="form-login-div">
      <h2 className="h2-login">Me connecter</h2>
      <div className="form-login-div">
        <form className="form-login" onSubmit={handleSubmit}>
          {messageError.length > 0 ? <p className="error-message">{messageError}</p> : null}

          {/* Input Pseudo */}
          <div>
            <input
              type="text"
              placeholder="Entrez votre email"
              className="input-custom"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Input Mot de passe */}
          <div>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              className="input-custom margin-more"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Bouton de connexion */}
          <button type="submit" className="button-black size-20px">
            Connexion
          </button>
        </form>

        {/* Lien vers inscription */}
        <p className="paragraph-login">
          Pas encore de compte ?{" "}
          <Link to={"/inscription"} className="link-login">
            Inscription
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
