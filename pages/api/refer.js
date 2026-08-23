var UID_PATTERN = /^u_[a-z0-9]{5,40}$/;
var MAX_BONUS_GENERATIONS = 50;
var IP_REFERRAL_DAILY_LIMIT = 20;

function isValidUid(id) {
  return typeof id === 'string' && UID_PATTERN.test(id);
}

function getClientIp(req) {
  var fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  async function kvGet(key) {
    const url = process.env.KV_REST_API_URL + '/get/' + key;
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
    const d = await r.json();
    return d.result;
  }
  async function kvScard(key) {
    const url = process.env.KV_REST_API_URL + '/scard/' + key;
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
    const d = await r.json();
    return d.result || 0;
  }
  async function kvSismember(key, member) {
    const url = process.env.KV_REST_API_URL + '/sismember/' + key + '/' + encodeURIComponent(member);
    const r = await fetch(url, { headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
    const d = await r.json();
    return d.result;
  }
  async function kvSadd(key, member) {
    const url = process.env.KV_REST_API_URL + '/sadd/' + key + '/' + encodeURIComponent(member);
    const r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
    return r.json();
  }
  async function kvIncrWithExpire(key, ttlSeconds) {
    try {
      var url = process.env.KV_REST_API_URL + '/incr/' + key;
      var r = await fetch(url, { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
      var d = await r.json();
      var count = typeof d.result === 'number' ? d.result : null;
      if (count === 1) {
        var expUrl = process.env.KV_REST_API_URL + '/expire/' + key + '/' + ttlSeconds;
        await fetch(expUrl, { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
      }
      return count;
    } catch (e) {
      return null;
    }
  }

  if (req.method === 'POST') {
    var b = req.body || {};
    var referrerId = b.referrerId; var referralId = b.referralId;
    if (!referrerId || !referralId) return res.status(200).json({ ok: true });
    if (!isValidUid(referrerId) || !isValidUid(referralId)) return res.status(200).json({ ok: true });
    if (referrerId === referralId) return res.status(200).json({ ok: true });
    try {
      var ip = getClientIp(req);
      var ipCount = await kvIncrWithExpire('refpost:' + ip + ':' + todayKey(), 172800);
      if (ipCount !== null && ipCount > IP_REFERRAL_DAILY_LIMIT) {
        return res.status(200).json({ ok: true });
      }
      var exists = await kvSismember('refs:' + referrerId, referralId);
      if (!exists) { await kvSadd('refs:' + referrerId, referralId); }
    } catch(e) {}
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    var uid = (req.query || {}).uid;
    if (!uid) return res.status(200).json({ referralCount: 0, bonusGenerations: 0, isSubscribed: false });
    try {
      var count = await kvScard('refs:' + uid);
      var bonus = Math.min(Math.floor(count / 5) * 5, MAX_BONUS_GENERATIONS);
      var subVal = await kvGet('subscriber:' + uid);
      var isSubscribed = !!subVal;
      return res.status(200).json({ referralCount: count, bonusGenerations: bonus, isSubscribed: isSubscribed });
    } catch(e) {
      return res.status(200).json({ referralCount: 0, bonusGenerations: 0, isSubscribed: false });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
