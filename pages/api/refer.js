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

  if (req.method === 'POST') {
    var b = req.body || {};
    var referrerId = b.referrerId; var referralId = b.referralId;
    if (!referrerId || !referralId) return res.status(200).json({ ok: true });
    try {
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
      var bonus = Math.floor(count / 5) * 5;
      var subVal = await kvGet('subscriber:' + uid);
      var isSubscribed = !!subVal;
      return res.status(200).json({ referralCount: count, bonusGenerations: bonus, isSubscribed: isSubscribed });
    } catch(e) {
      return res.status(200).json({ referralCount: 0, bonusGenerations: 0, isSubscribed: false });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
