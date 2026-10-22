import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
  private readonly router = inject(Router);

  readonly mobileSidebarOpen = signal<boolean>(false);
  readonly globalSearchQuery = signal<string>('');
  readonly searchModalOpen = signal<boolean>(false);

  readonly availableRoles: { role: UserRole; label: string }[] = [
    { role: 'SUPERADMIN', label: 'Ver como: Administrador Total (gerencia@gruposoto.es)' },
    { role: 'GERENCIA', label: 'Ver como: Gerente de Sede' },
    { role: 'OFICINA_TECNICA', label: 'Ver como: Oficina Técnica' },
    { role: 'MEDIDOR_OBRA', label: 'Ver como: Almacén y Obra' },
    { role: 'ADMINISTRACION_FACTURACION', label: 'Ver como: Administración' }
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

  onTenantChange(tenantId: string): void {
    this.store.switchActiveTenant(tenantId);
  }

  onRoleChange(role: UserRole): void {
    const found = this.availableRoles.find(r => r.role === role);
    if (found) {
      this.store.setRole(found.role, found.label.replace('Ver como: ', ''));
      if (role === 'MEDIDOR_OBRA') {
        this.router.navigate(['/portal/almacen']);
      }
    }
  }

  signOut(): void {
    this.store.logout();
    this.router.navigate(['/portal/login']);
  }
}
