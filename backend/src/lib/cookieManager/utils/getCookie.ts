import { parse } from "cookie";
import type { Context } from "../types/cookieLibType";

export function getCookie(ctx: Context, cookieKey: string) {
  const cookies = parse(ctx.req.headers.cookie || "");
  return cookies[cookieKey];
}
