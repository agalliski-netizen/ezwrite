import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import posts from '../../data/blog.json';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });

const C = {
  BG: '#08090C', SURFACE: '#101216', SURFACE2: '#16181D', BORDER: '#1F2228',
  BORDER_STRONG: '#2A2E37', TEXT: '#F5F6F8', TEXT2: '#A1A6B0', TEXT3: '#5C6470',
  ACCENT: '#647EFF', ACCENT_HOVER: '#7690FF', ACCENT_SOFT: 'rgba(100,126,255,0.12)',
  ACCENT_BORDER: 'rgba(100,126,255,0.45)', SHADOW: '0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.25)',
};

function buildPages() {
  const pages = [];
  posts.forEach((post) => {
    ['es', 'en'].forEach((lang) => {
      pages.push({ slug: post[lang].slug, lang, data: post[lang], id: post.id, category: post.category });
    });
  });
  return pages;
}

export async function getStaticPaths() {
  const pages = buildPages();
  return {
    paths: pages.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const pages = buildPages();
  const page = pages.find((p) => p.slug === params.slug);
  if (!page) return { notFound: true };
  return { props: { page } };
}

const BACK_LABEL = { es: '← Volver a EzWrite', en: '← Back to EzWrite' };
const FREE_NOTE = { es: 'Gratis, sin tarjeta, sin crear cuenta', en: 'Free, no card, no account needed' };

export default function BlogPost({ page }) {
  const { data, lang } = page;
  const back = BACK_LABEL[lang];
  const freeNote = FREE_NOTE[lang];

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

        <div style={{ marginBottom: '2rem' }}>
          {(data.blocks || []).map((b, idx) => {
            if (b.type === 'h2') {
              return (
                <h2 key={idx} style={{ fontSize: '18px', fontWeight: 700, color: C.TEXT, marginTop: '2rem', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                  {b.text}
                </h2>
              );
            }
            if (b.type === 'p') {
              return (
                <p key={idx} style={{ fontSize: '15px', lineHeight: 1.75, color: C.TEXT2, marginBottom: '14px' }}>
                  {b.text}
                </p>
              );
            }
            if (b.type === 'list-item') {
              return (
                <div key={idx} style={{ background: C.SURFACE, border: '1px solid ' + C.BORDER, borderLeft: '3px solid ' + C.ACCENT, borderRadius: '14px', padding: '18px', marginBottom: '14px', boxShadow: C.SHADOW }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: C.ACCENT + '22', color: C.ACCENT, display: 'inline-block', marginBottom: '10px' }}>
                    {b.n}
                  </span>
                  <p style={{ fontSize: '16px', lineHeight: 1.5, color: C.TEXT, fontWeight: 700, margin: '0 0 10px 0' }}>
                    {b.phrase}
                  </p>
                  <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: C.TEXT2, margin: '0 0 12px 0' }}>
                    {b.why}
                  </p>
                  <div style={{ background: C.SURFACE2, borderRadius: '10px', padding: '12px 14px' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.TEXT3, display: 'block', marginBottom: '6px' }}>
                      {lang === 'es' ? 'Mejor así' : 'Instead'}
                    </span>
                    <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: C.TEXT, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {b.instead}
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {data.closing && (
          <p style={{ fontSize: '15px', lineHeight: 1.75, color: C.TEXT2, marginBottom: '2rem' }}>
            {data.closing}
          </p>
        )}

        <div style={{ background: C.ACCENT_SOFT, border: '1px solid ' + C.ACCENT_BORDER, borderRadius: '14px', padding: '22px', textAlign: 'center' }}>
          <p style={{ fontSize: '14.5px', color: C.TEXT, lineHeight: 1.6, marginTop: 0, marginBottom: '16px' }}>
            {data.cta}
          </p>
          <Link href={data.ctaLinkSlug ? '/' + data.ctaLinkSlug : '/'} style={{ display: 'inline-block', padding: '13px 28px', background: C.ACCENT, color: '#fff', borderRadius: '10px', fontSize: '14.5px', fontWeight: 600, textDecoration: 'none' }}>
            {data.ctaBtn}
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
