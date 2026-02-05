export default function getProfilePictureUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return "/images/papier-theme.jpg";
  }
  return `/service/picture/${imageUrl}`;
}
