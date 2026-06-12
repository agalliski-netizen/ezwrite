import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

var TONES = ['Professional', 'Direct', 'Diplomatic', 'Empathetic', 'Firm'];
var LANGUAGES = ['Espanol', 'English', 'Portugues'];
var UI_CODES = { 'Espanol': 'ES', 'English': 'EN', 'Portugues': 'PT' };

var UI = {
'English': {
tagline: 'Write your message. Choose a tone and language. Get 3 polished versions.',
messageLabel: 'Your message',
placeholder: 'Write what you want to say, as rough as you like...',
toneLabel: 'Tone',
langLabel: 'Output language',
btn: 'Generate 3 versions',
writing: 'Writing...',
err: 'Something went wrong. Please try again.',
connErr: 'Connection error. Please try again.',
copy: 'Copy', copied: 'Copied!',
dictate: 'Dictate', stop: 'Stop',
noVoice: 'Voice not supported. Use Chrome or Edge.',
tones: { 'Professional': 'Professional', 'Direct': 'Direct', 'Diplomatic': 'Diplomatic', 'Empathetic': 'Empathetic', 'Firm': 'Firm' },
langs: { 'Espanol': 'Spanish', 'English': 'English', 'Portugues': 'Portuguese' }
},
'Espanol': {
tagline: 'Escribi tu mensaje. Elegi el tono y el idioma. Obtene 3 versiones pulidas.',
messageLabel: 'Tu mensaje',
placeholder: 'Escribi lo que queres decir, tan en bruto como quieras...',
toneLabel: 'Tono',
langLabel: 'Idioma del resultado',
btn: 'Generar 3 versiones',
writing: 'Escribiendo...',
err: 'Algo salio mal. Intenta de nuevo.',
connErr: 'Error de conexion. Intenta de nuevo.',
copy: 'Copiar', copied: 'Copiado!',
dictate: 'Dictar', stop: 'Detener',
noVoice: 'Dictado no soportado. Usa Chrome o Edge.',
tones: { 'Professional': 'Profesional', 'Direct': 'Directo', 'Diplomatic': 'Diplomatico', 'Empathetic': 'Empatico', 'Firm': 'Firme' },
langs: { 'Espanol': 'Espanol', 'English': 'English', 'Portugues': 'Portugues' }
},
'Portugues': {
tagline: 'Escreva sua mensagem. Escolha o tom e o idioma. Obtenha 3 versoes refinadas.',
messageLabel: 'Sua mensagem',
placeholder: 'Escreva o que voce quer dizer, tao bruto quanto quiser...',
toneLabel: 'Tom',
langLabel: 'Idioma do resultado',
btn: 'Gerar 3 versoes',
writing: 'Escrevendo...',
err: 'Algo deu errado. Tente novamente.',
connErr: 'Erro de conexao. Tente novamente.',
copy: 'Copiar', copied: 'Copiado!',
dictate: 'Ditar', stop: 'Parar',
noVoice: 'Ditado nao suportado. Use Chrome ou Edge.',
tones: { 'Professional': 'Profissional', 'Direct': 'Direto', 'Diplomatic': 'Diplomatico', 'Empathetic': 'Empatico', 'Firm': 'Firme' },
langs: { 'Espanol': 'Espanhol', 'English': 'Ingles', 'Portugues': 'Portugues' }
}
};

var BLUE = '#1B4FD8'; var BLUE_LIGHT = '#EEF2FF'; var BG = '#F9F9F7';
var WHITE = '#FFFFFF'; var TEXT = '#111111'; var TEXT2 = '#6B7280';
var TEXT3 = '#9CA3AF'; var BORDER = '#E5E7EB'; var GREEN = '#16A34A';
var GREEN_LIGHT = '#DCFCE7'; var VERSION_COLORS = ['#1B4FD8', '#6366F1', '#8B5CF6'];
var RED = '#DC2626'; var RED_LIGHT = '#FFF0F0';

