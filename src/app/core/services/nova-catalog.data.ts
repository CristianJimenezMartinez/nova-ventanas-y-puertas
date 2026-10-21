import {
  NovaPdfCatalog,
  NovaTechnicalFaq,
  NovaTechnicalSeries,
  SolutionRecommendation
} from '../models/nova.model';

export const NOVA_TECHNICAL_SERIES_DATA: NovaTechnicalSeries[] = [
  {
    id: 'nova-therm-82',
    code: 'SERIE 01 · PVC PASSIVHAUS',
    name: 'NOVA THERM 82 Triple Junta',
    category: 'PVC',
    depthMm: '82 mm · 7 Cámaras (Clase A)',
    uwValue: 'Uw desde 0.72 W/m²K',
    acousticRw: 'Rw hasta 47 dB',
    airTightness: 'Clase 4 (UNE-EN 12207)',
    securityClass: 'RC2 de serie / RC3 opc.',
    normative: 'CTE DB-HE1 · DB-HR · UNE-EN 12608 Clase A',
    summary: 'Sistema practicable y oscilobatiente de 82 mm con triple junta central de EPDM y soldadura invisible V-Perfect. Diseñado para viviendas de consumo casi nulo (ECCN).',
    highlights: ['Triple junta central de estanqueidad', 'Acristalamiento hasta 52 mm con gas Argón', 'Refuerzo de acero galvanizado cerrado']
  },
  {
    id: 'nova-alu-minimal-75',
    code: 'SERIE 02 · ALUMINIO HOJA OCULTA',
    name: 'NOVA ALU MINIMAL 75 RPT',
    category: 'ALUMINIO',
    depthMm: '75 mm · Vista frontal 50 mm',
    uwValue: 'Uw desde 0.88 W/m²K',
    acousticRw: 'Rw hasta 45 dB',
    airTightness: 'Clase 4 · Estanqueidad E1500',
    securityClass: 'Herraje oculto RC2',
    normative: 'CTE DB-HE · Qualicoat Seaside · UNE-EN 14351-1',
    summary: 'Carpintería de aluminio arquitectónico con hoja oculta tras el marco exterior y bisagras invisibles integradas. Aumenta un 22% la superficie acristalada útil.',
    highlights: ['Sección vista de solo 50 mm desde el exterior', 'Poliamida tubular de 35 mm con espuma aislante', 'Herraje perimetral oculto hasta 150 kg por hoja']
  },
  {
    id: 'nova-horizon-lift',
    code: 'SERIE 03 · CORREDERA ELEVABLE COTA CERO',
    name: 'NOVA HORIZON LIFT Cota Cero',
    category: 'ALUMINIO',
    depthMm: '160 / 180 mm · Nudo 25 mm',
    uwValue: 'Uw desde 0.95 W/m²K',
    acousticRw: 'Rw hasta 43 dB',
    airTightness: 'Clase 4 · Viento C5',
    securityClass: 'Multipunto RC2',
    normative: 'CTE DB-SUA (Accesibilidad Cota Cero) · UNE-EN 12210',
    summary: 'Sistema corredero elevable de gran formato con carril inferior totalmente enrasado en el pavimento y encuentro central minimalista de solo 25 mm.',
    highlights: ['Solera empotrada a cota cero con drenaje oculto', 'Hojas de hasta 400 kg o motorización oculta', 'Opción de apertura en esquina a 90° sin columna']
  },
  {
    id: 'nova-hybrid-wood-90',
    code: 'SERIE 04 · MIXTO ALUMINIO-MADERA',
    name: 'NOVA HYBRID WOOD 90',
    category: 'MIXTO',
    depthMm: '90 mm · Madera maciza + Alu',
    uwValue: 'Uw desde 0.78 W/m²K',
    acousticRw: 'Rw hasta 46 dB',
    airTightness: 'Clase 4 · Triple junta',
    securityClass: 'RC2 / RC3',
    normative: 'Certificación FSC/PEFC · UNE-EN 14351-1',
    summary: 'Fusión de envolvente exterior de aluminio extruido sin mantenimiento e interior de madera maciza de roble, nogal o castaño unida por clipaje elástico ventilado.',
    highlights: ['Cámara de ventilación que evita condensaciones', 'Interior en maderas nobles seleccionadas a mano', 'Cero mantenimiento en la cara exterior']
  },
  {
    id: 'nova-shield-rc3',
    code: 'SERIE 05 · PUERTAS ARQUITECTÓNICAS',
    name: 'NOVA SHIELD Pivot & Acorazada RC3',
    category: 'PUERTAS',
    depthMm: '95 mm · Panel coplanar enrasado',
    uwValue: 'Ud desde 0.68 W/m²K',
    acousticRw: 'Rw hasta 44 dB',
    airTightness: 'Umbral magnético automático',
    securityClass: 'DIN EN 1627 RC3 Certificado',
    normative: 'DIN EN 1627 RC3 · CTE DB-SI · UNE-EN 14351-1',
    summary: 'Puertas de entrada monumentales sobre eje pivotante excéntrico oculto, con cerradura motorizada biométrica y paneles de piedra sinterizada, aluminio o madera.',
    highlights: ['Hojas de hasta 3.200 mm de altura', 'Cerradura multipunto motorizada y lector dactilar', 'Acabados en porcelánico técnico, latón o roble']
  },
  {
    id: 'nova-panorama-glass',
    code: 'SERIE 06 · CERRAMIENTOS Y BIOCLIMÁTICA',
    name: 'NOVA PANORAMA Glass & Bioclimática',
    category: 'CERRAMIENTOS',
    depthMm: 'Vidrio templado 10/12 mm · Sin montantes',
    uwValue: 'Protección solar bioclimática',
    acousticRw: 'Reducción acústica hasta 34 dB',
    airTightness: 'Estanqueidad frente a lluvia y viento C4',
    securityClass: 'Templado / Laminar de seguridad',
    normative: 'CTE DB-SE-AE · UNE-EN 13561 · Marcado CE',
    summary: 'Cortinas de cristal abatibles y correderas sin perfiles verticales combinables con pérgolas bioclimáticas de lamas orientables motorizadas e iluminación LED.',
    highlights: ['Visión panorámica 100% libre de perfiles verticales', 'Guía inferior empotrable de 18 mm', 'Sensor de lluvia, viento y domótica integrada']
  }
];

