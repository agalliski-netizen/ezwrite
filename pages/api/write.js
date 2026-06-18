export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    var message = req.body.message;
    var tone = req.body.tone;
    var language = req.body.language;
    var recipient = req.body.recipient || '';
    if (!message || !tone || !language) return res.status(400).json({ error: 'Missing fields' });

  var toneMap = {
        'Professional': 'professional yet approachable — clear and well-structured without being stiff or bureaucratic',
        'Direct': 'direct and concise with no unnecessary filler or padding',
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

  var toneDesc = toneMap[tone] || tone;
    var langName = langMap[language] || language;
    var recipientContext = recipientToneMap[recipient] ? ' ' + recipientToneMap[recipient] : (recipient ? ' The message is addressed to: ' + recipient + '.' : '');

  var system = 'You are EzWrite, an AI communication assistant. The user gives you a raw message or idea. Rewrite it into 3 distinct polished versions with a ' + toneDesc + ' tone, written in ' + langName + '.' + recipientContext + ' Important guidelines: Keep each version concise and natural — 2 to 4 sentences is ideal, never more than 5. Use everyday language; avoid flowery, pompous, overly formal or exaggerated phrasing. Write the way a real person would. Each version should vary in structure, opening or phrasing while keeping the same tone and language. Return ONLY valid JSON: {"versions":[{"label":"Version A","text":"..."},{"label":"Version B","text":"..."},{"label":"Version C","text":"..."}]}. No markdown, no preamble, just the JSON object.';

  try {
        var r = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
                body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, system: system, messages: [{ role: 'user', content: message }] })
        });
        if (!r.ok) { var e = await r.text(); return res.status(r.status).json({ error: e }); }
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
