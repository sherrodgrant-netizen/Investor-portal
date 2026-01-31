import { NextResponse } from "next/server";
import { RequestAccessSchema } from "@/lib/validators";
import { createSObject } from "@/lib/salesforce/queries";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = RequestAccessSchema.parse(body);

    const statusField =
      process.env.SF_CONTACT_STATUS_FIELD || "DACQ_Investor_Status__c";

    const created: any = await createSObject("Contact", {
      FirstName: data.firstName,
      LastName: data.lastName,
      Email: data.email,
      Phone: data.phone,
      Company: data.company || null,
      [statusField]: "pending_access",
    });

    // Optional: Create a Task assigned to queue/user (depends on your org config)
    // await createSObject("Task", {...})

    return NextResponse.json({ ok: true, contactId: created.id });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
