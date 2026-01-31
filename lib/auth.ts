import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function isAuthenticated() {
  const token = await getAuthToken();
  return !!token;
}

export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) return null;

  // TODO: Validate token and fetch real user data
  return {
    id: "1",
    email: "demo@investor.com",
    name: "Demo Investor",
    role: "investor",
  };
}
