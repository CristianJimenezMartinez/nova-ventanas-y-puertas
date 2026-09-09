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
