
function err(socket, errorKey, errorCode, data= null) {
  const resp =   {
    "reqId": socket.reqId,
    "type": errorKey,
    "status": 0,
    "error": errorCode,
    "data": data || ""
  }
  socket.ws.send(JSON.stringify(resp));
}
function ok(socket, data= null) {
  const resp =   {
    "reqId": socket.reqId,
    "type": socket.action,
    "status": 1,
    "data": data || ""
  }
  socket.ws.send(JSON.stringify(resp));
}

module.exports = { err, ok };
