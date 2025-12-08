import type React from "react";
import { useMyProfileStore } from "../zustand/myProfileStore";

type Props = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const { userProfile } = useMyProfileStore();

  // Si on n'est pas connecté ou pas admin, afficher message ou rediriger
  if (!userProfile) {
    // non connecté -> rediriger vers la page d'accueil
    return <p>Chargement...</p>;
  }

  if (!userProfile.isAdmin) {
    // Utilisateur connecté mais pas admin -> message d'accès refusé
    return (
      <div style={{ padding: 24 }}>
        <h2>Accès refusé</h2>
        <p>Vous ne pouvez pas accéder à cette URL.</p>
      </div>
    );
  }

  // Admin : afficher les enfants
  return <>{children}</>;
}
