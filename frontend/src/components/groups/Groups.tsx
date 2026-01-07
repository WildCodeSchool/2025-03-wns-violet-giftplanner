import { useState } from "react";
import type { GetAllMyGroupsQuery } from "../../generated/graphql-types";
import { formatDate } from "../../utils/dateCalculator";
import CreateGroupForm from "../forms/CreateGroupForm";
import Button from "../utils/Button";
import Card from "../utils/Card";
import Container from "../utils/Container";
import Modal from "../utils/Modal";

type GroupsProps = {
  groups: GetAllMyGroupsQuery["getAllMyGroups"];
  setActiveGroup: (group: GetAllMyGroupsQuery["getAllMyGroups"]["groups"][number]) => void;
  loading: boolean;
  error?: string;
  onClick?: () => void;
};

export default function Groups({ groups, setActiveGroup, loading, error }: GroupsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Container
        colour="blue"
        title="Mes Groupes"
        button={<Button text={"Ajouter un groupe"} icon="plus" colour="green" onClick={toggleModal} />}
      >
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}

        {groups?.groups.map((group) => {
          return (
            <Card
              key={group.id}
              id={Number(group.id)}
              title={group.name}
              onClick={() => {
                setActiveGroup?.(group);
              }}
            >
              <p className="text-gray-600 text-sm sm:text-base truncate overflow-hidden text-ellipsis whitespace-nowrap">
                <span> Date limite: {formatDate(new Date(group.deadline))} </span> <br />
                <span>
                  {group.groupMember?.length}{" "}
                  {group.groupMember?.length === 1 ? "participant" : "participants"}
                </span>
              </p>
            </Card>
          );
        })}
      </Container>
      {isOpen && (
        <Modal onClose={toggleModal} isOpen={isOpen}>
          <CreateGroupForm onSuccess={toggleModal} />
        </Modal>
      )}
    </>
  );
}
