import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSignupMutation } from "../../graphql/generated/graphql-types";
import consoleErrorDev from "../../hooks/erreurMod";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import "../auth/auth.css";

const RegisterForm = () => {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    date_of_birth: "",
    password: "",
    passwordConfirmation: "",
    image_url: "",
  });
  const [fileName, setFileName] = useState("Importer une photo");
  const [hasFile, setHasFile] = useState(false);
  const navigate = useNavigate();
  const [messageError, setMessageError] = useState("");
  const { setUserProfile } = useMyProfileStore();

  const [signup] = useSignupMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setHasFile(true);
    } else {
      setFileName("Importer une photo");
      setHasFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.date_of_birth.trim()) {
      setMessageError("Tous les champs obligatoires doivent être remplis");
      return;
    }

    // Validation email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      setMessageError("Adresse email invalide");
      return;
    }

    // Validation longueur mot de passe
    if (form.password.length < 6) {
      setMessageError("Mot de passe trop court");
      return;
    }

    if (form.password.length > 100) {
      setMessageError("Mot de passe trop long");
      return;
    }

    // Vérification des mots de passe
    if (form.password !== form.passwordConfirmation) {
      setMessageError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // Préparer les données pour la mutation
      const dataToSend = {
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        date_of_birth: form.date_of_birth,
        password: form.password,
        // Ajoute phone_number si ton SignupInput l'accepte
      };

      // Appeler la mutation
      const res = await signup({
        variables: { data: dataToSend },
      });

      // Si succès
      if (res.data) {
        setUserProfile({ ...res.data.signup, lists: [] });
        navigate("/dashboard");
      }
    } catch (err: any) {
      // Si c'est une erreur GraphQL
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        setMessageError(err.graphQLErrors[0].message);
        consoleErrorDev("Erreur GraphQL lors de l'inscription :", err.graphQLErrors);
      } else {
        // Erreur réseau / autre
        setMessageError("Un problème est survenu, veuillez réessayer plus tard.");
        consoleErrorDev("Erreur lors de l'inscription :", err);
      }
    }
  };

  return (
    <div className="form-register-div">
      <h2 className="h2-register">Créer mon compte</h2>
      <div className="form-register-div">
        <form className="form-login" onSubmit={handleSubmit}>
          {messageError && <p className="error-message">{messageError}</p>}
          {/* Input Pseudo */}
          <div>
            <input
              type="text"
              placeholder="Nom"
              className="input-custom"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          {/* Input Mot de passe */}
          <div>
            <input
              type="text"
              placeholder="Prénom"
              className="input-custom"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Email"
              className="input-custom"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <input
              type="date"
              placeholder="Date de naissance"
              className="input-custom"
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              className="input-custom"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmation du mot de passe"
              className="input-custom"
              value={form.passwordConfirmation}
              onChange={(e) => setForm({ ...form, passwordConfirmation: e.target.value })}
            />
          </div>

          <div>
            <label className={`image-input-button margin-more ${hasFile ? "image-input-button-filled" : ""}`}>
              <span className="file-label-text">{fileName}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Bouton de connexion */}
          <button type="submit" className="button-black margin-more size-20px">
            Inscription
          </button>
        </form>

        {/* Lien vers inscription */}
        <p className="paragraph-login">
          Déjà inscrit ?{" "}
          <Link to={"/connexion"} className="link-login">
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
