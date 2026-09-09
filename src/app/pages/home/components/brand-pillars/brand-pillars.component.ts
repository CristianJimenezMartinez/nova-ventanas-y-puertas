import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PillarItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  iconSvg: string;
}

@Component({
  selector: 'app-brand-pillars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-pillars.component.html',
  styleUrls: ['./brand-pillars.component.scss']
})
export class BrandPillarsComponent {
  readonly pillars: PillarItem[] = [
    {
      id: 'diseno',
      title: 'DISEÑO',
      subtitle: 'Líneas Esbeltas',
      desc: 'Carpinterías de hoja oculta y perfilería minimalista que maximizan la superficie acristalada y la luz natural.',
      iconSvg: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
    },
    {
      id: 'calidad',
      title: 'CALIDAD',
      subtitle: 'Precisión Alemana',
      desc: 'Marcado CE, soldadura de esquina invisible y ensayos de resistencia certificados para más de 40 años.',
      iconSvg: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'
    },
    {
      id: 'aislamiento',
      title: 'AISLAMIENTO',
      subtitle: 'Confort Acústico & Térmico',
      desc: 'Rotura de puente térmico RPT, triple vidrio con gas argón y atenuación de hasta 48 dB contra el ruido exterior.',
      iconSvg: 'M12 3v18m-9-9h18'
    },
    {
      id: 'seguridad',
      title: 'SEGURIDAD',
      subtitle: 'Protección RC2 / RC3',
      desc: 'Herrajes perimetrales con bulones champiñón antipalanca, vidrios laminares y escudos de alta resistencia.',
      iconSvg: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    },
    {
      id: 'eficiencia',
      title: 'EFICIENCIA ENERGÉTICA',
      subtitle: 'Estándar Passivhaus',
      desc: 'Transmitancia térmica de hasta 0.72 W/m²K. Reduce hasta un 65% el gasto energético con subvención NextGen.',
      iconSvg: 'M13 10V3L4 14h7v7l9-11h-7z'
    }
  ];
}
