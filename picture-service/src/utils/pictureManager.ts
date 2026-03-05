import fs from "fs";
import path from "path";

export function deleteImageUtils(url: string): void {
  try {
    // de la racine du processus nodes on construit le chemin vers l'image à supprimer
    const publicDir = path.join(process.cwd(), "public");
    const filePath = path.resolve(publicDir, url);

    // verifie que la base est la base du dossier public pour éviter les remonter le dossier et supprimer nimporte quoi
    if (!filePath.startsWith(publicDir)) {
      throw new Error("Chemin non autorisé");
    }

    // si le fichier existe, on le supprime
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Erreur lors de la suppression de l'image : ${err}`);
  }

  return;
}