// Express routes for TrueNAS WebSocket API
import express from 'express';
import TrueNASWebSocket from './truenasWebsocket.js';

const router = express.Router();

// POST /truenas/call
// Body: { url: string, method: string, params: array, (optional) auth: { username, password } }
router.post('/call', async (req, res) => {
  const { url, method, params = [], auth } = req.body;
  if (!url || !method) {
    return res.status(400).json({ error: 'Missing url or method' });
  }
  const ws = new TrueNASWebSocket(url);
  try {
    await ws.connect();
    // If authentication is needed, call auth.login first
    if (auth && auth.username && auth.password) {
      await ws.call('auth.login', [auth.username, auth.password]);
    }
    const result = await ws.call(method, params);
    ws.close();
    res.json({ result });
  } catch (err) {
    ws.close();
    res.status(500).json({ error: err.message || err });
  }
});

export default router;
