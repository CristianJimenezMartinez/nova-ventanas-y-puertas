import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  PortalManagedUser,
  PortalTenantCompany,
  UserRole
} from '../models/portal.models';

export type PortalModuleKey =
  | 'dashboard'
  | 'presupuestos'
  | 'almacen'
  | 'facturacion'
  | 'catalogo'
  | 'correos'
  | 'empresas'
  | 'documentacion';

@Injectable({
  providedIn: 'root'
})
export class PortalSecurityService {
  private readonly http = inject(HttpClient);

  readonly jwtToken = signal<string>(this.readSessionToken());
  readonly activeTenantId = signal<string>('tenant-nova-soto');
  readonly securityBanner = signal<string>('');
  readonly pendingEmailDraft = signal<{
    recipientName: string;
    recipientEmail: string;
    linkedDocCode: string;
    subject: string;
    messageBody: string;
  } | null>(null);

  readonly pendingQuoteDraft = signal<{
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    workAddress: string;
    projectType: 'OBRA_NUEVA' | 'REFORMA_VIVIENDA' | 'SOLO_SUMINISTRO';
  } | null>(null);

  readonly tenants = signal<PortalTenantCompany[]>([
    {
      id: 'tenant-nova-soto',
      commercialName: 'NOVA Central · Murcia (Matriz)',
      legalName: 'GRUPO SOTO EMPRESARIAL SL',
      cif: 'B73849102',
      city: 'Molina de Segura · Murcia',
      invoicePrefix: 'FAC-MUR',
      catalogPolicy: 'LOCKED_BY_CENTRAL',
      adminEmail: 'gerencia@gruposoto.es',
      active: true
    }
  ]);

  readonly managedUsers = signal<PortalManagedUser[]>([
    {
      id: 'usr-gerencia-soto',
      tenantId: 'tenant-nova-soto',
      email: 'gerencia@gruposoto.es',
      fullName: 'Gerencia General · Grupo Soto',
      role: 'SUPERADMIN',
      active: true,
      tokenVersion: 1
    }
  ]);

  readonly activeTenant = computed(
    () =>
      this.tenants().find(t => t.id === this.activeTenantId()) ||
      this.tenants()[0]
  );

  constructor() {
    this.loadTenantsAndUsers();
  }

  private readSessionToken(): string {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('nova_jwt_token') || '';
  }

  saveSessionToken(token: string): void {
    this.jwtToken.set(token);
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem('nova_jwt_token', token);
      } else {
        sessionStorage.removeItem('nova_jwt_token');
      }
    }
  }

  getAuthHeaders(overrideTenantId?: string): HttpHeaders {
    let headers = new HttpHeaders({
      'X-Tenant-Id': overrideTenantId || this.activeTenantId()
    });
    const token = this.jwtToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  canAccessModule(role: UserRole, moduleKey: PortalModuleKey): boolean {
    if (moduleKey === 'documentacion') return true;
    switch (role) {
      case 'SUPERADMIN':
        return true;
      case 'GERENCIA':
        return moduleKey !== 'empresas';
      case 'OFICINA_TECNICA':
        return ['dashboard', 'presupuestos', 'correos'].includes(moduleKey);
      case 'ALMACEN_OBRA':
        return ['almacen'].includes(moduleKey);
      case 'ADMINISTRACION':
        return ['dashboard', 'facturacion', 'almacen', 'correos'].includes(moduleKey);
      default:
        return ['dashboard', 'presupuestos'].includes(moduleKey);
    }
  }

  loadTenantsAndUsers(): void {
    this.http
      .get<{ tenants: PortalTenantCompany[]; users: PortalManagedUser[] }>(
        '/api/v1/tenants',
        { headers: this.getAuthHeaders() }
      )
      .subscribe({
        next: res => {
          if (Array.isArray(res.tenants) && res.tenants.length > 0) {
            this.tenants.set(res.tenants);
          }
          if (Array.isArray(res.users) && res.users.length > 0) {
            this.managedUsers.set(res.users);
          }
        },
        error: () => {}
      });
  }

  createFranchiseTenant(params: {
    commercialName: string;
    legalName: string;
    cif: string;
    city: string;
    invoicePrefix: string;
    catalogPolicy: 'LOCKED_BY_CENTRAL' | 'CUSTOM_MARGIN_ALLOWED';
    adminEmail: string;
    password: string;
  }): void {
    this.http
      .post<{ ok: boolean; tenantId: string }>('/api/v1/tenants', params, {
        headers: this.getAuthHeaders()
      })
      .subscribe({
        next: () => {
          this.loadTenantsAndUsers();
          this.securityBanner.set(
            `Empresa "${params.commercialName}" creada con catálogo maestro heredado y usuario ${params.adminEmail} activo.`
          );
        },
        error: () => {
          const id = `tenant-${Date.now().toString().slice(-4)}`;
          this.tenants.update(list => [
            ...list,
            {
              id,
              commercialName: params.commercialName,
              legalName: params.legalName,
              cif: params.cif,
              city: params.city,
              invoicePrefix: params.invoicePrefix,
              catalogPolicy: params.catalogPolicy,
              adminEmail: params.adminEmail,
              active: true
            }
          ]);
        }
      });
  }

  toggleTenantCatalogPolicy(tenant: PortalTenantCompany): void {
    const updatedPolicy =
      tenant.catalogPolicy === 'LOCKED_BY_CENTRAL'
        ? 'CUSTOM_MARGIN_ALLOWED'
        : 'LOCKED_BY_CENTRAL';
    const updated = { ...tenant, catalogPolicy: updatedPolicy as 'LOCKED_BY_CENTRAL' | 'CUSTOM_MARGIN_ALLOWED' };
    this.tenants.update(list =>
      list.map(t => (t.id === tenant.id ? updated : t))
    );
    this.http
      .post('/api/v1/tenants', updated, { headers: this.getAuthHeaders() })
      .subscribe({ error: () => {} });
  }

  saveManagedUser(params: {
    id?: string;
    tenantId: string;
    email: string;
    fullName: string;
    role: UserRole;
    password?: string;
    active: boolean;
  }): void {
    this.http
      .post('/api/v1/users', params, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          this.loadTenantsAndUsers();
          this.securityBanner.set(`Usuario ${params.email} guardado y protegido con scrypt.`);
        },
        error: () => {}
      });
  }

  revokeAllSessions(): void {
    this.http
      .post('/api/v1/auth/revoke-sessions', {}, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          this.loadTenantsAndUsers();
          this.securityBanner.set(
            'Todas las sesiones anteriores han sido revocadas (tokenVersion incrementado en PostgreSQL).'
          );
        },
        error: () => {}
      });
  }
}
