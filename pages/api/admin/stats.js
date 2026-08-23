async function kvKeys(pattern) {
  var url = process.env.KV_REST_API_URL + '/keys/' + encodeURIComponent(pattern);
  var r = await fetch(url, { headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
  var d = await r.json();
  return d.result || [];
}

async function kvScard(key) {
  var url = process.env.KV_REST_API_URL + '/scard/' + encodeURIComponent(key);
  var r = await fetch(url, { headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
  var d = await r.json();
  return d.result || 0;
}

export default async function handler(req, res) {
  var SECRET = process.env.ADMIN_STATS_SECRET;
  var key = (req.query || {}).key;
  if (!SECRET || key !== SECRET) {
    res.status(401).send('<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;text-align:center;color:#888;">Acceso no autorizado.</body></html>');
    return;
  }

  var referrers = [];
  var totalReferrals = 0;
  var totalBonus = 0;

  try {
    var keys = await kvKeys('refs:*');
    var counts = await Promise.all(keys.map(function (k) { return kvScard(k); }));
    referrers = keys.map(function (k, i) {
      var id = k.replace('refs:', '');
      var count = counts[i] || 0;
      return { id: id, count: count };
    }).sort(function (a, b) { return b.count - a.count; });
    totalReferrals = counts.reduce(function (a, b) { return a + (b || 0); }, 0);
    totalBonus = referrers.reduce(function (sum, r) { return sum + Math.floor(r.count / 5) * 5; }, 0);
  } catch (e) {
    console.error('Admin stats KV error:', e.message);
  }

  var rowsHtml = referrers.length === 0
    ? '<tr><td colspan="3" style="padding:24px;text-align:center;color:#9CA3AF;">Todavía no hay referidos registrados.</td></tr>'
    : referrers.map(function (r, i) {
        var shortId = r.id.length > 16 ? r.id.slice(0, 16) + '…' : r.id;
        return '<tr><td style="padding:14px 10px;color:#9CA3AF;">' + (i + 1) + '</td><td style="padding:14px 10px;font-family:monospace;font-size:13px;">' + shortId + '</td><td style="padding:14px 10px;text-align:right;font-weight:600;">' + r.count + '</td></tr>';
      }).join('');

  var updated = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Mendoza', dateStyle: 'medium', timeStyle: 'short' });

  var html = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>EzWrite — Métricas de referidos</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">' +
    '<style>' +
    '* { box-sizing: border-box; margin:0; padding:0; }' +
    'body { background:#FAFAF8; font-family:"Poppins",sans-serif; color:#15171C; padding:48px 20px; }' +
    '.wrap { max-width: 720px; margin: 0 auto; }' +
    'h1 { font-family:"Lora",serif; font-weight:700; font-size:32px; margin-bottom:8px; }' +
    '.sub { color:#6B7280; font-size:14px; margin-bottom:32px; }' +
    '.cards { display:flex; gap:14px; margin-bottom:36px; flex-wrap:wrap; }' +
    '.card { flex:1; min-width:140px; background:#FFF; border:1px solid #E7E5DF; border-radius:16px; padding:18px; }' +
    '.card .num { font-family:"Lora",serif; font-weight:700; font-size:30px; color:#3457D5; }' +
    '.card .label { font-size:12px; color:#6B7280; margin-top:4px; line-height:1.4; }' +
    'table { width:100%; border-collapse:collapse; background:#FFF; border:1px solid #E7E5DF; border-radius:16px; overflow:hidden; }' +
    'th { text-align:left; padding:14px 10px; background:#F8F8F6; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#9CA3AF; }' +
    'tr:not(:last-child) td { border-bottom:1px solid #F0EFEA; }' +
    '.foot { text-align:center; margin-top:28px; font-size:12px; color:#9CA3AF; }' +
    '</style></head><body><div class="wrap">' +
    '<h1>Métricas de referidos</h1>' +
    '<div class="sub">Actualizado: ' + updated + ' · se recalcula en cada visita</div>' +
    '<div class="cards">' +
    '<div class="card"><div class="num">' + referrers.length + '</div><div class="label">Personas que compartieron</div></div>' +
    '<div class="card"><div class="num">' + totalReferrals + '</div><div class="label">Referidos confirmados</div></div>' +
    '<div class="card"><div class="num">' + totalBonus + '</div><div class="label">Generaciones extra desbloqueadas</div></div>' +
    '</div>' +
    '<table><thead><tr><th>#</th><th>Usuario</th><th style="text-align:right;">Referidos</th></tr></thead><tbody>' + rowsHtml + '</tbody></table>' +
    '<div class="foot">EzWrite · guardá esta página en favoritos para chequear rápido</div>' +
    '</div></body></html>';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
