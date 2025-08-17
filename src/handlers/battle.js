const store = require('../store');
const axios = require('axios');
const path = require("path");
const fs = require("fs");
const cfgPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

let battle = {}

battle = {
  "id": 0,
  "playerType": "",
  "options":[],
  "cases":[],
  "caseCounts": 0,
  "cost": 0,
  "slots":{
    "s1": {"id":0, "display_name":"", "type":"player"},
    "s2": {},
    "s3": {},
    "s4": {},
    "s5": {},
    "s6": {}
  },
  "players":[],
  "bots":[],
  "status": "Waiting ..."
};



module.exports = ()=> store.newBattle(battle);
