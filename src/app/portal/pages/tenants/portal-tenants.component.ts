import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalStoreService } from '../../services/portal-store.service';
import { PortalTenantCompany, UserRole } from '../../models/portal.models';

@Component({
  selector: 'app-portal-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-tenants.component.html',
  styleUrls: ['./portal-tenants.component.scss']
})
export class PortalTenantsComponent {
  readonly store = inject(PortalStoreService);
  readonly security = this.store.security;

  readonly showNewTenantModal = signal<boolean>(false);
  readonly showNewUserModal = signal<boolean>(false);

  // Campos para dar de alta Nueva Empresa / Franquicia
  readonly newCommercialName = signal<string>('');
  readonly newLegalName = signal<string>('');
  readonly newCif = signal<string>('');
  readonly newCity = signal<string>('');
  readonly newInvoicePrefix = signal<string>('FAC');
  readonly newCatalogPolicy = signal<'LOCKED_BY_CENTRAL' | 'CUSTOM_MARGIN_ALLOWED'>(
    'LOCKED_BY_CENTRAL'
  );
  readonly newAdminEmail = signal<string>('');
  readonly newAdminPassword = signal<string>('');

  // Campos para dar de alta Nuevo Usuario por Rol
  readonly newUserFullName = signal<string>('');
  readonly newUserEmail = signal<string>('');
  readonly newUserRole = signal<UserRole>('OFICINA_TECNICA');
  readonly newUserTenantId = signal<string>('tenant-nova-soto');
  readonly newUserPassword = signal<string>('');

  createNewFranchise(): void {
    this.security.createFranchiseTenant({
      commercialName: this.newCommercialName(),
      legalName: this.newLegalName(),
      cif: this.newCif(),
      city: this.newCity(),
      invoicePrefix: this.newInvoicePrefix(),
      catalogPolicy: this.newCatalogPolicy(),
      adminEmail: this.newAdminEmail(),
      password: this.newAdminPassword()
    });
    this.showNewTenantModal.set(false);
  }

  enterTenantWorkspace(tenant: PortalTenantCompany): void {
    this.store.switchActiveTenant(tenant.id);
    this.security.securityBanner.set(
      `Espacio de trabajo cambiado a "${tenant.commercialName}" (${tenant.cif}). Viendo sus datos aislados.`
    );
  }

  toggleCatalogPolicy(tenant: PortalTenantCompany): void {
    this.security.toggleTenantCatalogPolicy(tenant);
  }

  createNewUser(): void {
    this.security.saveManagedUser({
      tenantId: this.newUserTenantId(),
      email: this.newUserEmail(),
      fullName: this.newUserFullName(),
      role: this.newUserRole(),
      password: this.newUserPassword(),
      active: true
    });
    this.showNewUserModal.set(false);
  }

  getTenantLabel(tenantId: string): string {
    return (
      this.security.tenants().find(t => t.id === tenantId)?.commercialName ||
      tenantId
    );
  }

  getRolePermissionsSummary(role: UserRole): string {
    switch (role) {
      case 'SUPERADMIN':
        return 'Control total + Alta de Empresas y Seguridad';
      case 'GERENCIA':
        return 'Dirección de su sede (Presupuestos, Almacén, Facturas, Catálogo)';
      case 'OFICINA_TECNICA':
      case 'COMERCIAL':
        return 'Inicio, Presupuestos, Catálogo y Correos';
      case 'MEDIDOR_OBRA':
      case 'INSTALADOR_MONTAJE':
        return 'Solo Almacén y Documentación';
      case 'ADMINISTRACION_FACTURACION':
        return 'Inicio, Facturas, Almacén y Correos';
      default:
        return 'Acceso básico';
    }
  }
}
