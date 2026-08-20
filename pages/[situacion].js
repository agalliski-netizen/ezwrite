import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import situaciones from '../data/situaciones.json';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });

const C = {
  BG: '#08090C', SURFACE: '#101216', SURFACE2: '#16181D', BORDER: '#1F2228',
  BORDER_STRONG: '#2A2E37', TEXT: '#F5F6F8', TEXT2: '#A1A6B0', TEXT3: '#5C6470',
  ACCENT: '#647EFF', ACCENT_HOVER: '#7690FF', ACCENT_SOFT: 'rgba(100,126,255,0.12)',
  ACCENT_BORDER: 'rgba(100,126,255,0.45)', SHADOW: '0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.25)',
};
const VERSION_COLORS = ['#647EFF', '#8A7CFF', '#B07CFF'];

function buildPages() {
  const pages = [];
  situaciones.forEach((s) => {
    ['es', 'en'].forEach((lang) => {
      pages.push({ slug: s[lang].slug, lang, data: s[lang], id: s.id, category: s.category });
    });
  });
  return pages;
}

export async function getStaticPaths() {
  const pages = buildPages();
  return {
    paths: pages.map((p) => ({ params: { situacion: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const pages = buildPages();
  const page = pages.find((p) => p.slug === params.situacion);
  if (!page) return { notFound: true };
  return { props: { page } };
}

const BACK_LABEL = { es: '← Volver a EzWrite', en: '← Back to EzWrite' };
const RAW_LABEL = { es: 'Así lo escribirías vos', en: 'How you’d normally write it' };
const POLISHED_LABEL = { es: 'Así te lo deja EzWrite', en: 'What EzWrite gives you' };
const FREE_NOTE = { es: 'Gratis, sin tarjeta, sin crear cuenta', en: 'Free, no card, no account needed' };
const CTA_BTN = { es: 'Probar con mi propio mensaje', en: 'Try it with my own message' };

export default function SituacionPage({ page }) {
  const { data, lang } = page;
  const back = BACK_LABEL[lang];
  const rawLabel = RAW_LABEL[lang];
  const polishedLabel = POLISHED_LABEL[lang];
  const freeNote = FREE_NOTE[lang];
  const ctaBtn = CTA_BTN[lang];

  return (
    <div style={{ minHeight: '100vh', background: C.BG, fontFamily: inter.style.fontFamily, padding: '0 1rem' }}>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.meta} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#08090C" />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.meta} />
        <meta property="og:type" content="article" />
      </Head>
      <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: C.TEXT2, textDecoration: 'none', marginBottom: '2rem' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.ACCENT, display: 'inline-block' }}></span>
          {back}
        </Link>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: C.TEXT, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '14px' }}>
          {data.h1}
        </h1>
        <p style={{ fontSize: '15.5px', fontWeight: 400, color: C.TEXT2, lineHeight: 1.65, marginBottom: '2rem', maxWidth: '560px' }}>
          {data.intro}
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3, marginBottom: '10px', display: 'block' }}>
            {rawLabel}
          </span>
          <div style={{ background: C.SURFACE, border: '1px solid ' + C.BORDER, borderRadius: '14px', padding: '18px', boxShadow: C.SHADOW }}>
            <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: C.TEXT2, margin: 0, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
              {data.raw}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3, marginBottom: '10px', display: 'block' }}>
            {polishedLabel}
          </span>
          {data.versions.map((v, idx) => {
            const color = VERSION_COLORS[idx] || C.ACCENT;
            return (
              <div key={idx} style={{ background: C.SURFACE, border: '1px solid ' + C.BORDER, borderLeft: '3px solid ' + color, borderRadius: '14px', padding: '18px', marginBottom: '14px', boxShadow: C.SHADOW }}>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: color + '22', color: color, display: 'inline-block', marginBottom: '10px' }}>
                  {v.tone}
                </span>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: C.TEXT2, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {v.text}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.ACCENT_SOFT, border: '1px solid ' + C.ACCENT_BORDER, borderRadius: '14px', padding: '22px', textAlign: 'center' }}>
          <p style={{ fontSize: '14.5px', color: C.TEXT, lineHeight: 1.6, marginTop: 0, marginBottom: '16px' }}>
            {data.cta}
          </p>
          <Link href="/" style={{ display: 'inline-block', padding: '13px 28px', background: C.ACCENT, color: '#fff', borderRadius: '10px', fontSize: '14.5px', fontWeight: 600, textDecoration: 'none' }}>
            {ctaBtn}
          </Link>
          <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: 500, color: C.TEXT3 }}>{freeNote}</div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid ' + C.BORDER, textAlign: 'center', fontSize: '12px', color: C.TEXT3 }}>
          Made with <span style={{ color: C.ACCENT, fontWeight: 700 }}>EzWrite</span>
        </div>
      </div>
    </div>
  );
}
