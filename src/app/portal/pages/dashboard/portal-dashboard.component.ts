import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PortalStoreService } from '../../services/portal-store.service';
import { CrmLeadItem } from '../../models/portal.models';

@Component({
  selector: 'app-portal-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './portal-dashboard.component.html',
  styleUrls: ['./portal-dashboard.component.scss']
})
export class PortalDashboardComponent {
  readonly store = inject(PortalStoreService);
  private readonly router = inject(Router);

  readonly showNewLeadModal = signal<boolean>(false);
  readonly newLeadName = signal<string>('');
  readonly newLeadNif = signal<string>('');
  readonly newLeadPhone = signal<string>('');
  readonly newLeadEmail = signal<string>('');
  readonly newLeadCity = signal<string>('');
  readonly newLeadSystem = signal<string>('Carpintería a medida');
  readonly newLeadType = signal<'OBRA_NUEVA' | 'REFORMA_VIVIENDA' | 'SOLO_SUMINISTRO'>('REFORMA_VIVIENDA');

  saveNewLead(): void {
    const name = this.newLeadName().trim();
    if (!name) return;
    this.store.registerWebLead({
      fullName: name,
      nif: this.newLeadNif().trim(),
      phone: this.newLeadPhone().trim(),
      email: this.newLeadEmail().trim(),
      city: this.newLeadCity().trim() || 'Murcia',
      projectType: this.newLeadType(),
      recommendedSystem: this.newLeadSystem().trim() || 'Carpintería a medida'
    });
    this.newLeadName.set('');
    this.newLeadNif.set('');
    this.newLeadPhone.set('');
    this.newLeadEmail.set('');
    this.newLeadCity.set('');
    this.showNewLeadModal.set(false);
  }

  createQuoteFromLead(lead: CrmLeadItem): void {
    const pt =
      lead.projectType === 'OBRA_NUEVA' || lead.projectType === 'SOLO_SUMINISTRO'
        ? lead.projectType
        : 'REFORMA_VIVIENDA';
    this.store.security.pendingQuoteDraft.set({
      clientName: lead.fullName,
      clientNif: lead.nif || '',
      clientPhone: lead.phone,
      clientEmail: lead.email,
      workAddress: lead.city,
      projectType: pt
    });
    this.router.navigate(['/portal/presupuestos']);
  }

  deleteLead(id: string): void {
    this.store.removeLead(id);
  }
}
