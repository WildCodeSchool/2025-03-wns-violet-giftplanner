import Input from "../utils/Input";

export default function GroupLink() {
  // La logique pour récupérer un lien ici
  return (
    <Input
      className="w-2/4"
      placeholder="http://localhost:3000/dashboard/conversations"
      theme="dark"
      name="link"
      value="http://localhost:3000/dashboard/conversations"
      onChange={() => {}}
    />
  );
}
