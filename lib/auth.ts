import { cookies } from "next/headers";

const COOKIE = process.env.SESSION_COOKIE_NAME || "dacq_portal_session";

// Very simple session token: { contactId: string, email: string }
export type Session = { contactId: string; email: string };

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const c = cookieStore.get(COOKIE)?.value;
  if (!c) return null;
  try {
    return JSON.parse(Buffer.from(c, "base64").toString("utf8")) as Session;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHENTICATED");
  return s;
}

export async function setSession(session: Session) {
  const cookieStore = await cookies();
  const value = Buffer.from(JSON.stringify(session), "utf8").toString("base64");
  cookieStore.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