export default function Home() {
var s1 = useState(''); var message = s1[0]; var setMessage = s1[1];
var s2 = useState('Professional'); var tone = s2[0]; var setTone = s2[1];
var s3 = useState('English'); var language = s3[0]; var setLanguage = s3[1];
var s4 = useState(false); var loading = s4[0]; var setLoading = s4[1];
var s5 = useState(null); var versions = s5[0]; var setVersions = s5[1];
var s6 = useState(''); var error = s6[0]; var setError = s6[1];
var s7 = useState(null); var copied = s7[0]; var setCopied = s7[1];
var s8 = useState('English'); var uiLang = s8[0]; var setUiLang = s8[1];
var s9 = useState(false); var isListening = s9[0]; var setIsListening = s9[1];
var recognitionRef = useRef(null);

var t = UI[uiLang] || UI['English'];

useEffect(function() {
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }
}, []);

function toggleListening() {
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) { alert(t.noVoice); return; }
if (isListening) {
if (recognitionRef.current) { recognitionRef.current.stop(); }
setIsListening(false);
return;
}
var rec = new SR();
rec.lang = uiLang === 'Espanol' ? 'es-AR' : uiLang === 'Portugues' ? 'pt-BR' : 'en-US';
rec.interimResults = true;
rec.continuous = true;
var finalText = '';
rec.onresult = function(e) {
var interim = '';
for (var i = e.resultIndex; i < e.results.length; i++) {
if (e.results[i].isFinal) { finalText += e.results[i][0].transcript + ' '; }
else { interim = e.results[i][0].transcript; }
}
setMessage(finalText + interim);
};
rec.onend = function() { setIsListening(false); };
rec.onerror = function() { setIsListening(false); };
recognitionRef.current = rec;
rec.start();
setIsListening(true);
}

async function handleGenerate() {
if (!message.trim()) return;
setLoading(true); setError(''); setVersions(null);
try {
var res = await fetch('/api/write', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message: message, tone: tone, language: language })
});
var data = await res.json();
if (data.error) { setError(t.err); } else { setVersions(data.versions); }
} catch (e) { setError(t.connErr); }
finally { setLoading(false); }
}

async function handleCopy(text, idx) {
try {
await navigator.clipboard.writeText(text);
setCopied(idx);
setTimeout(function() { setCopied(null); }, 2000);
} catch (e) {}
}

var isDisabled = !message.trim() || loading;

