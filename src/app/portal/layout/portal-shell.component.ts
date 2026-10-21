import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortalStoreService } from '../services/portal-store.service';
import { UserRole } from '../models/portal.models';

@Component({
  selector: 'app-portal-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './portal-shell.component.html',
  styleUrls: ['./portal-shell.component.scss']
})
export class PortalShellComponent {
  readonly store = inject(PortalStoreService);

  readonly mobileSidebarOpen = signal<boolean>(false);
  readonly globalSearchQuery = signal<string>('');
  readonly searchModalOpen = signal<boolean>(false);

  readonly availableRoles: { role: UserRole; label: string }[] = [
    { role: 'GERENCIA', label: 'Gerencia & Dirección' },
    { role: 'OFICINA_TECNICA', label: 'Oficina Técnica & Presupuestos' },
    { role: 'COMERCIAL', label: 'Showroom & Ventas' },
    { role: 'MEDIDOR_OBRA', label: 'Medidor / Almacén Obra' },
    { role: 'ADMINISTRACION_FACTURACION', label: 'Administración & VeriFactu' }
  ];

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchModalOpen.set(!this.searchModalOpen());
    } else if (event.key === 'Escape' && this.searchModalOpen()) {
      this.searchModalOpen.set(false);
    }
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.set(!this.mobileSidebarOpen());
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  onRoleChange(role: UserRole): void {
    const found = this.availableRoles.find(r => r.role === role);
    if (found) {
      this.store.setRole(found.role, found.label);
    }
  }
}
