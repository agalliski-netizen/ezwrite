import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });

const C = {
  BG: '#08090C', SURFACE: '#101216', BORDER: '#1F2228',
  TEXT: '#F5F6F8', TEXT2: '#A1A6B0', TEXT3: '#5C6470',
  ACCENT: '#647EFF', SHADOW: '0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.25)',
};

const UI = {
  es: {
    title: 'Privacidad — EzWrite',
    back: '← Volver a EzWrite',
    h1: 'Política de privacidad',
    updated: 'Última actualización: 27 de agosto de 2026',
    intro: 'Esta página explica, en criollo, qué pasa con lo que escribís en EzWrite. Nada de letra chica: si algo no está acá, probablemente no lo hacemos.',
    sections: [
      {
        h: 'Tu mensaje y las 3 versiones generadas',
        p: 'El texto que escribís y las versiones que EzWrite te devuelve se procesan para generar la respuesta y no quedan guardados en nuestros servidores. Además, estos campos están específicamente excluidos de nuestra herramienta de analítica (PostHog): nunca se envía el contenido de tu mensaje ni el de las generaciones a esa herramienta, ni queda visible en ningún tipo de grabación de sesión. Solo vos, en el momento en que generás el mensaje, lo ves.',
      },
      {
        h: 'El historial de mensajes',
        p: 'Si usás la función de Historial, esas entradas se guardan únicamente en el navegador de tu dispositivo (localStorage), nunca en nuestros servidores. Nadie más las puede ver, y las podés borrar cuando quieras con el botón "Borrar historial" dentro de la app.',
      },
      {
        h: 'Qué sí medimos',
        p: 'Usamos PostHog para entender el uso general de la app: qué tono se elige, en qué idioma, si se completó el destinatario, cuántas generaciones se hacen por semana, si se llegó a ver la pantalla de precios, etc. Es información agregada y anónima sobre el uso del producto — nunca el contenido de lo que escribiste.',
      },
      {
        h: 'Pagos',
        p: 'Si te suscribís a EzWrite, el pago lo procesa Lemon Squeezy. Nosotros no vemos ni guardamos el número de tu tarjeta ni ningún dato financiero — eso queda enteramente del lado de Lemon Squeezy, que es quien factura la suscripción.',
      },
      {
        h: 'Cookies y almacenamiento local',
        p: 'Usamos el almacenamiento local de tu navegador para cosas como tu contador de generaciones gratis de la semana, tu preferencia de tema (claro/oscuro) y tu historial de mensajes (si lo activás). No usamos esto para rastrearte en otros sitios ni lo compartimos con nadie.',
      },
      {
        h: 'Con quién compartimos datos',
        p: 'No vendemos ni compartimos tus mensajes con nadie, bajo ningún concepto. Los únicos terceros involucrados son los proveedores que hacen funcionar la app (el servicio de IA que genera las versiones, Lemon Squeezy para pagos, PostHog para analítica agregada) — cada uno solo recibe lo estrictamente necesario para cumplir su función.',
      },
      {
        h: 'Contacto',
        p: 'Si tenés dudas sobre esto, escribinos a ezwrite.app@gmail.com o por Instagram (@ezwrite.app) o X (@Polaco23456).',
      },
    ],
  },
  en: {
    title: 'Privacy — EzWrite',
    back: '← Back to EzWrite',
    h1: 'Privacy policy',
    updated: 'Last updated: August 27, 2026',
    intro: 'This page explains, in plain language, what happens to what you write in EzWrite. No fine print: if it\'s not listed here, we probably don\'t do it.',
    sections: [
      {
        h: 'Your message and the 3 generated versions',
        p: 'The text you write and the versions EzWrite returns are processed to generate the response and are not stored on our servers. These fields are also specifically excluded from our analytics tool (PostHog): the content of your message and the generated versions is never sent to it, and never appears in any kind of session recording. Only you, at the moment you generate the message, see it.',
      },
      {
        h: 'Message history',
        p: 'If you use the History feature, those entries are saved only in your device\'s browser (localStorage), never on our servers. No one else can see them, and you can delete them anytime with the "Clear history" button inside the app.',
      },
      {
        h: 'What we do measure',
        p: 'We use PostHog to understand general app usage: which tone gets picked, in which language, whether a recipient was filled in, how many generations happen per week, whether the pricing screen was seen, etc. This is aggregated, anonymous product-usage information — never the content of what you wrote.',
      },
      {
        h: 'Payments',
        p: 'If you subscribe to EzWrite, payment is processed by Lemon Squeezy. We don\'t see or store your card number or any financial data — that stays entirely on Lemon Squeezy\'s side, which is who bills the subscription.',
      },
      {
        h: 'Cookies and local storage',
        p: 'We use your browser\'s local storage for things like your weekly free-generation counter, your theme preference (light/dark), and your message history (if you use it). We don\'t use this to track you across other sites or share it with anyone.',
      },
      {
        h: 'Who we share data with',
        p: 'We do not sell or share your messages with anyone, under any circumstance. The only third parties involved are the providers that make the app work (the AI service that generates the versions, Lemon Squeezy for payments, PostHog for aggregated analytics) — each only receives what\'s strictly necessary to do its job.',
      },
      {
        h: 'Contact',
        p: 'If you have questions about this, email us at ezwrite.app@gmail.com or reach out on Instagram (@ezwrite.app) or X (@Polaco23456).',
      },
    ],
  },
};

export default function Privacidad() {
  return (
    <div style={{ minHeight: '100vh', background: C.BG, fontFamily: inter.style.fontFamily, padding: '0 1rem' }}>
      <Head>
        <title>{UI.es.title}</title>
        <meta name="description" content={UI.es.intro} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#08090C" />
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: C.TEXT2, textDecoration: 'none', marginBottom: '2rem' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.ACCENT, display: 'inline-block' }}></span>
          {UI.es.back}
        </Link>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: C.TEXT, marginBottom: '6px', letterSpacing: '-0.02em' }}>{UI.es.h1}</h1>
        <div style={{ fontSize: '12.5px', color: C.TEXT3, marginBottom: '1.75rem' }}>{UI.es.updated}</div>
        <p style={{ fontSize: '15px', color: C.TEXT2, lineHeight: 1.6, marginBottom: '2.25rem' }}>{UI.es.intro}</p>

        {UI.es.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.TEXT, marginBottom: '6px' }}>{s.h}</h2>
            <p style={{ fontSize: '14px', color: C.TEXT2, lineHeight: 1.65, margin: 0 }}>{s.p}</p>
          </div>
        ))}

        <div style={{ height: '1px', background: C.BORDER, margin: '2.5rem 0' }}></div>

        <h1 style={{ fontSize: '22px', fontWeight: 800, color: C.TEXT, marginBottom: '6px', letterSpacing: '-0.02em' }}>{UI.en.h1}</h1>
        <div style={{ fontSize: '12.5px', color: C.TEXT3, marginBottom: '1.75rem' }}>{UI.en.updated}</div>
        <p style={{ fontSize: '15px', color: C.TEXT2, lineHeight: 1.6, marginBottom: '2.25rem' }}>{UI.en.intro}</p>

        {UI.en.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: C.TEXT, marginBottom: '6px' }}>{s.h}</h2>
            <p style={{ fontSize: '14px', color: C.TEXT2, lineHeight: 1.65, margin: 0 }}>{s.p}</p>
          </div>
        ))}

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid ' + C.BORDER, textAlign: 'center', fontSize: '12px', color: C.TEXT3 }}>
          Made with <span style={{ color: C.ACCENT, fontWeight: 700 }}>EzWrite</span>
        </div>
      </div>
    </div>
  );
}
