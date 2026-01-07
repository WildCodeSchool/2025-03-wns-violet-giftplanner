import * as cookie from "cookie";
import type { Context, CookieDelOptions } from "../types/cookieLibType";

export function delCookie(ctx: Context, cookieKey: string, cookieOption: CookieDelOptions = {}) {
  const cookieHeader = cookie.serialize(cookieKey, "", {
    httpOnly: cookieOption.httpOnly !== undefined ? cookieOption.httpOnly : true,
    secure: cookieOption.secure !== undefined ? cookieOption.secure : true,
    sameSite: cookieOption.sameSite !== undefined ? cookieOption.sameSite : "strict",
    domain: cookieOption.domain,
    maxAge: 0,
  });

  ctx.res.setHeader("Set-Cookie", cookieHeader);
}
