
const { computeChainHash } = require('./chain');
function ok(data = [], chainSecret) {
  return { status: true, chainHash: computeChainHash(chainSecret), data: Array.isArray(data) ? data : [data], error: [] };
}
function fail(err, chainSecret) {
  const item = (err && typeof err === 'object') ? { code: err.code || 0, message: err.message || String(err) } : { code: 0, message: String(err) };
  return { status: false, chainHash: computeChainHash(chainSecret), data: [], error: [item] };
}
module.exports = { ok, fail };
