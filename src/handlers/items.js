
const store = require('../store');
const { ok } = require('../lib/envelope');
module.exports = async function (ctx, payload) {
  const cid = payload && payload.case_id;
  const list = cid ? store.items.filter(i => i.case_id === cid) : store.items;
  return ok(list, ctx.config.chainSecret);
};
