import situaciones from '../../data/situaciones.json';
import blogPosts from '../../data/blog.json';

const BASE_URL = 'https://ezwrite.app';

function buildUrls() {
  const urls = [
    { loc: `${BASE_URL}/`, priority: '1.0' },
    { loc: `${BASE_URL}/blog`, priority: '0.5' },
    { loc: `${BASE_URL}/privacidad`, priority: '0.3' },
  ];

  situaciones.forEach((s) => {
    ['es', 'en'].forEach((lang) => {
      const slug = s[lang] && s[lang].slug;
      if (slug) urls.push({ loc: `${BASE_URL}/${slug}`, priority: '0.7' });
    });
  });

  blogPosts.forEach((b) => {
    ['es', 'en'].forEach((lang) => {
      const slug = b[lang] && b[lang].slug;
      if (slug) urls.push({ loc: `${BASE_URL}/blog/${slug}`, priority: '0.5' });
    });
  });

  return urls;
}

function generateSitemapXml() {
  const urls = buildUrls();
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export default function handler(req, res) {
  const xml = generateSitemapXml();
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xml);
}
