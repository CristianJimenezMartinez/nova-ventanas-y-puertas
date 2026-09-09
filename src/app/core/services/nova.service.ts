import { Injectable, signal } from '@angular/core';
import { 
  SolutionCategory, 
  MaterialOption, 
  BrandValue, 
  ArchitecturalProject, 
  SolutionRecommendation 
} from '../models/nova.model';

@Injectable({
  providedIn: 'root'
})
export class NovaService {
  /* ========================================================================
     Soluciones para Cada Espacio
     ======================================================================== */
  readonly solutions: SolutionCategory[] = [
    {
      id: 'ventanas',
      title: 'VENTANAS',
      subtitle: 'Luz, proporción y confort en cada espacio',
      description: 'Perfilería de sección mínima con hoja oculta que diluye los límites del marco. Máxima entrada de luz solar con aislamiento térmico y acústico insuperable.',
      imageUrl: 'assets/images/solution-ventanas.jpg',
      specs: ['Transmitancia Uw hasta 0.72 W/m²K', 'Atenuación acústica hasta -48 dB', 'Hoja oculta de 50 mm']
    },
    {
      id: 'puertas',
      title: 'PUERTAS',
      subtitle: 'La primera impresión de tu arquitectura',
      description: 'Puertas de entrada pivotantes de gran escala y acorazadas certificadas RC3. Integración de paneles enrasados de piedra, aluminio y maderas nobles.',
      imageUrl: 'assets/images/solution-puertas.jpg',
      specs: ['Bisagras pivotantes invisibles', 'Certificación antiefracción RC3', 'Aislamiento térmico perimetral']
    },
    {
      id: 'correderas',
      title: 'CORREDERAS',
      subtitle: 'Fluidez y solera a cota cero',
      description: 'Sistemas elevables y minimalistas con hojas de hasta 400 kg que se desplazan con suavidad milimétrica. El suelo interior y la terraza se convierten en un único plano continuo.',
      imageUrl: 'assets/images/solution-correderas.jpg',
      specs: ['Guía empotrada a ras de pavimento', 'Nudo central de solo 25 mm', 'Aperturas de esquina sin poste']
    },
    {
      id: 'cerramientos',
      title: 'CERRAMIENTOS',
      subtitle: 'Disolver los límites entre interior y exterior',
      description: 'Cortinas de cristal sin perfiles verticales y techos móviles de cristal bioclimático que permiten habitar la terraza durante las cuatro estaciones del año.',
      imageUrl: 'assets/images/glass-terrace.jpg',
      specs: ['Apertura total 100% abatible', 'Vidrio templado securizado 10 mm', 'Estanqueidad certificada']
    },
    {
      id: 'grandes-formatos',
      title: 'GRANDES FORMATOS',
      subtitle: 'Superficies acristaladas de escala monumental',
      description: 'Vidrios de suelo a techo sin travesaños intermedios. Ingeniería estructural para viviendas de diseño contemporáneo que exigen vistas panorámicas limpias.',
      imageUrl: 'assets/images/grand-format.jpg',
      specs: ['Acristalamientos de hasta 6 metros', 'Triple vidrio bajo emisivo con argón', 'Control solar selectivo']
    }
  ];

  /* ========================================================================
     Los Cuatro Materiales (Showroom Oficial)
     ======================================================================== */
  readonly materials: MaterialOption[] = [
    {
      id: 'aluminio',
      name: 'ALUMINIO',
      headline: 'Líneas limpias. Grandes dimensiones. Máxima libertad arquitectónica.',
      description: 'La aleación de aluminio con rotura de puente térmico (RPT) de última generación permite secciones de perfil ultrafinas, soportando grandes pesos de vidrio con una estabilidad dimensional inalterable.',
      imageUrl: 'assets/images/material-aluminio.jpg',
      features: ['Perfilería de hoja oculta de solo 50 mm vista', 'Poliamidas aislantes tubulares de hasta 35 mm', 'Acabados anodizados y lacados Qualicoat Seaside'],
      quote: 'El lenguaje predilecto de la arquitectura contemporánea.'
    },
    {
      id: 'pvc',
      name: 'PVC',
      headline: 'Hermeticidad absoluta. Eficiencia Passivhaus. Confort inalterable.',
      description: 'Formulado con perfilería alemana de 76 a 88 mm de profundidad y soldadura de esquina invisible. Su baja conductividad natural garantiza el mayor rendimiento térmico del mercado para viviendas de consumo casi nulo.',
      imageUrl: 'assets/images/material-pvc.jpg',
      features: ['Hasta 7 cámaras interiores de aislamiento térmico', 'Triple junta de estanqueidad perimetral de EPDM', 'Uw certificable hasta 0.72 W/m²K para estándar Passivhaus'],
      quote: 'El estándar definitivo de silencio y eficiencia energética.'
    },
    {
      id: 'mixto',
      name: 'MIXTO',
      headline: 'La durabilidad indestructible exterior con la calidez noble interior.',
      description: 'La solución más sofisticada exhibida en nuestro showroom. Estructura exterior de aluminio resistente a la intemperie unida mecánicamente a una sección interior de madera noble maciza tratada con barnices ecológicos.',
      imageUrl: 'assets/images/material-mixto.jpg',
      features: ['Clipaje técnico que absorbe dilataciones diferenciales', 'Sin condensaciones ni mantenimiento exterior', 'Interior en roble, castaño o pino seleccionado'],
      quote: 'Elegancia interior y resistencia exterior sin compromisos.'
    },
    {
      id: 'madera',
      name: 'MADERA',
      headline: 'Sostenibilidad orgánica. Confort bioclimático. Belleza atemporal.',
      description: 'Madera laminada de perfil europeo tratada contra hongos y humedad con procesos ecológicos. Un material vivo que aporta una calidez insustituible a rehabilitaciones de patrimonio y viviendas singulares.',
      imageUrl: 'assets/images/material-madera.jpg',
      features: ['Madera laminada en 3 capas que previene torsiones', 'Certificación forestal sostenible FSC / PEFC', 'Atenuación acústica natural superior'],
      quote: 'La autenticidad noble de la materia viva.'
    }
  ];

