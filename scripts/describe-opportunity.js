// Script to describe Opportunity object fields
// Run with: node scripts/describe-opportunity.js

require("dotenv").config({ path: ".env.local" });
const jsforce = require("jsforce");

async function describeOpportunity() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL || "https://login.salesforce.com",
  });

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + (process.env.SF_SECURITY_TOKEN || "")
  );

  console.log("Connected to:", conn.instanceUrl);

  // Describe Opportunity
  console.log("\n--- Opportunity Fields ---\n");
  const describe = await conn.sobject("Opportunity").describe();
  const fields = describe.fields.map((f) => ({
    name: f.name,
    label: f.label,
    type: f.type,
  }));

  fields.forEach((f) => {
    console.log(`  ${f.name} (${f.label}) - ${f.type}`);
  });

  // Get full details of the test opportunity
  console.log("\n--- Test Opportunity Full Details ---\n");
  const result = await conn.query(`
    SELECT FIELDS(ALL)
    FROM Opportunity
    WHERE Name LIKE '%7614%'
    LIMIT 1
  `);

  if (result.records.length > 0) {
    const opp = result.records[0];
    Object.keys(opp).forEach((key) => {
      if (opp[key] !== null && key !== "attributes") {
        console.log(`  ${key}: ${JSON.stringify(opp[key])}`);
      }
    });
  }
}

describeOpportunity().catch(console.error);
