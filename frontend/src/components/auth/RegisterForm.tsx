import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSignupMutation } from "../../generated/graphql-types";
import consoleErrorDev from "../../hooks/erreurMod";
import { useMyProfileStore } from "../../zustand/myProfileStore";
import Button from "../utils/Button";
import Input from "../utils/Input";
import Title from "../utils/Title";

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
    <div className="flex flex-col items-center justify-start h-full px-10 mb-[5%] md:px-5">
      <Title dark className="mt-[60px] mb-8 md:text-4xl md:mt-[94px] md:mb-20">
        Créer mon compte
      </Title>
      <div className="flex flex-col items-center justify-start h-full w-full px-10 mb-[5%] md:px-5 md:w-auto">
        <form
          className="flex flex-col items-center gap-3 justify-center w-full max-w-[600px] md:w-auto md:max-w-none"
          onSubmit={handleSubmit}
        >
          {messageError && <p className="text-[#ea4b09] font-bold mb-6 text-lg">{messageError}</p>}

          <Input
            theme="dark"
            type="text"
            placeholder="Nom"
            name="lastname"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          ></Input>
          <Input
            theme="dark"
            type="text"
            placeholder="Prénom"
            name="firstname"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          ></Input>

          <Input
            theme="dark"
            type="text"
            placeholder="Adresse email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          ></Input>

          <Input
            theme="dark"
            type="date"
            placeholder="Date de naissance"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          ></Input>

          <Input
            theme="dark"
            type="password"
            placeholder="Mot de passe"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          ></Input>
          <Input
            theme="dark"
            type="password"
            placeholder="Confirmation du mot de passe"
            name="passwordConfirmation"
            value={form.passwordConfirmation}
            onChange={(e) => setForm({ ...form, passwordConfirmation: e.target.value })}
          ></Input>

          <div className="w-full md:w-auto">
            <label
              className={`inline-block w-full bg-[#200904] text-[#fdfbf6] text-center border-none px-5 py-3 rounded-lg cursor-pointer text-lg font-inter font-bold transition-colors duration-300 overflow-hidden whitespace-nowrap mb-10 md:w-[400px] md:px-4 md:py-2 md:text-xl md:mb-20 ${hasFile ? "bg-[#292e96]" : ""}`}
            >
              <span className="block overflow-hidden text-ellipsis">{fileName}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Bouton de connexion */}
          <Button type="submit" colour="dark" rounded>
            Inscription
          </Button>
        </form>

        {/* Lien vers inscription */}
        <p className="text-base text-dark font-inter font-normal md:text-xl">
          Déjà inscrit ?{" "}
          <Link to={"/connexion"} className="text-[#200904] no-underline font-semibold text-base md:text-xl">
            Connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