export const NOVA_PDF_CATALOGS_DATA: NovaPdfCatalog[] = [
  {
    id: 'cat-general-sistemas',
    code: 'DOSSIER 01 · EDICIÓN ESPAÑOL',
    title: 'Catálogo General de Sistemas Arquitectónicos NOVA',
    subtitle: 'Sistemas de ventanas de PVC Clase A, Aluminio RPT, Correderas Elevables y Secciones Constructivas.',
    pages: 98,
    category: 'VENTANAS & CORREDERAS',
    specs: ['Secciones a escala 1:1', 'Tablas de transmitancia Uw y acústica Rw', 'Límites dimensionales y herrajes'],
    requestSubject: 'Catálogo General de Sistemas Arquitectónicos (98 págs.)'
  },
  {
    id: 'cat-puertas-paneles',
    code: 'DOSSIER 02 · EDICIÓN ESPAÑOL',
    title: 'Colección de Puertas de Entrada & Paneles Enrasados',
    subtitle: 'Puertas pivotantes monumentales, paneles coplanares en aluminio, piedra y madera, y seguridad RC3.',
    pages: 133,
    category: 'PUERTAS DE ENTRADA',
    specs: ['Más de 80 diseños de paneles', 'Tiradores integrados con LED', 'Cerraduras motorizadas y control de acceso'],
    requestSubject: 'Catálogo de Puertas de Entrada y Paneles (133 págs.)'
  },
  {
    id: 'cat-carta-acabados',
    code: 'DOSSIER 03 · EDICIÓN ESPAÑOL',
    title: 'Carta Técnica de Acabados, Folios, Maderas y Anodizados',
    subtitle: 'Muestrario completo de texturas arquitectónicas Ultramate, foliados madera, metalizados y bicolor.',
    pages: 16,
    category: 'ACABADOS & TEXTURAS',
    specs: ['Acabados Spectral Ultramate', 'Maderas nobles y texturados arena', 'Certificación solar Cool-Colors'],
    requestSubject: 'Carta Técnica de Acabados y Folios (16 págs.)'
  },
  {
    id: 'cat-prescripcion-cte',
    code: 'DOSSIER 04 · EDICIÓN ESPAÑOL',
    title: 'Manual Técnico de Prescripción para Arquitectos (CTE)',
    subtitle: 'Guía de cumplimiento del Código Técnico de la Edificación (DB-HE, DB-HR, DB-SUA) e instalación en obra.',
    pages: 15,
    category: 'INGENIERÍA & NORMATIVA',
    specs: ['Cálculo de transmitancia por zona climática', 'Encuentros de obra y premarcos', 'Certificación energética y deducciones IRPF'],
    requestSubject: 'Manual Técnico de Prescripción CTE (15 págs.)'
  }
];

