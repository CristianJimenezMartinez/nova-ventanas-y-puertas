import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NovaService } from '../../../../core/services/nova.service';
import { SolutionRecommendation } from '../../../../core/models/nova.model';

@Component({
  selector: 'app-solution-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solution-finder.component.html',
  styleUrls: ['./solution-finder.component.scss']
})
export class SolutionFinderComponent {
  private readonly novaService = inject(NovaService);

  readonly selectedNeed = signal<'ventana' | 'puerta' | 'cerramiento'>('ventana');
  readonly selectedPriority = signal<'aislamiento' | 'diseno' | 'seguridad' | 'eficiencia'>('diseno');
  readonly clientCity = signal<string>('Murcia');

  readonly recommendation = computed<SolutionRecommendation>(() => {
    return this.novaService.getRecommendation(this.selectedNeed(), this.selectedPriority());
  });

  setNeed(need: 'ventana' | 'puerta' | 'cerramiento'): void {
    this.selectedNeed.set(need);
  }

  setPriority(priority: 'aislamiento' | 'diseno' | 'seguridad' | 'eficiencia'): void {
    this.selectedPriority.set(priority);
  }

  requestInfo(): void {
    const url = this.novaService.generateWhatsAppUrl(this.recommendation(), this.clientCity());
    window.open(url, '_blank');
  }
}
