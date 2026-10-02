import { createHash } from "node:crypto";
import { appendFile } from "node:fs/promises";

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || "kshtq64w";
const dataset = process.env.PUBLIC_SANITY_DATASET || "production";
const query = '*[] | order(_id asc) {_id, _rev}';
const url = new URL(`https://${projectId}.api.sanity.io/v2026-04-16/data/query/${dataset}`);
url.searchParams.set("query", query);
url.searchParams.set("returnQuery", "false");

const response = await fetch(url, { headers: { Accept: "application/json" } });
if (!response.ok) {
  throw new Error(`Sanity revision request failed: HTTP ${response.status}`);
}

const payload = await response.json();
if (!Array.isArray(payload.result)) {
  throw new Error("Sanity revision request returned no document list.");
}

const fingerprint = createHash("sha256")
  .update(JSON.stringify(payload.result))
  .digest("hex");

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `fingerprint=${fingerprint}\n`);
}

console.log(`Sanity content fingerprint: ${fingerprint} (${payload.result.length} documents)`);
