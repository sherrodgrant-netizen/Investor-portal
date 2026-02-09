import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { verifyWireTransfer } from "@/lib/wire-verification";

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PNG, JPEG, WebP, GIF, or PDF." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const mediaType = file.type as "image/png" | "image/jpeg" | "image/webp" | "image/gif" | "application/pdf";

    const result = await verifyWireTransfer(base64, mediaType);

    return NextResponse.json({ verification: result });
  } catch (error) {
    console.error("Wire verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify wire transfer. Please try again." },
      { status: 500 }
    );
  }
}
