import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NovaService } from '../../../../core/services/nova.service';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss']
})
export class SolutionsComponent {
  readonly novaService = inject(NovaService);
  readonly solutions = this.novaService.solutions;

  private readonly routeMap: Record<string, string> = {
    ventanas: '/ventanas-aluminio-hoja-oculta',
    puertas: '/puertas-pivotantes-acorazadas-rc3',
    correderas: '/correderas-elevables-cota-cero',
    cerramientos: '/cerramientos-cortinas-cristal-bioclimatica',
    'grandes-formatos': '/ventanas-pvc-passivhaus'
  };

  getLandingRoute(id: string): string {
    return this.routeMap[id] || '/ventanas-pvc-passivhaus';
  }

  scrollToConfigurator(): void {
    const el = document.getElementById('configurador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
