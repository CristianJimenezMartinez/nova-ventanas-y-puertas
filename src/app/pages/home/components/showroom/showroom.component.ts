import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ShowroomGalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  points: string[];
}

@Component({
  selector: 'app-showroom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showroom.component.html',
  styleUrls: ['./showroom.component.scss']
})
export class ShowroomComponent {
  readonly items: ShowroomGalleryItem[] = [
    {
      id: 'fachada',
      title: 'Fachada Principal & Entrada Oficial',
      category: 'SEDE CENTRAL',
      description: 'Revestimiento arquitectónico en antracita mate, rótulo institucional retroiluminado en Oro Champagne y la columna con los cinco pilares de ingeniería Nova.',
      image: 'assets/images/showroom-fachada.jpg',
      points: [
        'Rótulo institucional retroiluminado',
        'Acceso directo y aparcamiento privado',
        'Los 5 pilares de ingeniería esculpidos'
      ]
    },
    {
      id: 'interior',
      title: 'Exposición Interactiva de Materiales',
      category: 'ZONA DE ASESORAMIENTO',
      description: 'Una experiencia sensorial completa: isla central con muestras de Aluminio, PVC, Mixto y Madera, módulos de apertura a escala real y zona de estudio de planos.',
      image: 'assets/images/showroom-interior.jpg',
      points: [
        'Los 4 materiales nobles expuestos al tacto',
        'Bancos funcionales de corredera, abatible y oscilobatiente',
        'Mesa de asesoramiento técnico con ingenieros de Grupo Soto'
      ]
    }
  ];

  openAppointmentWhatsApp(): void {
    const text = 'Hola NOVA Ventanas & Puertas, deseo agendar una visita privada a vuestro Showroom de Molina de Segura para estudiar el proyecto de mi vivienda.';
    window.open(`https://wa.me/34613754271?text=${encodeURIComponent(text)}`, '_blank');
  }
}
