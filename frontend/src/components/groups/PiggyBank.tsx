import Button from "../utils/Button";
import Container from "../utils/Container";

type PiggyBankProps = {
  pot: number;
  onAddFunds?: () => void;
};

export default function PiggyBank({ pot, onAddFunds }: PiggyBankProps) {
  return (
    <Container
      colour="yellow"
      title="Ma cagnotte"
      button={<Button text="Ajouter des fonds" icon="plus" colour="green" onClick={onAddFunds} />}
    >
      <div className="m-auto flex flex-col items-center gap-1">
        <p className="text-white text-7xl font-inter-extra-bold">{pot}€</p>
        <p className="text-dark text-lg font-inter">de fonds disponibles</p>
      </div>
    </Container>
  );
}
