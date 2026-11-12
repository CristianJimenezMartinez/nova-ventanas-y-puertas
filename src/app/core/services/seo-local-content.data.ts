import { SEO_LANDING_PAGES, SeoLandingFaq, SeoLandingPageData } from './seo-pages.data';

export interface SeoLocalZone {
  name: string;
  detail: string;
}

export interface SeoLocalProject {
  title: string;
  location: string;
  systems: string;
  imageUrl: string;
  year: string;
}

export interface SeoLocalStep {
  title: string;
  text: string;
}

export interface SeoLocalContent {
  climateTitle: string;
  climateText: string;
  zones: SeoLocalZone[];
  projects: SeoLocalProject[];
  process: SeoLocalStep[];
  extraFaqs: SeoLandingFaq[];
}

export type SeoLandingEnriched = SeoLandingPageData & { local?: SeoLocalContent };

const PROCESS_STEPS: SeoLocalStep[] = [
  { title: 'Visita y estudio técnico', text: 'Revisamos planos y orientaciones en el showroom o en tu vivienda y proponemos la serie y el vidrio adecuados.' },
  { title: 'Medición en obra', text: 'Nuestra oficina técnica mide cada hueco sin compromiso para fabricar a medida exacta.' },
  { title: 'Propuesta y presupuesto', text: 'Presupuesto cerrado por huecos con ficha de prestaciones (Uw, Rw, clase de permeabilidad y seguridad).' },
  { title: 'Fabricación a medida', text: 'Fabricación de perfilería y acristalamiento con control dimensional milimétrico.' },
  { title: 'Instalación certificada', text: 'Montaje con equipos propios según UNE 85219: cintas expansivas multifunción y sellado perimetral termoacústico.' },
  { title: 'Garantía y postventa', text: '10 años de garantía directa NOVA y servicio postventa.' }
];

