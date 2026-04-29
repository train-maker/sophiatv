#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const memoryPath = path.join(root, "memory", "DAILY_MEMORY.md");
const command = process.argv[2] || "show";
const text = process.argv.slice(3).join(" ").trim();

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function ensureMemoryFile() {
  fs.mkdirSync(path.dirname(memoryPath), { recursive: true });
  if (!fs.existsSync(memoryPath)) {
    fs.writeFileSync(memoryPath, "# Sophia Daily Memory\n\n## Daily Log\n", "utf8");
  }
}

function appendEntry(entry) {
  ensureMemoryFile();
  const date = today();
  let content = fs.readFileSync(memoryPath, "utf8");
  const heading = `### ${date}`;
  if (!content.includes(heading)) {
    content = `${content.trimEnd()}\n\n${heading}\n\n`;
  }
  content = `${content.trimEnd()}\n- ${entry}\n`;
  fs.writeFileSync(memoryPath, content, "utf8");
}

ensureMemoryFile();

if (command === "add") {
  if (!text) {
    console.error("Usage: npm run memory -- add \"short memory note\"");
    process.exit(1);
  }
  appendEntry(text);
  console.log(`Memory added to ${memoryPath}`);
} else if (command === "path") {
  console.log(memoryPath);
} else {
  console.log(fs.readFileSync(memoryPath, "utf8"));
}
