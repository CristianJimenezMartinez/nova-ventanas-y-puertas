import { Injectable } from '@angular/core';
import {
  SolutionCategory,
  MaterialOption,
  BrandValue,
  ArchitecturalProject,
  SolutionRecommendation,
  NovaTechnicalSeries,
  NovaPdfCatalog,
  NovaTechnicalFaq,
  WebLeadSubmission
} from '../models/nova.model';
import {
  NOVA_PDF_CATALOGS_DATA,
  NOVA_RECOMMENDATIONS_MAP,
  NOVA_TECHNICAL_FAQS_DATA,
  NOVA_TECHNICAL_SERIES_DATA
} from './nova-catalog.data';

@Injectable({
  providedIn: 'root'
})
export class NovaService {
  readonly solutions: SolutionCategory[] = [
    {
      id: 'ventanas',
      title: 'VENTANAS',
      subtitle: 'Luz, proporción y confort en cada espacio',
      description: 'Perfilería de sección mínima con hoja oculta que diluye los límites del marco. Máxima entrada de luz solar con aislamiento térmico y acústico certificado.',
      imageUrl: 'assets/images/solution-ventanas.jpg',
      specs: ['Transmitancia Uw hasta 0.72 W/m²K', 'Atenuación acústica Rw hasta 47 dB', 'Hoja oculta de 50 mm · Clase 4 (UNE-EN 12207)']
    },
    {
      id: 'puertas',
      title: 'PUERTAS',
      subtitle: 'La primera impresión de tu arquitectura',
      description: 'Puertas de entrada pivotantes de gran escala y acorazadas certificadas DIN EN 1627 RC2/RC3. Integración de paneles enrasados de piedra, aluminio y maderas nobles.',
      imageUrl: 'assets/images/solution-puertas.jpg',
      specs: ['Bisagras pivotantes invisibles', 'Seguridad certificada DIN EN 1627 RC3', 'Paneles enrasados con umbral magnético']
    },
    {
      id: 'correderas',
      title: 'CORREDERAS',
      subtitle: 'Fluidez y solera a cota cero',
      description: 'Sistemas elevables y minimalistas con hojas de hasta 400 kg que se desplazan con suavidad milimétrica. El suelo interior y la terraza se convierten en un único plano continuo.',
      imageUrl: 'assets/images/solution-correderas.jpg',
      specs: ['Guía empotrada a ras de pavimento', 'Nudo central minimalista de 25 mm', 'Aperturas de esquina a 90° sin poste']
    },
    {
      id: 'cerramientos',
      title: 'CERRAMIENTOS',
      subtitle: 'Disolver los límites entre interior y exterior',
      description: 'Cortinas de cristal sin perfiles verticales y techos bioclimáticos motorizados que permiten habitar el porche y la terraza durante las cuatro estaciones del año.',
      imageUrl: 'assets/images/glass-terrace.jpg',
      specs: ['Apertura total 100% abatible', 'Vidrio templado de seguridad 10 mm', 'Resistencia al viento Clase C4 (UNE-EN 12210)']
    },
    {
      id: 'grandes-formatos',
      title: 'GRANDES FORMATOS',
      subtitle: 'Superficies acristaladas de escala monumental',
      description: 'Vidrios de suelo a techo sin travesaños intermedios. Ingeniería estructural conforme al CTE DB-SUA para viviendas contemporáneas que exigen vistas panorámicas limpias.',
      imageUrl: 'assets/images/grand-format.jpg',
      specs: ['Acristalamientos de hasta 6 metros', 'Triple vidrio bajo emisivo con gas Argón', 'Control solar selectivo para clima mediterráneo']
    }
  ];

