import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { OfferSchema } from "@/lib/validators";
import { createSObject } from "@/lib/salesforce/queries";

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const data = OfferSchema.parse(body);

    const obj = process.env.SF_OBJ_OFFER || "DACQ_Offer__c";

    const created: any = await createSObject(obj, {
      DACQ_Contact__c: session.contactId,
      DACQ_Deal__c: data.dealId,
      DACQ_Offer_Amount__c: data.offerAmount,
      DACQ_Earnest_Money__c: data.earnestMoney,
      DACQ_Close_Date__c: data.closeDate,
      DACQ_Funding_Type__c: data.fundingType,
      DACQ_Inspection_Days__c: data.inspectionDays,
      DACQ_Notes__c: data.notes || null,
      DACQ_Status__c: data.status === "draft" ? "draft" : "submitted",
    });

    return NextResponse.json({ ok: true, offerId: created.id });
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
