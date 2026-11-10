import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export type LegalDocType = 'aviso' | 'privacidad' | 'cookies' | null;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private readonly router = inject(Router);
  readonly currentYear = new Date().getFullYear();
  readonly activeLegalModal = signal<LegalDocType>(null);

  readonly seoSpecialties = [
    { slug: '/ventanas-pvc-passivhaus', label: 'Ventanas PVC Passivhaus' },
    { slug: '/ventanas-aluminio-hoja-oculta', label: 'Aluminio RPT Hoja Oculta' },
    { slug: '/puertas-pivotantes-acorazadas-rc3', label: 'Puertas Pivotantes & RC3' },
    { slug: '/correderas-elevables-cota-cero', label: 'Correderas Cota Cero' },
    { slug: '/cerramientos-cortinas-cristal-bioclimatica', label: 'Cortinas de Cristal & Bioclimática' },
    { slug: '/ventanas-y-puertas-murcia', label: 'Ventanas y Puertas en Murcia' },
    { slug: '/ventanas-y-puertas-alicante', label: 'Ventanas en Alicante & Costa Blanca' },
    { slug: '/deducciones-irpf-cambio-ventanas', label: 'Deducción IRPF Cambio Ventanas' }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  }

  openLegal(type: LegalDocType): void {
    this.activeLegalModal.set(type);
  }

  closeLegal(): void {
    this.activeLegalModal.set(null);
  }
}
