import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalStoreService } from '../../services/portal-store.service';
import { INITIAL_CATALOG_SERIES } from '../../services/portal-seed.data';
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
  readonly showEditTenantModal = signal<boolean>(false);
  readonly showNewUserModal = signal<boolean>(false);
  readonly showEditUserModal = signal<boolean>(false);

  readonly showAllCompaniesUsers = signal<boolean>(false);
  readonly userSearchFilter = signal<string>('');

  readonly isSuperAdminView = computed(() => this.store.currentUser().role === 'SUPERADMIN');

  readonly visibleUsers = computed(() => {
    const activeTid = this.security.activeTenantId();
    const showAll = this.isSuperAdminView() && this.showAllCompaniesUsers();
    const q = this.userSearchFilter().trim().toLowerCase();
    return this.security.managedUsers().filter(u => {
      if (!showAll && u.tenantId !== activeTid) return false;
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  });

  // Campos para dar de alta Nueva Empresa / Franquicia (Exclusivo Superadmin)
  readonly newCommercialName = signal<string>('');
  readonly newLegalName = signal<string>('');
  readonly newCif = signal<string>('');
  readonly newCity = signal<string>('');
  readonly newInvoicePrefix = signal<string>('FAC');
  readonly newCatalogPolicy = signal<'LOCKED_BY_CENTRAL' | 'CUSTOM_MARGIN_ALLOWED'>('LOCKED_BY_CENTRAL');
  readonly newAdminEmail = signal<string>('');
  readonly newAdminPassword = signal<string>('');

  // Campos para Editar Empresa existente (Exclusivo Superadmin)
  readonly editTenantId = signal<string>('');
  readonly editCommercialName = signal<string>('');
  readonly editLegalName = signal<string>('');
  readonly editCif = signal<string>('');
  readonly editCity = signal<string>('');
  readonly editInvoicePrefix = signal<string>('');
  readonly editAdminEmail = signal<string>('');
  readonly editCatalogPolicy = signal<'LOCKED_BY_CENTRAL' | 'CUSTOM_MARGIN_ALLOWED'>('LOCKED_BY_CENTRAL');
  readonly editTenantActive = signal<boolean>(true);

  // Campos para dar de alta Nuevo Usuario
  readonly newUserFullName = signal<string>('');
  readonly newUserEmail = signal<string>('');
  readonly newUserRole = signal<UserRole>('OFICINA_TECNICA');
  readonly newUserTenantId = signal<string>('tenant-nova-soto');
  readonly newUserPassword = signal<string>('');

  // Campos para Editar Usuario / Resetear Contraseña o Rol
  readonly editingUserId = signal<string>('');
  readonly editingUserEmail = signal<string>('');
  readonly editingUserFullName = signal<string>('');
  readonly editingUserRole = signal<UserRole>('OFICINA_TECNICA');
  readonly editingUserTenantId = signal<string>('tenant-nova-soto');
  readonly editingUserNewPassword = signal<string>('');
  readonly editingUserActive = signal<boolean>(true);

  openNewUserModal(): void {
    this.newUserTenantId.set(this.security.activeTenantId());
    this.newUserFullName.set('');
    this.newUserEmail.set('');
    this.newUserPassword.set('');
    this.newUserRole.set('OFICINA_TECNICA');
    this.showNewUserModal.set(true);
  }

  openEditTenantModal(t: PortalTenantCompany): void {
    if (!this.isSuperAdminView()) return;
    this.editTenantId.set(t.id);
    this.editCommercialName.set(t.commercialName);
    this.editLegalName.set(t.legalName);
    this.editCif.set(t.cif);
    this.editCity.set(t.city);
    this.editInvoicePrefix.set(t.invoicePrefix);
    this.editAdminEmail.set(t.adminEmail);
    this.editCatalogPolicy.set(t.catalogPolicy);
    this.editTenantActive.set(t.active);
    this.showEditTenantModal.set(true);
  }

  saveEditedTenant(): void {
    if (!this.isSuperAdminView()) return;
    const email = this.editAdminEmail().trim().toLowerCase();
    if (email && !this.store.isValidEmail(email)) {
      this.security.securityBanner.set('⚠ El correo del responsable de la sede no tiene un formato válido.');
      return;
    }
    this.security.saveTenantChanges({
      id: this.editTenantId(),
      commercialName: this.editCommercialName().trim() || 'Sede NOVA',
      legalName: this.editLegalName().trim() || 'Sociedad SL',
      cif: this.editCif().trim() || 'B00000000',
      city: this.editCity().trim() || 'España',
      invoicePrefix: this.editInvoicePrefix().trim() || 'FAC',
      adminEmail: email,
      catalogPolicy: this.editCatalogPolicy(),
      active: this.editTenantId() === 'tenant-nova-soto' ? true : this.editTenantActive()
    });
    if (this.editTenantId() === this.security.activeTenantId()) {
      this.store.verifactuVault.update(v => ({
        ...v,
        nifEmisor: this.editCif().trim(),
        razonSocialEmisor: this.editLegalName().trim()
      }));
    }
    this.showEditTenantModal.set(false);
  }

  openEditUserModal(u: PortalManagedUser): void {
    this.editingUserId.set(u.id);
    this.editingUserEmail.set(u.email);
    this.editingUserFullName.set(u.fullName);
    this.editingUserRole.set(u.role);
    this.editingUserTenantId.set(u.tenantId);
    this.editingUserActive.set(u.active);
    this.editingUserNewPassword.set('');
    this.showEditUserModal.set(true);
  }

  saveEditedUser(): void {
    const safeRole: UserRole =
      !this.isSuperAdminView() && this.editingUserRole() === 'SUPERADMIN'
        ? 'GERENCIA'
        : this.editingUserRole();
    this.security.saveManagedUser({
      id: this.editingUserId(),
      tenantId: this.isSuperAdminView() ? this.editingUserTenantId() : this.security.activeTenantId(),
      email: this.editingUserEmail(),
      fullName: this.editingUserFullName().trim() || this.editingUserEmail(),
      role: safeRole,
      password: this.editingUserNewPassword().trim() || undefined,
      active: this.editingUserEmail() === 'gerencia@gruposoto.es' ? true : this.editingUserActive()
    });
    this.showEditUserModal.set(false);
  }

  createNewFranchise(): void {
    if (!this.isSuperAdminView()) return;
    const email = this.newAdminEmail().trim().toLowerCase();
    if (!email || !this.store.isValidEmail(email)) {
      this.security.securityBanner.set('⚠ Introduce un correo electrónico válido para el responsable de la sede.');
      return;
    }
    this.security.createFranchiseTenant({
      commercialName: this.newCommercialName(),
      legalName: this.newLegalName(),
      cif: this.newCif(),
      city: this.newCity(),
      invoicePrefix: this.newInvoicePrefix(),
      catalogPolicy: this.newCatalogPolicy(),
      adminEmail: email,
      password: this.newAdminPassword()
    });
    this.showNewTenantModal.set(false);
  }

  enterTenantWorkspace(tenant: PortalTenantCompany): void {
    if (!this.isSuperAdminView()) return;
    this.store.switchActiveTenant(tenant.id);
    this.security.securityBanner.set(
      `✓ Asistiendo en vivo a "${tenant.commercialName}" (${tenant.cif}). Ahora ves y puedes corregir sus clientes, presupuestos, almacén y facturas.`
    );
  }

  toggleCatalogPolicy(tenant: PortalTenantCompany): void {
    if (!this.isSuperAdminView()) return;
    this.security.toggleTenantCatalogPolicy(tenant);
  }

  toggleTenantStatus(tenant: PortalTenantCompany): void {
    if (!this.isSuperAdminView()) return;
    this.security.toggleTenantActive(tenant);
  }

  removeTenant(tenant: PortalTenantCompany): void {
    if (!this.isSuperAdminView() || tenant.id === 'tenant-nova-soto') return;
    this.security.deleteTenant(tenant.id, tenant.commercialName);
  }

  syncCatalogForTenant(tenant: PortalTenantCompany): void {
    if (!this.isSuperAdminView()) return;
    this.security.syncMasterCatalogToTenant(tenant.id, tenant.commercialName, () => {
      if (tenant.id === this.security.activeTenantId()) {
        this.store.catalogSeries.set(INITIAL_CATALOG_SERIES);
        this.store.persistStateToPostgresDb();
      }
    });
  }

  runActiveTenantRepair(): void {
    if (!this.isSuperAdminView()) return;
    const tid = this.security.activeTenantId();
    // 1. Limpiar posibles clientes duplicados por email dentro de la sede activa
    const seenEmails = new Set<string>();
    let removedDupLeads = 0;
    this.store.leads.update(list =>
      list.filter(l => {
        const em = (l.email || '').trim().toLowerCase();
        if (!em) return true;
        if (seenEmails.has(em)) {
          removedDupLeads++;
          return false;
        }
        seenEmails.add(em);
        return true;
      })
    );
    // 2. Sincronizar estado financiero de pedidos de almacén con facturas reales
    const invoicedCodes = new Set(this.store.invoices().map(i => i.orderCode).filter(Boolean));
    let syncedOrders = 0;
    this.store.warehouseOrders.update(list =>
      list.map(ord => {
        if (invoicedCodes.has(ord.orderCode) && ord.financialStatus === 'PENDIENTE_FACTURAR') {
          syncedOrders++;
          return { ...ord, financialStatus: 'FACTURADO_TOTAL' };
        }
        return ord;
      })
    );
    // 3. Asegurar que el catálogo tenga series válidas
    if (this.store.catalogSeries().length === 0) {
      this.store.catalogSeries.set(INITIAL_CATALOG_SERIES);
    }
    this.store.persistStateToPostgresDb();
    this.security.loadTenantsAndUsers();
    this.security.securityBanner.set(
      `✓ Diagnóstico y reparación completados en "${this.security.activeTenant().commercialName}" (${tid}): ${removedDupLeads} clientes duplicados depurados, ${syncedOrders} pedidos sincronizados con facturación y estado guardado en DB.`
    );
  }

  downloadTenantBackupJson(): void {
    const tenant = this.security.activeTenant();
    const dump = {
      exportedAtIso: new Date().toISOString(),
      tenant,
      leads: this.store.leads(),
      quotes: this.store.quotes(),
      warehouseOrders: this.store.warehouseOrders(),
      invoices: this.store.invoices(),
      catalogSeries: this.store.catalogSeries(),
      emailAccounts: this.store.emailAccounts()
    };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${tenant.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.security.securityBanner.set(`✓ Copia de seguridad JSON de "${tenant.commercialName}" descargada.`);
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
    return this.security.tenants().find(t => t.id === tenantId)?.commercialName || tenantId;
  }

  getRolePermissionsSummary(role: UserRole): string {
    switch (role) {
      case 'SUPERADMIN':
        return 'Control total + Soporte y Reparación de todas las empresas';
      case 'GERENCIA':
        return 'Dirección de su sede (Inicio, Presupuestos, Almacén, Facturas, Catálogo, Usuarios)';
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
