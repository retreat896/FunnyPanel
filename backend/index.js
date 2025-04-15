import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import truenasRoutes from './truenasRoutes.js';
import TrueNASWebSocket from './truenasWebsocket.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/truenas', truenasRoutes);

// /docs endpoint
app.get('/docs', (req, res) => {
  res.json({
    endpoints: [
      {
        method: 'POST',
        path: '/api/command',
        description: 'Simulate command execution. Expects { command: string } in the body.'
      }
    ]
  });
});

// Static route to get TrueNAS app status
app.get('/truenas/status', async (req, res) => {
  const url = process.env.TRUENAS_WS_URL;
  const username = process.env.TRUENAS_USERNAME;
  const password = process.env.TRUENAS_PASSWORD;
  const ws = new TrueNASWebSocket(url);
  try {
    await ws.connect();
    await ws.call('auth.login', [username, password]);
    const result = await ws.call('app.available', [[], {}]);
    ws.close();
    res.json({ result });
  } catch (err) {
    ws.close();
    res.status(500).json({ error: err.message || err });
  }
});

// Test route to check TrueNAS WebSocket connection
app.get('/truenas/test-connection', async (req, res) => {
  const url = process.env.TRUENAS_WS_URL;
  const ws = new TrueNASWebSocket(url);
  try {
    await ws.connect();
    ws.close();
    res.json({ success: true, message: 'WebSocket connection successful.' });
  } catch (err) {
    ws.close();
    res.status(500).json({ success: false, error: err.message || err });
  }
});

app.post('/api/command', (req, res) => {
  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Invalid command' });
  }

  // Simulate command execution
  res.json({
    output: [`$ ${command}`, 'Command executed (simulation from backend)']
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});