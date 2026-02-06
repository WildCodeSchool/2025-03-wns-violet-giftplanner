import type { GetAllMyGroupsQuery } from "../../graphql/generated/graphql-types";
import { useToggle } from "../../hooks/useToggle";
import type { Message } from "../../types/Message";
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
  messages: Record<number, Message[]>;
  getNbNewMessages: (groupId: number, messages: Message[]) => number;
  updateLastVu: (groupId: number, date: Date | string, serveurSyconization?: boolean) => void;
};

export default function Groups({
  groups,
  setActiveGroup,
  loading,
  error,
  messages,
  getNbNewMessages,
  updateLastVu,
}: GroupsProps) {
  const createGroupModal = useToggle(false);
  const closeCreateGroupModal = () => {
    createGroupModal.close();
  };

  return (
    <>
      <Container
        colour="blue"
        title="Mes Groupes"
        button={
          <Button text={"Ajouter un groupe"} icon="plus" colour="green" onClick={createGroupModal.open} />
        }
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
                updateLastVu(Number(group.id), messages[Number(group.id)][0].createdAt);
              }}
              nbNewMessages={getNbNewMessages(Number(group.id), messages[Number(group.id)] || [])}
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

      <Modal
        isOpen={createGroupModal.isOpen}
        onClose={closeCreateGroupModal}
        size="lg"
        withPadding={false}
        className="p-0 overflow-y-auto max-h-[85vh] max-md:max-h-full"
      >
        <CreateGroupForm onSuccess={closeCreateGroupModal} />
      </Modal>
    </>
  );
}
