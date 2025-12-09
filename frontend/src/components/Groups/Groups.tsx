import { useState } from "react";
import CreateGroupForm from "../forms/CreateGroupForm";
import Button from "../utils/Button";
import Card from "../utils/Card";
import Container from "../utils/Container";
import Modal from "../utils/Modal";
import type { GetAllMyGroupsQuery } from "../../generated/graphql-types";
import { useGetAllMyGroupsQuery } from "../../generated/graphql-types";
import { formatDate } from "../../utils/dateCalculator";

type GroupsProps = {
  groups: GetAllMyGroupsQuery["getAllMyGroups"];
  setActiveGroup: (id: Number) => void;
  onClick?: () => void;
};

export default function Groups({setActiveGroup }: GroupsProps) {
  const { data, loading, error } = useGetAllMyGroupsQuery();
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
      {error && <div>Error: {error.message}</div>}

      {data?.getAllMyGroups.map((group) => {
        return (
          <Card
            key={group.id}
            id={Number(group.id)}
            title={group.name}
            onClick={() => {
              setActiveGroup?.(Number(group.id));
            }}
          >
            <p className="text-gray-600 text-sm sm:text-base truncate overflow-hidden text-ellipsis whitespace-nowrap">
              <span> Date limite: {formatDate(new Date(group.deadline))} </span> <br /> 
              <span> {group.groupMember.length} {group.groupMember.length === 1 ? "participant" : "participants"} </span>
            </p>
          </Card>
        );
      })}

    </Container>
    {
      /* Modal */

      isOpen && (
        <Modal onClose={toggleModal} isOpen={isOpen}>
          <CreateGroupForm />
        </Modal>
      )
      
    }

</>
  );
}
