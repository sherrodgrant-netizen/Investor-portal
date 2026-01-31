import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { EventSchema } from "@/lib/validators";
import { createSObject } from "@/lib/salesforce/queries";

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = EventSchema.parse(body);

    const obj = process.env.SF_OBJ_ENGAGEMENT || "DACQ_Investor_Engagement__c";

    await createSObject(obj, {
      DACQ_Contact__c: session.contactId,
      DACQ_Deal__c: data.dealId || null,
      DACQ_Event_Type__c: data.eventType,
      DACQ_Timestamp__c: new Date().toISOString(),
      DACQ_Metadata__c: data.metadata ? JSON.stringify(data.metadata) : null,
      DACQ_Source__c: "portal",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHENTICATED") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
