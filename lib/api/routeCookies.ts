import { parseSetCookie } from "cookie";

type CookieWriter = {
  set: (
    name: string,
    value: string,
    options?: {
      domain?: string;
      expires?: Date;
      httpOnly?: boolean;
      maxAge?: number;
      partitioned?: boolean;
      path?: string;
      priority?: "low" | "medium" | "high";
      sameSite?: boolean | "lax" | "strict" | "none";
      secure?: boolean;
    },
  ) => void;
};

export function applySetCookies(
  cookieStore: CookieWriter,
  setCookieHeaders: string[] | undefined,
): void {
  for (const header of setCookieHeaders ?? []) {
    const { name, value, ...options } = parseSetCookie(header);
    if (value !== undefined) cookieStore.set(name, value, options);
  }
}
