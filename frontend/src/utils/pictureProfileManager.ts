export default function getProfilePictureUrl(imageUrl: string | null): string {
    if (!imageUrl) {
        return '/images/default-profile.png';
    }
    return `/service/picture/${imageUrl}`;
}