import { useState } from "react";
import { useSetLastMessageVuMutation } from "../../graphql/generated/graphql-types";
import type { Message } from "../../types/Message";

function valideDate(date: string | Date): Date {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
}

export default function useVuMessage() {
  const [lastVuByGroup, setLastVuByGroup] = useState<{ [groupId: number]: Date }>({});
  const [setLastMessageVuMutation] = useSetLastMessageVuMutation();

  /**
   * Change la date de la dernière vue pour un groupe donné
   * @param groupId id du groupe
   * @param date date de la dernière vue pour le frontend
   * @param serveurSyconization indique que le serveur doit considéré que le dérnier message de la bdd a été vu
   */
  const updateLastVu = async (groupId: number, date: Date | string, serveurSyconization: boolean = true) => {
    const dateObj = valideDate(date);

    setLastVuByGroup((prev) => ({
      ...prev,
      [groupId]: dateObj,
    }));

    // Optionnel: Synchronisation avec le serveur
    if (serveurSyconization) {
      const reponse = await setLastMessageVuMutation({
        variables: {
          data: {
            groupId: groupId,
          },
        },
      });

      if (!reponse || !reponse.data?.setLastMessageVu?.sucess) {
        console.warn(`Le message de vu pour le groupe ${groupId} n'a pas pu être mis à jour sur le serveur.`);
      }
    }
  };

  /**
   * Récupère la date de la dernière vue pour un groupe donné
   * @param groupId
   * @returns Date | undefined
   */
  const getLastVu = (groupId: number): Date | undefined => {
    return valideDate(lastVuByGroup[groupId]);
  };

  /**
   * Récupère le nombre de nouveaux messages pour un groupe donné
   * @param groupId -> id du groupe
   * @param messages -> la liste des messages du groupe
   * @returns number -> le nombre de nouveaux messages
   */
  const getNbNewMessages = (groupId: number, messages: Message[]): number => {
    const lastVu = getLastVu(groupId);
    if (!lastVu) return messages.length;

    const nbNewMessages = messages.filter((message) => {
      const messageDate = new Date(message.createdAt);
      return messageDate > lastVu;
    }).length;

    return nbNewMessages;
  };

  return {
    updateLastVu,
    getLastVu,
    getNbNewMessages,
  };
}
