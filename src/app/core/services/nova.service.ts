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
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
      specs: ['Transmitancia Uw hasta 0.72 W/m²K', 'Atenuación acústica hasta -48 dB', 'Hoja oculta de 50 mm']
    },
    {
      id: 'puertas',
      title: 'PUERTAS',
      subtitle: 'La primera impresión de tu arquitectura',
      description: 'Puertas de entrada pivotantes de gran escala y acorazadas certificadas RC3. Integración de paneles enrasados de piedra, aluminio y maderas nobles.',
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=85',
      specs: ['Bisagras pivotantes invisibles', 'Certificación antiefracción RC3', 'Aislamiento térmico perimetral']
    },
    {
      id: 'correderas',
      title: 'CORREDERAS',
      subtitle: 'Fluidez y solera a cota cero',
      description: 'Sistemas elevables y minimalistas con hojas de hasta 400 kg que se desplazan con suavidad milimétrica. El suelo interior y la terraza se convierten en un único plano continuo.',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
      specs: ['Guía empotrada a ras de pavimento', 'Nudo central de solo 25 mm', 'Aperturas de esquina sin poste']
    },
    {
      id: 'cerramientos',
      title: 'CERRAMIENTOS',
      subtitle: 'Disolver los límites entre interior y exterior',
      description: 'Cortinas de cristal sin perfiles verticales y techos móviles de cristal bioclimático que permiten habitar la terraza durante las cuatro estaciones del año.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=85',
      specs: ['Apertura total 100% abatible', 'Vidrio templado securizado 10 mm', 'Estanqueidad certificada']
    },
    {
      id: 'grandes-formatos',
      title: 'GRANDES FORMATOS',
      subtitle: 'Superficies acristaladas de escala monumental',
      description: 'Vidrios de suelo a techo sin travesaños intermedios. Ingeniería estructural para viviendas de diseño contemporáneo que exigen vistas panorámicas limpias.',
      imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=85',
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
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
      features: ['Perfilería de hoja oculta de solo 50 mm vista', 'Poliamidas aislantes tubulares de hasta 35 mm', 'Acabados anodizados y lacados Qualicoat Seaside'],
      quote: 'El lenguaje predilecto de la arquitectura contemporánea.'
    },
    {
      id: 'pvc',
      name: 'PVC',
      headline: 'Hermeticidad absoluta. Eficiencia Passivhaus. Confort inalterable.',
      description: 'Formulado con perfilería alemana de 76 a 88 mm de profundidad y soldadura de esquina invisible. Su baja conductividad natural garantiza el mayor rendimiento térmico del mercado para viviendas de consumo casi nulo.',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
      features: ['Hasta 7 cámaras interiores de aislamiento térmico', 'Triple junta de estanqueidad perimetral de EPDM', 'Uw certificable hasta 0.72 W/m²K para estándar Passivhaus'],
      quote: 'El estándar definitivo de silencio y eficiencia energética.'
    },
    {
      id: 'mixto',
      name: 'MIXTO',
      headline: 'La durabilidad indestructible exterior con la calidez noble interior.',
      description: 'La solución más sofisticada exhibida en nuestro showroom. Estructura exterior de aluminio resistente a la intemperie unida mecánicamente a una sección interior de madera noble maciza tratada con barnices ecológicos.',
      imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1400&q=85',
      features: ['Clipaje técnico que absorbe dilataciones diferenciales', 'Sin condensaciones ni mantenimiento exterior', 'Interior en roble, castaño o pino seleccionado'],
      quote: 'Elegancia interior y resistencia exterior sin compromisos.'
    },
    {
      id: 'madera',
      name: 'MADERA',
      headline: 'Sostenibilidad orgánica. Confort bioclimático. Belleza atemporal.',
      description: 'Madera laminada de perfil europeo tratada contra hongos y humedad con procesos ecológicos. Un material vivo que aporta una calidez insustituible a rehabilitaciones de patrimonio y viviendas singulares.',
      imageUrl: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1400&q=85',
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
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      highlight: 'Líneas mínimas, hoja oculta y proporciones perfectas.'
    },
    {
      id: 'calidad',
      number: '02',
      title: 'CALIDAD',
      subtitle: 'Precisión artesanal e ingeniería europea certificada',
      description: 'Soldaduras de esquina invisibles, herrajes alemanes de altísima durabilidad y ensayos en banco de pruebas que garantizan un comportamiento impecable tras más de 40 años de uso.',
      imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
      highlight: 'Marcado CE, ISO 9001 y 10 años de garantía directa.'
    },
    {
      id: 'aislamiento',
      number: '03',
      title: 'AISLAMIENTO',
      subtitle: 'Silencio acústico y templanza térmica en cualquier estación',
      description: 'Rotura de puente térmico avanzada, triple junta y vidrios selectivos con cámara rellena de gas Argón. El ruido del tráfico o la canícula estival se detienen por completo en la fachada.',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      highlight: 'Atenuación de hasta -48 dB y transmisión térmica de 0.72 W/m²K.'
    },
    {
      id: 'seguridad',
      number: '04',
      title: 'SEGURIDAD',
      subtitle: 'Tranquilidad invisible protegiendo lo más valioso',
      description: 'Puntos de cierre perimetrales con bulones tipo champiñón de acero templado, cerraduras multipunto automáticas y vidrios laminados antirrobo homologados RC2 y RC3.',
      imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85',
      highlight: 'Resistencia contra efracción certificada según normativa europea EN 1627.'
    },
    {
      id: 'eficiencia',
      number: '05',
      title: 'EFICIENCIA ENERGÉTICA',
      subtitle: 'Consumo casi nulo y compromiso sostenible con el entorno',
      description: 'Reducción de hasta un 65% en la factura de climatización. Nuestras carpinterías son aptas para el estándar Passivhaus y gestionamos íntegramente las subvenciones europeas Next Generation.',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
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
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      year: '2025'
    },
    {
      id: 'villa-altorreal',
      title: 'Villa Altorreal',
      location: 'Molina de Segura (Murcia)',
      category: 'viviendas',
      categoryLabel: 'Viviendas',
      systems: 'Ventanas Nova Passiv 88 · Triple Vidrio Control Solar',
      imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
      year: '2025'
    },
    {
      id: 'atico-gran-via',
      title: 'Ático Gran Vía',
      location: 'Murcia Capital',
      category: 'reformas',
      categoryLabel: 'Reformas',
      systems: 'Cortinas de Cristal Panorama · Techo Bioclimático',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      year: '2026'
    },
    {
      id: 'rehabilitacion-cieza',
      title: 'Finca Bioclimática',
      location: 'Cieza (Murcia)',
      category: 'reformas',
      categoryLabel: 'Reformas',
      systems: 'Carpintería Mixta Aluminio-Madera · NextGen EU',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
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
        imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'
      },
      'ventana-diseno': {
        title: 'TU SOLUCIÓN NOVA: Ventana de Aluminio de Hoja Oculta',
        system: 'Aluminio con Rotura de Puente Térmico Minimal',
        material: 'Aluminio RPT Arquitectónico',
        finish: 'Negro Azabache Mate con herrajes integrados',
        benefit: 'Sección vista frontal de solo 50 mm para máxima entrada de luz natural.',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
      },
      'ventana-seguridad': {
        title: 'TU SOLUCIÓN NOVA: Ventana Acorazada de Seguridad RC2/RC3',
        system: 'Herrajes Perimetrales con Bloqueo Automático',
        material: 'Aluminio o PVC Reforzado con Acero',
        finish: 'Gris Grafito Anodizado',
        benefit: 'Bulones tipo champiñón antipalanca y vidrio laminar de seguridad antirrobo.',
        imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80'
      },
      'ventana-eficiencia': {
        title: 'TU SOLUCIÓN NOVA: Sistema Certificado Passivhaus Ready',
        system: 'Ventana Termoaislante con Subvención Next Generation',
        material: 'PVC / Mixto de Alta Densidad',
        finish: 'Blanco Cálido o Roble Natural',
        benefit: 'Reduce el consumo de climatización en un 65% y califica para ayudas europeas.',
        imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80'
      },
      'puerta-seguridad': {
        title: 'TU SOLUCIÓN NOVA: Puerta de Entrada Acorazada Master Gate RC3',
        system: 'Estructura de Acero con Escudo Magnético y Núcleo Aislante',
        material: 'Aluminio Lacado con Alma de Acero',
        finish: 'Antracita Mate con tirador vertical de latón cepillado',
        benefit: 'Protección antiefracción certificada y aislamiento térmico de clase superior.',
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80'
      },
      'puerta-diseno': {
        title: 'TU SOLUCIÓN NOVA: Puerta Pivotante Monumental a Cota Cero',
        system: 'Eje Pivotante Oculto de Gran Formato',
        material: 'Panel Mixto Aluminio y Madera Noble',
        finish: 'Madera de Roble Tostado y Perfilería Negra',
        benefit: 'Apertura fluida en hojas de hasta 3 metros de altura sin bisagras visibles.',
        imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80'
      },
      'cerramiento-diseno': {
        title: 'TU SOLUCIÓN NOVA: Corredera Elevable Panorámica Horizon Slide',
        system: 'Solera Empotrada a Ras de Suelo y Nudo Central Mínimo',
        material: 'Aluminio RPT de Gran Resistencia',
        finish: 'Negro Mate Arquitectónico',
        benefit: 'Conexión limpia entre salón y jardín con deslizamiento suave con un solo dedo.',
        imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
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
