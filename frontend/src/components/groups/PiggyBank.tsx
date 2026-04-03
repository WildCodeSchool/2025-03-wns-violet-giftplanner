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
      title="Cagnotte du groupe"
      classNameTitle="font-inter-extra-bold text-[1.125rem]"
      button={<Button text="Ajouter des fonds" icon="plus" colour="green" small onClick={onAddFunds} />}
    >
      <div className="m-auto flex flex-col items-center gap-1">
        <p className="text-white text-7xl font-inter-extra-bold">{pot}€</p>
        <p className="text-dark text-lg font-inter">de fonds disponibles</p>
      </div>
    </Container>
  );
}
