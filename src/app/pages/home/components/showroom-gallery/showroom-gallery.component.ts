import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ShowroomItem {
  id: string;
  title: string;
  location: string;
  solution: string;
  imageUrl: string;
  description: string;
}

interface FinishColor {
  name: string;
  hex: string;
  type: string;
}

interface ShowroomSpotlight {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-showroom-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showroom-gallery.component.html',
  styleUrls: ['./showroom-gallery.component.scss']
})
export class ShowroomGalleryComponent {
  readonly showroomSpotlights: ShowroomSpotlight[] = [
    {
      id: 'fachada',
      title: 'Fachada Principal & Entrada Oficial',
      subtitle: 'Showroom Central en Molina de Segura (Murcia)',
      badge: 'Sede Oficial',
      image: 'assets/images/showroom-fachada.jpg',
      description: 'Revestimiento arquitectónico en antracita mate con rótulo retroiluminado en Oro Champagne y los 5 pilares de ingeniería Nova.',
      tags: ['Diseño', 'Calidad', 'Aislamiento', 'Seguridad', 'Eficiencia']
    },
    {
      id: 'interior',
      title: 'Exposición Interactiva de Materiales',
      subtitle: 'Toca y Comprueba la Diferencia Térmica y Acústica',
      badge: 'Zona de Demostración',
      image: 'assets/images/showroom-interior.jpg',
      description: 'Isla de exposición con los 4 materiales (Aluminio, PVC, Mixto y Madera) y bancos de prueba de apertura corredera, abatible, oscilobatiente y puertas de entrada.',
      tags: ['Aluminio', 'PVC', 'Mixto', 'Madera', 'Aperturas']
    }
  ];
  readonly projects: ShowroomItem[] = [
    {
      id: 'altorreal-villa',
      title: 'Chalet de Diseño en Altorreal',
      location: 'Molina de Segura (Murcia)',
      solution: 'Ventanas PVC Nova Passiv 88 & Correderas Panorámicas',
      imageUrl: 'assets/images/project-altorreal.jpg',
      description: 'Sustitución completa de carpintería antigua por PVC foliado gris antracita con triple vidrio y persianas monoblock motorizadas.'
    },
    {
      id: 'murcia-penthouse',
      title: 'Ático Panorámico en Gran Vía',
      location: 'Murcia Capital',
      solution: 'Cortinas de Cristal Panorama & Cerramiento Térmico',
      imageUrl: 'assets/images/project-atico.jpg',
      description: 'Integración de terraza de 45 m² a la vivienda sin perfiles verticales, logrando máxima luminosidad y estanqueidad contra vientos.'
    },
    {
      id: 'la-manga-residence',
      title: 'Vivienda Vanguardista en La Manga',
      location: 'Costa Cálida (Murcia)',
      solution: 'Aluminio RPT Hoja Oculta & Puerta Acorazada RC3',
      imageUrl: 'assets/images/project-mediterranea.jpg',
      description: 'Protección anticorrosiva especial para ambiente marino con rotura de puente térmico y vidrios con control solar selectivo.'
    },
    {
      id: 'cieza-finca',
      title: 'Rehabilitación Energética Sostenible',
      location: 'Cieza (Murcia)',
      solution: 'Subvención NextGen al 50% con Nova Thermo 76',
      imageUrl: 'assets/images/project-cieza.jpg',
      description: 'Reducción del 58% en consumo de climatización, con gestión 100% integral de las ayudas europeas para el propietario.'
    }
  ];

  readonly finishColors: FinishColor[] = [
    { name: 'Blanco Puro', hex: '#f8fafc', type: 'Clásico' },
    { name: 'Gris Antracita 7016', hex: '#374151', type: 'Tendencia' },
    { name: 'Negro Azabache Mate', hex: '#111827', type: 'Arquitectura' },
    { name: 'Roble Dorado', hex: '#b45309', type: 'Madera Texturada' },
    { name: 'Nogal Natural', hex: '#78350f', type: 'Madera Noble' },
    { name: 'Gris Cuarzo Texturado', hex: '#4b5563', type: 'Efecto Arena' }
  ];

  readonly activeColor = signal<string>('Gris Antracita 7016');

  selectColor(colorName: string): void {
    this.activeColor.set(colorName);
  }
}
