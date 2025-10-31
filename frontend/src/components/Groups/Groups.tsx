import { useState } from "react";
import type { GroupProps } from "../../types/Groups";
import CreateGroupForm from "../forms/CreateGroupForm";
import Button from "../utils/Button";
import Card from "../utils/Card";
import Container from "../utils/Container";
import Modal from "../utils/Modal";

type GroupsProps = {
  groups: GroupProps[];
  setActiveGroup?: (id: GroupProps["id"]) => void;
  onClick?: () => void;
};

export default function Groups({ groups, setActiveGroup }: GroupsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }
  return (
    <Container
      colour="blue"
      title="Mes Groupes"
      button={<Button text={"Ajouter un groupe"} icon="plus" colour="green" onClick={toggleModal} />}
    >
      {groups.map((group) => {
        return (
          <Card
            key={group.id}
            id={group.id}
            title={group.title}
            onClick={() => {
              setActiveGroup?.(group.id);
            }}
          >
            <p className="text-gray-600 text-sm sm:text-base truncate overflow-hidden text-ellipsis whitespace-nowrap">
              <span> Date limite: {group.date} </span> - <span> {group.participants} participants </span>
            </p>
          </Card>
        );
      })}

      {
        /* Modal */

        isOpen && (
          <Modal onClose={toggleModal}>
            <CreateGroupForm />
          </Modal>
        )
      }
    </Container>
  );
}
