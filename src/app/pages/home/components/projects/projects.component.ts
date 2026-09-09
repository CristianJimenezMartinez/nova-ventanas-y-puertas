import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovaService } from '../../../../core/services/nova.service';
import { ArchitecturalProject } from '../../../../core/models/nova.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  private readonly novaService = inject(NovaService);
  readonly allProjects = this.novaService.projects;

  readonly activeFilter = signal<'todos' | 'viviendas' | 'reformas' | 'grandes-formatos'>('todos');

  readonly filteredProjects = computed<ArchitecturalProject[]>(() => {
    const filter = this.activeFilter();
    if (filter === 'todos') {
      return this.allProjects;
    }
    return this.allProjects.filter(p => p.category === filter);
  });

  setFilter(filter: 'todos' | 'viviendas' | 'reformas' | 'grandes-formatos'): void {
    this.activeFilter.set(filter);
  }

  scrollToConfigurator(): void {
    const el = document.getElementById('configurador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
