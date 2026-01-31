import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement actual authentication logic
    // For now, accept any login for demo purposes
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Simulate successful login
    // In production, validate credentials and create session
    const response = NextResponse.json(
      {
        success: true,
        user: {
          email,
          name: "Demo Investor",
        },
      },
      { status: 200 }
    );

    // Set a simple auth cookie (replace with proper session management)
    response.cookies.set("auth_token", "demo_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
