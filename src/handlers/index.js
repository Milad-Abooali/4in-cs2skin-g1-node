
const getBots = require('./bots');
const getCases = require('./cases');
const getItems = require('./items');
const { newBattle } = require('./battle');
const { getMarketItems, refreshMarketItems } = require('./market');
module.exports = {
  'get/bots': getBots,
  'get/cases': getCases,
  'get/items': getItems,
  'battle/new': newBattle,
  'get/market_items': getMarketItems,
  'refresh/market_items': refreshMarketItems
};
