export default function consoleErrorDev(message: string, err: any) {
  if (import.meta.env.VITE_MODE !== "prod") {
    console.error(message, err);
  }
}
