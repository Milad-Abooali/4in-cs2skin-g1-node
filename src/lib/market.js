
const axios = require('axios');
async function loadMarketItems(config) {
  if (!config.marketApi || !config.marketApi.enabled) throw Object.assign(new Error('marketApi disabled in config'), { code: 503 });
  const { url, token, timeoutMs = 15000 } = config.marketApi;
  if (!token || token === 'PUT_YOUR_BEARER_TOKEN_HERE') throw Object.assign(new Error('Bearer token not set in config.marketApi.token'), { code: 401 });
  const resp = await axios.get(url, { timeout: timeoutMs, headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (typeof resp.data !== 'object') throw Object.assign(new Error('Unexpected response format from market API'), { code: 500 });
  return resp.data;
}
module.exports = { loadMarketItems };
