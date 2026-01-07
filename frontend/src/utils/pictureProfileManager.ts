export default function getProfilePictureUrl(imageUrl: string | null): string {
  if (!imageUrl) {
    return "/images/papier-theme.jpg";
  }
  return `/service/picture/${imageUrl}`;
}
