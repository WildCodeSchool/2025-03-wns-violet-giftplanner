import type { IncomingMessage, ServerResponse } from "node:http";

export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
};

export type DureeTemps = {
  s?: number;
  m?: number;
  h?: number;
  d?: number;
  y?: number;
};

export type CookieOptions = {
  httpOnly?: boolean; // Si true, cookie inaccessible en JS côté client
  secure?: boolean; // Si true, cookie envoyé uniquement en HTTPS
  sameSite?: "strict" | "lax" | "none"; // Politique SameSite du cookie
  maxAge?: DureeTemps; // Durée de vie du cookie en secondes
  expires?: Date; // Date d'expiration du cookie
  domain?: string; // Domaine pour lequel le cookie est valide
};

export type CookieDelOptions = Omit<CookieOptions, "maxAge" | "expires">;
