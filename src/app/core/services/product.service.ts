import { Injectable, signal } from '@angular/core';
import { ProductItem, ProductCategory, QuoteRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsData: ProductItem[] = [
    {
      id: 'pvc-thermo-76',
      category: 'pvc',
      name: 'Nova Thermo 76',
      series: 'Gama Confort Premium',
      headline: 'Ventana de PVC con perfilería alemana de 76 mm y 5 cámaras de alto aislamiento',
      description: 'Equilibrio perfecto entre estética depurada, máxima hermeticidad y ahorro energético. Cuenta con soldadura de esquina invisible y doble junta perimetral.',
      uwValue: '0.89 W/m²K',
      dbValue: '45 dB',
      profileDepth: '76 mm',
      chambers: 5,
      airPermeability: 'Clase 4 (Máxima)',
      highlights: [
        'Soldadura de esquina invisible de alta precisión',
        'Doble junta perimetral de estanqueidad',
        'Herraje perimetral de seguridad con bulones tipo champiñón',
        'Compatible con doble y triple acristalamiento bajo emisivo'
      ],
      imageUrl: 'assets/images/material-pvc.jpg',
      badge: 'Más Vendida',
      popular: true,
      passivhausReady: false
    },
    {
      id: 'pvc-passiv-88',
      category: 'pvc',
      name: 'Nova Passiv 88',
      series: 'Gama Passivhaus Certified',
      headline: 'Aislamiento extremo para viviendas de consumo casi nulo (ECCN)',
      description: 'El buque insignia del aislamiento. Perfil de 88 mm con 7 cámaras y triple junta interior de estanqueidad. Ahorra hasta el 65% en climatización y aísla ruidos urbanos severos.',
      uwValue: '0.72 W/m²K',
      dbValue: '48 dB',
      profileDepth: '88 mm',
      chambers: 7,
      airPermeability: 'Clase 4 (Máxima)',
      highlights: [
        'Certificación Passivhaus Ready para máxima eficiencia',
        'Triple junta de goma central para hermeticidad absoluta',
        'Triple vidrio con gas Argón y tratamiento bajo emisivo y control solar',
        'Máxima reducción acústica frente al tráfico pesado'
      ],
      imageUrl: 'assets/images/pilar-eficiencia.jpg',
      badge: 'Estándar Passivhaus',
      popular: true,
      passivhausReady: true
    },
    {
      id: 'alu-minimal-70',
      category: 'aluminio',
      name: 'Nova Alu Minimal 70',
      series: 'Aluminio con RPT',
      headline: 'Líneas ultrafinas con hoja oculta y rotura de puente térmico avanzada',
      description: 'Diseño arquitectónico contemporáneo con una sección vista frontal de solo 50 mm. Mayor superficie acristalada para una entrada masiva de luz natural sin renunciar al confort térmico.',
      uwValue: '1.10 W/m²K',
      dbValue: '42 dB',
      profileDepth: '70 mm',
      airPermeability: 'Clase 4',
      highlights: [
        'Perfil de hoja oculta con vistas mínimas de aluminio',
        'Poliamidas tubulares de 35 mm con inserciones aislantes',
        'Acabados anodizados, lacados texturados y bicolores',
        'Herrajes ocultos integrados para diseño vanguardista'
      ],
      imageUrl: 'assets/images/material-aluminio.jpg',
      badge: 'Diseño Vanguardia',
      popular: true,
      passivhausReady: false
    },
    {
      id: 'alu-horizon-slide',
      category: 'aluminio',
      name: 'Nova Horizon Slide',
      series: 'Corredera Elevable Panorámica',
      headline: 'Grandes cerramientos acristalados de hasta 6 metros con solera a cota cero',
      description: 'Diseñada para fusionar el interior de tu hogar con la terraza o jardín. Mecanismo de elevación que permite desplazar hojas de hasta 400 kg con un solo dedo.',
      uwValue: '1.20 W/m²K',
      dbValue: '40 dB',
      profileDepth: '160 mm',
      airPermeability: 'Clase 4',
      highlights: [
        'Apertura suave y sin esfuerzo mediante palanca elevable',
        'Guía inferior empotrada a ras de suelo sin barreras arquitectónicas',
        'Solapamiento central extrafino de 45 mm para máxima transparencia',
        'Capacidad de acristalamiento de hasta 52 mm de espesor'
      ],
      imageUrl: 'assets/images/solution-correderas.jpg',
      badge: 'Ventanales Panorámicos',
      popular: false,
      passivhausReady: false
    },
    {
      id: 'mixto-aluwood-90',
      category: 'mixto',
      name: 'Nova AluWood Duo 90',
      series: 'Mixto: Aluminio Exterior & Madera Interior',
      headline: 'La durabilidad del aluminio exterior con la calidez noble de la madera interior',
      description: 'El sistema más exclusivo expuesto en nuestro showroom. Marco exterior de aluminio con rotura de puente térmico y perfil interior de madera noble maciza (roble, castaño o pino tratado), sin condensaciones ni mantenimiento exterior.',
      uwValue: '0.82 W/m²K',
      dbValue: '46 dB',
      profileDepth: '92 mm',
      airPermeability: 'Clase 4 (Máxima)',
      highlights: [
        'Madera maciza interior tratada con barnices ecológicos al agua',
        'Clipaje técnico de unión aluminio-madera que absorbe dilataciones',
        'Aislamiento térmico de vanguardia apto para climas exigentes',
        'Disponible en acabados naturales roble, haya, nogal y lacados RAL'
      ],
      imageUrl: 'assets/images/material-mixto.jpg',
      badge: 'Showroom Destacado',
      popular: true,
      passivhausReady: true
    },
    {
      id: 'madera-natura-78',
      category: 'madera',
      name: 'Nova Madera Natura 78',
      series: 'Madera Laminada Tecnológica',
      headline: 'Sostenibilidad natural, diseño atemporal y confort bioclimático',
      description: 'Ventana de madera de perfil europeo laminada en 3 capas que evitan cualquier deformación. Tratamiento fungicida e hidrófugo de última generación con garantía de durabilidad extrema.',
      uwValue: '0.90 W/m²K',
      dbValue: '44 dB',
      profileDepth: '78 mm',
      airPermeability: 'Clase 4',
      highlights: [
        'Madera laminada certificada FSC de gestión forestal sostenible',
        'Doble junta de estanqueidad perimetral de caucho EPDM',
        'Herraje perimetral regulable en 3 dimensiones con microventilación',
        'Ideal para centros históricos, chalets rústicos y casas pasivas'
      ],
      imageUrl: 'assets/images/material-madera.jpg',
      badge: 'Ecológico & Noble',
      popular: false,
      passivhausReady: false
    },
    {
      id: 'door-secure-rc3',
      category: 'puertas',
      name: 'Nova Master Gate RC3',
      series: 'Puertas de Entrada Acorazadas',
      headline: 'Seguridad certificada antiefracción con paneles aislantes de diseño exclusivo',
      description: 'Protege tu vivienda con elegancia. Estructura interna de chapa de acero galvanizado con cilindro antibumping, escudo magnético y núcleo térmico de alta densidad.',
      uwValue: '0.95 W/m²K',
      dbValue: '43 dB',
      profileDepth: '85 mm',
      airPermeability: 'Clase 3',
      highlights: [
        'Cerradura de seguridad multipunto con bloqueo automático',
        'Bisagras reforzadas con pivotes antipalanca',
        'Aislamiento acústico y térmico superior al de puertas convencionales',
        'Acabados en imitación madera, porcelánico, piedra y aluminio lacado'
      ],
      imageUrl: 'assets/images/pilar-seguridad.jpg',
      badge: 'Seguridad RC3',
      popular: true,
      passivhausReady: false
    },
    {
      id: 'glass-curtain-panorama',
      category: 'cortinas',
      name: 'Nova Panorama Glass',
      series: 'Cortinas de Cristal Sin Perfiles',
      headline: 'Cerramientos panorámicos transparentes para balcones, terrazas y porches',
      description: 'Disfruta de tu terraza los 365 días del año. Paneles de vidrio templado de 10 mm deslizantes y abatibles que permiten una apertura del 100% sin perfiles que entorpezcan la vista.',
      uwValue: '5.2 W/m²K',
      dbValue: '36 dB',
      profileDepth: '60 mm',
      airPermeability: 'Clase 2',
      highlights: [
        '100% de apertura abatible en un lateral',
        'Vidrio templado securizado de 10 mm resistente a vientos huracanados',
        'Juntas de policarbonato transparente con protección UV',
        'Instalación rápida sin necesidad de realizar obras complejas'
      ],
      imageUrl: 'assets/images/glass-terrace.jpg',
      badge: 'Vistas 360°',
      popular: false,
      passivhausReady: false
    },
    {
      id: 'roof-bioclimatic',
      category: 'techos',
      name: 'Nova Sky Bioclimatic',
      series: 'Techos Móviles y Pérgolas',
      headline: 'Control solar y ventilación natural para ampliar la zona habitable de tu hogar',
      description: 'Techos motorizados retráctiles con paneles de cristal laminar o panel sándwich aislante. Equipados con sensores automáticos de lluvia y viento para total tranquilidad.',
      uwValue: '1.40 W/m²K',
      dbValue: '35 dB',
      profileDepth: '120 mm',
      airPermeability: 'Estanco',
      highlights: [
        'Apertura motorizada accionable por mando o smartphone',
        'Sensores inteligentes de cierre automático en caso de lluvia',
        'Integración perfecta con cortinas de cristal y luces LED perimetrales',
        'Canalización oculta de desagüe pluvial'
      ],
      imageUrl: 'assets/images/grand-format.jpg',
      badge: 'Solución Exterior',
      popular: false,
      passivhausReady: false
    },
    {
      id: 'roller-tunnel-box',
      category: 'persianas',
      name: 'Nova Tunnel & Screen',
      series: 'Persianas Motorizadas y Cajones Aislantes',
      headline: 'Cajón de persiana túnel monoblock con rotura de puente térmico y mosquitera integrada',
      description: 'El eslabón que elimina las fugas térmicas de las persianas tradicionales. Cajón compacto con aislamiento de poliestireno grafito de alta densidad y lama de aluminio extrusionado con poliuretano.',
      uwValue: '0.85 W/m²K',
      dbValue: '44 dB',
      profileDepth: '200 mm',
      airPermeability: 'Clase 4',
      highlights: [
        'Cajón hermético que elimina el puente térmico habitual de la cinta',
        'Motor silencioso con fin de carrera electrónico y domótica Somfy/Tuya',
        'Mosquitera plisada o enrollable oculta en el mismo registro',
        'Lamas autoblocantes de seguridad antirrobo'
      ],
      imageUrl: 'assets/images/window-detail.jpg',
      badge: 'Aislamiento Monoblock',
      popular: false,
      passivhausReady: true
    }
  ];

  readonly products = signal<ProductItem[]>(this.productsData);
  readonly selectedCategory = signal<ProductCategory | 'all'>('all');

  filterCategory(category: ProductCategory | 'all'): void {
    this.selectedCategory.set(category);
  }

  getFilteredProducts(): ProductItem[] {
    const cat = this.selectedCategory();
    if (cat === 'all') {
      return this.products();
    }
    return this.products().filter(p => p.category === cat);
  }

  generateWhatsAppUrl(quote: Partial<QuoteRequest>): string {
    const phone = '34613754271'; // Gerencia Grupo Soto
    let message = `Hola Grupo Soto / Nova Ventanas y Puertas, solicito presupuesto para:\n\n`;
    
    if (quote.serviceType) {
      const typeNames: Record<ProductCategory, string> = {
        pvc: 'Ventanas de PVC',
        aluminio: 'Ventanas de Aluminio RPT',
        mixto: 'Ventanas Mixtas (Aluminio-Madera)',
        madera: 'Ventanas de Madera Noble Tecnológica',
        puertas: 'Puertas de Entrada / Acorazadas',
        cortinas: 'Cortinas de Cristal',
        techos: 'Techos Móviles / Pérgola',
        persianas: 'Persianas Motorizadas / Mosquiteras'
      };
      message += `• Tipo de Cerramiento: ${typeNames[quote.serviceType] || quote.serviceType}\n`;
    }
    if (quote.material) {
      message += `• Material: ${quote.material.toUpperCase()}\n`;
    }
    if (quote.openingType && quote.openingType !== 'indiferente') {
      message += `• Sistema de Apertura: ${quote.openingType.toUpperCase()}\n`;
    }
    if (quote.propertyType) {
      message += `• Vivienda: ${quote.propertyType.toUpperCase()}\n`;
    }
    if (quote.approximateUnits) {
      message += `• Cantidad aprox.: ${quote.approximateUnits}\n`;
    }
    if (quote.needsNextGenHelp) {
      message += `• Interesado en Ayudas Next Generation: Sí (Subvención hasta 4.000€)\n`;
    }
    if (quote.clientCity) {
      message += `• Ubicación / Municipio: ${quote.clientCity}\n`;
    }
    if (quote.clientName) {
      message += `• Nombre: ${quote.clientName}\n`;
    }
    message += `\n¿Podrían darme asesoramiento técnico y visita gratuita de medición? Gracias.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
