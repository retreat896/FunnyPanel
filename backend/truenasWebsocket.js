import WebSocket from 'ws';

// Handles TrueNAS WebSocket API connections

class TrueNASWebSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.messageId = 1;
    this.pending = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.on('open', () => resolve());
      this.ws.on('message', (data) => this.handleMessage(data));
      this.ws.on('error', (err) => reject(err));
    });
  }

  handleMessage(data) {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (e) {
      return;
    }
    if (msg.id && this.pending.has(msg.id)) {
      const { resolve, reject } = this.pending.get(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
      this.pending.delete(msg.id);
    }
  }

  call(method, params = []) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      const payload = JSON.stringify({ id, msg: 'method', method, params });
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

export default TrueNASWebSocket;
