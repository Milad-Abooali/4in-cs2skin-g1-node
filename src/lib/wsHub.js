
let clients = new Set();
function register(ws) { clients.add(ws); ws.on('close', () => clients.delete(ws)); }
function broadcast(obj) { const data = typeof obj === 'string' ? obj : JSON.stringify(obj); for (const ws of clients) { try { ws.send(data); } catch {} } }
function count() { return clients.size; }
module.exports = { register, broadcast, count };
