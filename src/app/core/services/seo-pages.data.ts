export interface SeoLandingSpec {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface SeoLandingFaq {
  question: string;
  answer: string;
  normative: string;
}

export interface SeoLandingPageData {
  slug: string;
  categoryBadge: string;
  normativeBadge: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  heroImage: string;
  introParagraphs: string[];
  specs: SeoLandingSpec[];
  keyBenefits: { title: string; description: string }[];
  recommendedSeriesCode: string;
  recommendedSeriesName: string;
  catalogDownloadUrl: string;
  catalogTitle: string;
  faqs: SeoLandingFaq[];
}

export const SEO_LANDING_PAGES: SeoLandingPageData[] = [
  {
    slug: 'ventanas-pvc-passivhaus',
    categoryBadge: 'SISTEMA TERMOACÚSTICO CLASE A',
    normativeBadge: 'UNE-EN 12608 CLASE A · CTE DB-HE1 · PASSIVHAUS',
    metaTitle: 'Ventanas de PVC Passivhaus en Murcia y Alicante | NOVA THERM 82',
    metaDescription: 'Fabricación e instalación de ventanas de PVC Clase A Passivhaus en Murcia y Alicante. Serie NOVA THERM 82 con 7 cámaras, triple junta EPDM, Uw desde 0.72 W/m²K y 47 dB.',
    h1: 'Ventanas de PVC Clase A Passivhaus en Murcia y Alicante',
    subtitle: 'Hermeticidad extrema, soldadura invisible en esquina y el menor coeficiente de transmitancia térmica del mercado para viviendas de consumo casi nulo (ECCN).',
    heroImage: 'assets/images/material-pvc.jpg',
    introParagraphs: [
      'La serie propia NOVA THERM 82 Triple Junta representa la cumbre en aislamiento térmico y acústico en carpintería de PVC. Extruida exclusivamente con espesor de pared exterior Clase A (≥ 3.0 mm según norma europea UNE-EN 12608), garantiza una estabilidad estructural inalterable frente a la radiación solar del sureste español.',
      'Gracias a su arquitectura multicámara de 82 mm de profundidad, triple junta central de estanqueidad en EPDM y acristalamientos triples con cámara de gas Argón, reduce hasta un 68% las pérdidas energéticas de la vivienda y bloquea el ruido urbano hasta 47 dB.'
    ],
    specs: [
      { label: 'TRANSMITANCIA TÉRMICA', value: 'Uw desde 0.72 W/m²K', highlight: true },
      { label: 'ATENUACIÓN ACÚSTICA', value: 'Rw hasta 47 dB' },
      { label: 'SECCIÓN Y CÁMARAS', value: '82 mm · 7 Cámaras Clase A' },
      { label: 'PERMEABILIDAD AL AIRE', value: 'Clase 4 (UNE-EN 12207)' },
      { label: 'SEGURIDAD ANTIEFRACCIÓN', value: 'DIN EN 1627 RC2 / RC3' },
      { label: 'ACRISTALAMIENTO MÁXIMO', value: 'Hasta 52 mm Triple Vidrio' }
    ],
    keyBenefits: [
      {
        title: 'Soldadura Invisible V-Perfect',
        description: 'Unión perimetral de esquinas sin cordón visto para un acabado continuo, limpio y propio de la alta ebanistería arquitectónica.'
      },
      {
        title: 'Formulación Clima Severo (Zona S)',
        description: 'Compuesto estabilizado frente a radiación UV extrema y folios arquitectónicos Cool-Colors que reflejan la radiación infrarroja solar.'
      },
      {
        title: 'Apta para Deducción Fiscal IRPF (hasta 60%)',
        description: 'Sus valores certificados Uw permiten reducir más de un 30% la demanda energética global de la vivienda con Marcado CE oficial.'
      }
    ],
    recommendedSeriesCode: 'SERIE 01 · PVC PASSIVHAUS',
    recommendedSeriesName: 'NOVA THERM 82 Triple Junta',
    catalogDownloadUrl: '/catalogs/NOVA_Catalogo_Maestro_Sistemas_ES.pdf',
    catalogTitle: 'Catálogo General de Sistemas Arquitectónicos NOVA (98 págs.)',
    faqs: [
      {
        question: '¿Se amarillea o deforma el PVC con el sol de Murcia y Alicante?',
        answer: 'No. Los perfiles NOVA THERM 82 están certificados para Clima Severo (Clasificación S según UNE-EN 12608) y cuentan con tecnología reflectante térmica que mantiene el perfil estable e inalterable con 10 años de garantía.',
        normative: 'UNE-EN 12608 Clase A · Clima S'
      },
      {
        question: '¿Qué diferencia aporta la triple junta central frente a una ventana estándar de 2 juntas?',
        answer: 'La junta central crea una cámara seca aislada que protege el herraje perimetral de la humedad, mejora el aislamiento acústico en 4 dB adicionales y eleva la estanqueidad frente a viento y lluvia torrencial.',
        normative: 'UNE-EN 12207 / 12208'
      }
    ]
  },
  {
    slug: 'ventanas-aluminio-hoja-oculta',
    categoryBadge: 'CARPINTERÍA MINIMALISTA RPT',
    normativeBadge: 'UNE-EN 14351-1 · QUALICOAT SEASIDE · CTE DB-HE',
    metaTitle: 'Ventanas de Aluminio RPT con Hoja Oculta en Murcia y Alicante | NOVA',
    metaDescription: 'Ventanas de aluminio arquitectónico con Rotura de Puente Térmico (RPT) y hoja oculta de solo 50 mm de sección vista. Serie NOVA ALU MINIMAL 75 con herraje oculto.',
    h1: 'Ventanas de Aluminio RPT de Hoja Oculta y Perfil Minimalista',
    subtitle: 'Sección vista exterior de tan solo 50 mm con bisagras invisibles integradas. Un 22% más de superficie acristalada y luz natural sin renunciar al aislamiento térmico.',
    heroImage: 'assets/images/material-aluminio.jpg',
    introParagraphs: [
      'El sistema NOVA ALU MINIMAL 75 RPT ha sido desarrollado para proyectos de arquitectura contemporánea donde la pureza de líneas y la entrada de luz son prioritarias. Al ocultar completamente el perfil de la hoja detrás del marco exterior, resulta imposible distinguir desde fuera qué paños son fijos y cuáles practicables.',
      'Su núcleo incorpora poliamidas tubulares de 35 mm reforzadas con fibra de vidrio e inserciones de espuma aislante de poliolefina reticulada, alcanzando prestaciones térmicas de hasta 0.88 W/m²K en aleación primaria 6060-T66.'
    ],
    specs: [
      { label: 'SECCIÓN VISTA FRONTAL', value: 'Solo 50 mm exteriores', highlight: true },
      { label: 'TRANSMITANCIA TÉRMICA', value: 'Uw desde 0.88 W/m²K' },
      { label: 'ROTURA PUENTE TÉRMICO', value: 'Poliamida tubular 35 mm' },
      { label: 'ATENUACIÓN ACÚSTICA', value: 'Rw hasta 45 dB' },
      { label: 'HERRAJE ARQUITECTÓNICO', value: 'Oculto 180° · Hasta 150 kg' },
      { label: 'TRATAMIENTO SUPERFICIAL', value: 'Qualicoat Seaside / Anodizado' }
    ],
    keyBenefits: [
      {
        title: 'Estética Coplanar Fijo + Abatible Igualada',
        description: 'La misma sección vista de 50 mm en paños fijos y hojas oscilobatientes para fachadas de simetría arquitectónica perfecta.'
      },
      {
        title: 'Herraje y Bisagras 100% Ocultos',
        description: 'Sin bisagras vistas en el interior de la vivienda, facilitando el enrasado con tabiquería y evitando puentes térmicos puntuales.'
      },
      {
        title: 'Lacado Marino Qualicoat Seaside',
        description: 'Máxima resistencia frente a la corrosión salina e intemperie en viviendas de costa en Alicante, Cartagena, Águilas y Mazarrón.'
      }
    ],
    recommendedSeriesCode: 'SERIE 02 · ALUMINIO HOJA OCULTA',
    recommendedSeriesName: 'NOVA ALU MINIMAL 75 RPT',
    catalogDownloadUrl: '/catalogs/NOVA_Catalogo_Maestro_Sistemas_ES.pdf',
    catalogTitle: 'Catálogo General de Sistemas Arquitectónicos NOVA (98 págs.)',
    faqs: [
      {
        question: '¿Produce condensación una ventana de aluminio moderna con RPT de 35 mm?',
        answer: 'Jamás. La poliamida tubular de 35 mm junto con la espuma intercalar rompe por completo la transmisión térmica entre la cara exterior e interior del perfil, eliminando el riesgo de condensación superficial.',
        normative: 'CTE DB-HE1 · ISO 10077-2'
      },
      {
        question: '¿Qué peso de vidrio de seguridad soporta la hoja oculta NOVA ALU MINIMAL 75?',
        answer: 'Sus compases de acero inoxidable ocultos admiten hojas de hasta 150 kg de peso, permitiendo instalar triples vidrios laminares acústicos y antirrobo de gran formato.',
        normative: 'UNE-EN 13126 · RC2'
      }
    ]
  },
  {
    slug: 'puertas-pivotantes-acorazadas-rc3',
    categoryBadge: 'ACCESOS MONUMENTALES Y SEGURIDAD',
    normativeBadge: 'DIN EN 1627 RC3 · CTE DB-SI · Ud 0.68 W/m²K',
    metaTitle: 'Puertas Pivotantes y Acorazadas RC3 en Murcia y Alicante | Catálogo NOVA',
    metaDescription: 'Puertas de entrada pivotantes de gran formato y puertas acorazadas arquitectónicas certificadas DIN EN 1627 RC3. Paneles coplanares en piedra, aluminio y madera noble.',
    h1: 'Puertas Pivotantes Monumentales y Acorazadas de Seguridad RC3',
    subtitle: 'Ingeniería antiefracción certificada DIN EN 1627 RC3 con eje pivotante oculto, paneles enrasados de 95 mm, umbral magnético y control de acceso biométrico.',
    heroImage: 'assets/images/pivot-door.jpg',
    introParagraphs: [
      'La colección NOVA SHIELD Pivot & Acorazada RC3 redefine la entrada principal de viviendas unifamiliares y villas contemporáneas. Diseñada con paneles coplanares de 95 mm de espesor totalmente enrasados a ambas caras, combina una presencia escultórica imponente con un aislamiento termoacústico Ud de hasta 0.68 W/m²K.',
      'Su chasis interno reforzado, cerradura multipunto motorizada con ganchos antipalanca de acero templado y cilindros de alta seguridad cuentan con ensayo oficial antiefracción DIN EN 1627 Clase RC3.'
    ],
    specs: [
      { label: 'CERTIFICACIÓN SEGURIDAD', value: 'DIN EN 1627 Clase RC3', highlight: true },
      { label: 'TRANSMITANCIA TÉRMICA', value: 'Ud desde 0.68 W/m²K' },
      { label: 'ESPESOR DE HOJA COPLANAR', value: '95 mm Doble Cara Enrasada' },
      { label: 'DIMENSIONES MÁXIMAS', value: 'Hasta 3.200 × 2.000 mm' },
      { label: 'ATENUACIÓN ACÚSTICA', value: 'Rw hasta 44 dB' },
      { label: 'CONTROL DE ACCESO', value: 'Biométrico / Domótico / LED' }
    ],
    keyBenefits: [
      {
        title: 'Eje Pivotante Excéntrico Oculto con Cierre Amortiguado',
        description: 'Permite mover hojas de hasta 300 kg con un solo dedo gracias a su rodamiento hidráulico empotrado con freno integrado.'
      },
      {
        title: 'Acabados en Piedra Sinterizada, Latón, Roble y Ultramate',
        description: 'Más de 80 diseños de paneles arquitectónicos resistentes al sol extremo, con tiradores encastrados e iluminación LED indirecta.'
      },
      {
        title: 'Umbral Magnético Automático Cota Cero',
        description: 'Al cerrar la hoja, un doble sello magnético asciende automáticamente garantizando estanqueidad total al aire, polvo y agua sin escalón inferior.'
      }
    ],
    recommendedSeriesCode: 'SERIE 05 · PUERTAS ARQUITECTÓNICAS',
    recommendedSeriesName: 'NOVA SHIELD Pivot & Acorazada RC3',
    catalogDownloadUrl: '/catalogs/NOVA_Catalogo_Puertas_Seguridad_ES.pdf',
    catalogTitle: 'Colección de Puertas de Entrada y Paneles Enrasados (133 págs.)',
    faqs: [
      {
        question: '¿Es tan hermética una puerta pivotante como una puerta abatible tradicional?',
        answer: 'Sí. El sistema NOVA SHIELD incorpora triple junta perimetral y un umbral magnético retráctil que sella herméticamente todo el contorno al bloquearse la cerradura multipunto.',
        normative: 'UNE-EN 14351-1 · Clase 4'
      },
      {
        question: '¿Qué significa exactamente la certificación antirrobo DIN EN 1627 RC3?',
        answer: 'Garantiza mediante ensayo en laboratorio acreditado que la puerta resiste ataques prolongados de intrusos experimentados utilizando palancas de acero de 70 cm, destornilladores pesados, cuñas y taladros mecánicos.',
        normative: 'DIN EN 1627 Clase RC3'
      }
    ]
  },
  {
    slug: 'correderas-elevables-cota-cero',
    categoryBadge: 'GRANDES FORMATOS PANORÁMICOS',
    normativeBadge: 'CTE DB-SUA COTA CERO · UNE-EN 12210 CLASE C5',
    metaTitle: 'Correderas Elevables a Cota Cero y Grandes Formatos | NOVA Ventanas',
    metaDescription: 'Correderas elevables y minimalistas a cota cero con nudo central de 25 mm. Serie NOVA HORIZON LIFT para hojas de hasta 400 kg, esquinas a 90° sin poste y máxima hermeticidad.',
    h1: 'Correderas Elevables a Cota Cero y Grandes Formatos Acristalados',
    subtitle: 'Continuidad absoluta entre el salón y el porche sin barreras arquitectónicas, con encuentro central minimalista de solo 25 mm y deslizamiento silencioso.',
    heroImage: 'assets/images/solution-correderas.jpg',
    introParagraphs: [
      'El sistema NOVA HORIZON LIFT Cota Cero ha sido proyectado para disolver la frontera entre el interior de la vivienda y el jardín o terraza. Su solera inferior queda completamente empotrada a ras de pavimento con canalización de drenaje oculta, cumpliendo las exigencias de accesibilidad del CTE DB-SUA.',
      'A diferencia de las correderas convencionales de cepillo, su mecanismo elevable levanta la hoja sobre rodamientos de precisión al accionar la manilla y la desciende al cerrar, comprimiendo juntas perimetrales de EPDM con estanqueidad equivalente a una ventana practicable.'
    ],
    specs: [
      { label: 'NUDO CENTRAL MINIMALISTA', value: 'Solo 25 mm vistos', highlight: true },
      { label: 'SOLERA INFERIOR', value: '100% Empotrada a Cota Cero' },
      { label: 'CAPACIDAD POR HOJA', value: 'Hasta 400 kg (Manual/Motor)' },
      { label: 'TRANSMITANCIA TÉRMICA', value: 'Uw desde 0.95 W/m²K' },
      { label: 'RESISTENCIA AL VIENTO', value: 'Clase C5 (UNE-EN 12210)' },
      { label: 'APERTURA EN ESQUINA', value: 'Encuentro a 90° libre de poste' }
    ],
    keyBenefits: [
      {
        title: 'Transición Interior-Exterior a Ras de Suelo',
        description: 'El pavimento porcelánico o de madera continúa sin tropiezos hacia la terraza con evacuación hídrica oculta de alto caudal.'
      },
      {
        title: 'Esquinas Acristaladas a 90° Sin Columna',
        description: 'Posibilidad de abrir dos frentes perpendiculares dejando la esquina completamente diáfana hacia el jardín o la piscina.'
      },
      {
        title: 'Seguridad Laminar Antirrobo RC2',
        description: 'Cierres multipunto tipo gancho de acero inoxidable combinados con vidrios laminados de seguridad 6+6.2 con control solar.'
      }
    ],
    recommendedSeriesCode: 'SERIE 03 · CORREDERA ELEVABLE COTA CERO',
    recommendedSeriesName: 'NOVA HORIZON LIFT Cota Cero',
    catalogDownloadUrl: '/catalogs/NOVA_Catalogo_Maestro_Sistemas_ES.pdf',
    catalogTitle: 'Catálogo General de Sistemas Arquitectónicos NOVA (98 págs.)',
    faqs: [
      {
        question: '¿Puede entrar agua de lluvia al estar el carril empotrado a cota cero?',
        answer: 'No. La guía empotrada incorpora un colector de drenaje subpavimento con válvula antirretorno que evacúa hasta las lluvias torrenciales mediterráneas (DANA) con clasificación de estanqueidad E900.',
        normative: 'UNE-EN 12208 · CTE DB-HS'
      },
      {
        question: '¿Qué diferencia hay entre una corredera tradicional y una corredera elevable?',
        answer: 'La corredera tradicional roza sobre felpudos que dejan pasar aire y ruido. La corredera elevable NOVA HORIZON LIFT se asienta por gravedad sobre juntas de goma EPDM herméticas, logrando aislamiento Clase 4.',
        normative: 'UNE-EN 12207 Clase 4'
      }
    ]
  },
  {
    slug: 'cerramientos-cortinas-cristal-bioclimatica',
    categoryBadge: 'ARQUITECTURA EXTERIOR Y TERRAZAS',
    normativeBadge: 'UNE-EN 13561 · CTE DB-SE-AE · VIDRIO TEMPLADO',
    metaTitle: 'Cortinas de Cristal y Pérgolas Bioclimáticas en Murcia y Alicante | NOVA',
    metaDescription: 'Cerramientos de terrazas, porches y áticos con cortinas de cristal sin perfiles verticales y pérgolas bioclimáticas motorizadas en Murcia y Alicante. Serie NOVA PANORAMA.',
    h1: 'Cerramientos Panorámicos, Cortinas de Cristal y Pérgolas Bioclimáticas',
    subtitle: 'Habita tu porche, ático o terraza los 365 días del año con visión panorámica 100% libre de montantes verticales y regulación solar bioclimática.',
    heroImage: 'assets/images/glass-terrace.jpg',
    introParagraphs: [
      'La gama NOVA PANORAMA Glass & Bioclimática transforma terrazas, áticos y porches en espacios habitables durante todo el año sin alterar la estética de la fachada. Nuestras cortinas de cristal abatibles y deslizantes prescinden por completo de perfiles verticales entre hojas, ofreciendo vistas limpias y una apertura total del 100% del hueco.',
      'Combinadas con nuestras pérgolas bioclimáticas de lamas de aluminio orientables motorizadas (de 0° a 135°), permiten regular de forma natural la brisa, la luz solar y la impermeabilidad frente a la lluvia con sensores meteorológicos e iluminación LED perimetral integrada.'
    ],
    specs: [
      { label: 'VISIÓN PANORÁMICA', value: '100% Sin Perfiles Verticales', highlight: true },
      { label: 'VIDRIO DE SEGURIDAD', value: 'Templado 10 mm / 12 mm' },
      { label: 'REDUCCIÓN ACÚSTICA', value: 'Hasta 34 dB (UNE-EN ISO 10140)' },
      { label: 'RESISTENCIA AL VIENTO', value: 'Clase C4 / Hasta 180 km/h' },
      { label: 'GUÍA INFERIOR', value: 'Empotrable mínima de 18 mm' },
      { label: 'AUTOMATIZACIÓN', value: 'Sensores Lluvia / Viento + App' }
    ],
    keyBenefits: [
      {
        title: 'Apertura Total Plegable en un Extremo',
        description: 'Todas las hojas de vidrio templado se deslizan y pliegan suavemente en un lateral, dejando la terraza completamente abierta en minutos.'
      },
      {
        title: 'Confort Bioclimático Todo el Año',
        description: 'En invierno capta la radiación solar creando un colchón térmico; en verano ventila por convección natural sin efecto invernadero.'
      },
      {
        title: 'Sin Alteración Visual de Fachada en Comunidades',
        description: 'Al carecer de perfilería vertical, mantiene intacta la estética exterior de edificios residenciales y áticos urbanos.'
      }
    ],
    recommendedSeriesCode: 'SERIE 06 · CERRAMIENTOS Y BIOCLIMÁTICA',
    recommendedSeriesName: 'NOVA PANORAMA Glass & Bioclimática',
    catalogDownloadUrl: '/catalogs/NOVA_Catalogo_Mallorquinas_Skuro_ES.pdf',
    catalogTitle: 'Catálogo de Control Solar, Bioclimática y Sistemas Skuro (15 págs.)',
    faqs: [
      {
        question: '¿Aíslan del ruido y del viento las cortinas de cristal sin perfiles?',
        answer: 'Sí. Gracias al vidrio templado monolítico de 10 o 12 mm y a las juntas transparentes inter-cristal de policarbonato con filtro UV, reducen el ruido exterior hasta en 34 dB y bloquean el viento y el polvo.',
        normative: 'UNE-EN 12210 · UNE-EN 12600'
      },
      {
        question: '¿Es totalmente impermeable el techo de una pérgola bioclimática cuando llueve?',
        answer: 'Totalmente. Al cerrarse las lamas orientables, sus canales perimetrales recogen el agua de lluvia y la conducen de forma invisible por el interior de las columnas estructurales.',
        normative: 'UNE-EN 13561 · Marcado CE'
      }
    ]
  },
  {
    slug: 'ventanas-y-puertas-murcia',
    categoryBadge: 'SEDE CENTRAL Y SHOWROOM EN MURCIA',
    normativeBadge: 'MOLINA DE SEGURA · REGIÓN DE MURCIA · GRUPO SOTO',
    metaTitle: 'Fábrica y Showroom de Ventanas y Puertas en Murcia | NOVA Grupo Soto',
    metaDescription: 'Fabricación, showroom e instalación de ventanas de PVC Passivhaus, aluminio RPT hoja oculta, puertas pivotantes y cerramientos en Murcia y Molina de Segura. Grupo Soto.',
    h1: 'Fábrica, Showroom e Instalación de Ventanas y Puertas en Murcia',
    subtitle: 'Ingeniería de carpintería arquitectónica con sede central y exposición física en Polígono Industrial La Serreta (Molina de Segura). Servicio integral en toda la Región de Murcia.',
    heroImage: 'assets/images/showroom-interior.jpg',
    introParagraphs: [
      'Desde nuestra sede central y Showroom técnico en Molina de Segura (Polígono Industrial La Serreta), NOVA Ventanas & Puertas —división especializada de Grupo Soto— diseña, fabrica e instala carpintería exterior de altas prestaciones para viviendas unifamiliares, reformas integrales y estudios de arquitectura en toda la Región de Murcia.',
      'Conocemos al detalle las exigencias climáticas de Murcia Capital, Altorreal, La Alcayna, Cartagena, Lorca, La Manga, Cieza y el Mar Menor: combinamos perfilerías de baja transmitancia con vidrios de Control Solar Selectivo que detienen el calor extremo del verano murciano sin restar luminosidad.'
    ],
    specs: [
      { label: 'SEDE Y SHOWROOM FÍSICO', value: 'P.I. La Serreta · Molina de Segura', highlight: true },
      { label: 'COBERTURA GEOGRAFICA', value: 'Toda la Región de Murcia' },
      { label: 'INSTALACIÓN EN OBRA', value: 'Equipos Propios · UNE 85219' },
      { label: 'FACTOR SOLAR VIDRIO (g)', value: 'Control Solar Selectivo ≤ 0.38' },
      { label: 'ESTUDIO Y MEDICIÓN', value: 'Sin Compromiso en Obra' },
      { label: 'GARANTÍA OFICIAL NOVA', value: '10 Años + Servicio Postventa' }
    ],
    keyBenefits: [
      {
        title: 'Showroom Arquitectónico a Escala Real en Murcia',
        description: 'Ensaya en persona el deslizamiento de nuestras correderas a cota cero, el cierre magnético de las puertas RC3 y las secciones de hoja oculta.'
      },
      {
        title: 'Instalación Técnica Propia según Norma UNE 85219',
        description: 'Sin subcontratas sin control: nuestros oficiales instalan con cintas expansivas multifunción y sellado termoacústico perimetral.'
      },
      {
        title: 'Especialistas en Clima Cálido Mediterráneo (Zona B3/C3)',
        description: 'Configuraciones específicas de vidrio bajo emisivo y control solar para reducir hasta un 60% el gasto en aire acondicionado en verano.'
      }
    ],
    recommendedSeriesCode: 'INGENIERÍA LOCAL · REGIÓN DE MURCIA',
    recommendedSeriesName: 'Gama Completa NOVA · PVC, Aluminio RPT, Mixto y Puertas RC3',
    catalogDownloadUrl: '/catalogs/NOVA_Catalogo_Maestro_Sistemas_ES.pdf',
    catalogTitle: 'Catálogo General de Sistemas Arquitectónicos NOVA (98 págs.)',
    faqs: [
      {
        question: '¿Puedo visitar el Showroom de NOVA en Molina de Segura (Murcia)?',
        answer: 'Por supuesto. Nuestro Showroom está ubicado en el Polígono Industrial La Serreta (30500 Molina de Segura, Murcia), abierto de lunes a viernes de 08:30 a 19:30 con atención técnica personalizada.',
        normative: 'Showroom Oficial Grupo Soto'
      },
      {
        question: '¿Realizáis mediciones gratuitas en obra en cualquier municipio de Murcia?',
        answer: 'Sí, nuestra oficina técnica se desplaza sin coste a Murcia centro, Molina de Segura (Altorreal, La Alcayna), Cartagena, Lorca, Cieza, San Javier, Mazarrón, Águilas y toda la Región.',
        normative: 'Oficina Técnica Propia'
      }
    ]
  },
  {
    slug: 'ventanas-y-puertas-alicante',
    categoryBadge: 'PROYECTOS EN ALICANTE Y COSTA BLANCA',
    normativeBadge: 'QUALICOAT SEASIDE · CONTROL SOLAR · COSTA BLANCA',
    metaTitle: 'Ventanas, Puertas Pivotantes y Cerramientos en Alicante y Costa Blanca | NOVA',
    metaDescription: 'Instalación de ventanas de PVC Passivhaus, carpintería de aluminio RPT con protección marina Qualicoat Seaside, puertas pivotantes RC3 y correderas en Alicante y Costa Blanca.',
    h1: 'Carpintería Arquitectónica de Ventanas y Puertas en Alicante y Costa Blanca',
    subtitle: 'Sistemas de alta gama con protección anticorrosión marina Qualicoat Seaside, aislamiento acústico superior y grandes formatos para villas y viviendas en toda la provincia de Alicante.',
    heroImage: 'assets/images/project-mediterranea.jpg',
    introParagraphs: [
      'NOVA Ventanas & Puertas desarrolla y ejecuta proyectos de carpintería arquitectónica a medida en toda la provincia de Alicante y la Costa Blanca: Alicante capital, Playa de San Juan, Elche, Orihuela Costa, Torrevieja, Santa Pola, Benidorm, Altea, Calpe y Jávea.',
      'Las viviendas próximas al litoral alicantino requieren una ingeniería específica frente a la salinidad, la humedad ambiental y la alta insolación. Por ello, todos nuestros sistemas de aluminio RPT cuentan con certificación marina Qualicoat Seaside y herrajes con tratamiento anticorrosión Clase 5.'
    ],
    specs: [
      { label: 'PROTECCIÓN LITORAL', value: 'Qualicoat Seaside + Herraje C5', highlight: true },
      { label: 'ÁMBITO DE ACTUACIÓN', value: 'Alicante, Elche y Costa Blanca' },
      { label: 'TRANSMITANCIA TÉRMICA', value: 'Uw desde 0.72 W/m²K' },
      { label: 'AISLAMIENTO ACÚSTICO', value: 'Rw hasta 47 dB (Zonas Turísticas)' },
      { label: 'RESISTENCIA AL VIENTO', value: 'Hasta Clase C5 (Frentes Marítimos)' },
      { label: 'GRANDES FORMATOS', value: 'Hojas de hasta 6 metros' }
    ],
    keyBenefits: [
      {
        title: 'Blindaje Frente al Salitre y Brisa Marina',
        description: 'Pre-anodizado y lacado Qualicoat Seaside que impide la oxidación filiforme en primera y segunda línea de playa.'
      },
      {
        title: 'Silencio Absoluto en Zonas Costeras y Urbanas',
        description: 'Acristalamientos laminares acústicos asimétricos que reducen el ruido exterior hasta 47 dB para un descanso inalterable.'
      },
      {
        title: 'Grandes Correderas Panorámicas para Villas',
        description: 'Especialistas en correderas elevables a cota cero y aperturas de esquina a 90° para conectar salón, terraza y piscina.'
      }
    ],
    recommendedSeriesCode: 'ESPECIAL COSTA BLANCA · ALICANTE',
    recommendedSeriesName: 'NOVA HORIZON LIFT + NOVA ALU MINIMAL 75 Seaside',
    catalogDownloadUrl: '/catalogs/NOVA_Carta_Acabados_Folios_ES.pdf',
    catalogTitle: 'Carta Técnica de Acabados, Folios y Anodizados Seaside (16 págs.)',
    faqs: [
      {
        question: '¿Qué material es más recomendable cerca del mar en Alicante: PVC o Aluminio Seaside?',
        answer: 'Ambos ofrecen un comportamiento excelente: el PVC Clase A es 100% inmune a la corrosión salina, mientras que el Aluminio RPT con sello Qualicoat Seaside permite grandes dimensiones panorámicas con total garantía frente al salitre.',
        normative: 'Qualicoat Seaside · UNE-EN 1670 C5'
      },
      {
        question: '¿Trabajáis con arquitectos y constructores en villas de la Costa Blanca?',
        answer: 'Sí, nuestro departamento técnico colabora directamente con estudios de arquitectura y promotores facilitando detalles constructivos CAD/BIM, memorias CTE y ejecución integral en obra.',
        normative: 'Prescripción Arquitectónica CTE'
      }
    ]
  },
  {
    slug: 'deducciones-irpf-cambio-ventanas',
    categoryBadge: 'NORMATIVA FISCAL Y EFICIENCIA ENERGÉTICA',
    normativeBadge: 'DEDUCCIÓN IRPF 20% · 40% · 60% · CTE DB-HE1',
    metaTitle: 'Deducciones IRPF por Cambio de Ventanas Eficientes (20%, 40% y 60%) | NOVA',
    metaDescription: 'Guía técnica actualizada sobre las deducciones fiscales en el IRPF (20%, 40% y 60%) y ayudas por cambio de ventanas de alta eficiencia energética en Murcia y Alicante.',
    h1: 'Deducciones Fiscales en el IRPF por Cambio de Ventanas Eficientes',
    subtitle: 'Recupera entre el 20% y el 60% de tu inversión en la Declaración de la Renta sustituyendo tus antiguas carpinterías por sistemas certificados NOVA de bajo consumo energético.',
    heroImage: 'assets/images/pilar-eficiencia.jpg',
    introParagraphs: [
      'Sustituir ventanas antiguas de aluminio sin rotura de puente térmico o correderas simples por sistemas de alta eficiencia energética NOVA (como NOVA THERM 82 o NOVA ALU MINIMAL 75) no solo reduce de inmediato hasta un 60% la factura de climatización, sino que permite acogerse a las deducciones estatales en el IRPF por obras de mejora de la eficiencia energética.',
      'En NOVA Ventanas & Puertas entregamos toda la documentación oficial reglamentaria: factura desglosada conforme a VeriFactu, fichas de Declaración de Prestaciones (DoP), Marcado CE con valores exactos de transmitancia térmica (Uw) y factor solar (g) exigidos por los técnicos certificadores.'
    ],
    specs: [
      { label: 'TRAMO 1 · DEDUCCIÓN 20%', value: 'Reducción ≥ 7% demanda térmica', highlight: true },
      { label: 'TRAMO 2 · DEDUCCIÓN 40%', value: 'Reducción ≥ 30% energía o Clase A/B' },
      { label: 'TRAMO 3 · DEDUCCIÓN 60%', value: 'Rehabilitación energética edificio' },
      { label: 'REQUISITO TÉCNICO ZONA B3/C3', value: 'Uw ≤ 2.10 / 1.80 W/m²K (NOVA: 0.72)' },
      { label: 'DOCUMENTACIÓN ENTREGADA', value: 'Marcado CE + DoP + Factura Oficial' },
      { label: 'FORMA DE PAGO EXIGIDA', value: 'Transferencia / Medios Bancarios' }
    ],
    keyBenefits: [
      {
        title: 'Deducción del 20% (Hasta 5.000 € de base anual)',
        description: 'Se obtiene fácilmente con el cambio de ventanas al reducir al menos un 7% la demanda conjunta de calefacción y refrigeración.'
      },
      {
        title: 'Deducción del 40% (Hasta 7.500 € de base anual)',
        description: 'Aplicable cuando la sustitución de carpinterías reduce un 30% el consumo de energía primaria no renovable o la vivienda alcanza calificación energética A o B.'
      },
      {
        title: 'Entrega de Dossier Técnico de Certificación CE',
        description: 'Facilitamos todas las etiquetas de transmitancia Uw y factor solar g de cada hueco para que el arquitecto o ingeniero emita los Certificados Energéticos (antes y después).'
      }
    ],
    recommendedSeriesCode: 'MÁXIMA BONIFICACIÓN FISCAL · ECCN',
    recommendedSeriesName: 'NOVA THERM 82 (Uw 0.72) & NOVA ALU MINIMAL 75 (Uw 0.88)',
    catalogDownloadUrl: '/catalogs/NOVA_Catalogo_Maestro_Sistemas_ES.pdf',
    catalogTitle: 'Catálogo General de Sistemas Arquitectónicos NOVA (98 págs.)',
    faqs: [
      {
        question: '¿Qué requisito es imprescindible antes de desmontar las ventanas viejas?',
        answer: 'Para aplicar la deducción en el IRPF es obligatorio disponer de un Certificado de Eficiencia Energética (CEE) emitido y registrado ANTES de iniciar la obra, y un segundo certificado emitido DESPUÉS de instalar las nuevas ventanas NOVA.',
        normative: 'AEAT · Real Decreto-ley Eficiencia'
      },
      {
        question: '¿Cumplen todas las ventanas NOVA los valores límite del CTE para la deducción?',
        answer: 'Con creces. Mientras el CTE exige en Murcia y Alicante valores Uw inferiores a 1.80–2.10 W/m²K, nuestras series NOVA alcanzan entre 0.72 y 0.95 W/m²K, maximizando la caída de demanda energética en el certificado.',
        normative: 'CTE DB-HE1 · Marcado CE'
      }
    ]
  }
];
