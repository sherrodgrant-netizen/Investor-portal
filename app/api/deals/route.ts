import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Fetch real deals from database/Salesforce
  // For now, return empty array
  return NextResponse.json({
    deals: [],
  });
}
