
const store = require('../store');
const { ok, fail } = require('../lib/envelope');
async function getBattle(ctx, payload) {
  const id = payload && payload.battle_id;
  const b = id ? store.battles.get(id) : null;
  if (!b) return fail({ code: 404, message: 'Battle not found' }, ctx.config.chainSecret);
  return ok(b, ctx.config.chainSecret);
}
async function addBattle(ctx, payload) {
  const { creator_id = 'u_101', case_id = 'case_ice' } = payload || {};
  const b = store.createBattle(creator_id, case_id);
  ctx.broadcast({ type: 'battle.created', battle_id: b.battle_id, ts: new Date().toISOString() });
  return ok(b, ctx.config.chainSecret);
}
async function addBot(ctx, payload) {
  const { battle_id, bot_id = 'bot_alpha' } = payload || {};
  const b = store.battles.get(battle_id);
  if (!b) return fail({ code: 404, message: 'Battle not found' }, ctx.config.chainSecret);
  const bot = store.bots.find(x => x.bot_id === bot_id) || { bot_id, display_name: bot_id };
  const seat = b.seats.find(s => s.state === 'open');
  if (!seat) return fail({ code: 409, message: 'No seat available' }, ctx.config.chainSecret);
  seat.state = 'bot'; seat.bot = bot;
  ctx.broadcast({ type: 'battle.bot_added', battle_id, slot: seat.slot, bot_id });
  return ok(b, ctx.config.chainSecret);
}
async function joinBattle(ctx, payload) {
  const { battle_id, user_id = 'u_202', display_name = 'Guest' } = payload || {};
  const b = store.battles.get(battle_id);
  if (!b) return fail({ code: 404, message: 'Battle not found' }, ctx.config.chainSecret);
  const seat = b.seats.find(s => s.state === 'open');
  if (!seat) return fail({ code: 409, message: 'No seat available' }, ctx.config.chainSecret);
  seat.state = 'taken'; seat.user = { user_id, display_name };
  ctx.broadcast({ type: 'battle.joined', battle_id, slot: seat.slot, user_id });
  return ok(b, ctx.config.chainSecret);
}
module.exports = { getBattle, addBattle, addBot, joinBattle };
