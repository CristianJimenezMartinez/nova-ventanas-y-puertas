import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalStoreService } from '../../services/portal-store.service';
import { PortalManagedUser, PortalTenantCompany, UserRole } from '../../models/portal.models';

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

  readonly isSuperAdminView = computed(() => this.store.currentUser().role === 'SUPERADMIN');
  readonly visibleUsers = computed(() => {
    const activeTid = this.security.activeTenantId();
    return this.security.managedUsers().filter(u => u.tenantId === activeTid);
  });

  // Campos para dar de alta Nueva Empresa / Franquicia (Exclusivo Superadmin)
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

  // Campos para dar de alta Nuevo Usuario en la Empresa
  readonly newUserFullName = signal<string>('');
  readonly newUserEmail = signal<string>('');
  readonly newUserRole = signal<UserRole>('OFICINA_TECNICA');
  readonly newUserTenantId = signal<string>('tenant-nova-soto');
  readonly newUserPassword = signal<string>('');

  openNewUserModal(): void {
    this.newUserTenantId.set(this.security.activeTenantId());
    this.newUserFullName.set('');
    this.newUserEmail.set('');
    this.newUserPassword.set('');
    this.newUserRole.set('OFICINA_TECNICA');
    this.showNewUserModal.set(true);
  }

  createNewFranchise(): void {
    if (!this.isSuperAdminView()) return;
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
    if (!this.isSuperAdminView()) return;
    this.store.switchActiveTenant(tenant.id);
    this.security.securityBanner.set(
      `Espacio de trabajo cambiado a "${tenant.commercialName}" (${tenant.cif}). Viendo sus datos y usuarios aislados.`
    );
  }

  toggleCatalogPolicy(tenant: PortalTenantCompany): void {
    if (!this.isSuperAdminView()) return;
    this.security.toggleTenantCatalogPolicy(tenant);
  }

  createNewUser(): void {
    const email = this.newUserEmail().trim().toLowerCase();
    if (!email || !this.store.isValidEmail(email)) {
      this.security.securityBanner.set('⚠ El formato del correo electrónico no es válido.');
      return;
    }
    const targetTenantId = this.isSuperAdminView()
      ? this.newUserTenantId()
      : this.security.activeTenantId();
    const dupUser = this.security
      .managedUsers()
      .find(u => u.tenantId === targetTenantId && u.email.trim().toLowerCase() === email);
    if (dupUser) {
      this.security.securityBanner.set(
        `⚠ Ya existe un usuario con el correo "${email}" en esta empresa (${dupUser.fullName}).`
      );
      return;
    }
    const safeRole: UserRole =
      !this.isSuperAdminView() && this.newUserRole() === 'SUPERADMIN'
        ? 'GERENCIA'
        : this.newUserRole();

    this.security.saveManagedUser({
      tenantId: targetTenantId,
      email,
      fullName: this.newUserFullName().trim() || email,
      role: safeRole,
      password: this.newUserPassword() || 'Soto2026!Seguro',
      active: true
    });
    this.showNewUserModal.set(false);
  }

  toggleUserActive(user: PortalManagedUser): void {
    this.security.saveManagedUser({
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      active: !user.active
    });
  }

  deleteUser(user: PortalManagedUser): void {
    this.security.deleteManagedUser(user.id, user.email);
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
        return 'Dirección de su sede (Inicio, Presupuestos, Almacén, Facturas, Catálogo)';
      case 'OFICINA_TECNICA':
        return 'Inicio, Presupuestos y Correos (sin editar tarifas maestras)';
      case 'ALMACEN_OBRA':
        return 'Solo Almacén y Documentación';
      case 'ADMINISTRACION':
        return 'Inicio, Facturas, Almacén y Correos';
      default:
        return 'Acceso básico';
    }
  }
}
