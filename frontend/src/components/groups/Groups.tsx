import { useState } from "react";
import type { GetAllMyGroupsQuery } from "../../graphql/generated/graphql-types";
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
  onGroupClick?: (group: GetAllMyGroupsQuery["getAllMyGroups"]["groups"][number]) => void;
  activeGroupId?: number;
};

export default function Groups({
  groups,
  setActiveGroup,
  loading,
  error,
  onGroupClick,
  activeGroupId,
}: GroupsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <Container
        colour="blue"
        title="Mes groupes"
        classNameTitle="text-[1.125rem]"
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
              active={activeGroupId === Number(group.id)}
              onClick={() => {
                setActiveGroup?.(group);
                onGroupClick?.(group);
              }}
            >
              <p className="text-gray-600 text-xs sm:text-sm leading-tight">
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
          <CreateGroupForm onSuccess={toggleModal} onCancel={toggleModal} />
        </Modal>
      )}
    </>
  );
}
