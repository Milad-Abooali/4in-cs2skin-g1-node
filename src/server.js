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
const response = require('./lib/response');
if (config.cors && config.cors.enabled) {
  app.use(cors({ origin: config.cors.origins || ['*'] }));
}
app.use(express.json());
app.get('/', (_req, res) => res.send('WS Mock running'));
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
wss.on('connection', (ws) => {
  hub.register(ws);
  let authenticated = true;

  const socket = {
    ws: ws,
    reqId: "",
    action: ""
  }

  ws.on('message', async (raw) => {
    if(!authenticated) return;
    let msg;
    try { msg = JSON.parse(raw); } catch (e) {
      response.err(socket,'INVALID_JSON_BODY', 1002);
      return;
    }
    if (config.logIncoming) console.log('WS IN:', msg);
    const action = msg.type;
    const reqId = msg.reqId || null;
    const handler = routes[action];
    const ctx = { config, broadcast: hub.broadcast };
    socket.reqId = reqId;
    socket.action = action;
    try {
      if (!handler) {
        response.err(socket,'METHOD_NOT_ALLOWED', 1004);
        return;
      }
      const result = await handler(ctx, msg.data || {});
      response.ok(socket, result);
    } catch (err) {
      response.err(socket,err.type, err.error, err.data);
    }
  });

  // Handshake
  if(!authenticated) {
    ws.once('message', (raw) => {
    socket.reqId = 0;
    socket.action= `handshake`;

    const token = raw.toString().trim();
    if (config.token===token) {
      response.ok(socket, {
        "apiVersion": config.version,
        "serverTime": new Date().toISOString().split('.')[0] + "Z"
      });
      authenticated = true;
    } else {
      response.err(socket, 'INVALID_APP_TOKEN', 1001);
      ws.close();
    }
  });
  }

});
const port = Number(process.env.PORT || config.port || 8080);
server.listen(port, () => console.log(`WS Mock on :${port} (path: /ws)`));


module.exports = { broadcast: hub.broadcast, wss };
