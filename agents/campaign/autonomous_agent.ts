import fs from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
import { generatePost } from "./templates";

dotenv.config();

// --- Configuration ---
const MOLTX_SK = process.env.VITE_MOLTX_API_KEY || "";
const MOLTBOOK_SK = process.env.VITE_MOLTBOOK_API_KEY || "";
const CLAW_SK = process.env.VITE_4CLAW_API_KEY || "";

const API_MOLTX = "https://moltx.io/v1";
const API_MOLTBOOK = "https://www.moltbook.com/api/v1";
const API_4CLAW = "https://www.4claw.org/api/v1";

const STATE_FILE = path.join(process.cwd(), "agents", "campaign", "state.json");

interface AgentState {
  lastRun: string;
  postsSent: number;
  platforms: {
    moltx: { lastPostId?: string };
    moltbook: { lastPostId?: string };
    claw4: { lastPostId?: string };
  };
}

async function loadState(): Promise<AgentState> {
  try {
    const data = await fs.readFile(STATE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      lastRun: new Date(0).toISOString(),
      postsSent: 0,
      platforms: { moltx: {}, moltbook: {}, claw4: {} },
    };
  }
}

async function saveState(state: AgentState) {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

// --- Platform Adapters ---

async function postToMoltX(title: string, content: string) {
  if (!MOLTX_SK) return null;
  const res = await fetch(`${API_MOLTX}/posts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${MOLTX_SK}`, "Content-Type": "application/json" },
    body: JSON.stringify({ content: `${title}\n\n${content}` }),
  });
  return res.json();
}

async function postToMoltbook(content: string) {
  if (!MOLTBOOK_SK) return null;
  const res = await fetch(`${API_MOLTBOOK}/posts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${MOLTBOOK_SK}`, "Content-Type": "application/json" },
    body: JSON.stringify({ submolt_name: "general", title: "Protocol Update", content }),
  });
  return res.json();
}

async function postTo4Claw(board: string, title: string, content: string) {
  if (!CLAW_SK) return null;
  const res = await fetch(`${API_4CLAW}/boards/${board}/threads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CLAW_SK}`, "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, anon: false }),
  });
  return res.json();
}

async function replyToMoltX(postId: string, content: string) {
  if (!MOLTX_SK) return null;
  const res = await fetch(`${API_MOLTX}/posts/${postId}/replies`, {
    method: "POST",
    headers: { Authorization: `Bearer ${MOLTX_SK}`, "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

async function replyToMoltbook(postId: string, content: string) {
  if (!MOLTBOOK_SK) return null;
  const res = await fetch(`${API_MOLTBOOK}/posts/${postId}/replies`, {
    method: "POST",
    headers: { Authorization: `Bearer ${MOLTBOOK_SK}`, "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return res.json();
}

async function replyTo4Claw(threadId: string, content: string) {
  if (!CLAW_SK) return null;
  const res = await fetch(`${API_4CLAW}/threads/${threadId}/replies`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CLAW_SK}`, "Content-Type": "application/json" },
    body: JSON.stringify({ content, anon: false, bump: true }),
  });
  return res.json();
}

async function readFeed(platform: "MoltX" | "Moltbook" | "4Claw") {
  // Feed reading kept for future manual inspection or simple logging
  return [];
}

// --- Intelligence (Deterministic) ---

async function decideAction(state: AgentState) {
  const platforms: ("MoltX" | "Moltbook" | "4Claw")[] = ["MoltX", "Moltbook", "4Claw"];
  // Select platform based on postsSent to rotate
  const platform = platforms[state.postsSent % platforms.length];
  
  // Calculate day (15 min intervals -> 96 runs per day)
  // Simplified: 1 post per 15 mins.
  const totalRunsPerDay = 24 * 4; 
  const day = Math.floor(state.postsSent / totalRunsPerDay) + 1;
  
  const content = generatePost(state.postsSent, Math.min(day, 30));
  
  const titles = [
    "Grinta Protocol | Research Probe",
    "Nexus Propagation | Starknet DeFi",
    "Autonomous Banking System",
    "BTC-Fi Stability Report",
    "Agentic Economy Status",
    "Mathematical Trust | Protocol Update"
  ];
  const title = titles[state.postsSent % titles.length];

  return {
    action: "POST" as const,
    platform,
    title,
    content,
    board: "crypto"
  };
}

// --- Heartbeat Logic ---

async function heartbeat() {
  console.log(`[${new Date().toISOString()}] Heartbeat waking up...`);
  const state = await loadState();

  const decision = await decideAction(state);
  console.log("Decision (Deterministic):", decision.action, decision.platform);

  if (decision.action === "POST") {
    let res;
    if (decision.platform === "MoltX") res = await postToMoltX(decision.title, decision.content);
    else if (decision.platform === "Moltbook") res = await postToMoltbook(decision.content);
    else if (decision.platform === "4Claw") res = await postTo4Claw(decision.board || "crypto", decision.title, decision.content);

    console.log("Post Result:", res);
    state.postsSent++;
  }

  state.lastRun = new Date().toISOString();
  await saveState(state);
}

// --- Startup ---

console.log("🚀 Grinta Unified Marketing Agent Starting...");
heartbeat();

// Run every 15 minutes as requested
setInterval(heartbeat, 15 * 60 * 1000);
