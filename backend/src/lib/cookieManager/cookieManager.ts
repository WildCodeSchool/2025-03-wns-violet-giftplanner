import type { Context, CookieDelOptions, CookieOptions, DureeTemps } from "./types/cookieLibType";
import { delCookie } from "./utils/delCookie";
import { getCookie } from "./utils/getCookie";
import { setCookie } from "./utils/setCookie";

const cookieManager = {
  getCookie,
  setCookie,
  delCookie,
};

export default cookieManager;

export type { Context, CookieDelOptions, CookieOptions, DureeTemps };
export { delCookie, setCookie, getCookie, cookieManager };
