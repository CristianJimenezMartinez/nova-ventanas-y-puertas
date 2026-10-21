import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovaService } from '../../../../core/services/nova.service';
import { NovaPdfCatalog, NovaTechnicalSeries } from '../../../../core/models/nova.model';

@Component({
  selector: 'app-technical-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technical-catalog.component.html',
  styleUrls: ['./technical-catalog.component.scss']
})
export class TechnicalCatalogComponent {
  private readonly novaService = inject(NovaService);

  readonly allSeries = this.novaService.technicalSeries;
  readonly pdfCatalogs = this.novaService.pdfCatalogs;
  readonly technicalFaqs = this.novaService.technicalFaqs;

  readonly selectedCategory = signal<'TODAS' | 'PVC' | 'ALUMINIO' | 'MIXTO' | 'PUERTAS' | 'CERRAMIENTOS'>('TODAS');
  readonly openFaqId = signal<string>('faq-1');

  readonly filteredSeries = computed<NovaTechnicalSeries[]>(() => {
    const cat = this.selectedCategory();
    if (cat === 'TODAS') {
      return this.allSeries;
    }
    return this.allSeries.filter(s => s.category === cat);
  });

  setCategory(cat: 'TODAS' | 'PVC' | 'ALUMINIO' | 'MIXTO' | 'PUERTAS' | 'CERRAMIENTOS'): void {
    this.selectedCategory.set(cat);
  }

  toggleFaq(id: string): void {
    this.openFaqId.set(this.openFaqId() === id ? '' : id);
  }

  requestCatalog(catalog: NovaPdfCatalog): void {
    const url = this.novaService.generateCatalogWhatsAppUrl(catalog);
    window.open(url, '_blank');
  }

  scrollToConfigurator(): void {
    const el = document.getElementById('configurador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
