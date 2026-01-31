import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement actual authentication logic with Salesforce
    // For now, accept any login for demo purposes
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Mock contactId - in production, fetch from Salesforce
    const contactId = "demo_contact_id";

    // Set session
    await setSession({ contactId, email });

    return NextResponse.json(
      {
        success: true,
        user: {
          contactId,
          email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