  readonly materials: MaterialOption[] = [
    {
      id: 'aluminio',
      name: 'ALUMINIO',
      headline: 'Líneas limpias. Grandes dimensiones. Máxima libertad arquitectónica.',
      description: 'La aleación de aluminio arquitectónico 6060-T66 con rotura de puente térmico (RPT) permite secciones de perfil ultrafinas, soportando grandes pesos de vidrio con una estabilidad dimensional inalterable.',
      imageUrl: 'assets/images/material-aluminio.jpg',
      features: ['Perfilería de hoja oculta de solo 50 mm vista', 'Poliamidas aislantes tubulares de hasta 35 mm', 'Acabados anodizados y lacados Qualicoat Seaside'],
      quote: 'El lenguaje predilecto de la arquitectura contemporánea.'
    },
    {
      id: 'pvc',
      name: 'PVC',
      headline: 'Hermeticidad absoluta. Eficiencia Passivhaus. Confort inalterable.',
      description: 'Formulado con perfilería multicámara de 76 a 82 mm de profundidad (Espesor Clase A según UNE-EN 12608) y soldadura de esquina V-Perfect. Su baja conductividad natural garantiza el mayor rendimiento térmico del mercado.',
      imageUrl: 'assets/images/material-pvc.jpg',
      features: ['Hasta 7 cámaras interiores y triple junta de EPDM', 'Perfilería Clase A (espesor de pared exterior ≥ 3.0 mm)', 'Uw certificable hasta 0.72 W/m²K para estándar Passivhaus'],
      quote: 'El estándar definitivo de silencio y eficiencia energética.'
    },
    {
      id: 'mixto',
      name: 'MIXTO',
      headline: 'La durabilidad indestructible exterior con la calidez noble interior.',
      description: 'La solución más sofisticada exhibida en nuestro showroom. Estructura exterior de aluminio resistente a la intemperie unida mediante clipaje elástico a una sección interior de madera noble maciza.',
      imageUrl: 'assets/images/material-mixto.jpg',
      features: ['Clipaje técnico que absorbe dilataciones diferenciales', 'Sin condensaciones ni mantenimiento exterior', 'Interior en roble europeo, nogal o fresno seleccionado'],
      quote: 'Elegancia interior y resistencia exterior sin compromisos.'
    },
    {
      id: 'madera',
      name: 'MADERA',
      headline: 'Sostenibilidad orgánica. Confort bioclimático. Belleza atemporal.',
      description: 'Madera laminada de perfil europeo tratada con lasures ecológicos al agua. Un material vivo que aporta una calidez insustituible a rehabilitaciones de patrimonio y viviendas singulares.',
      imageUrl: 'assets/images/material-madera.jpg',
      features: ['Madera laminada en 3 capas que previene torsiones', 'Certificación forestal sostenible FSC / PEFC', 'Atenuación acústica natural superior'],
      quote: 'La autenticidad noble de la materia viva.'
    }
  ];

  readonly technicalSeries: NovaTechnicalSeries[] = NOVA_TECHNICAL_SERIES_DATA;
  readonly pdfCatalogs: NovaPdfCatalog[] = NOVA_PDF_CATALOGS_DATA;
  readonly technicalFaqs: NovaTechnicalFaq[] = NOVA_TECHNICAL_FAQS_DATA;

  readonly values: BrandValue[] = [
    {
      id: 'diseno',
      number: '01',
      title: 'DISEÑO',
      subtitle: 'La arquitectura empieza mucho antes de colocar una ventana',
      description: 'Cada sección, perfil y ensamblaje se concibe para integrarse en las líneas de la vivienda. Eliminamos lo superfluo para que la luz y el paisaje sean los auténticos protagonistas.',
      imageUrl: 'assets/images/pilar-diseno.jpg',
      highlight: 'Líneas mínimas, hoja oculta de 50 mm y proporciones puras.'
    },
    {
      id: 'calidad',
      number: '02',
      title: 'CALIDAD',
      subtitle: 'Precisión artesanal e ingeniería europea certificada',
      description: 'Soldaduras de esquina invisibles, herrajes europeos de altísima durabilidad y ensayos en banco de pruebas que garantizan un comportamiento impecable tras décadas de uso.',
      imageUrl: 'assets/images/pilar-calidad.jpg',
      highlight: 'Marcado CE, UNE-EN 14351-1 y 10 años de garantía directa.'
    },
    {
      id: 'aislamiento',
      number: '03',
      title: 'AISLAMIENTO',
      subtitle: 'Silencio acústico y templanza térmica en cualquier estación',
      description: 'Rotura de puente térmico avanzada, triple junta de EPDM y vidrios selectivos con cámara rellena de gas Argón. El ruido exterior y el calor estival se detienen en la fachada.',
      imageUrl: 'assets/images/pilar-aislamiento.jpg',
      highlight: 'Atenuación acústica de hasta 47 dB y transmitancia Uw desde 0.72 W/m²K.'
    },
    {
      id: 'seguridad',
      number: '04',
      title: 'SEGURIDAD',
      subtitle: 'Tranquilidad invisible protegiendo lo más valioso',
      description: 'Puntos de cierre perimetrales con bulones octogonales tipo champiñón de acero templado, cerraduras multipunto automáticas y vidrios laminados antirrobo homologados RC2 y RC3.',
      imageUrl: 'assets/images/pilar-seguridad.jpg',
      highlight: 'Resistencia contra efracción certificada según normativa DIN EN 1627.'
    },
    {
      id: 'eficiencia',
      number: '05',
      title: 'EFICIENCIA ENERGÉTICA',
      subtitle: 'Consumo casi nulo y cumplimiento estricto del CTE DB-HE',
      description: 'Reducción drástica de la demanda de climatización en invierno y verano. Carpinterías aptas para estándar Passivhaus y deducciones fiscales en el IRPF por mejora de eficiencia energética.',
      imageUrl: 'assets/images/pilar-eficiencia.jpg',
      highlight: 'Ahorro energético certificable y apto para deducción fiscal IRPF (20% al 60%).'
    }
  ];

