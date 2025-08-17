const store = require('../store');
const axios = require('axios');
const path = require("path");
const getCases = require('./cases');

if ( Object.keys(store.casesImpacted).length < 1 ) {
  console.log( "Impact Cases ..." )
  getCases().then(r => console.log("Cases Impacted.", store.casesImpacted) );
}
let battle = {}

battle = {
  "id": 0,
  "playerType": "",
  "options":[],
  "cases":[],
  "caseCounts": 0,
  "cost": 0,
  "slots":{
    "s1": {},
    "s2": {},
    "s3": {},
    "s4": {},
    "s5": {},
    "s6": {}
  },
  "players":[],
  "bots":[],
  "status": "foo",
  "summery": {
    steps:{}
  }
};

async function newBattle(ctx, data) {
  if (!ctx.config.umApi || !ctx.config.umApi.enabled) throw Object.assign(new Error('marketApi disabled in config'), { code: 503 });
  const { url, token, xKey,  timeoutMs } = ctx.config.umApi;
  if (!token || token === 'PUT_YOUR_BEARER_TOKEN_HERE') throw Object.assign(new Error('Bearer token not set in config.marketApi.token'), { code: 401 });
  const dataBody = {
    "type": "xGetJWT",
    "data": {
      "X_KEY": xKey,
      "token": data.token
    }
  };

  try {
    const resp = await axios.post(
        url,
        dataBody,
        {
          timeout: timeoutMs,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
    );

    // Options
    battle.options = data.options;

    // Cases
    battle.cases = data.cases;

    // Fill Player & Slot
    battle.slots.s1 = {"id":resp.data.data.profile.id, "display_name":resp.data.data.profile.display_name,"type":"player"};
    battle.createdBy = resp.data.data.profile.id;
    battle.players.push(resp.data.data.profile.id);

    // Handel Cases
    let caseCost = data.cases.flatMap(Object.values).reduce((a, b) => a + b, 0);
    let caseCount = data.cases.flatMap(Object.values).reduce((a, b) => a + b, 0);

    for (const i in battle.cases) {

      // Get Cases
      let iID = Object.keys(battle.cases[i])[0];
      let iCount = Object.values(battle.cases[i])[0];

      //counter
      caseCount = caseCount+iCount;

      console.log( store.casesImpacted );


      battle.summery.steps[`r${i}`] = [];
    }

    // Check Balance

    // Cases Count


    return battle;
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No Response:', error.request);
    } else {
      console.error('Request Error:', error.message);
    }
    throw error.response.data;
  }


}

// Get User

// Check Balance

// Check Cases

// Make Battle

// Save Battle
store.battles[battle.id] = battle;

// Get Battle

module.exports = { newBattle };
