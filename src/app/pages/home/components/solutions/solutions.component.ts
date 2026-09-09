import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovaService } from '../../../../core/services/nova.service';
import { SolutionCategory } from '../../../../core/models/nova.model';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss']
})
export class SolutionsComponent {
  readonly novaService = inject(NovaService);
  readonly solutions = this.novaService.solutions;

  scrollToConfigurator(): void {
    const el = document.getElementById('configurador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
