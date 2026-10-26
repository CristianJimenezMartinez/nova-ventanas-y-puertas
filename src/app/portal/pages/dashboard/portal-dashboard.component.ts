import { Component, computed, inject, signal } from '@angular/core';
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

  readonly clientSearchQuery = signal<string>('');
  readonly showNewLeadModal = signal<boolean>(false);
  readonly editingLeadId = signal<string | null>(null);
  readonly leadModalError = signal<string>('');
  readonly newLeadName = signal<string>('');
  readonly newLeadNif = signal<string>('');
  readonly newLeadPhone = signal<string>('');
  readonly newLeadEmail = signal<string>('');
  readonly newLeadCity = signal<string>('');
  readonly newLeadSystem = signal<string>('Carpintería a medida');
  readonly newLeadType = signal<'OBRA_NUEVA' | 'REFORMA_VIVIENDA' | 'SOLO_SUMINISTRO'>('REFORMA_VIVIENDA');

  readonly filteredLeads = computed(() => {
    const q = this.clientSearchQuery().trim().toLowerCase();
    const list = this.store.leads();
    if (!q) return list;
    return list.filter(
      l =>
        l.fullName.toLowerCase().includes(q) ||
        (l.nif && l.nif.toLowerCase().includes(q)) ||
        l.phone.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
    );
  });

  openNewLeadModal(): void {
    this.editingLeadId.set(null);
    this.leadModalError.set('');
    this.newLeadName.set('');
    this.newLeadNif.set('');
    this.newLeadPhone.set('');
    this.newLeadEmail.set('');
    this.newLeadCity.set('');
    this.newLeadSystem.set('Carpintería a medida');
    this.newLeadType.set('REFORMA_VIVIENDA');
    this.showNewLeadModal.set(true);
  }

  openEditLeadModal(lead: CrmLeadItem): void {
    this.editingLeadId.set(lead.id);
    this.leadModalError.set('');
    this.newLeadName.set(lead.fullName);
    this.newLeadNif.set(lead.nif || '');
    this.newLeadPhone.set(lead.phone);
    this.newLeadEmail.set(lead.email);
    this.newLeadCity.set(lead.city);
    this.newLeadSystem.set(lead.recommendedSystem || '');
    const pt = lead.projectType === 'OBRA_NUEVA' || lead.projectType === 'SOLO_SUMINISTRO' ? lead.projectType : 'REFORMA_VIVIENDA';
    this.newLeadType.set(pt);
    this.showNewLeadModal.set(true);
  }

  saveNewLead(): void {
    this.leadModalError.set('');
    const editId = this.editingLeadId();
    if (editId) {
      const res = this.store.updateLead(editId, {
        fullName: this.newLeadName().trim(),
        nif: this.newLeadNif().trim(),
        phone: this.newLeadPhone().trim(),
        email: this.newLeadEmail().trim(),
        city: this.newLeadCity().trim() || 'Murcia',
        projectType: this.newLeadType(),
        recommendedSystem: this.newLeadSystem().trim()
      });
      if (!res.ok) {
        this.leadModalError.set(res.error || 'No se pudo actualizar el cliente.');
        return;
      }
      this.showNewLeadModal.set(false);
      return;
    }

    const res = this.store.registerWebLead(
      {
        fullName: this.newLeadName(),
        nif: this.newLeadNif().trim(),
        phone: this.newLeadPhone().trim(),
        email: this.newLeadEmail().trim(),
        city: this.newLeadCity().trim() || 'Murcia',
        projectType: this.newLeadType(),
        recommendedSystem: this.newLeadSystem().trim() || 'Carpintería a medida'
      },
      { rejectDuplicateEmail: true }
    );
    if (!res.ok) {
      this.leadModalError.set(res.error || 'No se pudo guardar el cliente.');
      return;
    }
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
