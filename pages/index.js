import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { usePostHog } from 'posthog-js/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });

var TONES = ['Professional', 'Direct', 'Diplomatic', 'Empathetic', 'Firm'];
var LANGUAGES = ['Espanol', 'English', 'Portugues'];
var OUTPUT_LANGUAGES_EXTRA = ['French', 'Italian', 'German', 'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Turkish', 'Polish', 'Ukrainian', 'Greek', 'Hebrew', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Czech', 'Romanian', 'Hungarian', 'Vietnamese', 'Thai', 'Indonesian', 'Filipino'];
var UI_CODES = { 'Espanol': 'ES', 'English': 'EN', 'Portugues': 'PT' };

var EXAMPLES = {
'Espanol': [
{ label: 'Pedir un aumento', text: 'necesito hablar de mi sueldo llevo 2 años sin aumento y creo que me lo merezco por todo lo que hice', tone: 'Diplomatic', recipient: 'Jefe/a' },
{ label: 'Disculpa a un cliente', text: 'perdon por la demora en la entrega, se nos complico con un proveedor y se atraso todo, se que no es excusa', tone: 'Empathetic', recipient: 'Cliente' },
{ label: 'Rechazar una propuesta', text: 'no me interesa el proyecto que me mandaste, el precio esta muy por debajo de lo que suelo cobrar', tone: 'Firm', recipient: 'Cliente' }
],
'English': [
{ label: 'Ask for a raise', text: 'i need to talk about my salary, been 2 years without a raise and i think i deserve it for everything i did', tone: 'Diplomatic', recipient: 'Boss' },
{ label: 'Apologize to a client', text: 'sorry for the delay in delivery, we had issues with a supplier and everything got pushed back, i know its not an excuse', tone: 'Empathetic', recipient: 'Client' },
{ label: 'Decline a proposal', text: 'not interested in the project you sent me, the price is way below what i usually charge', tone: 'Firm', recipient: 'Client' }
],
'Portugues': [
{ label: 'Pedir um aumento', text: 'preciso falar sobre meu salario, ja faz 2 anos sem aumento e acho que mereço por tudo que fiz', tone: 'Diplomatic', recipient: 'Chefe' },
{ label: 'Desculpar-se com cliente', text: 'desculpa pela demora na entrega, tivemos problemas com um fornecedor e tudo atrasou, sei que nao e desculpa', tone: 'Empathetic', recipient: 'Cliente' },
{ label: 'Recusar uma proposta', text: 'nao tenho interesse no projeto que voce mandou, o preco esta bem abaixo do que costumo cobrar', tone: 'Firm', recipient: 'Cliente' }
]
};

var UI = {
'English': {
tagline: 'Write your message. Choose a tone and language. Get 3 polished versions.',
messageLabel: 'Your message',
placeholder: 'Write your message exactly as it comes to mind...',
toneLabel: 'Tone',
langLabel: 'Output language',
moreLanguages: 'More languages',
searchLanguagePlaceholder: 'Search language...',
btn: 'Generate 3 versions',
freeNote: 'Free, no credit card',
tryExample: 'Or try an example',
writing: 'Writing',
err: 'Something went wrong. Please try again.',
connErr: 'Connection error. Please try again.',
copy: 'Copy', copied: 'Copied',
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
versionLabel: 'Version',
langs: { 'Espanol': 'Spanish', 'English': 'English', 'Portugues': 'Portuguese' }
},
'Espanol': {
tagline: 'Escribí tu mensaje. Elegí el tono y el idioma. Obtené 3 versiones pulidas.',
messageLabel: 'Tu mensaje',
placeholder: 'Escribí tu mensaje tal como te sale… (por más crudo que sea)',
toneLabel: 'Tono',
langLabel: 'Idioma del resultado',
moreLanguages: 'Más idiomas',
searchLanguagePlaceholder: 'Buscar idioma...',
btn: 'Generar 3 versiones',
freeNote: 'Gratis, sin tarjeta',
tryExample: 'O probá con un ejemplo',
writing: 'Escribiendo',
err: 'Algo salio mal. Intenta de nuevo.',
connErr: 'Error de conexion. Intenta de nuevo.',
copy: 'Copiar', copied: 'Copiado',
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
tones: { 'Professional': 'Profesional', 'Direct': 'Directo', 'Diplomatic': 'Diplomático', 'Empathetic': 'Empático', 'Firm': 'Firme' },
versionLabel: 'Versión',
langs: { 'Espanol': 'Español', 'English': 'English', 'Portugues': 'Portugués', 'French': 'Francés', 'Italian': 'Italiano', 'German': 'Alemán', 'Dutch': 'Holandés', 'Russian': 'Ruso', 'Chinese': 'Chino', 'Japanese': 'Japonés', 'Korean': 'Coreano', 'Arabic': 'Árabe', 'Hindi': 'Hindi', 'Turkish': 'Turco', 'Polish': 'Polaco', 'Ukrainian': 'Ucraniano', 'Greek': 'Griego', 'Hebrew': 'Hebreo', 'Swedish': 'Sueco', 'Norwegian': 'Noruego', 'Danish': 'Danés', 'Finnish': 'Finlandés', 'Czech': 'Checo', 'Romanian': 'Rumano', 'Hungarian': 'Húngaro', 'Vietnamese': 'Vietnamita', 'Thai': 'Tailandés', 'Indonesian': 'Indonesio', 'Filipino': 'Filipino' }
},
'Portugues': {
tagline: 'Escreva sua mensagem. Escolha o tom e o idioma. Obtenha 3 versoes refinadas.',
messageLabel: 'Sua mensagem',
placeholder: 'Escreva sua mensagem exatamente como vem à mente…',
toneLabel: 'Tom',
langLabel: 'Idioma do resultado',
moreLanguages: 'Mais idiomas',
searchLanguagePlaceholder: 'Buscar idioma...',
btn: 'Gerar 3 versoes',
freeNote: 'Gratis, sem cartao',
tryExample: 'Ou experimente um exemplo',
writing: 'Escrevendo',
err: 'Algo deu errado. Tente novamente.',
connErr: 'Erro de conexao. Tente novamente.',
copy: 'Copiar', copied: 'Copiado',
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
tones: { 'Professional': 'Profissional', 'Direct': 'Direto', 'Diplomatic': 'Diplomático', 'Empathetic': 'Empático', 'Firm': 'Firme' },
versionLabel: 'Versão',
langs: { 'Espanol': 'Espanhol', 'English': 'Ingles', 'Portugues': 'Portugues', 'French': 'Frances', 'Italian': 'Italiano', 'German': 'Alemao', 'Dutch': 'Holandes', 'Russian': 'Russo', 'Chinese': 'Chines', 'Japanese': 'Japones', 'Korean': 'Coreano', 'Arabic': 'Arabe', 'Hindi': 'Hindi', 'Turkish': 'Turco', 'Polish': 'Polones', 'Ukrainian': 'Ucraniano', 'Greek': 'Grego', 'Hebrew': 'Hebraico', 'Swedish': 'Sueco', 'Norwegian': 'Norueguês', 'Danish': 'Dinamarques', 'Finnish': 'Finlandes', 'Czech': 'Tcheco', 'Romanian': 'Romeno', 'Hungarian': 'Hungaro', 'Vietnamese': 'Vietnamita', 'Thai': 'Tailandes', 'Indonesian': 'Indonesio', 'Filipino': 'Filipino' }
}
};

var THEME = {
dark: { BG: '#08090C', SURFACE: '#101216', SURFACE2: '#16181D', BORDER: '#1F2228', BORDER_STRONG: '#2A2E37', TEXT: '#F5F6F8', TEXT2: '#A1A6B0', TEXT3: '#5C6470', ACCENT: '#647EFF', ACCENT_HOVER: '#7690FF', ACCENT_ACTIVE: '#5468D8', ACCENT_SOFT: 'rgba(100,126,255,0.12)', ACCENT_BORDER: 'rgba(100,126,255,0.45)', FOCUS_RING: '0 0 0 3px rgba(100,126,255,0.30)', SHADOW: '0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.25)', SHADOW_HOVER: '0 4px 20px rgba(0,0,0,.5)', GLOW: '0 0 0 1px rgba(100,126,255,.4), 0 4px 24px rgba(100,126,255,.35)', GREEN: '#3DDC97', GREEN_LIGHT: 'rgba(61,220,151,0.1)', RED: '#FF6B6B', RED_LIGHT: 'rgba(255,107,107,0.12)' },
light: { BG: '#FAFAFB', SURFACE: '#FFFFFF', SURFACE2: '#F3F4F6', BORDER: '#E5E7EB', BORDER_STRONG: '#D1D5DB', TEXT: '#0B0D12', TEXT2: '#565C66', TEXT3: '#9CA3AF', ACCENT: '#4C6EF5', ACCENT_HOVER: '#3F5FE0', ACCENT_ACTIVE: '#3651C9', ACCENT_SOFT: 'rgba(76,110,245,0.08)', ACCENT_BORDER: 'rgba(76,110,245,0.4)', FOCUS_RING: '0 0 0 3px rgba(76,110,245,0.20)', SHADOW: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)', SHADOW_HOVER: '0 4px 12px rgba(16,24,40,.08)', GLOW: '0 4px 16px rgba(76,110,245,.28)', GREEN: '#12B76A', GREEN_LIGHT: '#DCFCE7', RED: '#E5484D', RED_LIGHT: '#FEF2F2' }
};
var VERSION_COLORS_DARK = ['#647EFF', '#8A7CFF', '#B07CFF'];
var VERSION_COLORS_LIGHT = ['#4C6EF5', '#7048E8', '#9C36B5'];

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
var s22 = useState(false); var isSubscribed = s22[0]; var setIsSubscribed = s22[1];
var s23 = useState(true); var isDark = s23[0]; var setIsDark = s23[1];
var s24 = useState(false); var themeLoaded = s24[0]; var setThemeLoaded = s24[1];

var posthog = usePostHog();
var t = UI[uiLang] || UI['English'];
var C = isDark ? THEME.dark : THEME.light;
var VERSION_COLORS = isDark ? VERSION_COLORS_DARK : VERSION_COLORS_LIGHT;

useEffect(function() {
try { var saved = localStorage.getItem('ezw_theme'); setIsDark(saved ? saved === 'dark' : true); } catch(e) {}
setThemeLoaded(true);
}, []);
function toggleTheme() {
setIsDark(function(prev) { var next = !prev; try { localStorage.setItem('ezw_theme', next ? 'dark' : 'light'); } catch(e) {} return next; });
}

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
fetch('/api/refer?uid=' + uid).then(function(r) { return r.json(); }).then(function(d) { var rc = d.referralCount || 0; var bg = d.bonusGenerations || 0; var sub = d.isSubscribed || false; setReferralCount(rc); setBonusGen(bg); setIsSubscribed(sub); setUsageLeft(function() { return sub ? 9999 : (DAILY_LIMIT + bg) - getUsage().count; }); }).catch(function(){});
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

async function runGenerate(msgOverride, toneOverride, recipientOverride) {
var msg = msgOverride !== undefined ? msgOverride : message;
if (!msg.trim()) return;
var usage = getUsage();
if (!isSubscribed && usage.count >= DAILY_LIMIT + bonusGen) { setUsageLeft(0); return; }
if (posthog) posthog.capture('generate_clicked', { tone: toneOverride || tone, language: language, recipient: recipientOverride !== undefined ? recipientOverride : recipient, message_length: msg.trim().length });
setLoading(true); setError(''); setVersions(null);
var _ctrl = new AbortController();
var _tout = setTimeout(function() { _ctrl.abort(); }, 25000);
try {
var res = await fetch('/api/write', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message: msg, tone: toneOverride || tone, language: language, recipient: (function() { var r = recipientOverride !== undefined ? recipientOverride : recipient; return r === 'Other' || r === 'Otro' || r === 'Outro' ? recipientOther : r; })() })
,
signal: _ctrl.signal
});
var data = await res.json();
if (data.error) { setError(t.err); } else {
setVersions(data.versions);
usage.count += 1;
saveUsage(usage);
setUsageLeft((DAILY_LIMIT + bonusGen) - usage.count);
}
} catch (e) { clearTimeout(_tout); setError(e.name === 'AbortError' ? t.err : t.connErr); }
finally { clearTimeout(_tout); setLoading(false); }
}

