export interface SolutionCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  specs: string[];
}

export interface MaterialOption {
  id: 'aluminio' | 'pvc' | 'mixto' | 'madera';
  name: string;
  headline: string;
  description: string;
  imageUrl: string;
  features: string[];
  quote: string;
}

export interface BrandValue {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  highlight: string;
}

export interface ArchitecturalProject {
  id: string;
  title: string;
  location: string;
  category: 'viviendas' | 'reformas' | 'grandes-formatos';
  categoryLabel: string;
  systems: string;
  imageUrl: string;
  year: string;
}

export interface SolutionRecommendation {
  title: string;
  system: string;
  material: string;
  finish: string;
  benefit: string;
  imageUrl: string;
}

export interface NovaTechnicalSeries {
  id: string;
  code: string;
  name: string;
  category: 'PVC' | 'ALUMINIO' | 'MIXTO' | 'PUERTAS' | 'CERRAMIENTOS';
  depthMm: string;
  uwValue: string;
  acousticRw: string;
  airTightness: string;
  securityClass: string;
  normative: string;
  summary: string;
  highlights: string[];
}

export interface NovaPdfCatalog {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  pages: number;
  category: string;
  specs: string[];
  requestSubject: string;
}

export interface NovaTechnicalFaq {
  id: string;
  question: string;
  answer: string;
  normativeTag: string;
}

export interface WebLeadSubmission {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  projectType: 'OBRA_NUEVA' | 'REFORMA_INTEGRAL' | 'SUSTITUCION_VENTANAS' | 'ARQUITECTURA_PROFESIONAL';
  need: 'ventana' | 'puerta' | 'cerramiento';
  priority: 'aislamiento' | 'diseno' | 'seguridad' | 'eficiencia';
  recommendedSystem: string;
  notes?: string;
}
