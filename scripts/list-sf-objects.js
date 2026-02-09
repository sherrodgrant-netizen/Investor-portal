// Script to list available custom objects in Salesforce
// Run with: node scripts/list-sf-objects.js

require("dotenv").config({ path: ".env.local" });
const jsforce = require("jsforce");

async function listObjects() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL || "https://login.salesforce.com",
  });

  console.log("Connecting to Salesforce...");
  console.log("Login URL:", process.env.SF_LOGIN_URL);
  console.log("Username:", process.env.SF_USERNAME);

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + (process.env.SF_SECURITY_TOKEN || "")
  );

  console.log("\nConnected to:", conn.instanceUrl);
  console.log("\n--- Custom Objects (ending in __c) ---\n");

  const result = await conn.describeGlobal();
  const customObjects = result.sobjects
    .filter((obj) => obj.name.endsWith("__c"))
    .map((obj) => ({
      name: obj.name,
      label: obj.label,
      queryable: obj.queryable,
    }));

  if (customObjects.length === 0) {
    console.log("No custom objects found in this org.");
  } else {
    customObjects.forEach((obj) => {
      console.log(`  ${obj.name} (${obj.label})`);
    });
  }

  console.log("\n--- All Queryable Standard Objects ---\n");
  const standardObjects = result.sobjects
    .filter((obj) => !obj.name.endsWith("__c") && obj.queryable)
    .slice(0, 20) // Show first 20
    .map((obj) => obj.name);
  console.log(standardObjects.join(", "));
}

listObjects().catch(console.error);