function handleGenerate() { runGenerate(); }

function handleExampleClick(ex) {
setMessage(ex.text);
setTone(ex.tone);
setRecipient(ex.recipient);
if (posthog) posthog.capture('example_clicked', { label: ex.label });
runGenerate(ex.text, ex.tone, ex.recipient);
}

async function handleCopy(text, idx) {
try {
await navigator.clipboard.writeText(text);
if (posthog) posthog.capture('result_copied', { version: idx + 1 });
setCopied(idx);
setTimeout(function() { setCopied(null); }, 2000);
} catch (e) {}
}

var isDisabled = !message.trim() || loading || (usageLeft <= 0 && !isSubscribed);
var showManifest = typeof navigator === 'undefined' ? true : !/SamsungBrowser/i.test(navigator.userAgent || '');
var examples = EXAMPLES[uiLang] || EXAMPLES['English'];

var showPaywall = !isSubscribed && usageLeft <= 0;
if (!themeLoaded) return null;
return (
<div style={{ minHeight: '100vh', background: C.BG, fontFamily: inter.style.fontFamily, padding: '0 1rem', transition: 'background 0.2s ease' }}>
<Head>
<title>EzWrite</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
{showManifest && <link rel="manifest" href="/manifest.json" />}
<meta name="theme-color" content={isDark ? '#08090C' : '#FAFAFB'} />
<meta name="description" content={t.tagline} />
</Head>
<style>{`
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
@keyframes card-in { to { opacity: 1; transform: translateY(0); } }
@keyframes dot-bounce { 0%, 60%, 100% { opacity: .3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
@keyframes check-pop { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
.ez-generate-btn:not(:disabled):hover { background: ${C.ACCENT_HOVER}; box-shadow: ${C.GLOW}; }
.ez-generate-btn:not(:disabled) { transition: background .15s ease, box-shadow .15s ease, transform .08s ease; }
.ez-generate-btn:not(:disabled):active { background: ${C.ACCENT_ACTIVE}; transform: scale(0.98); }
.ez-card { transition: box-shadow 0.15s ease, border-color 0.15s ease; }
.ez-card:hover { box-shadow: ${C.SHADOW_HOVER}; }
.ez-example-chip { transition: border-color .15s ease, background .15s ease, transform .1s ease, color .15s ease; }
.ez-example-chip:hover { border-color: ${C.ACCENT_BORDER} !important; background: ${C.ACCENT_SOFT} !important; color: ${C.TEXT} !important; transform: translateY(-1px); }
.ez-theme-toggle { transition: background 0.15s ease; }
.ez-theme-toggle:hover { background: ${C.SURFACE2} !important; }
.ez-theme-toggle svg { transition: transform .3s ease; }
.ez-theme-toggle[data-dark="true"] svg { transform: rotate(180deg); }
.ez-textarea-input { transition: border-color .15s ease, box-shadow .15s ease; }
.ez-textarea-input:focus { outline: none; border-color: ${C.ACCENT} !important; box-shadow: ${C.SHADOW}, ${C.FOCUS_RING} !important; }
.ez-copy-btn[data-copied="true"] svg { animation: check-pop .25s ease; }
.ez-result-card { opacity: 0; transform: translateY(6px); animation: card-in .3s ease forwards; }
.ez-wordmark { letter-spacing: -0.03em; }
@media (max-width: 480px) { .ez-wordmark { letter-spacing: -0.02em; } h1.ez-headline { font-size: 18px; } }
`}</style>
<div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '3.5rem', paddingBottom: '4.5rem' }}>
<div style={{ marginBottom: '2.75rem' }}>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
<div className="ez-wordmark" style={{ fontFamily: inter.style.fontFamily, fontWeight: 800, fontSize: '21px', color: C.TEXT, display: 'flex', alignItems: 'center', gap: '8px' }}>
<span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.ACCENT, display: 'inline-block' }}></span>
EzWrite
</div>
<div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
<button onClick={toggleTheme} className="ez-theme-toggle" data-dark={isDark} aria-label="Toggle theme" style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '1px solid '+C.BORDER, background: 'transparent', cursor: 'pointer', color: C.TEXT2 }}>
{isDark ? (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>) : (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 18a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.7.7a1 1 0 11-1.42 1.42l-.7-.7a1 1 0 010-1.42zm14.14 14.14a1 1 0 011.42 0l.7.7a1 1 0 01-1.42 1.42l-.7-.7a1 1 0 010-1.42zM2 12a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm18 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.22 19.78a1 1 0 010-1.42l.7-.7a1 1 0 111.42 1.42l-.7.7a1 1 0 01-1.42 0zM18.36 5.64a1 1 0 010-1.42l.7-.7a1 1 0 111.42 1.42l-.7.7a1 1 0 01-1.42 0z"/></svg>)}
</button>
<div style={{ display: 'flex', gap: '4px' }}>
{LANGUAGES.map(function(ul) { var active = uiLang === ul; return (<button key={ul} onClick={function() { setUiLang(ul); }} style={{ padding: '4px 9px', borderRadius: '4px', border: active ? '1.5px solid '+C.ACCENT : '1px solid '+C.BORDER, background: active ? C.ACCENT_SOFT : 'transparent', color: active ? C.ACCENT : C.TEXT3, fontSize: '11px', fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: inter.style.fontFamily, letterSpacing: '0.03em' }}>{UI_CODES[ul]}</button>); })}
</div>
</div>
</div>
<h1 className="ez-headline" style={{ fontSize: '20px', fontWeight: 700, color: C.TEXT, marginTop: '14px', lineHeight: 1.4, letterSpacing: '-0.015em', maxWidth: '480px' }}>{t.tagline}</h1>
</div>
{showInstallBanner && (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: C.ACCENT_SOFT, border: '1px solid '+C.ACCENT, borderRadius: '10px', padding: '12px 14px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
<span style={{ fontSize: '13px', color: C.TEXT, fontWeight: 500 }}>{t.installTitle}</span>
<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
<button onClick={handleInstallClick} style={{ background: C.ACCENT, color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: inter.style.fontFamily }}>{isIos ? t.installBtnIos : t.installBtn}</button>
<button onClick={handleInstallDismiss} style={{ background: 'transparent', color: C.TEXT3, border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: inter.style.fontFamily }}>{t.installDismiss}</button>
</div>
{isIos && showIosSteps && (<ol style={{ width: '100%', margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: C.TEXT2, lineHeight: 1.6 }}>
<li>{t.iosStep1}</li>
<li>{t.iosStep2}</li>
<li>{t.iosStep3}</li>
</ol>)}
</div>)}
{!versions && !loading && (<div style={{ marginBottom: '1.75rem' }}>
<span style={{ fontSize: '12px', color: C.TEXT3, marginBottom: '8px', display: 'block' }}>{t.tryExample}</span>
<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
{examples.map(function(ex, i) { return (<button key={i} className="ez-example-chip" onClick={function() { handleExampleClick(ex); }} style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid '+C.BORDER, background: 'transparent', color: C.TEXT2, fontSize: '13.5px', fontWeight: 500, cursor: 'pointer', fontFamily: inter.style.fontFamily }}>{ex.label}</button>); })}
</div>
</div>)}
<div style={{ marginBottom: '1.75rem' }}>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3 }}>{t.messageLabel}</span>
<button onClick={toggleListening} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', border: isListening ? '1.5px solid '+C.RED : '1px solid '+C.BORDER, background: isListening ? C.RED_LIGHT : 'transparent', color: isListening ? C.RED : C.TEXT2, fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: inter.style.fontFamily }}>
<svg width="12" height="12" viewBox="0 0 24 24" fill={isListening ? C.RED : C.TEXT2}><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6 10a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93V21H8v2h8v-2h-3v-2.07A8 8 0 0 0 20 11h-2z"/></svg>
{isListening ? t.stop : t.dictate}
{isListening && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.RED, display: 'inline-block', animation: 'pulse 1s infinite' }}></span>}
</button>
</div>
<textarea className="ez-textarea-input" style={{ width: '100%', minHeight: '130px', padding: '16px 18px', border: isListening ? '1.5px solid '+C.RED : '1px solid '+C.BORDER, borderRadius: '14px', fontSize: '15px', color: C.TEXT, background: isListening ? C.RED_LIGHT : C.SURFACE, resize: 'vertical', fontFamily: inter.style.fontFamily, lineHeight: 1.65, boxSizing: 'border-box', boxShadow: C.SHADOW }} placeholder={t.placeholder} value={message} onChange={function(e) { setMessage(e.target.value); }} />
</div>
<div style={{ marginBottom: '1.75rem' }}>
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3, marginBottom: '10px', display: 'block' }}>{t.recipientLabel}</span>
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: recipient === 'Other' || recipient === 'Otro' || recipient === 'Outro' ? '8px' : '0' }}>
{t.recipientOptions.map(function(r) { var active = recipient === r; return (<button key={r} onClick={function() { setRecipient(active ? '' : r); if (!active) setRecipientOther(''); }} style={{ padding: '8px 15px', borderRadius: '8px', border: active ? '1.5px solid '+C.ACCENT_BORDER : '1px solid '+C.BORDER, background: active ? C.ACCENT_SOFT : 'transparent', color: active ? C.ACCENT : C.TEXT2, fontSize: '13.5px', fontWeight: active ? 600 : 500, cursor: 'pointer', fontFamily: inter.style.fontFamily, transition: 'all .15s ease' }}>{r}</button>); })}
</div>
{(recipient === 'Other' || recipient === 'Otro' || recipient === 'Outro') && (<input type="text" value={recipientOther} onChange={function(e) { setRecipientOther(e.target.value); }} placeholder={t.recipientOtherPlaceholder} style={{ width: '100%', padding: '10px 14px', border: '1px solid '+C.BORDER, borderRadius: '8px', fontSize: '14px', color: C.TEXT, background: C.SURFACE, fontFamily: inter.style.fontFamily, boxSizing: 'border-box', outline: 'none' }} />)}
</div>
<div style={{ marginBottom: '1.75rem' }}>
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3, marginBottom: '10px', display: 'block' }}>{t.toneLabel}</span>
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
{TONES.map(function(tk) { var active = tone === tk; return (<button key={tk} onClick={function() { setTone(tk); }} style={{ padding: '8px 15px', borderRadius: '8px', border: active ? '1.5px solid '+C.ACCENT_BORDER : '1px solid '+C.BORDER, background: active ? C.ACCENT_SOFT : 'transparent', color: active ? C.ACCENT : C.TEXT2, fontSize: '13.5px', fontWeight: active ? 600 : 500, cursor: 'pointer', fontFamily: inter.style.fontFamily, transition: 'all .15s ease' }}>{t.tones[tk] || tk}</button>); })}
</div>
</div>
<div style={{ marginBottom: '1.75rem' }}>
<span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3, marginBottom: '10px', display: 'block' }}>{t.langLabel}</span>
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
{LANGUAGES.map(function(l) { var active = language === l; return (<button key={l} onClick={function() { setLanguage(l); setShowMoreLanguages(false); }} style={{ padding: '8px 15px', borderRadius: '8px', border: active ? '1.5px solid '+C.ACCENT_BORDER : '1px solid '+C.BORDER, background: active ? C.ACCENT_SOFT : 'transparent', color: active ? C.ACCENT : C.TEXT2, fontSize: '13.5px', fontWeight: active ? 600 : 500, cursor: 'pointer', fontFamily: inter.style.fontFamily, transition: 'all .15s ease' }}>{t.langs[l] || l}</button>); })}
{(function() { var isExtraActive = OUTPUT_LANGUAGES_EXTRA.indexOf(language) !== -1; return (<button onClick={function() { setShowMoreLanguages(!showMoreLanguages); }} style={{ padding: '8px 15px', borderRadius: '8px', border: isExtraActive ? '1.5px solid '+C.ACCENT_BORDER : '1px dashed '+C.BORDER, background: isExtraActive ? C.ACCENT_SOFT : 'transparent', color: isExtraActive ? C.ACCENT : C.TEXT2, fontSize: '13.5px', fontWeight: isExtraActive ? 600 : 500, cursor: 'pointer', fontFamily: inter.style.fontFamily }}>{isExtraActive ? (t.langs[language] || language) : t.moreLanguages}</button>); })()}
</div>
{showMoreLanguages && (<div style={{ marginTop: '10px', padding: '12px', border: '1px solid '+C.BORDER, borderRadius: '10px', background: C.SURFACE2 }}>
<input type="text" value={langSearch} onChange={function(e) { setLangSearch(e.target.value); }} placeholder={t.searchLanguagePlaceholder} style={{ width: '100%', padding: '8px 10px', border: '1px solid '+C.BORDER, borderRadius: '6px', fontSize: '13px', color: C.TEXT, background: C.SURFACE, fontFamily: inter.style.fontFamily, boxSizing: 'border-box', outline: 'none', marginBottom: '10px' }} />
<div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '180px', overflowY: 'auto' }}>
{OUTPUT_LANGUAGES_EXTRA.filter(function(l) { return (t.langs[l] || l).toLowerCase().indexOf(langSearch.toLowerCase()) !== -1; }).map(function(l) { var active = language === l; return (<button key={l} onClick={function() { setLanguage(l); setShowMoreLanguages(false); setLangSearch(''); }} style={{ padding: '6px 12px', borderRadius: '6px', border: active ? '1.5px solid '+C.ACCENT_BORDER : '1px solid '+C.BORDER, background: active ? C.ACCENT_SOFT : 'transparent', color: active ? C.ACCENT : C.TEXT2, fontSize: '13px', fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: inter.style.fontFamily }}>{t.langs[l] || l}</button>); })}
</div>
</div>)}
</div>
<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
{usageLeft > 0 && usageLeft < (DAILY_LIMIT + bonusGen) && <span style={{ fontSize: '11px', color: usageLeft === 1 ? C.RED : C.TEXT3 }}>{t.usageLeft(usageLeft)}</span>}
</div>
<button className="ez-generate-btn" style={{ width: '100%', padding: '16px', background: isDisabled ? C.BORDER : C.ACCENT, color: isDisabled ? C.TEXT3 : '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em', cursor: isDisabled ? 'not-allowed' : 'pointer', fontFamily: inter.style.fontFamily, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleGenerate} disabled={isDisabled}>
{loading ? (<span>{t.writing}<span className="loading-dots"><span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', margin: '0 1px', animation: 'dot-bounce 1.1s infinite ease-in-out' }}></span><span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', margin: '0 1px', animation: 'dot-bounce 1.1s infinite ease-in-out .15s' }}></span><span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', margin: '0 1px', animation: 'dot-bounce 1.1s infinite ease-in-out .3s' }}></span></span></span>) : t.btn}
</button>
<div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', fontWeight: 500, color: C.TEXT3 }}>{t.freeNote}</div>
{showPaywall && (<div style={{ background: isDark ? 'rgba(245,158,11,0.1)' : '#FFF7ED', border: '1px solid '+(isDark ? 'rgba(245,158,11,0.35)' : '#FED7AA'), borderRadius: '10px', padding: '20px', marginTop: '1rem', textAlign: 'center' }}><div style={{ fontSize: '15px', fontWeight: 600, color: isDark ? '#FBBF24' : '#92400E', marginBottom: '6px' }}>{t.limitTitle}</div><div style={{ fontSize: '13px', color: isDark ? '#FCD34D' : '#B45309', marginBottom: '16px', lineHeight: 1.5 }}>{t.limitMsg}</div><div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}><a href={`https://ezwrite.lemonsqueezy.com/checkout/buy/301906ea-f048-4b2b-a72d-0734e8869e4a${userId ? "?checkout%5Bcustom%5D%5Buser_id%5D=" + encodeURIComponent(userId) : ""}&checkout%5Bredirect_url%5D=https://ezwrite.app/?activated=1`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#F59E0B', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>{t.limitBtnMonthly}</a><a href={`https://ezwrite.lemonsqueezy.com/checkout/buy/fbe2aa91-d13b-4663-a043-f73b95f0884d${userId ? "?checkout%5Bcustom%5D%5Buser_id%5D=" + encodeURIComponent(userId) : ""}&checkout%5Bredirect_url%5D=https://ezwrite.app/?activated=1`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'transparent', color: isDark ? '#FBBF24' : '#92400E', border: '1.5px solid #F59E0B', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>{t.limitBtnAnnual}</a></div></div>)}
{error && (<div style={{ background: C.RED_LIGHT, border: '1px solid '+C.RED, color: C.RED, borderRadius: '8px', padding: '12px 14px', fontSize: '13px', marginTop: '1rem' }}>{error}</div>)}
{versions && (<div className="ph-no-capture"><div style={{ height: '1px', background: C.BORDER, margin: '2rem 0' }}></div>{versions.map(function(v, idx) { var color = VERSION_COLORS[idx] || C.ACCENT; var isCopied = copied === idx; return (<div key={idx} className="ez-card ez-result-card" style={{ background: C.SURFACE, border: '1px solid '+C.BORDER, borderLeft: '3px solid '+color, borderRadius: '14px', padding: '18px', marginBottom: '14px', boxShadow: C.SHADOW, animationDelay: (idx*80)+'ms' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: color+'22', color: color }}>{t.versionLabel} {v.label}</span><button className="ez-copy-btn" data-copied={isCopied} onClick={function() { handleCopy(v.text, idx); }} style={{ fontSize: '12px', fontWeight: 500, padding: '5px 12px', borderRadius: '6px', border: isCopied ? '1px solid '+C.GREEN : '1px solid '+C.BORDER, background: isCopied ? C.GREEN_LIGHT : 'transparent', cursor: 'pointer', color: isCopied ? C.GREEN : C.TEXT2, fontFamily: inter.style.fontFamily, display: 'flex', alignItems: 'center', gap: '4px' }}>{isCopied && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}{isCopied ? t.copied : t.copy}</button></div><p style={{ fontSize: '15px', lineHeight: 1.7, color: isDark ? C.TEXT2 : C.TEXT, margin: 0, whiteSpace: 'pre-wrap' }}>{v.text}</p></div>); })}</div>)}
{userId && (<div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid '+C.BORDER, textAlign: 'center' }}><div style={{ fontSize: '13px', fontWeight: 600, color: C.TEXT, marginBottom: '6px' }}>{t.shareMsg}</div><div style={{ marginBottom: '14px' }}>{[0,1,2,3,4].map(function(i) { var filled = referralCount > 0 && (i < referralCount % 5 || (referralCount % 5 === 0 && i < 5)); return (<span key={i} style={{ fontSize: '22px', color: filled ? C.GREEN : C.TEXT3 }}>{filled ? '●' : '○'}</span>); })}<span style={{ fontSize: '12px', color: C.TEXT2, marginLeft: '10px' }}>{t.shareProgress(referralCount % 5 === 0 && referralCount > 0 ? 5 : referralCount % 5)}</span></div><button onClick={function() { var url = 'https://ezwrite.app?ref='+userId; var msg = 'Probá EzWrite gratis — la IA que te da 3 versiones pulidas de cualquier mensaje: ' + url; if (posthog) posthog.capture('referral_shared');
window.open('https://wa.me/?text='+encodeURIComponent(msg), '_blank'); }} style={{ padding: '11px 28px', background: C.GREEN, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: inter.style.fontFamily, display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width='16' height='16' viewBox='0 0 24 24' fill='white'><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/></svg> {t.shareBtn}</button>{bonusGen > 0 && (<div style={{ fontSize: '12px', color: C.GREEN, marginTop: '8px', fontWeight: 500 }}>+{bonusGen} {uiLang === 'Espanol' ? 'generaciones extra desbloqueadas' : uiLang === 'Portugues' ? 'gerações extras desbloqueadas' : 'extra generations unlocked'}</div>)}</div>)}
<div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid '+C.BORDER, textAlign: 'center', fontSize: '12px', color: C.TEXT3 }}>Made with <span style={{ color: C.ACCENT, fontWeight: 700 }}>EzWrite</span><span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>Powered by <span style={{ color: '#E86A2D', fontWeight: 600 }}>Claude</span></div>
<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}><a href="https://www.producthunt.com/products/ezwrite?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-ezwrite" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: '1px solid '+C.BORDER, fontSize: '12px', color: C.TEXT3, textDecoration: 'none', fontFamily: inter.style.fontFamily }}>🚀 Featured on Product Hunt</a></div>
</div>
</div>
);
}