export const NOVA_TECHNICAL_FAQS_DATA: NovaTechnicalFaq[] = [
  {
    id: 'faq-1',
    question: '¿Qué diferencia real existe entre una ventana de Aluminio RPT de Hoja Oculta y una de PVC Clase A?',
    answer: 'El PVC Clase A (serie NOVA THERM 82) ofrece la menor conductividad térmica natural (Uw hasta 0.72 W/m²K) y esquinas soldadas herméticamente, siendo imbatible en aislamiento térmico y acústico. El Aluminio RPT de Hoja Oculta (serie NOVA ALU MINIMAL 75) aporta mayor rigidez estructural para grandes formatos con perfiles vistos de solo 50 mm.',
    normativeTag: 'UNE-EN 12608 · UNE-EN 14351-1'
  },
  {
    id: 'faq-2',
    question: '¿Por qué es tan importante el montaje en obra como la propia ventana?',
    answer: 'Una ventana de altas prestaciones pierde hasta un 40% de su aislamiento térmico y acústico si el encuentro con el muro no se sella correctamente. En NOVA realizamos instalaciones técnicas con cintas expansivas multifunción, espuma elástica de celda cerrada y sellado perimetral (Clase 4).',
    normativeTag: 'UNE 85219 · Instalación en Obra'
  },
  {
    id: 'faq-3',
    question: '¿Qué tipo de vidrio necesito en Murcia y Alicante para frenar el calor en verano y el ruido?',
    answer: 'En el clima mediterráneo (Zonas B3 y C3 del CTE), instalamos vidrios de Control Solar Selectivo (factor solar g ≤ 0.38) con cámara de gas Argón que bloquean más del 60% de la radiación infrarroja sin oscurecer la vivienda, combinados con laminares acústicos Silence (hasta 47 dB).',
    normativeTag: 'CTE DB-HE1 · DB-HR'
  },
  {
    id: 'faq-4',
    question: '¿Cuándo es obligatorio instalar vidrio laminar de seguridad según normativa?',
    answer: 'El Código Técnico de la Edificación (CTE DB-SUA 2) exige vidrio laminar o templado de seguridad (clasificación 1B1 / 2B2 según UNE-EN 12600) en todas las puertas, balconeras, fijos inferiores y acristalamientos situados a menos de 900 mm del suelo.',
    normativeTag: 'CTE DB-SUA 2 · UNE-EN 12600'
  },
  {
    id: 'faq-5',
    question: '¿Cómo funcionan las deducciones fiscales en el IRPF por cambio de ventanas?',
    answer: 'La normativa estatal permite deducir en el IRPF un 20% al reducir al menos un 7% la demanda de calefacción y refrigeración, un 40% al reducir un 30% el consumo de energía primaria no renovable (o alcanzar clase A o B), y hasta un 60% en actuaciones de edificio.',
    normativeTag: 'Deducciones IRPF · Eficiencia Energética'
  }
];

