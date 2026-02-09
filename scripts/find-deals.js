// Script to find recent records that might be "deals"
// Run with: node scripts/find-deals.js

require("dotenv").config({ path: ".env.local" });
const jsforce = require("jsforce");

async function findDeals() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL || "https://login.salesforce.com",
  });

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + (process.env.SF_SECURITY_TOKEN || "")
  );

  console.log("Connected to:", conn.instanceUrl);
  console.log("\nSearching for recent records...\n");

  // Check Opportunity (standard Deal object in Salesforce)
  console.log("--- Opportunities (Recent 5) ---");
  try {
    const opps = await conn.query(`
      SELECT Id, Name, StageName, Amount, CreatedDate
      FROM Opportunity
      ORDER BY CreatedDate DESC
      LIMIT 5
    `);
    if (opps.records.length === 0) {
      console.log("No opportunities found.\n");
    } else {
      opps.records.forEach((r) => {
        console.log(`  ${r.Name} - ${r.StageName} - $${r.Amount || 0} - Created: ${r.CreatedDate}`);
      });
      console.log("");
    }
  } catch (e) {
    console.log("Could not query Opportunity\n");
  }

  // Check Account (might have properties linked)
  console.log("--- Accounts (Recent 5) ---");
  try {
    const accts = await conn.query(`
      SELECT Id, Name, Type, CreatedDate
      FROM Account
      ORDER BY CreatedDate DESC
      LIMIT 5
    `);
    if (accts.records.length === 0) {
      console.log("No accounts found.\n");
    } else {
      accts.records.forEach((r) => {
        console.log(`  ${r.Name} - ${r.Type || "N/A"} - Created: ${r.CreatedDate}`);
      });
      console.log("");
    }
  } catch (e) {
    console.log("Could not query Account\n");
  }

  // Check Lead (investor leads perhaps)
  console.log("--- Leads (Recent 5) ---");
  try {
    const leads = await conn.query(`
      SELECT Id, Name, Status, CreatedDate
      FROM Lead
      ORDER BY CreatedDate DESC
      LIMIT 5
    `);
    if (leads.records.length === 0) {
      console.log("No leads found.\n");
    } else {
      leads.records.forEach((r) => {
        console.log(`  ${r.Name} - ${r.Status} - Created: ${r.CreatedDate}`);
      });
      console.log("");
    }
  } catch (e) {
    console.log("Could not query Lead\n");
  }

  // Check Contact (investors)
  console.log("--- Contacts (Recent 5) ---");
  try {
    const contacts = await conn.query(`
      SELECT Id, Name, Email, CreatedDate
      FROM Contact
      ORDER BY CreatedDate DESC
      LIMIT 5
    `);
    if (contacts.records.length === 0) {
      console.log("No contacts found.\n");
    } else {
      contacts.records.forEach((r) => {
        console.log(`  ${r.Name} - ${r.Email || "N/A"} - Created: ${r.CreatedDate}`);
      });
      console.log("");
    }
  } catch (e) {
    console.log("Could not query Contact\n");
  }
}

findDeals().catch(console.error);
