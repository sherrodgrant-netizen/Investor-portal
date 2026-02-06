import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { soql, getContentVersionIds } from "@/lib/salesforce/queries";

export async function GET(req: Request) {
  try {
    await requireSession();

    const obj = process.env.SF_OBJ_DEAL || "Opportunity";
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || 24);

    // Query Opportunity object with actual Salesforce field names
    // Using "Property Available" stage as the "published" filter
    const r: any = await soql(`
      SELECT Id, Name,
             Property_Address__Street__s, Property_Address__City__s,
             Property_Address__StateCode__s, Property_Address__PostalCode__s,
             Amount, Bedroomsp__c, Bathroomsp__c, Sq_Ft_Total__c,
             ARV__c, Estimated_Rehab_Cost__c, URL__c, Image_1__c,
             County__c, Year_Built__c, Lot_Size__c,
             StageName, CreatedDate
      FROM ${obj}
      WHERE StageName = 'Property Available'
      ORDER BY CreatedDate DESC
      LIMIT ${limit}
    `);

    // Transform Salesforce fields to match app's expected format
    // Also fetch images for each deal
    const transformedRecords = await Promise.all(
      (r.records || []).map(async (record: any) => {
        // Fetch images attached to this deal
        const imageIds = await getContentVersionIds(record.Id);
        const sfImage = imageIds.length > 0 ? `/api/sf-image/${imageIds[0]}` : null;

        return {
          Id: record.Id,
          Name: record.Name,
          // Map address fields
          DACQ_Address__c: record.Property_Address__Street__s || record.Name,
          DACQ_City__c: record.Property_Address__City__s,
          DACQ_State__c: record.Property_Address__StateCode__s,
          DACQ_Zip__c: record.Property_Address__PostalCode__s,
          // Map deal fields
          DACQ_Price__c: record.Amount,
          DACQ_Beds__c: record.Bedroomsp__c,
          DACQ_Baths__c: record.Bathroomsp__c,
          DACQ_Sqft__c: record.Sq_Ft_Total__c,
          DACQ_ARV__c: record.ARV__c,
          DACQ_Rehab_Estimate__c: record.Estimated_Rehab_Cost__c,
          DACQ_Packet_URL__c: record.URL__c,
          // Additional fields - prefer SF Files image over Image_1__c field
          imageUrl: sfImage || record.Image_1__c,
          county: record.County__c,
          yearBuilt: record.Year_Built__c,
          lotSize: record.Lot_Size__c,
        };
      })
    );

    return NextResponse.json({ records: transformedRecords });
  } catch (error) {
    console.error("Deals API error:", error);
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
