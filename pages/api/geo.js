export default function handler(req, res) {
  var country = (req.headers['x-vercel-ip-country'] || '').toUpperCase();
  res.status(200).json({ country: country });
}
