// This is the pure email validation logic
export function verifyEmail(email: string): string {
  const trimmed = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmed) return "L'email est requis";
  if (!emailRegex.test(trimmed)) return "Format d'email invalide";

  return ""; // no error
}
