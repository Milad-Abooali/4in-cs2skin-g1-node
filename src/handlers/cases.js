const store = require('../store');
const { ok } = require('../lib/envelope');

module.exports = async function (ctx, payload) {
  const cases = store.cases;
  const items = store.items;
  const market_items = store.market_items;

  // 1) Build lookup for market_items by id
  const marketById = new Map(market_items.map(m => [String(m.id), m]));

  // 2) Group & enrich items by case_id, keyed by "id" (from items array)
  const itemsByCaseIdAsObj = items.reduce((acc, it) => {
    const cid = String(it.case_id);
    const keyId = String(it.id);
    const market = marketById.get(String(it.item_id));

    const enriched = {
      ...it,
      ...(market ? { market_hash_name: market.market_hash_name, cat: market.cat } : {})
    };

    delete enriched.case_id; // no longer needed

    (acc[cid] ||= {});
    acc[cid][keyId] = enriched; // items keyed by item.id

    return acc;
  }, {});

  // 3) Build cases keyed by case.id
  const casesById = Object.fromEntries(
      cases.map(cs => {
        const id = String(cs.id);
        return [id, { ...cs, items: itemsByCaseIdAsObj[id] ?? {} }];
      })
  );

  // Access examples:
  // casesById["1"]                  -> the case with id "1"
  // casesById["1"].items["7"]       -> item with id "7" inside case "1"

  return ok(casesById, ctx.config.chainSecret);
};
