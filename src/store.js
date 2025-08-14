
const { v4: uuidv4 } = require('uuid');
const store = {
  bots: [
    { bot_id: 'bot_alpha', display_name: 'AlphaBot', avatar: 'https://media.cs2skin.com/bots/alpha.png' },
    { bot_id: 'bot_beta', display_name: 'BetaBot', avatar: 'https://media.cs2skin.com/bots/beta.png' }
  ],
  cases: [
    { case_id: 'case_treasure', title: 'Tycoon Treasure', price: 1646771, currency: 'COIN' },
    { case_id: 'case_moonlit', title: 'Moonlit', price: 1343224, currency: 'COIN' },
    { case_id: 'case_ice', title: 'Ice Blast', price: 249, currency: 'USD' }
  ],
  items: [
    { item_id: 'ak-ice', market_name: 'AK-47 | Ice Coil', rarity: 'Classified', est_price: 1299, case_id: 'case_ice' },
    { item_id: 'usp-polar', market_name: 'USP-S | Polar', rarity: 'Mil-Spec', est_price: 199, case_id: 'case_ice' },
    { item_id: 'karambit-fz', market_name: 'Karambit | Fade', rarity: 'Covert', est_price: 189999, case_id: 'case_ice' }
  ],
  battles: new Map(),
  market_items: null,
  market_items_loaded_at: null,
  createBattle(creator_id, case_id) {
    const battle_id = 'b_' + uuidv4();
    const battle = {
      battle_id, creator_id, status: 'lobby', case_id,
      seats: [{ slot: 1, state: 'taken', user: { user_id: creator_id, display_name: 'Creator' } }, { slot: 2, state: 'open' }, { slot: 3, state: 'open' }, { slot: 4, state: 'open' }],
      created_at: new Date().toISOString()
    };
    this.battles.set(battle_id, battle);
    return battle;
  }
};
module.exports = store;
