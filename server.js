import express from 'express';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let agentProcess = null;
const STATE_FILE = path.join(process.cwd(), 'agents', 'campaign', 'state.json');
const FEEDBACK_FILE = path.join(process.cwd(), 'market_feedback.json');

app.get('/api/campaign/status', async (req, res) => {
  try {
    const stateData = await fs.readFile(STATE_FILE, 'utf-8');
    const state = JSON.parse(stateData);
    res.json({
      isRunning: agentProcess !== null,
      ...state
    });
  } catch (e) {
    res.json({ isRunning: agentProcess !== null, postsSent: 0 });
  }
});

app.post('/api/campaign/start', (req, res) => {
  if (agentProcess) {
    return res.json({ message: 'Agent already running' });
  }

  console.log('Starting autonomous agent...');
  agentProcess = spawn('npx', ['tsx', 'agents/campaign/autonomous_agent.ts'], {
    shell: true,
    stdio: 'inherit'
  });

  agentProcess.on('close', (code) => {
    console.log(`Agent process exited with code ${code}`);
    agentProcess = null;
  });

  res.json({ message: 'Agent started successfully' });
});

app.post('/api/campaign/stop', (req, res) => {
  if (agentProcess) {
    agentProcess.kill();
    agentProcess = null;
    return res.json({ message: 'Agent stopped' });
  }
  res.json({ message: 'Agent not running' });
});

app.get('/api/campaign/logs', async (req, res) => {
  try {
    const feedback = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    res.json(JSON.parse(feedback));
  } catch (e) {
    res.json([]);
  }
});

app.listen(port, () => {
  console.log(`Campaign management server running at http://localhost:${port}`);
});
