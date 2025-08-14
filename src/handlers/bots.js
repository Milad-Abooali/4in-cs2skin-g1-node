
const store = require('../store');
const { ok } = require('../lib/envelope');
module.exports = async function (ctx, payload) {
  return ok(store.bots, ctx.config.chainSecret);
};
