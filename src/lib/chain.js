
const crypto = require('crypto');
function computeChainHash(secret) {
  return crypto.createHash('sha256').update(`${secret}|${Date.now()}`).digest('hex');
}
module.exports = { computeChainHash };