export const SEO_LOCAL_CONTENT: Record<string, SeoLocalContent> = {
  'ventanas-y-puertas-murcia': {
    climateTitle: 'Clima de Murcia: calor extremo en verano, sol directo todo el año',
    climateText: 'Murcia capital está en zona climática B3 del CTE DB-HE: veranos muy cálidos, inviernos suaves y alta radiación solar. Lo que más importa no es solo el aislamiento de invierno, sino frenar el calor solar. Por eso combinamos perfilería de baja transmitancia con vidrios de Control Solar Selectivo (factor solar g ≤ 0.38) y, cuando el diseño lo pide, persianas o mallorquinas de control solar.',
    zones: [
      { name: 'Murcia capital', detail: 'Reformas de pisos y áticos: sustitución de ventanas antiguas y cerramientos de terraza sin alterar la fachada.' },
      { name: 'Molina de Segura · Altorreal · La Alcayna', detail: 'Viviendas unifamiliares y urbanizaciones. Aquí está nuestro showroom, así que puedes ver los sistemas a tamaño real.' },
      { name: 'Cieza y Vega Alta', detail: 'Rehabilitación de fincas y viviendas singulares, con sistemas mixtos aluminio-madera.' },
      { name: 'Cartagena · Mar Menor · La Manga', detail: 'Zona costera: prioridad a la resistencia a la salinidad y al viento, y al aislamiento acústico.' },
      { name: 'Lorca · Mazarrón · Águilas', detail: 'Obra nueva y reforma con mediciones y montaje propios en toda la Región.' }
    ],
    projects: [
      { title: 'Villa Altorreal', location: 'Molina de Segura (Murcia)', systems: 'NOVA THERM 82 Triple Junta · Triple Vidrio Control Solar', imageUrl: 'assets/images/project-altorreal.jpg', year: '2025' },
      { title: 'Ático Gran Vía', location: 'Murcia Capital', systems: 'NOVA PANORAMA Glass · Pérgola Bioclimática Motorizada', imageUrl: 'assets/images/project-atico.jpg', year: '2026' },
      { title: 'Finca Bioclimática', location: 'Cieza (Murcia)', systems: 'NOVA HYBRID WOOD 90 Aluminio-Madera · Estándar ECCN', imageUrl: 'assets/images/project-cieza.jpg', year: '2025' }
    ],
    process: PROCESS_STEPS,
    extraFaqs: [
      {
        question: '¿Qué ventana conviene más en Murcia: PVC o aluminio?',
        answer: 'Depende del proyecto. El PVC Clase A (NOVA THERM 82) da el mejor aislamiento térmico y acústico y suele ser la opción más eficiente para reformas de vivienda. El aluminio RPT (NOVA ALU MINIMAL 75 o HORIZON LIFT) se elige cuando se quieren perfiles muy finos o grandes huecos acristalados. En ambos casos recomendamos vidrio de control solar por el calor del verano murciano.',
        normative: 'CTE DB-HE1 · Zona B3'
      },
      {
        question: '¿Cuánto tarda un cambio de ventanas desde la medición?',
        answer: 'El plazo depende de la serie, el acabado y el número de huecos, por lo que se confirma en el presupuesto tras la medición en obra. Te damos la fecha de fabricación e instalación por escrito antes de empezar.',
        normative: 'Presupuesto técnico NOVA'
      },
      {
        question: '¿Se puede hacer la reforma sin obra ni escombros?',
        answer: 'En la mayoría de sustituciones se instala la nueva ventana sobre el premarco o el marco existente, con sellado perimetral, minimizando la obra. Lo confirmamos en la visita técnica según el estado del hueco.',
        normative: 'UNE 85219 · Instalación en obra'
      }
    ]
  },
  'ventanas-y-puertas-alicante': {
    climateTitle: 'Clima de Alicante: salitre, humedad y sol intenso',
    climateText: 'Alicante capital está en zona climática B4 del CTE DB-HE, con veranos cálidos y humedad elevada por la cercanía al mar. En primera y segunda línea de costa pesan más la corrosión salina y el viento. Por eso trabajamos con lacado marino Qualicoat Seaside, herraje con tratamiento anticorrosión y, donde hace falta, PVC Clase A, que es inmune al salitre.',
    zones: [
      { name: 'Alicante · Playa de San Juan', detail: 'Viviendas y áticos frente al mar: aluminio Seaside y vidrios acústicos laminares.' },
      { name: 'Elche', detail: 'Viviendas unifamiliares y reformas integrales con prioridad en eficiencia energética.' },
      { name: 'Orihuela Costa · Torrevieja · Santa Pola', detail: 'Zona de costa: resistencia a salinidad, viento y grandes correderas hacia terraza y piscina.' },
      { name: 'Benidorm · Altea · Calpe · Jávea', detail: 'Villas y apartamentos con grandes formatos acristalados y vistas panorámicas.' }
    ],
    projects: [
      { title: 'Casa Mediterránea', location: 'Alicante / Costa Blanca', systems: 'NOVA HORIZON LIFT Cota Cero · Aluminio RPT Minimal', imageUrl: 'assets/images/project-mediterranea.jpg', year: '2025' },
      { title: 'Ático Gran Vía', location: 'Murcia Capital', systems: 'NOVA PANORAMA Glass · Pérgola Bioclimática Motorizada', imageUrl: 'assets/images/project-atico.jpg', year: '2026' }
    ],
    process: PROCESS_STEPS,
    extraFaqs: [
      {
        question: '¿Qué hace falta para que una ventana aguante bien el salitre?',
        answer: 'En aluminio, lacado o anodizado marino Qualicoat Seaside y herrajes con tratamiento anticorrosión; en PVC Clase A no hay corrosión. También importa un buen sellado en la instalación, porque la humedad entra por las juntas, no por el perfil.',
        normative: 'Qualicoat Seaside · UNE 85219'
      },
      {
        question: '¿Ayudan las ventanas nuevas a reducir el ruido en zonas turísticas?',
        answer: 'Sí. Combinando perfilería hermética Clase 4 con vidrios laminares acústicos asimétricos se alcanzan atenuaciones de hasta 47 dB (Rw) en la serie NOVA THERM 82.',
        normative: 'CTE DB-HR · UNE-EN 12207'
      },
      {
        question: '¿Puedo ver los sistemas antes de decidir si vivo en Alicante?',
        answer: 'Sí. Nuestro showroom está en Molina de Segura (Murcia), a poca distancia de la provincia de Alicante. También podemos empezar con una consulta por WhatsApp y una medición en tu vivienda.',
        normative: 'Showroom oficial Grupo Soto'
      }
    ]
  }
};

export function getEnrichedLandingPages(): SeoLandingEnriched[] {
  return SEO_LANDING_PAGES.map(page => {
    const local = SEO_LOCAL_CONTENT[page.slug];
    if (!local) {
      return page;
    }
    return { ...page, faqs: [...page.faqs, ...local.extraFaqs], local };
  });
}
