export const config = { maxDuration: 30 };

var FREE_DAILY_LIMIT = 5;
var IP_DAILY_LIMIT = 40;
var MAX_BONUS_GENERATIONS = 50;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function kvGet(key) {
  try {
    var url = process.env.KV_REST_API_URL + '/get/' + key;
    var r = await fetch(url, { headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
    var d = await r.json();
    return d.result;
  } catch (e) { return null; }
}

async function kvScard(key) {
  try {
    var url = process.env.KV_REST_API_URL + '/scard/' + key;
    var r = await fetch(url, { headers: { Authorization: 'Bearer ' + process.env.KV_REST_API_TOKEN } });
    var d = await r.json();
    return d.result || 0;
  } catch (e) { return 0; }
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

function getClientIp(req) {
  var fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
var message = req.body.message;
var tone = req.body.tone;
var customTone = req.body.customTone;
var language = req.body.language;
var recipient = req.body.recipient || '';
var uid = req.body.uid || '';
if (!message || !tone || !language) return res.status(400).json({ error: 'Missing fields' });

// --- Server-side usage enforcement ---
// El límite gratuito ("5 por día") hasta ahora solo se controlaba en el
// cliente vía localStorage, algo trivial de saltear. Esto agrega el
// control real del lado del servidor, respaldado en Upstash.
try {
  var ip = getClientIp(req);
  var day = todayKey();

  var isSubscribed = false;
  if (uid) {
    var subVal = await kvGet('subscriber:' + uid);
    isSubscribed = !!subVal;
  }

  if (!isSubscribed) {
    var bonus = 0;
    if (uid) {
      var referralCount = await kvScard('refs:' + uid);
    bonus = Math.min(Math.floor(referralCount / 5) * 5, MAX_BONUS_GENERATIONS);
    }
    var limit = FREE_DAILY_LIMIT + bonus;

    var usageKey = uid ? ('usage:' + uid + ':' + day) : ('usage:anon:' + ip + ':' + day);
    var usageCount = await kvIncrWithExpire(usageKey, 172800);
    if (usageCount !== null && usageCount > limit) {
      return res.status(429).json({ error: 'Daily limit reached', limitReached: true });
    }

    // Techo secundario por IP: frena a quien regenera/borra el uid del
    // cliente para esquivar el límite de arriba. Más laxo a propósito
    // (oficinas / redes compartidas usan la misma IP).
    var ipUsageCount = await kvIncrWithExpire('ipusage:' + ip + ':' + day, 172800);
    if (ipUsageCount !== null && ipUsageCount > IP_DAILY_LIMIT) {
      return res.status(429).json({ error: 'Daily limit reached', limitReached: true });
    }
  }
} catch (e) {
  // Si Upstash falla, dejamos pasar el request en vez de romper la app
  // (mismo criterio que el resto del backend). Se pierde el control en
  // ese caso puntual, pero no tira la app abajo por un problema de Redis.
  console.error('Rate limit check error:', e.message);
}

var toneMap = {
'Professional': 'professional yet approachable — clear and well-structured without being stiff or bureaucratic',
'Diplomatic': 'diplomatic and tactful, careful with wording without being vague',
'Empathetic': 'empathetic and warm — genuine and human, without being condescending, patronizing or overly effusive. Keep it brief and natural, like a real person would write it.',
'Firm': 'firm and assertive, holding a clear position without being aggressive or cold'
};

var recipientToneMap = {
'Friend': 'The recipient is a close friend. Use a relaxed, slightly informal tone — contractions, casual phrasing, as you would naturally write to a friend.',
'Amigo/a': 'El destinatario es un amigo cercano. Usa un tono relajado y levemente informal, como le escribirías naturalmente a un amigo.',
'Partner': 'The recipient is a romantic partner. Keep the tone warm and personal.',
'Pareja': 'El destinatario es la pareja. El tono debe ser cálido y personal.',
'Boss': 'The recipient is a boss or superior. Maintain professional respect.',
'Jefe/a': 'El destinatario es un jefe o superior. Mantené el respeto profesional.',
'Client': 'The recipient is a client. Be professional and courteous.',
'Cliente': 'El destinatario es un cliente. Sé profesional y cortés.',
'Colleague': 'The recipient is a colleague. Friendly but professional.',
'Colega': 'El destinatario es un colega. Amable pero profesional.'
};

var langMap = {
'Espanol': 'Spanish',
'English': 'English',
'Portugues': 'Brazilian Portuguese'
};

var toneDesc;
if (tone === 'Custom' && customTone && customTone.trim()) {
  toneDesc = customTone.trim() + ' (this is a custom tone description given directly by the user — follow it closely)';
} else {
  toneDesc = toneMap[tone] || tone;
}
var langName = langMap[language] || language;
var recipientContext = recipientToneMap[recipient] ? ' ' + recipientToneMap[recipient] : (recipient ? ' The message is addressed to: ' + recipient + '.' : '');

var dialectNote = '';
if (langName === 'Spanish') {
var country = (req.headers['x-vercel-ip-country'] || '').toUpperCase();
var spanishDialectMap = {
'AR': ' Use Argentine Rioplatense Spanish: "vos" instead of "tú" (vos tenés, vos querés, escribí instead of escribe). This is essential for sounding natural to Argentine readers.',
'UY': ' Use Argentine/Uruguayan Rioplatense Spanish: "vos" instead of "tú" (vos tenés, vos querés, escribí instead of escribe). This is essential for sounding natural to Uruguayan readers.',
'ES': ' Use Peninsular Spanish from Spain: "tú" for informal address, "vosotros" for informal plural, and vocabulary typical of Spain (vale, genial, ordenador instead of computadora).'
};
var defaultSpanish = ' Use neutral Latin American Spanish: "tú" (not "vos"), with vocabulary broadly understood across Mexico, Colombia, Peru, Chile, Venezuela and other Latin American countries. Avoid regionalisms specific to any single country.';
dialectNote = spanishDialectMap[country] || defaultSpanish;
}

var system = 'You are EzWrite, an AI communication assistant. The user gives you a raw message or idea. Rewrite it into 3 distinct polished versions with a ' + toneDesc + ' tone, written in ' + langName + '.' + dialectNote + recipientContext + ' Important guidelines: Preserve every specific fact from the original message exactly as given (dates, amounts, deadlines, names, numbers, times) - never alter, invent, round, or omit them. Keep each version concise and natural — 2 to 4 sentences is ideal, never more than 5. Use everyday language; avoid flowery, pompous, overly formal or exaggerated phrasing. Write the way a real person would. Each version should vary in structure, opening or phrasing while keeping the same tone and language. Return ONLY valid JSON: {"versions":[{"label":"A","text":"..."},{"label":"B","text":"..."},{"label":"C","text":"..."}]}. No markdown, no preamble, just the JSON object.';

function sleep(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms); }); }

try {
var r;
var attempt = 0;
var maxAttempts = 3;
var lastErrorText = '';
while (attempt < maxAttempts) {
r = await fetch('https://api.anthropic.com/v1/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, system: system, messages: [{ role: 'user', content: message }] })
});
if (r.ok) break;
var isTransient = r.status === 429 || r.status === 529 || r.status === 503;
lastErrorText = await r.text();
attempt += 1;
if (!isTransient || attempt >= maxAttempts) {
var isOverloaded = r.status === 429 || r.status === 529 || r.status === 503;
return res.status(r.status).json({ error: lastErrorText, overloaded: isOverloaded });
}
await sleep(400 * attempt);
}
var data = await r.json();
var text = data.content ? data.content.map(function(b) { return b.text || ''; }).join('') : '';
var clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
var result;
try { result = JSON.parse(clean); }
catch (pe) { return res.status(500).json({ error: 'Parse error', raw: clean.substring(0, 200) }); }
return res.status(200).json(result);
} catch (err) {
return res.status(500).json({ error: err.message });
}
}
