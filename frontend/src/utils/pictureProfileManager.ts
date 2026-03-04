export default function getProfilePictureUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return "/images/papier-theme.jpg";
  }
  return `/service/picture/${imageUrl}`;
}

export function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
