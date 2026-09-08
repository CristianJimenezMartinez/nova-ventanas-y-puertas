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

@Component({
  selector: 'app-showroom-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showroom-gallery.component.html',
  styleUrls: ['./showroom-gallery.component.scss']
})
export class ShowroomGalleryComponent {
  readonly projects: ShowroomItem[] = [
    {
      id: 'altorreal-villa',
      title: 'Chalet de Diseño en Altorreal',
      location: 'Molina de Segura (Murcia)',
      solution: 'Ventanas PVC Nova Passiv 88 & Correderas Panorámicas',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      description: 'Sustitución completa de carpintería antigua por PVC foliado gris antracita con triple vidrio y persianas monoblock motorizadas.'
    },
    {
      id: 'murcia-penthouse',
      title: 'Ático Panorámico en Gran Vía',
      location: 'Murcia Capital',
      solution: 'Cortinas de Cristal Panorama & Cerramiento Térmico',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      description: 'Integración de terraza de 45 m² a la vivienda sin perfiles verticales, logrando máxima luminosidad y estanqueidad contra vientos.'
    },
    {
      id: 'la-manga-residence',
      title: 'Vivienda Vanguardista en La Manga',
      location: 'Costa Cálida (Murcia)',
      solution: 'Aluminio RPT Hoja Oculta & Puerta Acorazada RC3',
      imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80',
      description: 'Protección anticorrosiva especial para ambiente marino con rotura de puente térmico y vidrios con control solar selectivo.'
    },
    {
      id: 'cieza-finca',
      title: 'Rehabilitación Energética Sostenible',
      location: 'Cieza (Murcia)',
      solution: 'Subvención NextGen al 50% con Nova Thermo 76',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
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
