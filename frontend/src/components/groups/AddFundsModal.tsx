import { useState } from "react";
import { useAddFundsToGroupMutation } from "../../graphql/generated/graphql-types";
import { GET_ALL_MY_GROUPS } from "../../graphql/operations/groupOperations";
import Button from "../utils/Button";
import Input from "../utils/Input";
import Modal from "../utils/Modal";

type AddFundsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  groupId: number;
  currentAmount: number;
};

export default function AddFundsModal({
  isOpen,
  onClose,
  onSuccess,
  groupId,
  currentAmount,
}: AddFundsModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [addFunds, { loading }] = useAddFundsToGroupMutation({
    refetchQueries: [{ query: GET_ALL_MY_GROUPS }],
    awaitRefetchQueries: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setError("Veuillez entrer un montant valide");
      return;
    }

    try {
      await addFunds({
        variables: {
          data: {
            groupId,
            amount: numAmount,
          },
        },
      });
      setAmount("");
      onSuccess?.();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    }
  };

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="!w-[450px] !h-auto max-md:!h-auto max-md:!w-11/12 max-md:!rounded-2xl !bg-yellow"
    >
      <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8 bg-yellow rounded-2xl min-w-[350px]">
        <h2 className="text-3xl font-inter-extra-bold text-white text-center mb-2">Ajouter des fonds</h2>

        <div className="text-center">
          <p className="text-white text-lg mb-1">Cagnotte actuelle</p>
          <p className="font-bold text-white text-4xl">{currentAmount}€</p>
        </div>

        <div className="mt-2">
          <Input
            name="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Montant à ajouter (€)"
            icon="piggyBank"
            error={error}
          />
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <Button type="button" colour="orange" onClick={handleClose}>
            Annuler
          </Button>
          <Button type="submit" colour="green">
            {loading ? "..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
