#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const issueId = process.env.PAPERCLIP_OFFICE_ISSUE_ID || "5c59171c-0a46-4baf-9cb7-efeb25f43580";
const baseUrl = (process.env.PAPERCLIP_BASE_URL || "http://127.0.0.1:3100").replace(/\/$/, "");
const root = path.resolve(__dirname, "..");
const statePath = path.join(root, "memory", "office-watch-state.json");
const inboxPath = path.join(root, "memory", "PAPERCLIP_OFFICE_INBOX.md");
const memoryPath = path.join(root, "memory", "DAILY_MEMORY.md");
const pollMs = Number(process.env.PAPERCLIP_OFFICE_WATCH_MS || 5000);

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function ensureFiles() {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  if (!fs.existsSync(inboxPath)) {
    fs.writeFileSync(
      inboxPath,
      "# Paperclip Office Inbox\n\nMessages from the Paperclip Office Chat are mirrored here for Codex continuity.\n\n",
      "utf8",
    );
  }
}

function readState() {
  ensureFiles();
  if (!fs.existsSync(statePath)) return { seenIds: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, "utf8"));
    return { seenIds: Array.isArray(parsed.seenIds) ? parsed.seenIds : [] };
  } catch {
    return { seenIds: [] };
  }
}

function writeState(state) {
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function appendInbox(comment) {
  const author = comment.authorAgentId ? `Agent ${comment.authorAgentId}` : comment.authorUserId ? "Tarence" : "Office";
  const createdAt = comment.createdAt ? new Date(comment.createdAt).toISOString() : new Date().toISOString();
  fs.appendFileSync(inboxPath, `## ${createdAt} - ${author}\n\n${String(comment.body || "").trim()}\n\n`, "utf8");
}

function appendDailyMemory(note) {
  if (!fs.existsSync(memoryPath)) return;
  const date = today();
  let content = fs.readFileSync(memoryPath, "utf8");
  const heading = `### ${date}`;
  if (!content.includes(heading)) content = `${content.trimEnd()}\n\n${heading}\n\n`;
  content = `${content.trimEnd()}\n- ${note}\n`;
  fs.writeFileSync(memoryPath, content, "utf8");
}

async function fetchComments() {
  const response = await fetch(`${baseUrl}/api/issues/${issueId}/comments?order=asc&limit=100`);
  if (!response.ok) throw new Error(`Paperclip comments request failed: ${response.status}`);
  return response.json();
}

async function tick() {
  const comments = await fetchComments();
  const state = readState();
  const seen = new Set(state.seenIds);
  const newComments = comments.filter((comment) => comment?.id && !seen.has(comment.id));

  for (const comment of newComments) {
    seen.add(comment.id);
    appendInbox(comment);
    const body = String(comment.body || "");
    if (/\bcodex\b/i.test(body)) {
      appendDailyMemory(`Paperclip Office mention for Codex: ${body.slice(0, 180).replace(/\s+/g, " ")}`);
      process.stdout.write(`\u0007Codex mention in Paperclip Office: ${body.slice(0, 180)}\n`);
    } else {
      process.stdout.write(`Office message mirrored: ${body.slice(0, 80).replace(/\s+/g, " ")}\n`);
    }
  }

  writeState({ seenIds: Array.from(seen).slice(-500), updatedAt: new Date().toISOString() });
}

async function main() {
  ensureFiles();
  console.log(`Watching Paperclip Office Chat at ${baseUrl}/SOP/office-chat`);
  console.log(`Mirroring comments to ${inboxPath}`);
  while (true) {
    try {
      await tick();
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
    }
    await new Promise((resolve) => setTimeout(resolve, pollMs));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