export const NOVA_RECOMMENDATIONS_MAP: Record<string, SolutionRecommendation> = {
  'ventana-aislamiento': {
    title: 'TU SOLUCIÓN NOVA: Sistema NOVA THERM 82 con Triple Vidrio Acústico',
    system: 'NOVA THERM 82 · PVC Clase A (7 Cámaras y Triple Junta EPDM)',
    material: 'PVC de Alta Densidad con Soldadura Invisible V-Perfect',
    finish: 'Gris Antracita 7016 Ultramate o Roble Natural',
    benefit: 'Atenuación acústica Rw de hasta 47 dB y transmitancia Uw de 0.72 W/m²K (Clase 4).',
    imageUrl: 'assets/images/material-pvc.jpg'
  },
  'ventana-diseno': {
    title: 'TU SOLUCIÓN NOVA: Ventana Arquitectónica NOVA ALU MINIMAL 75 Hoja Oculta',
    system: 'NOVA ALU MINIMAL 75 RPT · Bisagras Ocultas Integradas',
    material: 'Aluminio Arquitectónico con Rotura de Puente Térmico de 35 mm',
    finish: 'Negro Azabache Mate Qualicoat o Anodizado Champagne',
    benefit: 'Sección vista frontal de solo 50 mm con un 22% más de luz natural.',
    imageUrl: 'assets/images/material-aluminio.jpg'
  },
  'ventana-seguridad': {
    title: 'TU SOLUCIÓN NOVA: Ventana Antiefracción Certificada DIN EN 1627 RC2/RC3',
    system: 'NOVA ALU MINIMAL 75 / THERM 82 con Herraje Perimetral RC2',
    material: 'Perfilería Reforzada + Vidrio Laminar de Seguridad 4+4.2 / 6+6.2',
    finish: 'Gris Grafito Texturado con Manilla Secustik con Llave',
    benefit: 'Bulones octogonales tipo champiñón antipalanca y vidrio antirrobo.',
    imageUrl: 'assets/images/pilar-seguridad.jpg'
  },
  'ventana-eficiencia': {
    title: 'TU SOLUCIÓN NOVA: Sistema Passivhaus NOVA THERM 82 / HYBRID WOOD 90',
    system: 'Carpintería de Consumo Casi Nulo (CTE DB-HE1) con Gas Argón',
    material: 'PVC 82 mm Triple Junta o Mixto Aluminio-Madera Noble',
    finish: 'Blanco Cálido Seda o Roble Europeo Interior',
    benefit: 'Reduce hasta un 65% la pérdida energética y califica para deducción IRPF (hasta 60%).',
    imageUrl: 'assets/images/pilar-eficiencia.jpg'
  },
  'puerta-aislamiento': {
    title: 'TU SOLUCIÓN NOVA: Puerta Coplanar Termoacústica NOVA SHIELD 95',
    system: 'NOVA SHIELD 95 con Núcleo Multicapa de Alta Densidad y Triple Junta',
    material: 'Aluminio RPT de 95 mm con Umbral Magnético Automático',
    finish: 'Panel Enrasado Piedra Sinterizada o Roble Tostado',
    benefit: 'Transmitancia Ud desde 0.68 W/m²K y sellado hermético contra viento y ruido.',
    imageUrl: 'assets/images/solution-puertas.jpg'
  },
  'puerta-diseno': {
    title: 'TU SOLUCIÓN NOVA: Puerta Pivotante Monumental NOVA SHIELD Pivot',
    system: 'Eje Pivotante Excéntrico Oculto para Hojas de hasta 3,20 m',
    material: 'Panel Coplanar Mixto Aluminio, Porcelánico Técnico y Madera Noble',
    finish: 'Roble Natural con Perfilería Negra e Iluminación LED en Tirador',
    benefit: 'Apertura arquitectónica fluida sin bisagras vistas y presencia escultórica.',
    imageUrl: 'assets/images/pivot-door.jpg'
  },
  'puerta-seguridad': {
    title: 'TU SOLUCIÓN NOVA: Puerta Acorazada Arquitectónica NOVA SHIELD RC3',
    system: 'NOVA SHIELD RC3 · Cerradura Motorizada Multipunto y Escudo Acero',
    material: 'Estructura de Acero y Aluminio Coplanar Certificada DIN EN 1627 RC3',
    finish: 'Antracita Mate con Tirador Escultórico en Latón Cepillado',
    benefit: 'Protección antiefracción certificada RC3 con lector biométrico opcional.',
    imageUrl: 'assets/images/pivot-door.jpg'
  },
  'puerta-eficiencia': {
    title: 'TU SOLUCIÓN NOVA: Puerta de Entrada Passivhaus Ud 0.68 W/m²K',
    system: 'NOVA SHIELD 95 Termoaislante con Rotura de Puente Térmico Integral',
    material: 'Panel Coplanar de 95 mm con Aislamiento de Poliuretano Alta Densidad',
    finish: 'Acabado Bicolor: Exterior Anodizado / Interior Blanco Cálido',
    benefit: 'Elimina puentes térmicos en el acceso principal cumpliendo el estándar ECCN.',
    imageUrl: 'assets/images/solution-puertas.jpg'
  },
  'cerramiento-aislamiento': {
    title: 'TU SOLUCIÓN NOVA: Corredera Elevable Hermética NOVA HORIZON LIFT',
    system: 'NOVA HORIZON LIFT con Doble Junta Perimetral y Vidrio Control Solar',
    material: 'Aluminio RPT Gran Formato para Hojas de hasta 400 kg',
    finish: 'Gris Piedra Arquitectónico o Negro Mate',
    benefit: 'Hermeticidad Clase 4 en grandes luces acristaladas con Uw desde 0.95 W/m²K.',
    imageUrl: 'assets/images/solution-correderas.jpg'
  },
  'cerramiento-diseno': {
    title: 'TU SOLUCIÓN NOVA: Corredera Elevable NOVA HORIZON LIFT Cota Cero',
    system: 'Solera Empotrada a Ras de Pavimento y Nudo Central de solo 25 mm',
    material: 'Aluminio RPT Minimalista con Apertura en Esquina Libre de Poste',
    finish: 'Negro Mate Arquitectónico con Carril Oculto',
    benefit: 'Fusión total entre salón, porche y jardín sin barreras arquitectónicas.',
    imageUrl: 'assets/images/solution-correderas.jpg'
  },
  'cerramiento-seguridad': {
    title: 'TU SOLUCIÓN NOVA: Cerramiento Panorámico de Seguridad RC2 + CTE DB-SUA',
    system: 'NOVA HORIZON LIFT RC2 con Vidrio Laminar Antirrobo 6+6.2',
    material: 'Aluminio Estructural RPT con Cierre Multipunto Antipalanqueta',
    finish: 'Grafito Anodizado de Alta Resistencia Climática',
    benefit: 'Máxima superficie acristalada con resistencia anti-impacto y antiefracción RC2.',
    imageUrl: 'assets/images/grand-format.jpg'
  },
  'cerramiento-eficiencia': {
    title: 'TU SOLUCIÓN NOVA: Conjunto NOVA PANORAMA Bioclimática & Cortina de Cristal',
    system: 'Pérgola Bioclimática Motorizada + Cerramiento Abatible Sin Perfiles',
    material: 'Aluminio Extruido y Vidrio Templado de 10 mm con Control Solar',
    finish: 'Bicolor Negro / Champagne o Blanco Arquitectónico',
    benefit: 'Regulación bioclimática natural en verano y captación térmica invernal.',
    imageUrl: 'assets/images/glass-terrace.jpg'
  }
};
