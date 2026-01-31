import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Validate token and fetch real user data
  // For now, return mock user data
  return NextResponse.json({
    user: {
      id: "1",
      email: "demo@investor.com",
      name: "Demo Investor",
      role: "investor",
    },
  });
}
