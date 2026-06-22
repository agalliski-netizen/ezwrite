import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise(function(resolve, reject) {
    var data = '';
    req.on('data', function(chunk) { data += chunk; });
    req.on('end', function() { resolve(data); });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  var rawBody = await getRawBody(req);
  var secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  var signature = req.headers['x-signature'];

  if (secret && signature) {
    var hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (hmac !== signature) return res.status(401).json({ error: 'Invalid signature' });
  }

  var data;
  try { data = JSON.parse(rawBody); } catch(e) { return res.status(400).json({ error: 'Invalid JSON' }); }

  var event = req.headers['x-event-name'];
  var userId = (data.meta && data.meta.custom_data) ? data.meta.custom_data.user_id : null;

  if (userId) {
    var kv = null;
    try { var m = require('@vercel/kv'); kv = m.kv; } catch(e) {}
    if (kv) {
      try {
        if (event === 'subscription_created' || event === 'subscription_activated' || event === 'subscription_updated') {
          var status = (data.data && data.data.attributes) ? data.data.attributes.status : 'active';
          if (status === 'active') {
            await kv.set('subscriber:' + userId, '1');
          } else {
            await kv.del('subscriber:' + userId);
          }
        } else if (event === 'subscription_cancelled' || event === 'subscription_expired') {
          await kv.del('subscriber:' + userId);
        }
      } catch(e) {}
    }
  }

  return res.status(200).json({ ok: true });
}
