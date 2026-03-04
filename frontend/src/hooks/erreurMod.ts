export default function consoleErrorDev(message: string, err: any) {
  const debug = 1;
  if (import.meta.env.VITE_MODE !== "prod" || debug === 1) {
    console.error(message, err);
  }
}
