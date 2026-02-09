// Script to query Property__c objects in Salesforce
// Run with: node scripts/query-properties.js

require("dotenv").config({ path: ".env.local" });
const jsforce = require("jsforce");

async function queryProperties() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL || "https://login.salesforce.com",
  });

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + (process.env.SF_SECURITY_TOKEN || "")
  );

  console.log("Connected to:", conn.instanceUrl);

  // First, describe the Property__c object to see available fields
  console.log("\n--- Property__c Fields ---\n");
  const describe = await conn.sobject("Property__c").describe();
  const fields = describe.fields.map((f) => ({
    name: f.name,
    label: f.label,
    type: f.type,
  }));

  // Show first 30 fields
  fields.slice(0, 40).forEach((f) => {
    console.log(`  ${f.name} (${f.label}) - ${f.type}`);
  });

  if (fields.length > 40) {
    console.log(`  ... and ${fields.length - 40} more fields`);
  }

  // Now query the records
  console.log("\n--- Property__c Records ---\n");
  const result = await conn.query(`
    SELECT Id, Name, CreatedDate
    FROM Property__c
    ORDER BY CreatedDate DESC
    LIMIT 10
  `);

  if (result.records.length === 0) {
    console.log("No Property__c records found.");
  } else {
    result.records.forEach((r) => {
      console.log(`  ${r.Name} (${r.Id}) - Created: ${r.CreatedDate}`);
    });
  }
}

queryProperties().catch(console.error);