return (
<div style={{ minHeight: '100vh', background: BG, fontFamily: "'Inter', system-ui, sans-serif", padding: '0 1rem' }}>
<Head>
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#1B4FD8" />
<meta name="description" content="Write in any language, get 3 polished versions instantly." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
</Head>
<style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
<div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '3rem', paddingBottom: '4rem' }}>
<div style={{ marginBottom: '2.5rem' }}>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
<div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '2rem', color: TEXT, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
<span style={{ width: '8px', height: '8px', borderRadius: '50%', background: BLUE, display: 'inline-block' }}></span>
EzWrite
</div>
<div style={{ display: 'flex', gap: '4px' }}>
{LANGUAGES.map(function(ul) { var active = uiLang === ul; return (<button key={ul} onClick={function() { setUiLang(ul); }} style={{ padding: '4px 9px', borderRadius: '4px', border: active ? '1.5px solid '+BLUE : '1px solid '+BORDER, background: active ? BLUE_LIGHT : WHITE, color: active ? BLUE : TEXT3, fontSize: '11px', fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.03em' }}>{UI_CODES[ul]}</button>); })}
</div>
</div>
<p style={{ fontSize: '14px', color: TEXT2, marginTop: '8px' }}>{t.tagline}</p>
</div>
<div style={{ marginBottom: '1.5rem' }}>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: TEXT3 }}>{t.messageLabel}</span>
<button onClick={toggleListening} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', border: isListening ? '1.5px solid '+RED : '1px solid '+BORDER, background: isListening ? RED_LIGHT : WHITE, color: isListening ? RED : TEXT2, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill={isListening ? RED : TEXT2}><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6 10a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93V21H8v2h8v-2h-3v-2.07A8 8 0 0 0 20 11h-2z"/></svg>
{isListening ? t.stop : t.dictate}
{isListening && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: RED, display: 'inline-block', animation: 'pulse 1s infinite' }}></span>}
</button>
</div>
<textarea style={{ width: '100%', minHeight: '120px', padding: '12px 14px', border: isListening ? '1.5px solid '+RED : '1px solid '+BORDER, borderRadius: '8px', fontSize: '14px', color: TEXT, background: isListening ? RED_LIGHT : WHITE, resize: 'vertical', fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1.6, boxSizing: 'border-box' }} placeholder={t.placeholder} value={message} onChange={function(e) { setMessage(e.target.value); }} />
</div>
<div style={{ marginBottom: '1.5rem' }}>
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: TEXT3, marginBottom: '8px', display: 'block' }}>{t.toneLabel}</span>
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
{TONES.map(function(tk) { var active = tone === tk; return (<button key={tk} onClick={function() { setTone(tk); }} style={{ padding: '7px 14px', borderRadius: '6px', border: active ? '1.5px solid '+BLUE : '1px solid '+BORDER, background: active ? BLUE_LIGHT : WHITE, color: active ? BLUE : TEXT2, fontSize: '13px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{t.tones[tk] || tk}</button>); })}
</div>
</div>
<div style={{ marginBottom: '1.5rem' }}>
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: TEXT3, marginBottom: '8px', display: 'block' }}>{t.langLabel}</span>
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
{LANGUAGES.map(function(l) { var active = language === l; return (<button key={l} onClick={function() { setLanguage(l); }} style={{ padding: '7px 14px', borderRadius: '6px', border: active ? '1.5px solid '+BLUE : '1px solid '+BORDER, background: active ? BLUE_LIGHT : WHITE, color: active ? BLUE : TEXT2, fontSize: '13px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{t.langs[l] || l}</button>); })}
</div>
</div>
<button style={{ width: '100%', padding: '13px', background: isDisabled ? BORDER : BLUE, color: isDisabled ? TEXT3 : WHITE, border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: isDisabled ? 'not-allowed' : 'pointer', fontFamily: "'Inter', system-ui, sans-serif", marginTop: '0.5rem' }} onClick={handleGenerate} disabled={isDisabled}>{loading ? t.writing : t.btn}</button>
{error && (<div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', marginTop: '1rem' }}>{error}</div>)}
{versions && (<div><div style={{ height: '1px', background: BORDER, margin: '2rem 0' }}></div>{versions.map(function(v, idx) { var color = VERSION_COLORS[idx] || BLUE; var isCopied = copied === idx; return (<div key={idx} style={{ background: WHITE, border: '1px solid '+BORDER, borderLeft: '3px solid '+color, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: color+'18', color: color }}>{v.label}</span><button onClick={function() { handleCopy(v.text, idx); }} style={{ fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '6px', border: isCopied ? '1px solid '+GREEN : '1px solid '+BORDER, background: isCopied ? GREEN_LIGHT : WHITE, cursor: 'pointer', color: isCopied ? GREEN : TEXT2, fontFamily: "'Inter', system-ui, sans-serif" }}>{isCopied ? t.copied : t.copy}</button></div><p style={{ fontSize: '14px', lineHeight: 1.7, color: TEXT, margin: 0, whiteSpace: 'pre-wrap' }}>{v.text}</p></div>); })}</div>)}
<div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid '+BORDER, textAlign: 'center', fontSize: '12px', color: TEXT3 }}>Made with <span style={{ color: BLUE, fontFamily: "'DM Serif Display', Georgia, serif" }}>EzWrite</span><span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>Powered by <span style={{ color: '#E86A2D', fontWeight: 600 }}>Claude</span></div>
</div>
</div>
);
}
