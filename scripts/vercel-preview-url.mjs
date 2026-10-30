// CI helper. Finds the Vercel preview URL for one project on the current PR.
//
// Vercel does not create GitHub Deployment objects for this repo, so the usual
// wait-for-deployment actions find nothing. It does post a commit status named
// "Vercel – <project>" and a PR comment that carries a base64 JSON blob with each
// project's preview URL. This script waits for the status to succeed, then reads
// the URL from the comment and writes `url=` to GITHUB_OUTPUT.
//
// Vercel skips projects a PR does not touch ("Skipped - Not affected"). The status
// still reads success, but the comment marks the project SKIPPED with no URL. Then
// this script exits without writing `url=`, and the smoke job builds and starts
// the app itself, the same way the full suite does.
//
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, GITHUB_EVENT_PATH (pull_request event),
//      VERCEL_PROJECT (e.g. pickler-site), TIMEOUT_SECONDS (default 600).
import { appendFileSync, readFileSync } from "node:fs";

const token = required("GITHUB_TOKEN");
const repo = required("GITHUB_REPOSITORY");
const project = required("VERCEL_PROJECT");
const event = JSON.parse(readFileSync(required("GITHUB_EVENT_PATH"), "utf8"));
const prNumber = event.pull_request?.number;
const sha = event.pull_request?.head?.sha;
if (!prNumber || !sha) fail("not a pull_request event");

const timeoutMs = Number(process.env.TIMEOUT_SECONDS ?? 600) * 1000;
const intervalMs = 10_000;
const deadline = Date.now() + timeoutMs;

function required(name) {
  const value = process.env[name];
  if (!value) fail(`missing env ${name}`);
  return value;
}

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

async function github(path) {
  const response = await fetch(`https://api.github.com/repos/${repo}/${path}`, {
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!response.ok) fail(`GitHub ${path} returned ${response.status}`);
  return response.json();
}

// Context is "Vercel – <project>" with an en dash; match any single separator.
const contextPattern = new RegExp(`^Vercel . ${project.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

async function deploymentState() {
  const { statuses } = await github(`commits/${sha}/status`);
  return statuses.find((s) => contextPattern.test(s.context))?.state;
}

// The project's entry in the Vercel comment: { previewUrl, nextCommitStatus, ... }.
async function commentEntry() {
  const comments = await github(`issues/${prNumber}/comments?per_page=100`);
  for (const comment of comments) {
    if (comment.user?.login !== "vercel[bot]") continue;
    const match = /^\[vc\]: #[^:]+:([A-Za-z0-9+/=]+)/m.exec(comment.body ?? "");
    if (!match) continue;
    const blob = JSON.parse(Buffer.from(match[1], "base64").toString("utf8"));
    const entry = blob.projects?.find((p) => p.name === project);
    if (entry) return entry;
  }
  return undefined;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

while (Date.now() < deadline) {
  const state = await deploymentState();
  if (state === "failure" || state === "error") fail(`Vercel deployment for ${project} ${state}`);
  if (state === "success") {
    const entry = await commentEntry();
    if (entry?.nextCommitStatus === "SKIPPED") {
      console.log(`${project} skipped by Vercel (not affected); smoke will build it locally`);
      process.exit(0);
    }
    if (entry?.previewUrl) {
      const url = `https://${entry.previewUrl}`;
      console.log(`${project} preview: ${url}`);
      if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `url=${url}\n`);
      process.exit(0);
    }
    console.log(`${project} deployed, waiting for the Vercel PR comment`);
  } else {
    console.log(`${project} status: ${state ?? "not reported yet"}`);
  }
  await sleep(intervalMs);
}
fail(`timed out after ${timeoutMs / 1000}s waiting for ${project} preview`);
