import { useState } from "react";
import { useNavigate } from "react-router";
import { useSignupMutation } from "../../../graphql/generated/graphql-types";
import consoleErrorDev from "../../../hooks/erreurMod";
import { toBase64 } from "../../../utils/pictureProfileManager";
import { useMyProfileStore } from "../../../zustand/myProfileStore";
import Button from "../../utils/Button";
import Input from "../../utils/Input";
import AuthFooter from "./AuthFooter";
import AuthFormTemplate from "./AuthFormTemplate";

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
  const [file, setFile] = useState<null | File>(null);
  const navigate = useNavigate();
  const [messageError, setMessageError] = useState("");
  const { setUserProfile } = useMyProfileStore();

  const [signup] = useSignupMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    } else {
      setFileName("Importer une photo");
      setFile(null);
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
        pictureBase64: file ? ((await toBase64(file)) as string) : undefined,
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
    <AuthFormTemplate
      title="Créer mon compte"
      onSubmit={handleSubmit}
      footer={
        <AuthFooter to="/connexion" link="Connexion">
          Déjà inscrit ?{" "}
        </AuthFooter>
      }
    >
      {messageError && <p className="text-orange font-bold text-lg">{messageError}</p>}

      <Input
        dataTestId="lastNameRegister"
        theme="dark"
        type="text"
        placeholder="Nom"
        name="lastname"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      ></Input>
      <Input
        dataTestId="firstNameRegister"
        theme="dark"
        type="text"
        placeholder="Prénom"
        name="firstname"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      ></Input>
      <Input
        dataTestId="emailRegister"
        theme="dark"
        type="text"
        placeholder="Adresse email"
        name="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      ></Input>
      <Input
        dataTestId="birthdayRegister"
        theme="dark"
        type="date"
        placeholder="Date de naissance"
        name="date_of_birth"
        value={form.date_of_birth}
        onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
      ></Input>
      <Input
        dataTestId="passwordRegister"
        theme="dark"
        type="password"
        placeholder="Mot de passe"
        name="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      ></Input>
      <Input
        dataTestId="passwordConfirmRegister"
        theme="dark"
        type="password"
        placeholder="Confirmation du mot de passe"
        name="passwordConfirmation"
        value={form.passwordConfirmation}
        onChange={(e) => setForm({ ...form, passwordConfirmation: e.target.value })}
      ></Input>

      <div className="w-full ">
        {/* md:w-auto */}
        <label
          className={`inline-block w-full bg-dark text-white text-center border-none px-5 py-3 rounded-lg cursor-pointer text-sm md:text-lg font-inter font-bold transition-colors duration-300 overflow-hidden whitespace-nowrap w-[400px] px-4 py-2 text-xl ${file ? "bg-[#292e96]" : ""}`}
        >
          <span className="block overflow-hidden text-lg text-ellipsis font-bold">{fileName}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {/* Bouton de connexion */}
      <Button
        type="submit"
        colour="dark"
        rounded
        className="text-xl px-[25px] py-[10px] mt-5"
        data-testid="buttonRegister"
      >
        Inscription
      </Button>
    </AuthFormTemplate>
  );
};

export default RegisterForm;
