import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import posts from '../../data/blog.json';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], display: 'swap' });

const C = {
  BG: '#08090C', SURFACE: '#101216', BORDER: '#1F2228',
  TEXT: '#F5F6F8', TEXT2: '#A1A6B0', TEXT3: '#5C6470',
  ACCENT: '#647EFF', SHADOW: '0 1px 2px rgba(0,0,0,.4), 0 2px 8px rgba(0,0,0,.25)',
};

const UI = {
  es: { title: 'Blog de EzWrite', back: '← Volver a EzWrite', intro: 'Ideas y ejemplos concretos para escribir los mensajes que cuestan.' },
  en: { title: 'EzWrite Blog', back: '← Back to EzWrite', intro: 'Concrete ideas and examples for writing the messages that are hard to write.' },
};

export async function getStaticProps() {
  const items = [];
  posts.forEach((post) => {
    ['es', 'en'].forEach((lang) => {
      items.push({ lang, slug: post[lang].slug, h1: post[lang].h1, intro: post[lang].intro, category: post.category });
    });
  });
  return { props: { items } };
}

export default function BlogIndex({ items }) {
  const esItems = items.filter((i) => i.lang === 'es');
  const enItems = items.filter((i) => i.lang === 'en');

  return (
    <div style={{ minHeight: '100vh', background: C.BG, fontFamily: inter.style.fontFamily, padding: '0 1rem' }}>
      <Head>
        <title>{'EzWrite Blog — ' + UI.es.title}</title>
        <meta name="description" content={UI.es.intro} />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#08090C" />
      </Head>
      <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: C.TEXT2, textDecoration: 'none', marginBottom: '2rem' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.ACCENT, display: 'inline-block' }}></span>
          {UI.es.back}
        </Link>

        <h1 style={{ fontSize: '26px', fontWeight: 800, color: C.TEXT, marginBottom: '10px', letterSpacing: '-0.02em' }}>
          {UI.es.title}
        </h1>
        <p style={{ fontSize: '15px', color: C.TEXT2, marginBottom: '2rem' }}>{UI.es.intro}</p>

        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3, marginBottom: '10px', display: 'block' }}>Español</span>
        {esItems.map((item) => (
          <Link key={item.slug} href={'/blog/' + item.slug} style={{ display: 'block', background: C.SURFACE, border: '1px solid ' + C.BORDER, borderRadius: '14px', padding: '18px', marginBottom: '12px', textDecoration: 'none', boxShadow: C.SHADOW }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: C.TEXT, marginBottom: '6px' }}>{item.h1}</div>
            <div style={{ fontSize: '13.5px', color: C.TEXT2, lineHeight: 1.5 }}>{item.intro}</div>
          </Link>
        ))}

        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.TEXT3, margin: '1.5rem 0 10px', display: 'block' }}>English</span>
        {enItems.map((item) => (
          <Link key={item.slug} href={'/blog/' + item.slug} style={{ display: 'block', background: C.SURFACE, border: '1px solid ' + C.BORDER, borderRadius: '14px', padding: '18px', marginBottom: '12px', textDecoration: 'none', boxShadow: C.SHADOW }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: C.TEXT, marginBottom: '6px' }}>{item.h1}</div>
            <div style={{ fontSize: '13.5px', color: C.TEXT2, lineHeight: 1.5 }}>{item.intro}</div>
          </Link>
        ))}

        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid ' + C.BORDER, textAlign: 'center', fontSize: '12px', color: C.TEXT3 }}>
          Made with <span style={{ color: C.ACCENT, fontWeight: 700 }}>EzWrite</span>
        </div>
      </div>
    </div>
  );
}
