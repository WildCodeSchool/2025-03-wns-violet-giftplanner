import Button from "../utils/Button";
import Container from "../utils/Container";

type PiggyBankProps = {
  pot: number;
};

export default function PiggyBank({ pot }: PiggyBankProps) {
  return (
    <Container
      colour="yellow"
      title="Ma Cagnotte"
      button={<Button text="Ajouter des fonds" icon="plus" colour="green" />}
    >
      <div className="m-auto text-2xl text-white">
        <p>La cagnotte est de {pot}€ </p>
      </div>
    </Container>
  );
}
