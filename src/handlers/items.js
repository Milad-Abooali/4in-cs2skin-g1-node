const grpcClient = require('../lib/gRPC');
const store = require('../store');
const path = require("path");
const fs = require("fs");
const cfgPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const { protoToObject } = require('../lib/protoUtils');

// Get Bots
const query  = `select * from case_items`;
grpcClient.Query({ token: config.coreToken, query }, (err, response) => {
  if (err) {
    console.error("gRPC error:", err);
    return;
  }
  if (response.status === "ok") {
    const responseArray = protoToObject(response.data);
    store.items = responseArray.rows;
    console.log('gRPC - get case_items ', responseArray.count)
  }
});

module.exports = ()=> store.items;
