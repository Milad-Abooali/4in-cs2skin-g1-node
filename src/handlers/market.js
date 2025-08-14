
const store = require('../store');
const { ok, fail } = require('../lib/envelope');
const { loadMarketItems } = require('../lib/market');
async function getMarketItems(ctx, payload) {
  if (!store.market_items) {
    try {
      const obj = await loadMarketItems(ctx.config);
      store.market_items = obj;
      store.market_items_loaded_at = new Date().toISOString();
    } catch (err) {
      return fail({ code: err.code || 500, message: err.message || 'load failed' }, ctx.config.chainSecret);
    }
  }
  return ok({ market_items: store.market_items, loaded_at: store.market_items_loaded_at }, ctx.config.chainSecret);
}
async function refreshMarketItems(ctx, payload) {
  try {
    const obj = await loadMarketItems(ctx.config);
    store.market_items = obj;
    store.market_items_loaded_at = new Date().toISOString();
    ctx.broadcast({ type: 'market_items.refreshed', ts: store.market_items_loaded_at });
    return ok({ market_items: store.market_items, loaded_at: store.market_items_loaded_at }, ctx.config.chainSecret);
  } catch (err) {
    return fail({ code: err.code || 500, message: err.message || 'refresh failed' }, ctx.config.chainSecret);
  }
}
module.exports = { getMarketItems, refreshMarketItems };
