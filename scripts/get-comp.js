require("dotenv").config({ path: ".env.local" });
const jsforce = require("jsforce");

async function getCompDetails() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL
  });

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + (process.env.SF_SECURITY_TOKEN || "")
  );

  const result = await conn.query(`
    SELECT Id, Name, Deal__c, Address__c, Bed__c, Baths__c,
           Square_Footage__c, Year_Built__c, Garage_Size__c,
           Lot_Size_SQFT__c, Sales_Price__c, Notes_Maybe_pics__c
    FROM Comparable__c
    ORDER BY CreatedDate DESC
    LIMIT 5
  `);

  console.log("--- Comparables Found ---\n");

  for (const comp of result.records) {
    console.log("Name:", comp.Name);
    console.log("  Address:", comp.Address__c || "N/A");
    console.log("  Beds:", comp.Bed__c || "N/A");
    console.log("  Baths:", comp.Baths__c || "N/A");
    console.log("  Sqft:", comp.Square_Footage__c || "N/A");
    console.log("  Year Built:", comp.Year_Built__c || "N/A");
    console.log("  Sales Price:", comp.Sales_Price__c || "N/A");
    console.log("  Deal ID:", comp.Deal__c || "Not linked");

    if (comp.Deal__c) {
      const deal = await conn.query(`SELECT Name FROM Opportunity WHERE Id = '${comp.Deal__c}'`);
      if (deal.records.length > 0) {
        console.log("  -> Linked to:", deal.records[0].Name);
      }
    }
    console.log("");
  }
}

getCompDetails().catch(console.error);
