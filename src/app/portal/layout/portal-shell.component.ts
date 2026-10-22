import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PortalStoreService } from '../services/portal-store.service';
import { UserRole } from '../models/portal.models';

export interface PortalNavItem {
  moduleKey: 'dashboard' | 'presupuestos' | 'almacen' | 'facturacion' | 'catalogo' | 'correos' | 'empresas' | 'documentacion';
  label: string;
  route: string;
  showWarehouseBadge?: boolean;
}

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

  // Distribución fija e invariable del menú lateral en todos los apartados
  readonly navItems: PortalNavItem[] = [
    { moduleKey: 'dashboard', label: 'Inicio', route: '/portal/dashboard' },
    { moduleKey: 'presupuestos', label: 'Presupuestos', route: '/portal/presupuestos' },
    { moduleKey: 'almacen', label: 'Almacén', route: '/portal/almacen', showWarehouseBadge: true },
    { moduleKey: 'facturacion', label: 'Facturas', route: '/portal/facturacion' },
    { moduleKey: 'catalogo', label: 'Catálogo y Tarifas', route: '/portal/catalogo' },
    { moduleKey: 'correos', label: 'Correos', route: '/portal/correos' },
    { moduleKey: 'empresas', label: 'Empresas y Usuarios', route: '/portal/empresas' },
    { moduleKey: 'documentacion', label: 'Documentación', route: '/portal/documentacion' }
  ];

  readonly availableRoles: { role: UserRole; label: string }[] = [
    { role: 'SUPERADMIN', label: 'Ver como: Superadministrador Central' },
    { role: 'GERENCIA', label: 'Ver como: Gerente de Sede' },
    { role: 'OFICINA_TECNICA', label: 'Ver como: Comercial y Presupuestos' },
    { role: 'ALMACEN_OBRA', label: 'Ver como: Almacén y Obra' },
    { role: 'ADMINISTRACION', label: 'Ver como: Administración y Facturas' }
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

  canAccess(moduleKey: PortalNavItem['moduleKey']): boolean {
    if (moduleKey === 'documentacion') return true;
    return this.store.security.canAccessModule(this.store.currentUser().role, moduleKey);
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
      const currentUrl = this.router.url;
      const activeItem = this.navItems.find(item => currentUrl.startsWith(item.route));
      if (activeItem && !this.canAccess(activeItem.moduleKey)) {
        this.router.navigate([role === 'ALMACEN_OBRA' ? '/portal/almacen' : '/portal/dashboard']);
      }
    }
  }

  signOut(): void {
    this.store.logout();
    this.router.navigate(['/portal/login']);
  }
}
