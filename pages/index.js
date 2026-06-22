import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { usePostHog } from 'posthog-js/react';

var TONES = ['Professional', 'Direct', 'Diplomatic', 'Empathetic', 'Firm'];
var LANGUAGES = ['Espanol', 'English', 'Portugues'];
var OUTPUT_LANGUAGES_EXTRA = ['French', 'Italian', 'German', 'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Turkish', 'Polish', 'Ukrainian', 'Greek', 'Hebrew', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Czech', 'Romanian', 'Hungarian', 'Vietnamese', 'Thai', 'Indonesian', 'Filipino'];
var UI_CODES = { 'Espanol': 'ES', 'English': 'EN', 'Portugues': 'PT' };

var UI = {
'English': {
tagline: 'Write your message. Choose a tone and language. Get 3 polished versions.',
messageLabel: 'Your message',
placeholder: 'Write what you want to say, as rough as you like...',
toneLabel: 'Tone',
langLabel: 'Output language',
moreLanguages: 'More languages',
searchLanguagePlaceholder: 'Search language...',
btn: 'Generate 3 versions',
writing: 'Writing...',
err: 'Something went wrong. Please try again.',
connErr: 'Connection error. Please try again.',
copy: 'Copy', copied: 'Copied!',
dictate: 'Dictate', stop: 'Stop',
noVoice: 'Voice not supported. Use Chrome or Edge.',
installTitle: 'Get quick access from your home screen',
installBtn: 'Install app',
installBtnIos: 'Add to Home Screen',
iosStep1: 'Tap the Share icon',
iosStep2: 'Scroll down and tap "Add to Home Screen"',
iosStep3: 'Tap "Add" to confirm',
installDismiss: 'Not now',
limitTitle: 'Daily limit reached',
limitMsg: 'You\'ve used your 5 free generations for today. Upgrade to keep writing.',
limitBtnMonthly: 'Monthly → $2.99/mo',
limitBtnAnnual: 'Annual → $1.99/mo',
usageLeft: function(n) { return n + ' generation' + (n === 1 ? '' : 's') + ' left today'; },
shareMsg: 'Invite 5 friends → 5 extra generations',
shareBtn: '📲 Share EzWrite',
shareWhatsappMsg: 'Try EzWrite for free — the AI that gives you 3 polished versions of any message: ',
shareProgress: function(n) { return n + ' of 5'; },
recipientLabel: 'Recipient (optional)',
recipientOtherPlaceholder: 'Describe the relationship...',
recipientOptions: ['Boss', 'Client', 'Colleague', 'Friend', 'Partner', 'Other'],
tones: { 'Professional': 'Professional', 'Direct': 'Direct', 'Diplomatic': 'Diplomatic', 'Empathetic': 'Empathetic', 'Firm': 'Firm' },
langs: { 'Espanol': 'Spanish', 'English': 'English', 'Portugues': 'Portuguese' }
},
'Espanol': {
tagline: 'Escribi tu mensaje. Elegi el tono y el idioma. Obtene 3 versiones pulidas.',
messageLabel: 'Tu mensaje',
placeholder: 'Escribi lo que queres decir, tan en bruto como quieras...',
toneLabel: 'Tono',
langLabel: 'Idioma del resultado',
moreLanguages: 'Más idiomas',
searchLanguagePlaceholder: 'Buscar idioma...',
btn: 'Generar 3 versiones',
writing: 'Escribiendo...',
err: 'Algo salio mal. Intenta de nuevo.',
connErr: 'Error de conexion. Intenta de nuevo.',
copy: 'Copiar', copied: 'Copiado!',
dictate: 'Dictar', stop: 'Detener',
noVoice: 'Dictado no soportado. Usa Chrome o Edge.',
installTitle: 'Acceso rápido desde tu pantalla de inicio',
installBtn: 'Instalar app',
installBtnIos: 'Agregar a inicio',
iosStep1: 'Tocá el ícono de compartir',
iosStep2: 'Deslizá y tocá "Agregar a pantalla de inicio"',
iosStep3: 'Tocá "Agregar" para confirmar',
installDismiss: 'Ahora no',
limitTitle: 'Límite diario alcanzado',
limitMsg: 'Usaste tus 5 generaciones gratuitas de hoy. Suscribíte para seguir escribiendo.',
limitBtnMonthly: 'Mensual → $2.99/mes',
limitBtnAnnual: 'Anual → $1.99/mes',
usageLeft: function(n) { return n + (n === 1 ? ' generación restante' : ' generaciones restantes') + ' hoy'; },
shareMsg: 'Invitá 5 amigos → 5 generaciones extra',
shareBtn: '📲 Compartir EzWrite',
shareWhatsappMsg: 'Probá EzWrite gratis — la IA que te da 3 versiones de cualquier mensaje: ',
shareProgress: function(n) { return n + ' de 5'; },
recipientLabel: 'Destinatario (opcional)',
recipientOtherPlaceholder: 'Describi la relación...',
recipientOptions: ['Jefe/a', 'Cliente', 'Colega', 'Amigo/a', 'Pareja', 'Otro'],
tones: { 'Professional': 'Profesional', 'Direct': 'Directo', 'Diplomatic': 'Diplomatico', 'Empathetic': 'Empatico', 'Firm': 'Firme' },
langs: { 'Espanol': 'Espanol', 'English': 'English', 'Portugues': 'Portugues', 'French': 'Frances', 'Italian': 'Italiano', 'German': 'Aleman', 'Dutch': 'Holandes', 'Russian': 'Ruso', 'Chinese': 'Chino', 'Japanese': 'Japones', 'Korean': 'Coreano', 'Arabic': 'Arabe', 'Hindi': 'Hindi', 'Turkish': 'Turco', 'Polish': 'Polaco', 'Ukrainian': 'Ucraniano', 'Greek': 'Griego', 'Hebrew': 'Hebreo', 'Swedish': 'Sueco', 'Norwegian': 'Noruego', 'Danish': 'Danes', 'Finnish': 'Finlandes', 'Czech': 'Checo', 'Romanian': 'Rumano', 'Hungarian': 'Hungaro', 'Vietnamese': 'Vietnamita', 'Thai': 'Tailandes', 'Indonesian': 'Indonesio', 'Filipino': 'Filipino' }
},
'Portugues': {
tagline: 'Escreva sua mensagem. Escolha o tom e o idioma. Obtenha 3 versoes refinadas.',
messageLabel: 'Sua mensagem',
placeholder: 'Escreva o que voce quer dizer, tao bruto quanto quiser...',
toneLabel: 'Tom',
langLabel: 'Idioma do resultado',
moreLanguages: 'Mais idiomas',
searchLanguagePlaceholder: 'Buscar idioma...',
btn: 'Gerar 3 versoes',
writing: 'Escrevendo...',
err: 'Algo deu errado. Tente novamente.',
connErr: 'Erro de conexao. Tente novamente.',
copy: 'Copiar', copied: 'Copiado!',
dictate: 'Ditar', stop: 'Parar',
noVoice: 'Ditado nao suportado. Use Chrome ou Edge.',
installTitle: 'Acesso rápido pela tela inicial',
installBtn: 'Instalar app',
installBtnIos: 'Adicionar à tela inicial',
iosStep1: 'Toque no ícone de compartilhar',
iosStep2: 'Deslize e toque em "Adicionar à Tela de Início"',
iosStep3: 'Toque em "Adicionar" para confirmar',
installDismiss: 'Agora não',
limitTitle: 'Limite diário atingido',
limitMsg: 'Você usou suas 5 gerações gratuitas de hoje. Assine para continuar escrevendo.',
limitBtnMonthly: 'Mensal → $2.99/mês',
limitBtnAnnual: 'Anual → $1.99/mês',
usageLeft: function(n) { return n + (n === 1 ? ' geração restante' : ' gerações restantes') + ' hoje'; },
shareMsg: 'Convide 5 amigos → 5 gerações extras',
shareBtn: '📲 Compartilhar EzWrite',
shareWhatsappMsg: 'Experimente o EzWrite grátis — a IA que te dá 3 versões de qualquer mensagem: ',
shareProgress: function(n) { return n + ' de 5'; },
recipientLabel: 'Destinatário (opcional)',
recipientOtherPlaceholder: 'Descreva o relacionamento...',
recipientOptions: ['Chefe', 'Cliente', 'Colega', 'Amigo/a', 'Parceiro/a', 'Outro'],
tones: { 'Professional': 'Profissional', 'Direct': 'Direto', 'Diplomatic': 'Diplomatico', 'Empathetic': 'Empatico', 'Firm': 'Firme' },
langs: { 'Espanol': 'Espanhol', 'English': 'Ingles', 'Portugues': 'Portugues', 'French': 'Frances', 'Italian': 'Italiano', 'German': 'Alemao', 'Dutch': 'Holandes', 'Russian': 'Russo', 'Chinese': 'Chines', 'Japanese': 'Japones', 'Korean': 'Coreano', 'Arabic': 'Arabe', 'Hindi': 'Hindi', 'Turkish': 'Turco', 'Polish': 'Polones', 'Ukrainian': 'Ucraniano', 'Greek': 'Grego', 'Hebrew': 'Hebraico', 'Swedish': 'Sueco', 'Norwegian': 'Norueguês', 'Danish': 'Dinamarques', 'Finnish': 'Finlandes', 'Czech': 'Tcheco', 'Romanian': 'Romeno', 'Hungarian': 'Hungaro', 'Vietnamese': 'Vietnamita', 'Thai': 'Tailandes', 'Indonesian': 'Indonesio', 'Filipino': 'Filipino' }
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
var s8 = useState(function() { var lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase(); if (lang.startsWith('es')) return 'Espanol'; if (lang.startsWith('pt')) return 'Portugues'; return 'English'; }); var uiLang = s8[0]; var setUiLang = s8[1];
var s9 = useState(false); var isListening = s9[0]; var setIsListening = s9[1];
var recognitionRef = useRef(null);
var DAILY_LIMIT = 5;
function getUsage() { try { var u = JSON.parse(localStorage.getItem('ezw_usage') || 'null'); var today = new Date().toDateString(); if (!u || u.date !== today) { return { date: today, count: 0 }; } return u; } catch(e) { return { date: new Date().toDateString(), count: 0 }; } }
function saveUsage(u) { try { localStorage.setItem('ezw_usage', JSON.stringify(u)); } catch(e) {} }
var s10 = useState(function() { return DAILY_LIMIT - getUsage().count; }); var usageLeft = s10[0]; var setUsageLeft = s10[1];
var s11 = useState(''); var recipient = s11[0]; var setRecipient = s11[1];
var s12 = useState(''); var recipientOther = s12[0]; var setRecipientOther = s12[1];
var s13 = useState(null); var deferredInstallPrompt = s13[0]; var setDeferredInstallPrompt = s13[1];
var s14 = useState(false); var showInstallBanner = s14[0]; var setShowInstallBanner = s14[1];
var s15 = useState(false); var isIos = s15[0]; var setIsIos = s15[1];
var s16 = useState(false); var showIosSteps = s16[0]; var setShowIosSteps = s16[1];
var s17 = useState(false); var showMoreLanguages = s17[0]; var setShowMoreLanguages = s17[1];
var s18 = useState(''); var langSearch = s18[0]; var setLangSearch = s18[1];
var s19 = useState(null); var userId = s19[0]; var setUserId = s19[1];
var s20 = useState(0); var referralCount = s20[0]; var setReferralCount = s20[1];
var s21 = useState(0); var bonusGen = s21[0]; var setBonusGen = s21[1];

var posthog = usePostHog();
var t = UI[uiLang] || UI['English'];

useEffect(function() {
var isSamsung = /SamsungBrowser/i.test(window.navigator.userAgent || '');
if (isSamsung) return;
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }
}, []);

useEffect(function() {
var ua = window.navigator.userAgent || '';
var iosDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (standalone) return;
var dismissed = false;
try { dismissed = localStorage.getItem('ezw_install_dismissed') === '1'; } catch(e) {}
if (dismissed) return;
if (iosDevice) { setIsIos(true); setShowInstallBanner(true); return; }
function handleBeforeInstall(e) { e.preventDefault(); setDeferredInstallPrompt(e); setShowInstallBanner(true); }
function handleInstalled() { setShowInstallBanner(false); setDeferredInstallPrompt(null); }
window.addEventListener('beforeinstallprompt', handleBeforeInstall);
window.addEventListener('appinstalled', handleInstalled);
return function() {
window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
window.removeEventListener('appinstalled', handleInstalled);
};
}, []);

useEffect(function() {
try {
var uid = localStorage.getItem('ezw_uid');
if (!uid) { uid = 'u_' + Math.random().toString(36).slice(2,11) + Date.now().toString(36); localStorage.setItem('ezw_uid', uid); }
setUserId(uid);
if (posthog) posthog.identify(uid);
var ref = new URLSearchParams(window.location.search).get('ref');
if (ref && ref !== uid) { fetch('/api/refer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ referrerId: ref, referralId: uid }) }).catch(function(){}); }
fetch('/api/refer?uid=' + uid).then(function(r) { return r.json(); }).then(function(d) { var rc = d.referralCount || 0; var bg = d.bonusGenerations || 0; setReferralCount(rc); setBonusGen(bg); setUsageLeft(function() { return (DAILY_LIMIT + bg) - getUsage().count; }); }).catch(function(){});
} catch(e) {}
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
rec.interimResults = false;
rec.continuous = true;
rec.onresult = function(e) {
var newText = '';
for (var i = e.resultIndex; i < e.results.length; i++) {
newText += e.results[i][0].transcript + ' ';
}
if (newText) { setMessage(function(prev) { return prev + newText; }); }
};
rec.onend = function() { setIsListening(false); };
rec.onerror = function() { setIsListening(false); };
recognitionRef.current = rec;
rec.start();
setIsListening(true);
}

function handleInstallClick() {
if (deferredInstallPrompt) {
deferredInstallPrompt.prompt();
deferredInstallPrompt.userChoice.then(function() { setDeferredInstallPrompt(null); setShowInstallBanner(false); });
return;
}
setShowIosSteps(true);
}

function handleInstallDismiss() {
setShowInstallBanner(false);
try { localStorage.setItem('ezw_install_dismissed', '1'); } catch(e) {}
}

async function handleGenerate() {
if (!message.trim()) return;
var usage = getUsage();
if (usage.count >= DAILY_LIMIT + bonusGen) { setUsageLeft(0); return; }
if (posthog) posthog.capture('generate_clicked', { tone: tone, language: language, recipient: recipient, message_length: message.trim().length });
setLoading(true); setError(''); setVersions(null);
try {
var res = await fetch('/api/write', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message: message, tone: tone, language: language, recipient: recipient === 'Other' || recipient === 'Otro' || recipient === 'Outro' ? recipientOther : recipient })
});
var data = await res.json();
if (data.error) { setError(t.err); } else {
setVersions(data.versions);
usage.count += 1;
saveUsage(usage);
setUsageLeft((DAILY_LIMIT + bonusGen) - usage.count);
}
} catch (e) { setError(t.connErr); }
finally { setLoading(false); }
}

async function handleCopy(text, idx) {
try {
await navigator.clipboard.writeText(text);
if (posthog) posthog.capture('result_copied', { version: idx + 1 });
setCopied(idx);
setTimeout(function() { setCopied(null); }, 2000);
} catch (e) {}
}

var isDisabled = !message.trim() || loading || usageLeft <= 0;
var showManifest = typeof navigator === 'undefined' ? true : !/SamsungBrowser/i.test(navigator.userAgent || '');

return (
<div style={{ minHeight: '100vh', background: BG, fontFamily: "'Inter', system-ui, sans-serif", padding: '0 1rem' }}>
<Head>
<title>EzWrite</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="data:image/png;base64,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" />
{showManifest && <link rel="manifest" href="/manifest.json" />}
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
{showInstallBanner && (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: BLUE_LIGHT, border: '1px solid '+BLUE, borderRadius: '10px', padding: '12px 14px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
<span style={{ fontSize: '13px', color: TEXT, fontWeight: 500 }}>{t.installTitle}</span>
<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
<button onClick={handleInstallClick} style={{ background: BLUE, color: WHITE, border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{isIos ? t.installBtnIos : t.installBtn}</button>
<button onClick={handleInstallDismiss} style={{ background: 'transparent', color: TEXT3, border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{t.installDismiss}</button>
</div>
{isIos && showIosSteps && (<ol style={{ width: '100%', margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: TEXT2, lineHeight: 1.6 }}>
<li>{t.iosStep1}</li>
<li>{t.iosStep2}</li>
<li>{t.iosStep3}</li>
</ol>)}
</div>)}
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
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: TEXT3, marginBottom: '8px', display: 'block' }}>{t.recipientLabel}</span>
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: recipient === 'Other' || recipient === 'Otro' || recipient === 'Outro' ? '8px' : '0' }}>
{t.recipientOptions.map(function(r) { var active = recipient === r; return (<button key={r} onClick={function() { setRecipient(active ? '' : r); if (!active) setRecipientOther(''); }} style={{ padding: '7px 14px', borderRadius: '6px', border: active ? '1.5px solid '+BLUE : '1px solid '+BORDER, background: active ? BLUE_LIGHT : WHITE, color: active ? BLUE : TEXT2, fontSize: '13px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{r}</button>); })}
</div>
{(recipient === 'Other' || recipient === 'Otro' || recipient === 'Outro') && (<input type="text" value={recipientOther} onChange={function(e) { setRecipientOther(e.target.value); }} placeholder={t.recipientOtherPlaceholder} style={{ width: '100%', padding: '10px 14px', border: '1px solid '+BORDER, borderRadius: '8px', fontSize: '14px', color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box', outline: 'none' }} />)}
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
{LANGUAGES.map(function(l) { var active = language === l; return (<button key={l} onClick={function() { setLanguage(l); setShowMoreLanguages(false); }} style={{ padding: '7px 14px', borderRadius: '6px', border: active ? '1.5px solid '+BLUE : '1px solid '+BORDER, background: active ? BLUE_LIGHT : WHITE, color: active ? BLUE : TEXT2, fontSize: '13px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{t.langs[l] || l}</button>); })}
{(function() { var isExtraActive = OUTPUT_LANGUAGES_EXTRA.indexOf(language) !== -1; return (<button onClick={function() { setShowMoreLanguages(!showMoreLanguages); }} style={{ padding: '7px 14px', borderRadius: '6px', border: isExtraActive ? '1.5px solid '+BLUE : '1px dashed '+BORDER, background: isExtraActive ? BLUE_LIGHT : WHITE, color: isExtraActive ? BLUE : TEXT2, fontSize: '13px', fontWeight: isExtraActive ? 600 : 400, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{isExtraActive ? (t.langs[language] || language) : t.moreLanguages}</button>); })()}
</div>
{showMoreLanguages && (<div style={{ marginTop: '10px', padding: '12px', border: '1px solid '+BORDER, borderRadius: '8px', background: BG }}>
<input type="text" value={langSearch} onChange={function(e) { setLangSearch(e.target.value); }} placeholder={t.searchLanguagePlaceholder} style={{ width: '100%', padding: '8px 10px', border: '1px solid '+BORDER, borderRadius: '6px', fontSize: '13px', color: TEXT, fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box', outline: 'none', marginBottom: '10px' }} />
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '180px', overflowY: 'auto' }}>
{OUTPUT_LANGUAGES_EXTRA.filter(function(l) { return (t.langs[l] || l).toLowerCase().indexOf(langSearch.toLowerCase()) !== -1; }).map(function(l) { var active = language === l; return (<button key={l} onClick={function() { setLanguage(l); setShowMoreLanguages(false); setLangSearch(''); }} style={{ padding: '6px 12px', borderRadius: '6px', border: active ? '1.5px solid '+BLUE : '1px solid '+BORDER, background: active ? BLUE_LIGHT : WHITE, color: active ? BLUE : TEXT2, fontSize: '13px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>{t.langs[l] || l}</button>); })}
</div>
</div>)}
</div>
<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
{usageLeft > 0 && usageLeft < (DAILY_LIMIT + bonusGen) && <span style={{ fontSize: '11px', color: usageLeft === 1 ? RED : TEXT3 }}>{t.usageLeft(usageLeft)}</span>}
</div>
<button style={{ width: '100%', padding: '13px', background: isDisabled ? BORDER : BLUE, color: isDisabled ? TEXT3 : WHITE, border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: isDisabled ? 'not-allowed' : 'pointer', fontFamily: "'Inter', system-ui, sans-serif", marginTop: '0' }} onClick={handleGenerate} disabled={isDisabled}>{loading ? t.writing : t.btn}</button>
{usageLeft <= 0 && (<div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '20px', marginTop: '1rem', textAlign: 'center' }}><div style={{ fontSize: '15px', fontWeight: 600, color: '#92400E', marginBottom: '6px' }}>{t.limitTitle}</div><div style={{ fontSize: '13px', color: '#B45309', marginBottom: '16px', lineHeight: 1.5 }}>{t.limitMsg}</div><div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}><a href="https://ezwrite.lemonsqueezy.com/checkout/buy/6442eb2a-a6ef-4149-8c84-cc8749d0b9df" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#F59E0B', color: WHITE, padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>{t.limitBtnMonthly}</a><a href="https://ezwrite.lemonsqueezy.com/checkout/buy/11bbf4e4-ff26-4e52-946c-f301d7a9fac7" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: WHITE, color: '#92400E', border: '1.5px solid #F59E0B', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>{t.limitBtnAnnual}</a></div></div>)}
{error && (<div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', marginTop: '1rem' }}>{error}</div>)}
{versions && (<div><div style={{ height: '1px', background: BORDER, margin: '2rem 0' }}></div>{versions.map(function(v, idx) { var color = VERSION_COLORS[idx] || BLUE; var isCopied = copied === idx; return (<div key={idx} style={{ background: WHITE, border: '1px solid '+BORDER, borderLeft: '3px solid '+color, borderRadius: '10px', padding: '16px', marginBottom: '12px' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: color+'18', color: color }}>{v.label}</span><button onClick={function() { handleCopy(v.text, idx); }} style={{ fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '6px', border: isCopied ? '1px solid '+GREEN : '1px solid '+BORDER, background: isCopied ? GREEN_LIGHT : WHITE, cursor: 'pointer', color: isCopied ? GREEN : TEXT2, fontFamily: "'Inter', system-ui, sans-serif" }}>{isCopied ? t.copied : t.copy}</button></div><p style={{ fontSize: '14px', lineHeight: 1.7, color: TEXT, margin: 0, whiteSpace: 'pre-wrap' }}>{v.text}</p></div>); })}</div>)}
{userId && (<div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid '+BORDER, textAlign: 'center' }}><div style={{ fontSize: '13px', fontWeight: 600, color: TEXT, marginBottom: '6px' }}>{t.shareMsg}</div><div style={{ marginBottom: '14px' }}>{[0,1,2,3,4].map(function(i) { var filled = referralCount > 0 && (i < referralCount % 5 || (referralCount % 5 === 0 && i < 5)); return (<span key={i} style={{ fontSize: '22px', color: filled ? GREEN : TEXT3 }}>{filled ? '●' : '○'}</span>); })}<span style={{ fontSize: '12px', color: TEXT2, marginLeft: '10px' }}>{t.shareProgress(referralCount % 5 === 0 && referralCount > 0 ? 5 : referralCount % 5)}</span></div><button onClick={function() { var url = 'https://ezwrite-eight.vercel.app?ref='+userId; var msg = 'Probá EzWrite gratis — la IA que te da 3 versiones pulidas de cualquier mensaje: ' + url; if (posthog) posthog.capture('referral_shared');
window.open('https://wa.me/?text='+encodeURIComponent(msg), '_blank'); }} style={{ padding: '11px 28px', background: GREEN, color: WHITE, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif", display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width='16' height='16' viewBox='0 0 24 24' fill='white'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/></svg> {t.shareBtn}</button>{bonusGen > 0 && (<div style={{ fontSize: '12px', color: GREEN, marginTop: '8px', fontWeight: 500 }}>+{bonusGen} {uiLang === 'Espanol' ? 'generaciones extra desbloqueadas' : uiLang === 'Portugues' ? 'gerações extras desbloqueadas' : 'extra generations unlocked'}</div>)}</div>)}
<div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid '+BORDER, textAlign: 'center', fontSize: '12px', color: TEXT3 }}>Made with <span style={{ color: BLUE, fontFamily: "'DM Serif Display', Georgia, serif" }}>EzWrite</span><span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>Powered by <span style={{ color: '#E86A2D', fontWeight: 600 }}>Claude</span></div>
</div>
</div>
);
}