  /* ========================================================================
     Los 5 Valores de NOVA (Columna del Showroom)
     ======================================================================== */
  readonly values: BrandValue[] = [
    {
      id: 'diseno',
      number: '01',
      title: 'DISEÑO',
      subtitle: 'La arquitectura empieza mucho antes de colocar una ventana',
      description: 'Cada sección, perfil y ensamblaje se concibe para integrarse en las líneas de la vivienda. Eliminamos lo superfluo para que la luz y el paisaje sean los auténticos protagonistas.',
      imageUrl: 'assets/images/pilar-diseno.jpg',
      highlight: 'Líneas mínimas, hoja oculta y proporciones perfectas.'
    },
    {
      id: 'calidad',
      number: '02',
      title: 'CALIDAD',
      subtitle: 'Precisión artesanal e ingeniería europea certificada',
      description: 'Soldaduras de esquina invisibles, herrajes alemanes de altísima durabilidad y ensayos en banco de pruebas que garantizan un comportamiento impecable tras más de 40 años de uso.',
      imageUrl: 'assets/images/pilar-calidad.jpg',
      highlight: 'Marcado CE, ISO 9001 y 10 años de garantía directa.'
    },
    {
      id: 'aislamiento',
      number: '03',
      title: 'AISLAMIENTO',
      subtitle: 'Silencio acústico y templanza térmica en cualquier estación',
      description: 'Rotura de puente térmico avanzada, triple junta y vidrios selectivos con cámara rellena de gas Argón. El ruido del tráfico o la canícula estival se detienen por completo en la fachada.',
      imageUrl: 'assets/images/pilar-aislamiento.jpg',
      highlight: 'Atenuación de hasta -48 dB y transmisión térmica de 0.72 W/m²K.'
    },
    {
      id: 'seguridad',
      number: '04',
      title: 'SEGURIDAD',
      subtitle: 'Tranquilidad invisible protegiendo lo más valioso',
      description: 'Puntos de cierre perimetrales con bulones tipo champiñón de acero templado, cerraduras multipunto automáticas y vidrios laminados antirrobo homologados RC2 y RC3.',
      imageUrl: 'assets/images/pilar-seguridad.jpg',
      highlight: 'Resistencia contra efracción certificada según normativa europea EN 1627.'
    },
    {
      id: 'eficiencia',
      number: '05',
      title: 'EFICIENCIA ENERGÉTICA',
      subtitle: 'Consumo casi nulo y compromiso sostenible con el entorno',
      description: 'Reducción de hasta un 65% en la factura de climatización. Nuestras carpinterías son aptas para el estándar Passivhaus y gestionamos íntegramente las subvenciones europeas Next Generation.',
      imageUrl: 'assets/images/pilar-eficiencia.jpg',
      highlight: 'Ahorro energético medible y hasta 4.000 € de subvención directa.'
    }
  ];

  /* ========================================================================
     Proyectos Arquitectónicos Realizados
     ======================================================================== */
  readonly projects: ArchitecturalProject[] = [
    {
      id: 'casa-mediterranea',
      title: 'Casa Mediterránea',
      location: 'Alicante / Costa Blanca',
      category: 'grandes-formatos',
      categoryLabel: 'Grandes Formatos',
      systems: 'Correderas Elevables · Aluminio RPT Oculto',
      imageUrl: 'assets/images/project-mediterranea.jpg',
      year: '2025'
    },
    {
      id: 'villa-altorreal',
      title: 'Villa Altorreal',
      location: 'Molina de Segura (Murcia)',
      category: 'viviendas',
      categoryLabel: 'Viviendas',
      systems: 'Ventanas Nova Passiv 88 · Triple Vidrio Control Solar',
      imageUrl: 'assets/images/project-altorreal.jpg',
      year: '2025'
    },
    {
      id: 'atico-gran-via',
      title: 'Ático Gran Vía',
      location: 'Murcia Capital',
      category: 'reformas',
      categoryLabel: 'Reformas',
      systems: 'Cortinas de Cristal Panorama · Techo Bioclimático',
      imageUrl: 'assets/images/project-atico.jpg',
      year: '2026'
    },
    {
      id: 'rehabilitacion-cieza',
      title: 'Finca Bioclimática',
      location: 'Cieza (Murcia)',
      category: 'reformas',
      categoryLabel: 'Reformas',
      systems: 'Carpintería Mixta Aluminio-Madera · NextGen EU',
      imageUrl: 'assets/images/project-cieza.jpg',
      year: '2025'
    }
  ];

