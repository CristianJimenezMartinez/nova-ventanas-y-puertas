export type ProductCategory = 'pvc' | 'aluminio' | 'mixto' | 'madera' | 'puertas' | 'cortinas' | 'techos' | 'persianas';

export interface ProductItem {
  id: string;
  category: ProductCategory;
  name: string;
  series: string;
  headline: string;
  description: string;
  uwValue: string;        // Transmitancia térmica W/m²K
  dbValue: string;        // Atenuación acústica dB
  profileDepth: string;   // Profundidad perfil mm
  chambers?: number;      // Número de cámaras
  airPermeability: string;// Permeabilidad al aire (Clase 4)
  highlights: string[];
  imageUrl: string;
  badge?: string;
  popular?: boolean;
  passivhausReady?: boolean;
}

export interface QuoteRequest {
  propertyType: 'piso' | 'chalet' | 'comercial';
  serviceType: ProductCategory;
  material: 'pvc' | 'aluminio' | 'mixto' | 'madera' | 'indiferente';
  openingType?: 'corredera' | 'abatible' | 'oscilobatiente' | 'puerta' | 'indiferente';
  approximateUnits: string;
  includeInstallation: boolean;
  needsNextGenHelp: boolean;
  clientName: string;
  clientPhone: string;
  clientCity: string;
  notes?: string;
}
