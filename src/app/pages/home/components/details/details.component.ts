import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DetailBlock {
  id: string;
  number: string;
  title: string;
  caption: string;
  lead: string;
  description: string;
  imageUrl: string;
  specs: string[];
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  readonly blocks: DetailBlock[] = [
    {
      id: 'ventanas',
      number: '01',
      title: 'VENTANAS',
      caption: 'Luz, proporción y confort en cada espacio',
      lead: 'Una ventana no es simplemente un cerramiento; es el marco a través del cual la arquitectura dialoga con el paisaje y la luz natural.',
      description: 'Cuidamos cada milímetro: soldaduras invisibles, sección vista frontal reducida a 50 mm y herrajes perimetrales que garantizan un cierre hermético sin resistencia mecánica.',
      imageUrl: 'assets/images/window-detail.jpg',
      specs: ['Rotura de Puente Térmico Avanzada', 'Transmitancia Uw hasta 0.72 W/m²K', 'Vidrio Bajo Emisivo con Gas Argón']
    },
    {
      id: 'puertas',
      number: '02',
      title: 'PUERTAS',
      caption: 'La primera impresión de tu arquitectura',
      lead: 'El punto de contacto inicial con el hogar. Una presencia monumental que transmite solidez, diseño y protección inquebrantable.',
      description: 'Sistemas pivotantes de gran altura con bisagras invisibles empotradas a suelo y techo, combinados con blindajes acorazados certificados RC3 y núcleos térmicos de alta densidad.',
      imageUrl: 'assets/images/pivot-door.jpg',
      specs: ['Hojas de hasta 3 metros de altura', 'Certificación Antiefracción RC3', 'Paneles de piedra, madera noble y aluminio']
    },
    {
      id: 'cerramientos',
      number: '03',
      title: 'CERRAMIENTOS',
      caption: 'Disolver los límites entre interior y exterior',
      lead: 'Grandes paños acristalados que se desvanecen para convertir el jardín o la terraza en una extensión natural del salón.',
      description: 'Correderas elevables con guía oculta a cota cero y cortinas de cristal sin perfilería vertical. Movimiento ingrávido y estanqueidad contra el viento y la lluvia.',
      imageUrl: 'assets/images/sliding-doors.jpg',
      specs: ['Solera empotrada sin barreras', 'Nudo central ultrafino de 25 mm', 'Apertura panorámica del 100%']
    }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
