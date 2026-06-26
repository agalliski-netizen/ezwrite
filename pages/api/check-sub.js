export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    const { uid } = req.query;
    if (!uid) return res.status(200).json({ sub: false });
    try {
          const url = process.env.KV_REST_API_URL + '/get/subscriber:' + uid;
          const r = await fetch(url, {
                  headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN }
          });
          const data = await r.json();
          return res.status(200).json({ sub: !!data.result });
    } catch (e) {
          return res.status(200).json({ sub: false });
    }
}
