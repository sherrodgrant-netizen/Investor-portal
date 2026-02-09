// Script to query Offer__c objects in Salesforce
// Run with: node scripts/query-offers.js

require("dotenv").config({ path: ".env.local" });
const jsforce = require("jsforce");

async function queryOffers() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL || "https://login.salesforce.com",
  });

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + (process.env.SF_SECURITY_TOKEN || "")
  );

  console.log("Connected to:", conn.instanceUrl);

  // First, describe the Offer__c object to see available fields
  console.log("\n--- Offer__c Fields ---\n");
  const describe = await conn.sobject("Offer__c").describe();
  const fields = describe.fields.map((f) => ({
    name: f.name,
    label: f.label,
    type: f.type,
  }));

  // Show first 50 fields
  fields.slice(0, 50).forEach((f) => {
    console.log(`  ${f.name} (${f.label}) - ${f.type}`);
  });

  if (fields.length > 50) {
    console.log(`  ... and ${fields.length - 50} more fields`);
  }

  // Now query the records
  console.log("\n--- Offer__c Records (10 most recent) ---\n");
  const result = await conn.query(`
    SELECT Id, Name, CreatedDate
    FROM Offer__c
    ORDER BY CreatedDate DESC
    LIMIT 10
  `);

  if (result.records.length === 0) {
    console.log("No Offer__c records found.");
  } else {
    result.records.forEach((r) => {
      console.log(`  ${r.Name} (${r.Id}) - Created: ${r.CreatedDate}`);
    });
  }
}

queryOffers().catch(console.error);
