export default async function handler(req, res) {
    var kv = null;
    try { var m = require('@vercel/kv'); kv = m.kv; } catch(e) {}

    if (req.method === 'POST') {
          var b = req.body || {};
          var referrerId = b.referrerId; var referralId = b.referralId;
          if (!referrerId || !referralId || !kv) return res.status(200).json({ ok: true });
          try {
                  var exists = await kv.sismember('refs:' + referrerId, referralId);
                  if (!exists) { await kv.sadd('refs:' + referrerId, referralId); }
                } catch(e) {}
          return res.status(200).json({ ok: true });
        }

    if (req.method === 'GET') {
          var uid = (req.query || {}).uid;
          if (!uid || !kv) return res.status(200).json({ referralCount: 0, bonusGenerations: 0, isSubscribed: false });
          try {
                  var count = (await kv.scard('refs:' + uid)) || 0;
                  var bonus = Math.floor(count / 5) * 5;
                  var subVal = await kv.get('subscriber:' + uid);
                  var isSubscribed = !!subVal;
                  return res.status(200).json({ referralCount: count, bonusGenerations: bonus, isSubscribed: isSubscribed });
                } catch(e) {
                  return res.status(200).json({ referralCount: 0, bonusGenerations: 0, isSubscribed: false });
                }
        }

    return res.status(405).json({ error: 'Method not allowed' });
  }
