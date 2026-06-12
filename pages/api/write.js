export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    var message = req.body.message;
    var tone = req.body.tone;
    var language = req.body.language;
    if (!message || !tone || !language) return res.status(400).json({ error: 'Missing fields' });

  var toneMap = {
        'Professional': 'professional and formal',
        'Direct': 'direct and concise with no unnecessary filler',
        'Diplomatic': 'diplomatic and tactful, careful with wording',
        'Empathetic': 'empathetic and warm, showing genuine care',
        'Firm': 'firm and assertive, holding a clear position'
  };
    var langMap = {
          'Espanol': 'Spanish',
          'English': 'English',
          'Portugues': 'Brazilian Portuguese'
    };
    var toneDesc = toneMap[tone] || tone;
    var langName = langMap[language] || language;
    var system = 'You are EzWrite, an expert communication assistant. The user gives you a raw message or idea. Rewrite it into 3 distinct polished versions with a ' + toneDesc + ' tone, written in ' + langName + '. Each version should vary in sentence structure, opening, or phrasing but all must share the same tone and target language. Return ONLY valid JSON: {"versions":[{"label":"Version A","text":"..."},{"label":"Version B","text":"..."},{"label":"Version C","text":"..."}]}. No markdown, no preamble, just the JSON object.';

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
