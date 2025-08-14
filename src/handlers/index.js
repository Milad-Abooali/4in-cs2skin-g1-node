
const getBots = require('./bots');
const getCases = require('./cases');
const getItems = require('./items');
const { getBattle, addBattle, addBot, joinBattle } = require('./battle');
const { getMarketItems, refreshMarketItems } = require('./market');
module.exports = {
  'get/bots': getBots,
  'get/cases': getCases,
  'get/items': getItems,
  'get/battle': getBattle,
  'add/battle': addBattle,
  'add/bot': addBot,
  'join/battle': joinBattle,
  'get/market_items': getMarketItems,
  'refresh/market_items': refreshMarketItems
};
