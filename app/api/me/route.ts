import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return session data
  return NextResponse.json({
    user: {
      contactId: session.contactId,
      email: session.email,
    },
  });
}
