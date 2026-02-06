// Salesforce REST API integration using jsforce
import jsforce from "jsforce";

// Singleton connection instance
let connection: jsforce.Connection | null = null;

async function getConnection(): Promise<jsforce.Connection> {
  if (connection && connection.accessToken) {
    return connection;
  }

  const loginUrl = process.env.SF_LOGIN_URL || "https://login.salesforce.com";
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;
  const securityToken = process.env.SF_SECURITY_TOKEN || "";

  if (!username || !password) {
    throw new Error(
      "Salesforce credentials not configured. Set SF_USERNAME and SF_PASSWORD in .env.local"
    );
  }

  connection = new jsforce.Connection({
    loginUrl,
  });

  // Login with password + security token
  await connection.login(username, password + securityToken);

  console.log("Salesforce connection established");
  console.log("Instance URL:", connection.instanceUrl);

  return connection;
}

export async function soql(query: string): Promise<any> {
  try {
    const conn = await getConnection();
    console.log("Executing SOQL:", query);
    const result = await conn.query(query);
    console.log("Query returned", result.totalSize, "records");
    return result;
  } catch (error) {
    console.error("SOQL query error:", error);
    // Return empty result on error to prevent app crash during development
    return {
      records: [],
      totalSize: 0,
    };
  }
}

export async function createSObject(
  objectType: string,
  data: any
): Promise<any> {
  try {
    const conn = await getConnection();
    console.log("Creating SObject:", objectType, data);
    const result = await conn.sobject(objectType).create(data);
    return result;
  } catch (error) {
    console.error("Create SObject error:", error);
    throw error;
  }
}

export async function updateSObject(
  objectType: string,
  id: string,
  data: any
): Promise<any> {
  try {
    const conn = await getConnection();
    console.log("Updating SObject:", objectType, id, data);
    const result = await conn.sobject(objectType).update({ Id: id, ...data });
    return result;
  } catch (error) {
    console.error("Update SObject error:", error);
    throw error;
  }
}

export async function querySObject(
  objectType: string,
  id: string,
  fields: string[]
): Promise<any> {
  try {
    const conn = await getConnection();
    const query = `SELECT ${fields.join(", ")} FROM ${objectType} WHERE Id = '${id}'`;
    console.log("Querying SObject:", query);
    const result = await conn.query(query);
    return result.records[0] || null;
  } catch (error) {
    console.error("Query SObject error:", error);
    throw error;
  }
}

// Get ContentVersion IDs for files attached to a record
export async function getContentVersionIds(linkedEntityId: string): Promise<string[]> {
  try {
    const conn = await getConnection();

    // Get ContentDocumentLinks for the record
    const links = await conn.query(`
      SELECT ContentDocumentId
      FROM ContentDocumentLink
      WHERE LinkedEntityId = '${linkedEntityId}'
    `);

    if (!links.records || links.records.length === 0) {
      return [];
    }

    const docIds = links.records.map((r: any) => `'${r.ContentDocumentId}'`).join(',');

    // Get the latest ContentVersion for each document
    const versions = await conn.query(`
      SELECT Id, Title, FileType
      FROM ContentVersion
      WHERE ContentDocumentId IN (${docIds})
      AND IsLatest = true
    `);

    return (versions.records || []).map((v: any) => v.Id);
  } catch (error) {
    console.error("Error getting content versions:", error);
    return [];
  }
}

// Get file content as binary for a ContentVersion
export async function getContentVersionData(versionId: string): Promise<{ data: Buffer; contentType: string } | null> {
  try {
    const conn = await getConnection();

    // Get the content type first
    const version = await conn.query(`
      SELECT FileType FROM ContentVersion WHERE Id = '${versionId}'
    `);

    if (!version.records || version.records.length === 0) {
      return null;
    }

    const fileType = version.records[0].FileType.toLowerCase();
    const contentType = fileType === 'jpg' || fileType === 'jpeg'
      ? 'image/jpeg'
      : fileType === 'png'
        ? 'image/png'
        : fileType === 'gif'
          ? 'image/gif'
          : 'application/octet-stream';

    // Fetch the binary data using native fetch (jsforce doesn't handle binary correctly)
    const url = `${conn.instanceUrl}/services/data/v58.0/sobjects/ContentVersion/${versionId}/VersionData`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${conn.accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch ContentVersion data:", response.status, response.statusText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer);

    return { data, contentType };
  } catch (error) {
    console.error("Error getting content version data:", error);
    return null;
  }
}
