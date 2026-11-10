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

// 2. Páginas SEO Estratégicas Pre-renderizadas (0 MB RAM en VPS, respuesta 200 OK directa en Nginx)
const SEO_PAGES = [
  {
    slug: 'ventanas-pvc-passivhaus',
    metaTitle: 'Ventanas de PVC Passivhaus en Murcia y Alicante | NOVA THERM 82',
    metaDescription:
      'Fabricación e instalación de ventanas de PVC Clase A Passivhaus en Murcia y Alicante. Serie NOVA THERM 82 con 7 cámaras, triple junta EPDM, Uw desde 0.72 W/m²K y 47 dB.',
    h1: 'Ventanas de PVC Clase A Passivhaus en Murcia y Alicante',
    lead: 'Serie propia NOVA THERM 82 Triple Junta de 82 mm y 7 cámaras con espesor de pared Clase A (UNE-EN 12608), soldadura invisible V-Perfect, transmitancia térmica Uw desde 0.72 W/m²K y aislamiento acústico de hasta 47 dB.',
    image: 'assets/images/material-pvc.jpg',
    faqs: [
      {
        q: '¿Se amarillea o deforma el PVC con el sol de Murcia y Alicante?',
        a: 'No. Los perfiles NOVA THERM 82 están certificados para Clima Severo (Clasificación S según UNE-EN 12608) y cuentan con tecnología reflectante térmica con 10 años de garantía.'
      },
      {
        q: '¿Qué diferencia aporta la triple junta central frente a una ventana estándar de 2 juntas?',
        a: 'La junta central crea una cámara seca aislada que protege el herraje perimetral, mejora el aislamiento acústico en 4 dB adicionales y eleva la estanqueidad Clase 4.'
      }
    ]
  },
  {
    slug: 'ventanas-aluminio-hoja-oculta',
    metaTitle: 'Ventanas de Aluminio RPT con Hoja Oculta en Murcia y Alicante | NOVA',
    metaDescription:
      'Ventanas de aluminio arquitectónico con Rotura de Puente Térmico (RPT) y hoja oculta de solo 50 mm de sección vista. Serie NOVA ALU MINIMAL 75 con herraje oculto.',
    h1: 'Ventanas de Aluminio RPT de Hoja Oculta y Perfil Minimalista',
    lead: 'Sistema NOVA ALU MINIMAL 75 RPT con sección vista frontal de solo 50 mm, poliamida tubular de 35 mm, bisagras invisibles ocultas, lacado marino Qualicoat Seaside y un 22% más de luz natural.',
    image: 'assets/images/material-aluminio.jpg',
    faqs: [
      {
        q: '¿Produce condensación una ventana de aluminio moderna con RPT de 35 mm?',
        a: 'Jamás. La poliamida tubular de 35 mm con espuma aislante rompe la transmisión térmica entre exterior e interior, eliminando la condensación superficial conforme al CTE DB-HE1.'
      },
      {
        q: '¿Qué peso de vidrio de seguridad soporta la hoja oculta NOVA ALU MINIMAL 75?',
        a: 'Sus compases ocultos de acero inoxidable admiten hojas de hasta 150 kg para instalar triples vidrios laminares acústicos y antirrobo RC2.'
      }
    ]
  },
  {
    slug: 'puertas-pivotantes-acorazadas-rc3',
    metaTitle: 'Puertas Pivotantes y Acorazadas RC3 en Murcia y Alicante | Catálogo NOVA',
    metaDescription:
      'Puertas de entrada pivotantes de gran formato y puertas acorazadas arquitectónicas certificadas DIN EN 1627 RC3. Paneles coplanares en piedra, aluminio y madera noble.',
    h1: 'Puertas Pivotantes Monumentales y Acorazadas de Seguridad RC3',
    lead: 'Colección NOVA SHIELD Pivot & Acorazada RC3 con paneles coplanares enrasados de 95 mm, transmitancia Ud desde 0.68 W/m²K, eje pivotante oculto hasta 3.200 mm de altura, umbral magnético automático y cerradura biométrica.',
    image: 'assets/images/pivot-door.jpg',
    faqs: [
      {
        q: '¿Es tan hermética una puerta pivotante como una puerta abatible tradicional?',
        a: 'Sí. El sistema NOVA SHIELD incorpora triple junta perimetral y umbral magnético retráctil que sella herméticamente todo el contorno con clasificación Clase 4.'
      },
      {
        q: '¿Qué significa exactamente la certificación antirrobo DIN EN 1627 RC3?',
        a: 'Garantiza mediante ensayo oficial que la puerta resiste intentos de intrusión con palancas de acero de 70 cm, cuñas y herramientas mecánicas.'
      }
    ]
  },
  {
    slug: 'correderas-elevables-cota-cero',
    metaTitle: 'Correderas Elevables a Cota Cero y Grandes Formatos | NOVA Ventanas',
    metaDescription:
      'Correderas elevables y minimalistas a cota cero con nudo central de 25 mm. Serie NOVA HORIZON LIFT para hojas de hasta 400 kg, esquinas a 90° sin poste y máxima hermeticidad.',
    h1: 'Correderas Elevables a Cota Cero y Grandes Formatos Acristalados',
    lead: 'Sistema NOVA HORIZON LIFT con carril inferior 100% empotrado a ras de pavimento (CTE DB-SUA), encuentro central minimalista de 25 mm, hojas de hasta 400 kg y aperturas de esquina a 90° sin columna.',
    image: 'assets/images/solution-correderas.jpg',
    faqs: [
      {
        q: '¿Puede entrar agua de lluvia al estar el carril empotrado a cota cero?',
        a: 'No. La guía empotrada incorpora colector de drenaje oculto subpavimento con válvula antirretorno ensayado frente a lluvias intensas.'
      },
      {
        q: '¿Qué diferencia hay entre una corredera tradicional y una corredera elevable?',
        a: 'La corredera elevable NOVA HORIZON LIFT desciende sobre juntas herméticas de EPDM al cerrarse, logrando aislamiento térmico y acústico Clase 4.'
      }
    ]
  },
  {
    slug: 'cerramientos-cortinas-cristal-bioclimatica',
    metaTitle: 'Cortinas de Cristal y Pérgolas Bioclimáticas en Murcia y Alicante | NOVA',
    metaDescription:
      'Cerramientos de terrazas, porches y áticos con cortinas de cristal sin perfiles verticales y pérgolas bioclimáticas motorizadas en Murcia y Alicante. Serie NOVA PANORAMA.',
    h1: 'Cerramientos Panorámicos, Cortinas de Cristal y Pérgolas Bioclimáticas',
    lead: 'Gama NOVA PANORAMA Glass & Bioclimática en vidrio templado de seguridad de 10 y 12 mm sin montantes verticales, combinable con pérgolas bioclimáticas de lamas orientables motorizadas e iluminación LED.',
    image: 'assets/images/glass-terrace.jpg',
    faqs: [
      {
        q: '¿Aíslan del ruido y del viento las cortinas de cristal sin perfiles?',
        a: 'Sí. Con vidrio templado de 10/12 mm y sellos transparentes inter-cristal reducen el ruido hasta en 34 dB y soportan vientos Clase C4.'
      },
      {
        q: '¿Es totalmente impermeable el techo de una pérgola bioclimática cuando llueve?',
        a: 'Totalmente. Las lamas recogen el agua en canales perimetrales y la evacúan de forma oculta por el interior de las columnas.'
      }
    ]
  },
  {
    slug: 'ventanas-y-puertas-murcia',
    metaTitle: 'Fábrica y Showroom de Ventanas y Puertas en Murcia | NOVA Grupo Soto',
    metaDescription:
      'Fabricación, showroom e instalación de ventanas de PVC Passivhaus, aluminio RPT hoja oculta, puertas pivotantes y cerramientos en Murcia y Molina de Segura. Grupo Soto.',
    h1: 'Fábrica, Showroom e Instalación de Ventanas y Puertas en Murcia',
    lead: 'Sede central y Showroom técnico en Polígono Industrial La Serreta (Molina de Segura, Murcia). Fabricación e instalación propia conforme a norma UNE 85219 en Murcia Capital, Altorreal, Cartagena, Lorca y toda la Región.',
    image: 'assets/images/showroom-interior.jpg',
    faqs: [
      {
        q: '¿Dónde está ubicado el Showroom de NOVA Ventanas y Puertas en Murcia?',
        a: 'En el Polígono Industrial La Serreta, 30500 Molina de Segura (Murcia), abierto de lunes a viernes de 08:30 a 19:30.'
      },
      {
        q: '¿Realizáis mediciones gratuitas en obra en toda la Región de Murcia?',
        a: 'Sí, nuestra oficina técnica realiza estudio térmico, acústico y medición en obra sin compromiso en toda la Región de Murcia.'
      }
    ]
  },
  {
    slug: 'ventanas-y-puertas-alicante',
    metaTitle: 'Ventanas, Puertas Pivotantes y Cerramientos en Alicante y Costa Blanca | NOVA',
    metaDescription:
      'Instalación de ventanas de PVC Passivhaus, carpintería de aluminio RPT con protección marina Qualicoat Seaside, puertas pivotantes RC3 y correderas en Alicante y Costa Blanca.',
    h1: 'Carpintería Arquitectónica de Ventanas y Puertas en Alicante y Costa Blanca',
    lead: 'Ejecución integral de proyectos de carpintería exterior de alta gama en Alicante, Elche, Orihuela Costa, Torrevieja, Benidorm, Altea y Jávea con protección marina Qualicoat Seaside y vidrios de Control Solar Selectivo.',
    image: 'assets/images/project-mediterranea.jpg',
    faqs: [
      {
        q: '¿Qué material es más recomendable cerca del mar en Alicante: PVC o Aluminio Seaside?',
        a: 'Ambos son idóneos: el PVC Clase A es inmune al salitre y el Aluminio RPT con sello Qualicoat Seaside y herraje C5 garantiza durabilidad total en primera línea de costa.'
      },
      {
        q: '¿Trabajáis con estudios de arquitectura y villas en la Costa Blanca?',
        a: 'Sí, proporcionamos prescripción técnica CTE, detalles constructivos y montaje propio certificado para obra nueva y rehabilitación.'
      }
    ]
  },
  {
    slug: 'deducciones-irpf-cambio-ventanas',
    metaTitle: 'Deducciones IRPF por Cambio de Ventanas Eficientes (20%, 40% y 60%) | NOVA',
    metaDescription:
      'Guía técnica actualizada sobre las deducciones fiscales en el IRPF (20%, 40% y 60%) y ayudas por cambio de ventanas de alta eficiencia energética en Murcia y Alicante.',
    h1: 'Deducciones Fiscales en el IRPF por Cambio de Ventanas Eficientes',
    lead: 'Deduce el 20%, 40% o 60% en el IRPF al sustituir tus ventanas por carpintería certificada NOVA THERM 82 o NOVA ALU MINIMAL 75. Entregamos Marcado CE, Declaración de Prestaciones (DoP) y factura oficial VeriFactu.',
    image: 'assets/images/pilar-eficiencia.jpg',
    faqs: [
      {
        q: '¿Qué requisito es imprescindible antes de desmontar las ventanas viejas?',
        a: 'Disponer del Certificado de Eficiencia Energética (CEE) previo registrado antes de la obra y emitir el certificado posterior tras la instalación.'
      },
      {
        q: '¿Cumplen todas las ventanas NOVA los valores límite del CTE para la deducción?',
        a: 'Sí, nuestras series alcanzan transmitancias Uw de 0.72 a 0.95 W/m²K, superando ampliamente las exigencias del CTE DB-HE1 en Murcia y Alicante.'
      }
    ]
  }
];

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
      `<app-root><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.lead)}</p>${faqsSemanticHtml}<nav>${internalLinksHtml}<a href="${BASE_URL}/">Inicio NOVA Ventanas y Puertas</a></nav></div></app-root>`
    );

  fs.writeFileSync(path.join(DIST_DIR, `${page.slug}.html`), pageHtml, 'utf8');
  console.log(`✅ Pre-renderizada página SEO estática: /${page.slug} -> ${page.slug}.html`);
}
