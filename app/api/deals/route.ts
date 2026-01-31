import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { soql } from "@/lib/salesforce/queries";

export async function GET(req: Request) {
  try {
    await requireSession();

    const obj = process.env.SF_OBJ_DEAL || "DACQ_Deal__c";
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || 24);

    const r: any = await soql(`
      SELECT Id, Name, DACQ_Address__c, DACQ_City__c, DACQ_State__c, DACQ_Zip__c,
             DACQ_Price__c, DACQ_Beds__c, DACQ_Baths__c, DACQ_Sqft__c,
             DACQ_ARV__c, DACQ_Rehab_Estimate__c, DACQ_Spread__c, DACQ_Packet_URL__c
      FROM ${obj}
      WHERE DACQ_Published__c = true
      ORDER BY DACQ_Published_Date__c DESC
      LIMIT ${limit}
    `);

    return NextResponse.json({ records: r.records || [] });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
