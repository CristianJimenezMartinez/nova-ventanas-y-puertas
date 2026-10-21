import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NovaService } from '../../../../core/services/nova.service';
import { SolutionRecommendation, WebLeadSubmission } from '../../../../core/models/nova.model';
import { PortalStoreService } from '../../../../portal/services/portal-store.service';

@Component({
  selector: 'app-solution-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solution-finder.component.html',
  styleUrls: ['./solution-finder.component.scss']
})
export class SolutionFinderComponent {
  private readonly novaService = inject(NovaService);
  private readonly portalStore = inject(PortalStoreService);

  readonly selectedNeed = signal<'ventana' | 'puerta' | 'cerramiento'>('ventana');
  readonly selectedPriority = signal<'aislamiento' | 'diseno' | 'seguridad' | 'eficiencia'>('diseno');

  readonly clientName = signal<string>('');
  readonly clientPhone = signal<string>('');
  readonly clientEmail = signal<string>('');
  readonly clientCity = signal<string>('Murcia');
  readonly projectType = signal<WebLeadSubmission['projectType']>('OBRA_NUEVA');
  readonly leadSubmitted = signal<boolean>(false);

  readonly recommendation = computed<SolutionRecommendation>(() => {
    return this.novaService.getRecommendation(this.selectedNeed(), this.selectedPriority());
  });

  setNeed(need: 'ventana' | 'puerta' | 'cerramiento'): void {
    this.selectedNeed.set(need);
    this.leadSubmitted.set(false);
  }

  setPriority(priority: 'aislamiento' | 'diseno' | 'seguridad' | 'eficiencia'): void {
    this.selectedPriority.set(priority);
    this.leadSubmitted.set(false);
  }

  submitLeadToCrm(): void {
    const rec = this.recommendation();
    const name = this.clientName().trim() || 'Cliente Web NOVA';
    const phone = this.clientPhone().trim() || 'Pendiente confirmar';
    const email = this.clientEmail().trim() || 'sin-email@cliente.es';
    const city = this.clientCity().trim() || 'Murcia';

    this.portalStore.registerWebLead({
      fullName: name,
      phone,
      email,
      city,
      projectType: this.projectType(),
      recommendedSystem: `${rec.title} (${rec.system})`
    });

    this.leadSubmitted.set(true);
  }

  openWhatsAppDirect(): void {
    const rec = this.recommendation();
    const url = this.novaService.generateWhatsAppUrl(rec, {
      fullName: this.clientName(),
      phone: this.clientPhone(),
      email: this.clientEmail(),
      city: this.clientCity(),
      projectType: this.projectType()
    });
    window.open(url, '_blank');
  }
}