  readonly projects: ArchitecturalProject[] = [
    {
      id: 'casa-mediterranea',
      title: 'Casa Mediterránea',
      location: 'Alicante / Costa Blanca',
      category: 'grandes-formatos',
      categoryLabel: 'Grandes Formatos',
      systems: 'NOVA HORIZON LIFT Cota Cero · Aluminio RPT Minimal',
      imageUrl: 'assets/images/project-mediterranea.jpg',
      year: '2025'
    },
    {
      id: 'villa-altorreal',
      title: 'Villa Altorreal',
      location: 'Molina de Segura (Murcia)',
      category: 'viviendas',
      categoryLabel: 'Viviendas',
      systems: 'NOVA THERM 82 Triple Junta · Triple Vidrio Control Solar',
      imageUrl: 'assets/images/project-altorreal.jpg',
      year: '2025'
    },
    {
      id: 'atico-gran-via',
      title: 'Ático Gran Vía',
      location: 'Murcia Capital',
      category: 'reformas',
      categoryLabel: 'Reformas',
      systems: 'NOVA PANORAMA Glass · Pérgola Bioclimática Motorizada',
      imageUrl: 'assets/images/project-atico.jpg',
      year: '2026'
    },
    {
      id: 'rehabilitacion-cieza',
      title: 'Finca Bioclimática',
      location: 'Cieza (Murcia)',
      category: 'reformas',
      categoryLabel: 'Reformas',
      systems: 'NOVA HYBRID WOOD 90 Aluminio-Madera · Estándar ECCN',
      imageUrl: 'assets/images/project-cieza.jpg',
      year: '2025'
    }
  ];

  getRecommendation(
    need: 'ventana' | 'puerta' | 'cerramiento',
    priority: 'aislamiento' | 'diseno' | 'seguridad' | 'eficiencia'
  ): SolutionRecommendation {
    const key = `${need}-${priority}`;
    return NOVA_RECOMMENDATIONS_MAP[key] ?? NOVA_RECOMMENDATIONS_MAP['ventana-diseno'];
  }

  generateWhatsAppUrl(rec: SolutionRecommendation, lead?: Partial<WebLeadSubmission>): string {
    const phone = '34613754271';
    const city = lead?.city || 'Murcia';
    const nameLine = lead?.fullName ? `• Cliente: ${lead.fullName} (${lead.phone || ''})\n` : '';
    const projectLine = lead?.projectType ? `• Tipo de proyecto: ${lead.projectType}\n` : '';
    const message =
      `Hola NOVA Ventanas & Puertas,\n\n` +
      `He configurado mi proyecto en la web y solicito estudio técnico:\n` +
      nameLine +
      projectLine +
      `• Solución: ${rec.title}\n` +
      `• Sistema: ${rec.system}\n` +
      `• Material y Acabado: ${rec.material} (${rec.finish})\n` +
      `• Ubicación: ${city}\n\n` +
      `¿Podrían agendar asesoramiento técnico y medición para mi proyecto? Gracias.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  generateCatalogWhatsAppUrl(catalog: NovaPdfCatalog): string {
    const phone = '34613754271';
    const message =
      `Hola NOVA Ventanas & Puertas,\n\n` +
      `Solicito el envío del dossier técnico en español:\n` +
      `• ${catalog.requestSubject}\n\n` +
      `Muchas gracias.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
