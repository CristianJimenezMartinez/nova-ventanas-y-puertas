import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovaService } from '../../../../core/services/nova.service';
import { MaterialOption } from '../../../../core/models/nova.model';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent {
  private readonly novaService = inject(NovaService);
  readonly materials = this.novaService.materials;

  readonly activeMaterialId = signal<'aluminio' | 'pvc' | 'mixto' | 'madera'>('aluminio');

  readonly activeMaterial = computed<MaterialOption>(() => {
    return this.materials.find(m => m.id === this.activeMaterialId()) || this.materials[0];
  });

  selectMaterial(id: 'aluminio' | 'pvc' | 'mixto' | 'madera'): void {
    this.activeMaterialId.set(id);
  }

  scrollToConfigurator(): void {
    const el = document.getElementById('configurador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
