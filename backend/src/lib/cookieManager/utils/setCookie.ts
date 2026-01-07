import * as cookie from "cookie";
import type { Context, CookieOptions } from "../types/cookieLibType";

function getTimeInSeconds(optionMaxAge: CookieOptions["maxAge"]): number | undefined {
  if (!optionMaxAge) return undefined;

  const seconds =
    (optionMaxAge.s ?? 0) +
    (optionMaxAge.m ?? 0) * 60 +
    (optionMaxAge.h ?? 0) * 3600 +
    (optionMaxAge.d ?? 0) * 86400 +
    (optionMaxAge.y ?? 0) * 31536000;

  return seconds;
}

export function setCookie(ctx: Context, cookieKey: string, value: any, cookieOption: CookieOptions = {}) {
  const cookieHeader = cookie.serialize(cookieKey, value, {
    httpOnly: cookieOption.httpOnly !== undefined ? cookieOption.httpOnly : true,
    secure: cookieOption.secure !== undefined ? cookieOption.secure : true,
    sameSite: cookieOption.sameSite !== undefined ? cookieOption.sameSite : "strict",
    domain: cookieOption.domain,
    maxAge:
      cookieOption.maxAge != undefined ? getTimeInSeconds(cookieOption.maxAge) : getTimeInSeconds({ d: 1 }),
    expires: cookieOption.expires,
  });

  ctx.res.setHeader("Set-Cookie", cookieHeader);
  // maxAge?: number; // Durée de vie du cookie en secondes
}
