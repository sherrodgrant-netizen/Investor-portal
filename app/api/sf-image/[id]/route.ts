import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContentVersionData } from "@/lib/salesforce/queries";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Soft auth check - the image URLs are only known to authenticated users
    // who got them from the deals API (which requires full auth)
    const session = await getSession();
    if (!session) {
      // Check if request has a valid referer from our app
      const referer = req.headers.get("referer") || "";
      const host = req.headers.get("host") || "";
      if (!referer.includes(host) && !referer.includes("localhost")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const { id } = await params;

    // Validate ID format (Salesforce ContentVersion IDs are 15 or 18 chars)
    if (!id || id.length < 15 || id.length > 18) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const result = await getContentVersionData(id);

    if (!result) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new NextResponse(result.data, {
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("SF Image API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
