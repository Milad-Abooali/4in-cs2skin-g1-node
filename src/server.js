
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const routes = require('./handlers');
const { fail } = require('./lib/envelope');
const hub = require('./lib/wsHub');
const cfgPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const app = express();
if (config.cors && config.cors.enabled) {
  app.use(cors({ origin: config.cors.origins || ['*'] }));
}
app.use(express.json());
app.get('/', (_req, res) => res.send('WS Mock running'));
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  hub.register(ws);
  ws.on('message', async (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch (e) {
      ws.send(JSON.stringify(fail({ code: 400, message: 'Invalid JSON' }, config.chainSecret)));
      return;
    }
    if (config.logIncoming) console.log('WS IN:', msg);
    const action = msg.action;
    const reqId = msg.reqId || null;
    const handler = routes[action];
    const ctx = { config, broadcast: hub.broadcast };
    try {
      if (!handler) {
        const resp = fail({ code: 404, message: 'Unknown action' }, config.chainSecret);
        resp.reqId = reqId; ws.send(JSON.stringify(resp)); return;
      }
      const result = await handler(ctx, msg.payload || {});
      result.reqId = reqId; ws.send(JSON.stringify(result));
    } catch (err) {
      const resp = fail({ code: 500, message: err.message || String(err) }, config.chainSecret);
      resp.reqId = reqId; ws.send(JSON.stringify(resp));
    }
  });
});
const port = Number(process.env.PORT || config.port || 8080);
server.listen(port, () => console.log(`WS Mock on :${port} (path: /ws)`));
module.exports = { broadcast: hub.broadcast, wss };