  /* ========================================================================
     Recomendador de Solución (Selector Visual)
     ======================================================================== */
  getRecommendation(need: 'ventana' | 'puerta' | 'cerramiento', priority: 'aislamiento' | 'diseno' | 'seguridad' | 'eficiencia'): SolutionRecommendation {
    const recommendations: Record<string, SolutionRecommendation> = {
      'ventana-aislamiento': {
        title: 'TU SOLUCIÓN NOVA: Ventana Passiv 88 con Triple Vidrio Acústico',
        system: 'PVC Alemán de 7 Cámaras con 88 mm de Profundidad',
        material: 'PVC con Soldadura Invisible',
        finish: 'Gris Antracita 7016 Texturado',
        benefit: 'Aislamiento acústico extremo de 48 dB y transmisión térmica Uw de 0.72 W/m²K.',
        imageUrl: 'assets/images/material-pvc.jpg'
      },
      'ventana-diseno': {
        title: 'TU SOLUCIÓN NOVA: Ventana de Aluminio de Hoja Oculta',
        system: 'Aluminio con Rotura de Puente Térmico Minimal',
        material: 'Aluminio RPT Arquitectónico',
        finish: 'Negro Azabache Mate con herrajes integrados',
        benefit: 'Sección vista frontal de solo 50 mm para máxima entrada de luz natural.',
        imageUrl: 'assets/images/material-aluminio.jpg'
      },
      'ventana-seguridad': {
        title: 'TU SOLUCIÓN NOVA: Ventana Acorazada de Seguridad RC2/RC3',
        system: 'Herrajes Perimetrales con Bloqueo Automático',
        material: 'Aluminio o PVC Reforzado con Acero',
        finish: 'Gris Grafito Anodizado',
        benefit: 'Bulones tipo champiñón antipalanca y vidrio laminar de seguridad antirrobo.',
        imageUrl: 'assets/images/pilar-seguridad.jpg'
      },
      'ventana-eficiencia': {
        title: 'TU SOLUCIÓN NOVA: Sistema Certificado Passivhaus Ready',
        system: 'Ventana Termoaislante con Subvención Next Generation',
        material: 'PVC / Mixto de Alta Densidad',
        finish: 'Blanco Cálido o Roble Natural',
        benefit: 'Reduce el consumo de climatización en un 65% y califica para ayudas europeas.',
        imageUrl: 'assets/images/pilar-eficiencia.jpg'
      },
      'puerta-seguridad': {
        title: 'TU SOLUCIÓN NOVA: Puerta de Entrada Acorazada Master Gate RC3',
        system: 'Estructura de Acero con Escudo Magnético y Núcleo Aislante',
        material: 'Aluminio Lacado con Alma de Acero',
        finish: 'Antracita Mate con tirador vertical de latón cepillado',
        benefit: 'Protección antiefracción certificada y aislamiento térmico de clase superior.',
        imageUrl: 'assets/images/pivot-door.jpg'
      },
      'puerta-diseno': {
        title: 'TU SOLUCIÓN NOVA: Puerta Pivotante Monumental a Cota Cero',
        system: 'Eje Pivotante Oculto de Gran Formato',
        material: 'Panel Mixto Aluminio y Madera Noble',
        finish: 'Madera de Roble Tostado y Perfilería Negra',
        benefit: 'Apertura fluida en hojas de hasta 3 metros de altura sin bisagras visibles.',
        imageUrl: 'assets/images/solution-puertas.jpg'
      },
      'cerramiento-diseno': {
        title: 'TU SOLUCIÓN NOVA: Corredera Elevable Panorámica Horizon Slide',
        system: 'Solera Empotrada a Ras de Suelo y Nudo Central Mínimo',
        material: 'Aluminio RPT de Gran Resistencia',
        finish: 'Negro Mate Arquitectónico',
        benefit: 'Conexión limpia entre salón y jardín con deslizamiento suave con un solo dedo.',
        imageUrl: 'assets/images/solution-correderas.jpg'
      }
    };

    const key = `${need}-${priority}`;
    return recommendations[key] || recommendations['ventana-diseno'];
  }

  generateWhatsAppUrl(rec: SolutionRecommendation, clientCity = 'Murcia'): string {
    const phone = '34613754271';
    const message = `Hola NOVA Ventanas & Puertas,\n\nHe configurado mi proyecto en la web y me interesa:\n• Solución: ${rec.title}\n• Sistema: ${rec.system}\n• Material y Acabado: ${rec.material} (${rec.finish})\n• Ubicación: ${clientCity}\n\n¿Podrían darme asesoramiento técnico y visita de medición para mi vivienda? Gracias.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
