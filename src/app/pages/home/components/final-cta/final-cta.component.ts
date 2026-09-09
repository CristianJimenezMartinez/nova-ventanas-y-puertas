import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-cta.component.html',
  styleUrls: ['./final-cta.component.scss']
})
export class FinalCtaComponent {
  scrollToConfigurator(): void {
    const el = document.getElementById('configurador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openWhatsApp(): void {
    const text = 'Hola NOVA Ventanas & Puertas, deseo solicitar presupuesto e información técnica para mi proyecto.';
    window.open(`https://wa.me/34613754271?text=${encodeURIComponent(text)}`, '_blank');
  }
}
