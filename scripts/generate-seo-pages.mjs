import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist/nova-ventanas-y-puertas/browser');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://novaventanasypuertas.com';

if (!fs.existsSync(INDEX_PATH)) {
  console.error('❌ No se encontró dist/nova-ventanas-y-puertas/browser/index.html');
  process.exit(1);
}

const baseHtml = fs.readFileSync(INDEX_PATH, 'utf8');

// 1. Generar portal.html (Sin etiqueta canonical hacia "/" y con noindex, nofollow estricto)
const portalHtml = baseHtml
  .replace(/<title>[\s\S]*?<\/title>/, '<title>NOVA Portal Profesional | Gestión Interna Grupo Soto</title>')
  .replace(/<link rel="canonical"[^>]*>\s*/g, '')
  .replace(
    /<meta name="robots"[^>]*>/g,
    '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">'
  )
  .replace(
    /<meta name="googlebot"[^>]*>/g,
    '<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet">'
  )
  .replace(
    /<meta name="bingbot"[^>]*>/g,
    '<meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet">'
  );

fs.writeFileSync(path.join(DIST_DIR, 'portal.html'), portalHtml, 'utf8');
console.log('✅ Generado portal.html (noindex, nofollow, sin canonical duplicada)');

// 2. Páginas SEO: fuente única = src/app/core/services/seo-*.data.ts (sin duplicar contenido)
import ts from 'typescript';
import { pathToFileURL } from 'node:url';

const SERVICES_DIR = path.resolve('src/app/core/services');
const TMP_DIR = path.resolve('node_modules/.cache/seo-data');
fs.mkdirSync(TMP_DIR, { recursive: true });
for (const file of ['seo-pages.data', 'seo-local-content.data']) {
  const source = fs.readFileSync(path.join(SERVICES_DIR, `${file}.ts`), 'utf8');
  const js = ts
    .transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } })
    .outputText.replace(/from '\.\/seo-pages\.data'/g, "from './seo-pages.data.mjs'");
  fs.writeFileSync(path.join(TMP_DIR, `${file}.mjs`), js, 'utf8');
}
const { getEnrichedLandingPages } = await import(
  pathToFileURL(path.join(TMP_DIR, 'seo-local-content.data.mjs')).href
);

const SEO_PAGES = getEnrichedLandingPages().map(p => ({
  slug: p.slug,
  metaTitle: p.metaTitle,
  metaDescription: p.metaDescription,
  h1: p.h1,
  lead: p.introParagraphs.join(' '),
  image: p.heroImage,
  faqs: p.faqs.map(f => ({ q: f.question, a: f.answer })),
  zones: p.local ? p.local.zones.map(z => `${z.name}: ${z.detail}`) : []
}));

const escapeHtml = str =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

for (const page of SEO_PAGES) {
  const canonicalUrl = `${BASE_URL}/${page.slug}`;
  const imageUrl = `${BASE_URL}/${page.image}`;

  const pageJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NOVA Ventanas y Puertas', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: page.h1, item: canonicalUrl }
        ]
      },
      {
        '@type': 'Service',
        name: page.h1,
        description: page.metaDescription,
        url: canonicalUrl,
        image: imageUrl,
        brand: { '@type': 'Brand', name: 'NOVA Ventanas & Puertas' },
        provider: {
          '@type': 'HomeAndConstructionBusiness',
          name: 'NOVA Ventanas y Puertas — Grupo Soto',
          telephone: '+34613754271',
          url: `${BASE_URL}/`
        },
        areaServed: ['Murcia', 'Molina de Segura', 'Alicante', 'Costa Blanca', 'España']
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  });

  const internalLinksHtml = SEO_PAGES.map(
    p => `<a href="${BASE_URL}/${p.slug}">${escapeHtml(p.h1)}</a>`
  ).join(' ');

  const faqsSemanticHtml = page.faqs
    .map(f => `<section><h2>${escapeHtml(f.q)}</h2><p>${escapeHtml(f.a)}</p></section>`)
    .join('');

  const zonesHtml = page.zones.length ? `<h2>Zonas de servicio</h2><ul>${page.zones.map(z => `<li>${escapeHtml(z)}</li>`).join('')}</ul>` : '';

  const pageHtml = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.metaTitle)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escapeHtml(page.metaDescription)}">`
    )
    .replace(
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${canonicalUrl}">`
    )
    .replace(
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escapeHtml(page.metaTitle)}">`
    )
    .replace(
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escapeHtml(page.metaDescription)}">`
    )
    .replace(
      /<meta property="og:url"[^>]*>/,
      `<meta property="og:url" content="${canonicalUrl}">`
    )
    .replace(
      /<meta property="og:image"[^>]*>/,
      `<meta property="og:image" content="${imageUrl}">`
    )
    .replace(
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${escapeHtml(page.metaTitle)}">`
    )
    .replace(
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${escapeHtml(page.metaDescription)}">`
    )
    .replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${imageUrl}">`
    )
    .replace(
      '</head>',
      `  <script type="application/ld+json">${pageJsonLd}</script>\n</head>`
    )
    .replace(
      /<app-root>[\s\S]*?<\/app-root>/,
      `<app-root><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.lead)}</p>${zonesHtml}${faqsSemanticHtml}<nav>${internalLinksHtml}<a href="${BASE_URL}/">Inicio NOVA Ventanas y Puertas</a></nav></div></app-root>`
    );

  fs.writeFileSync(path.join(DIST_DIR, `${page.slug}.html`), pageHtml, 'utf8');
  console.log(`✅ Pre-renderizada página SEO estática: /${page.slug} -> ${page.slug}.html`);
}
