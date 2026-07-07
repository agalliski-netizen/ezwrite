
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  const signature = req.headers['x-signature'];

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const sig = Buffer.from(signature || '', 'utf8');
  if (digest.length !== sig.length || !crypto.timingSafeEqual(digest, sig)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload?.meta?.event_name;
  const userId = payload?.meta?.custom_data?.user_id;

  async function kvSet(key, value) {
    const url = process.env.KV_REST_API_URL + '/set/' + key;
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    });
    return r.json();
  }

  async function kvDel(key) {
    const url = process.env.KV_REST_API_URL + '/del/' + key;
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN }
    });
    return r.json();
  }

  try {
    if (userId && (eventName === 'subscription_created' || eventName === 'subscription_activated')) {
      await kvSet('subscriber:' + userId, '1');
    } else if (userId && (eventName === 'subscription_cancelled' || eventName === 'subscription_expired')) {
      await kvDel('subscriber:' + userId);
    }
  } catch (e) {
    console.error('KV error:', e.message);
  }

  return res.status(200).json({ ok: true });
}
