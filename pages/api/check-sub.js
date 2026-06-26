import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const { uid } = req.query;
  if (!uid) return res.status(200).json({ sub: false });
  try {
    const val = await kv.get('subscriber:' + uid);
    return res.status(200).json({ sub: !!val });
  } catch (e) {
    return res.status(200).json({ sub: false });
  }
}
