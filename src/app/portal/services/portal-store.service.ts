import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CatalogSeries, CrmLeadItem, EmailAccountConfig, EmailMessageItem,
  GlassComposition, PortalQuote, PortalThemeMode, PortalUser,
  ShutterAndSolarOption, UserRole, VeriFactuInvoice, VeriFactuVaultConfig,
  WarehouseOperationalStatus, WarehouseOrder
} from '../models/portal.models';
import {
  INITIAL_CATALOG_SERIES, INITIAL_CRM_LEADS, INITIAL_EMAIL_ACCOUNTS,
  INITIAL_EMAIL_MESSAGES, INITIAL_GLASS_COMPOSITIONS, INITIAL_SHUTTER_OPTIONS,
  INITIAL_WAREHOUSE_ORDERS, buildSeedChainedInvoices, buildSeedQuotes
} from './portal-seed.data';
import { VeriFactuXmlService } from './verifactu-xml.service';
import { PricingMatrixEngineService } from './pricing-matrix-engine.service';
import { PortalSecurityService } from './portal-security.service';

@Injectable({
  providedIn: 'root'
})
export class PortalStoreService {
  private readonly http = inject(HttpClient);
  private readonly verifactuXml = inject(VeriFactuXmlService);
  private readonly pricingEngine = inject(PricingMatrixEngineService);
  readonly security = inject(PortalSecurityService);

  readonly themeMode = signal<PortalThemeMode>('ivory');
  readonly isAuthenticated = signal<boolean>(true);
  readonly dbSyncedStatus = signal<'CONECTANDO_DB' | 'SINCRONIZADO_DB_NOVA' | 'MODO_LOCAL'>('CONECTANDO_DB');

  readonly currentUser = signal<PortalUser>({
    id: 'usr-gerencia-soto',
    fullName: 'Gerencia General · Grupo Soto',
    email: 'gerencia@gruposoto.es',
    role: 'SUPERADMIN',
    roleLabel: 'Administrador Total · Gerencia Grupo Soto',
    tenantId: 'tenant-nova-soto',
    tenantName: 'NOVA VENTANAS & PUERTAS (GRUPO SOTO)',
    branchName: 'Showroom & Planta La Serreta · Molina de Segura'
  });

  readonly catalogSeries = signal<CatalogSeries[]>(INITIAL_CATALOG_SERIES);
  readonly glassCompositions = signal<GlassComposition[]>(INITIAL_GLASS_COMPOSITIONS);
  readonly shutterOptions = signal<ShutterAndSolarOption[]>(INITIAL_SHUTTER_OPTIONS);
  readonly leads = signal<CrmLeadItem[]>(INITIAL_CRM_LEADS);
  readonly quotes = signal<PortalQuote[]>(this.buildInitialQuotes());
  readonly warehouseOrders = signal<WarehouseOrder[]>(INITIAL_WAREHOUSE_ORDERS);
  readonly verifactuVault = signal<VeriFactuVaultConfig>({
    activeMode: 'MODO_2_PACK_GESTORIA',
    softwareName: 'NOVA-ERP-VERIFACTU-SOTO',
    softwareId: 'NV26',
    softwareVersion: '4.1.0',
    nifEmisor: 'B73849102',
    razonSocialEmisor: 'GRUPO SOTO EMPRESARIAL SL',
    environment: 'AEAT_SANDBOX_PRUEBAS',
    certificateLoaded: false,
    certificateFileName: 'Pendiente de cargar (.p12 / .pfx)',
    certificateSubject: 'Cofre AES-256-GCM preparado para certificado FNMT / Camerfirma',
    certificateValidUntil: '2028-12-31',
    autoSendOnIssue: false
  });
  readonly invoices = signal<VeriFactuInvoice[]>(this.buildInitialChainedInvoices());
  readonly emailAccounts = signal<EmailAccountConfig[]>(INITIAL_EMAIL_ACCOUNTS);
  readonly emailMessages = signal<EmailMessageItem[]>(INITIAL_EMAIL_MESSAGES);

  readonly totalInvoicedEur = computed(() =>
    this.invoices().reduce((acc, inv) => acc + inv.totalImporteEur, 0)
  );
  readonly totalCollectedEur = computed(() =>
    this.invoices().reduce((acc, inv) => acc + inv.cobradoEur, 0)
  );
  readonly activeWarehouseCount = computed(() => this.warehouseOrders().length);
  readonly isSuperAdminAccount = computed(
    () => this.currentUser().email.toLowerCase() === 'gerencia@gruposoto.es' || this.currentUser().role === 'SUPERADMIN'
  );

  constructor() {
    this.hydrateFromPostgresDb();
  }

  private hydrateFromPostgresDb(targetTenantId?: string): void {
    const headers = this.security.getAuthHeaders(targetTenantId);
    this.http
      .get<{
        hasStoredState: boolean;
        state: Record<string, unknown> | null;
        leads: CrmLeadItem[];
      }>('/api/v1/state', { headers })
      .subscribe({
        next: res => {
          if (res.hasStoredState && res.state) {
            const st = res.state as Record<string, unknown>;
            if (Array.isArray(st['catalogSeries'])) this.catalogSeries.set(st['catalogSeries'] as CatalogSeries[]);
            if (Array.isArray(st['quotes'])) this.quotes.set(st['quotes'] as PortalQuote[]);
            if (Array.isArray(st['warehouseOrders'])) this.warehouseOrders.set(st['warehouseOrders'] as WarehouseOrder[]);
            if (Array.isArray(st['invoices'])) this.invoices.set(st['invoices'] as VeriFactuInvoice[]);
            if (Array.isArray(st['emailAccounts'])) {
              this.emailAccounts.set(st['emailAccounts'] as EmailAccountConfig[]);
            }
            if (Array.isArray(st['emailMessages'])) this.emailMessages.set(st['emailMessages'] as EmailMessageItem[]);
            if (Array.isArray(st['leads'])) this.leads.set(st['leads'] as CrmLeadItem[]);
          } else {
            this.persistStateToPostgresDb();
          }
          if (Array.isArray(res.leads) && res.leads.length > 0 && this.leads().length === 0) {
            this.leads.set(res.leads);
          }
          this.dbSyncedStatus.set('SINCRONIZADO_DB_NOVA');
        },
        error: () => {
          this.dbSyncedStatus.set('MODO_LOCAL');
        }
      });
  }

  persistStateToPostgresDb(): void {
    const payload = {
      catalogSeries: this.catalogSeries(),
      quotes: this.quotes(),
      warehouseOrders: this.warehouseOrders(),
      invoices: this.invoices(),
      verifactuVault: this.verifactuVault(),
      emailAccounts: this.emailAccounts(),
      emailMessages: this.emailMessages(),
      leads: this.leads()
    };
    this.http.put('/api/v1/state', payload, { headers: this.security.getAuthHeaders() }).subscribe({
      next: () => this.dbSyncedStatus.set('SINCRONIZADO_DB_NOVA'),
      error: () => this.dbSyncedStatus.set('MODO_LOCAL')
    });
  }

  switchActiveTenant(tenantId: string): void {
    this.security.activeTenantId.set(tenantId);
    const tenant = this.security.tenants().find(t => t.id === tenantId);
    if (tenant) {
      this.currentUser.update(u => ({
        ...u,
        tenantId: tenant.id,
        tenantName: tenant.legalName,
        branchName: tenant.commercialName
      }));
      this.verifactuVault.update(v => ({
        ...v,
        nifEmisor: tenant.cif,
        razonSocialEmisor: tenant.legalName
      }));
    }
    this.quotes.set([]);
    this.warehouseOrders.set([]);
    this.invoices.set([]);
    this.leads.set([]);
    this.emailMessages.set([]);
    this.emailAccounts.set(
      tenantId === 'tenant-nova-soto'
        ? INITIAL_EMAIL_ACCOUNTS
        : tenant?.adminEmail
          ? [
              {
                id: `mail-${tenant.id}`,
                aliasName: tenant.commercialName,
                emailAddress: tenant.adminEmail,
                department: 'GENERAL',
                smtpHost: 'smtp.ionos.es',
                smtpPort: 587,
                imapHost: 'imap.ionos.es',
                imapPort: 993,
                useTls: true,
                status: 'CONECTADO_OK',
                signatureHtml: `${tenant.commercialName} · ${tenant.legalName}`
              }
            ]
          : []
    );
    this.hydrateFromPostgresDb(tenantId);
  }

  logout(): void {
    this.security.saveSessionToken('');
    this.isAuthenticated.set(false);
  }

  toggleTheme(): void {
    this.themeMode.set(this.themeMode() === 'noir' ? 'ivory' : 'noir');
  }

  setRole(role: UserRole, roleLabel: string): void {
    this.currentUser.update(u => ({ ...u, role, roleLabel }));
  }

  loginWithCredentials(email: string, password?: string): void {
    const labels: Record<UserRole, string> = {
      SUPERADMIN: 'Superadministrador Central · Grupo Soto',
      GERENCIA: 'Gerente de Sede',
      OFICINA_TECNICA: 'Comercial y Presupuestos',
      ALMACEN_OBRA: 'Almacén y Obra',
      ADMINISTRACION: 'Administración y Facturas'
    };
    const normalizedEmail = (email || 'gerencia@gruposoto.es').trim().toLowerCase();
    const fallbackRole: UserRole = normalizedEmail === 'gerencia@gruposoto.es' ? 'SUPERADMIN' : 'GERENCIA';
    this.http
      .post<{
        ok: boolean;
        token?: string;
        user?: { id: string; email: string; fullName: string; role: UserRole; tenantId: string };
      }>('/api/v1/auth/login', { email: normalizedEmail, password })
      .subscribe({
        next: res => {
          if (res.token) this.security.saveSessionToken(res.token);
          if (res.user) {
            const mappedRole: UserRole = labels[res.user.role] ? res.user.role : fallbackRole;
            this.currentUser.update(u => ({
              ...u,
              id: res.user!.id,
              email: res.user!.email,
              fullName: res.user!.fullName,
              role: mappedRole,
              roleLabel: labels[mappedRole],
              tenantId: res.user!.tenantId
            }));
            this.switchActiveTenant(res.user.tenantId);
          }
        },
        error: () => {}
      });
    this.currentUser.update(u => ({
      ...u,
      fullName: normalizedEmail === 'gerencia@gruposoto.es' ? 'Gerencia General · Grupo Soto' : normalizedEmail,
      email: normalizedEmail,
      role: fallbackRole,
      roleLabel: labels[fallbackRole]
    }));
    this.isAuthenticated.set(true);
  }

  applyBulkTariffPercentage(seriesId: string, percentageDelta: number): void {
    const factor = 1 + percentageDelta / 100;
    this.catalogSeries.update(list =>
      list.map(s =>
        s.id !== seriesId
          ? s
          : { ...s, matrixTariffPrices: s.matrixTariffPrices.map(row => row.map(cell => Math.round(cell * factor * 100) / 100)) }
      )
    );
    this.persistStateToPostgresDb();
  }

  updateSeriesMatrixFromPastedText(seriesId: string, rawText: string): boolean {
    const rows = rawText
      .trim()
      .split(/\r?\n/)
      .map(line => line.trim().split(/[\t;,\s]+/).map(v => Number(v.replace(',', '.'))).filter(n => !Number.isNaN(n) && n > 0))
      .filter(r => r.length >= 2);
    if (rows.length < 2) return false;
    this.catalogSeries.update(list =>
      list.map(s => {
        if (s.id !== seriesId) return s;
        const widthsMm = Array.from({ length: rows[0].length }, (_, idx) => 800 + idx * 200);
        const heightsMm = Array.from({ length: rows.length }, (_, idx) => 800 + idx * 200);
        return { ...s, widthsMm, heightsMm, matrixTariffPrices: rows };
      })
    );
    this.persistStateToPostgresDb();
    return true;
  }

  addCatalogSeries(newSeries: CatalogSeries): void {
    this.catalogSeries.update(list => [newSeries, ...list]);
    this.persistStateToPostgresDb();
  }

  toggleWarehouseComponentReception(
    orderId: string,
    part: 'carpentryReceived' | 'glassReceived' | 'shutterMotorReceived' | 'accessoriesReceived'
  ): void {
    this.warehouseOrders.update(list =>
      list.map(ord => {
        if (ord.id !== orderId) return ord;
        const updated = { ...ord, [part]: !ord[part], updatedAtIso: new Date().toISOString() };
        const allReady =
          updated.carpentryReceived &&
          updated.glassReceived &&
          updated.shutterMotorReceived &&
          updated.accessoriesReceived;
        updated.operationalStatus = allReady
          ? updated.circuitType === 'SUMINISTRO_SIN_MONTAJE'
            ? 'LISTO_RECOGIDA_ENTREGA'
            : 'COMPLETO_EN_ALMACEN'
          : 'RECIBIDO_PARCIAL';
        return updated;
      })
    );
    this.persistStateToPostgresDb();
  }

  updateWarehouseStatus(orderId: string, status: WarehouseOperationalStatus): void {
    this.warehouseOrders.update(list =>
      list.map(ord => (ord.id === orderId ? { ...ord, operationalStatus: status } : ord))
    );
    this.persistStateToPostgresDb();
  }

  issueInvoiceDirectlyFromWarehouse(order: WarehouseOrder, diasPagoInput?: number | null): VeriFactuInvoice {
    const safeDiasPago = diasPagoInput ?? 0;
    const vatRatePercent: 21 | 10 = order.circuitType === 'SUMINISTRO_SIN_MONTAJE' ? 21 : 10;
    const baseImponibleEur = Math.round((order.totalAmountEur / (1 + vatRatePercent / 100)) * 100) / 100;

    const createdInvoice = this.createChainedInvoice({
      invoiceType: 'F1_ORDINARIA',
      orderCode: order.orderCode,
      clientName: order.clientName,
      clientNif: order.clientNif,
      workDescription: `Suministro / Albarán ${order.deliveryNoteCode} (${order.assignedCaballete}) · ${order.workAddress}`,
      diasPago: safeDiasPago,
      baseImponibleEur,
      vatRatePercent,
      retencionGarantia5PercentEur: 0,
      operationalStatus: order.operationalStatus
    });

    this.warehouseOrders.update(list =>
      list.map(o => (o.id === order.id ? { ...o, financialStatus: 'FACTURADO_TOTAL' } : o))
    );
    this.persistStateToPostgresDb();
    return createdInvoice;
  }

  createChainedInvoice(params: {
    invoiceType: 'F1_ORDINARIA' | 'ANTICIPO_OBRA' | 'CERTIFICACION' | 'R1_RECTIFICATIVA';
    orderCode: string;
    clientName: string;
    clientNif: string;
    workDescription: string;
    diasPago?: number | null;
    baseImponibleEur: number;
    vatRatePercent: 21 | 10 | 0;
    retencionGarantia5PercentEur: number;
    operationalStatus: WarehouseOperationalStatus;
  }): VeriFactuInvoice {
    const currentList = this.invoices();
    const nextNum = 2026001 + currentList.length;
    const prefix = params.invoiceType === 'R1_RECTIFICATIVA' ? 'RECT' : 'FAC';
    const seriesAndNumber = `${prefix}-${nextNum}`;
    const issueDateIso = new Date().toISOString();

    const safeDiasPago = params.diasPago ?? 0;
    const dueDateIso = this.verifactuXml.computeNormalizedDueDateIso(issueDateIso, safeDiasPago);

    const vatAmountEur = Math.round(params.baseImponibleEur * (params.vatRatePercent / 100) * 100) / 100;
    const totalImporteEur =
      Math.round((params.baseImponibleEur + vatAmountEur - params.retencionGarantia5PercentEur) * 100) / 100;

    const previousHash64 =
      currentList.length > 0
        ? currentList[0].currentHash64
        : '0000000000000000000000000000000000000000000000000000000000000000';

    const vault = this.verifactuVault();
    const currentHash64 = this.verifactuXml.computeDeterministicAeatHash64({
      nifEmisor: vault.nifEmisor,
      seriesAndNumber,
      issueDateIso,
      invoiceType: params.invoiceType,
      vatAmountEur,
      totalImporteEur,
      previousHash64
    });

    const aeatQrUrl = this.verifactuXml.buildAeatQrVerificationUrl(
      vault.nifEmisor,
      seriesAndNumber,
      issueDateIso,
      totalImporteEur,
      currentHash64
    );

    const newInv: VeriFactuInvoice = {
      id: `inv-${Date.now()}`,
      seriesAndNumber,
      invoiceType: params.invoiceType,
      orderCode: params.orderCode,
      clientName: params.clientName,
      clientNif: params.clientNif,
      workDescription: params.workDescription,
      issueDateIso,
      diasPago: safeDiasPago,
      dueDateIso,
      baseImponibleEur: params.baseImponibleEur,
      vatRatePercent: params.vatRatePercent,
      vatAmountEur,
      retencionGarantia5PercentEur: params.retencionGarantia5PercentEur,
      totalImporteEur,
      cobradoEur: 0,
      operationalStatus: params.operationalStatus,
      paymentStatus: this.verifactuXml.evaluatePaymentStatus(totalImporteEur, 0, dueDateIso),
      previousHash64,
      currentHash64,
      aeatQrUrl,
      aeatSubmissionState: vault.certificateLoaded && vault.autoSendOnIssue ? 'ENVIADO_AEAT_OK' : 'HUELLA_GENERADA'
    };

    this.invoices.update(list => [newInv, ...list]);
    this.persistStateToPostgresDb();
    return newInv;
  }

  registerInvoiceCollection(invoiceId: string): void {
    this.invoices.update(list =>
      list.map(inv => (inv.id !== invoiceId ? inv : { ...inv, cobradoEur: inv.totalImporteEur, paymentStatus: 'COBRADA' }))
    );
    this.persistStateToPostgresDb();
  }

  removeInvoice(invoiceId: string): void {
    this.invoices.update(list => list.filter(i => i.id !== invoiceId));
    this.persistStateToPostgresDb();
  }

  saveQuoteOnly(quote: PortalQuote): void {
    this.quotes.update(list => [quote, ...list.filter(q => q.id !== quote.id)]);
    this.persistStateToPostgresDb();
  }

  removeQuote(quoteId: string): void {
    this.quotes.update(list => list.filter(q => q.id !== quoteId));
    this.persistStateToPostgresDb();
  }

  addManualWarehouseOrder(order: WarehouseOrder): void {
    this.warehouseOrders.update(list => [order, ...list]);
    this.persistStateToPostgresDb();
  }

  removeWarehouseOrder(orderId: string): void {
    this.warehouseOrders.update(list => list.filter(o => o.id !== orderId));
    this.persistStateToPostgresDb();
  }

  saveQuoteAndConvertToOrder(quote: PortalQuote): void {
    this.quotes.update(list => [quote, ...list.filter(q => q.id !== quote.id)]);
    const seq = 1 + this.warehouseOrders().length;
    const newOrder: WarehouseOrder = {
      id: `ord-${Date.now()}`,
      orderCode: `PED-2026-${String(seq).padStart(3, '0')}`,
      quoteCode: quote.code,
      clientName: quote.clientName || 'Cliente',
      clientNif: quote.clientNif || '',
      workAddress: quote.workAddress || '',
      circuitType: quote.projectType === 'SOLO_SUMINISTRO' ? 'SUMINISTRO_SIN_MONTAJE' : 'FABRICA_TERMINADA',
      assignedCaballete: `CABALLETE A-${String(seq).padStart(2, '0')}`,
      unitsCount: quote.holes.reduce((acc, h) => acc + h.quantity, 0),
      totalAmountEur: quote.totalPvpEur,
      carpentryReceived: false,
      glassReceived: false,
      shutterMotorReceived: false,
      accessoriesReceived: false,
      operationalStatus: 'EN_FABRICACION',
      financialStatus: 'PENDIENTE_FACTURAR',
      deliveryNoteCode: `ALB-2026-${String(seq).padStart(3, '0')}`,
      updatedAtIso: new Date().toISOString()
    };
    this.warehouseOrders.update(list => [newOrder, ...list]);
    this.persistStateToPostgresDb();
  }

  registerWebLead(lead: Omit<CrmLeadItem, 'id' | 'createdAtIso' | 'status'>): void {
    const item: CrmLeadItem = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAtIso: new Date().toISOString(),
      status: 'NUEVO_WEB'
    };
    this.leads.update(list => [item, ...list]);
    this.http.post('/api/v1/leads', item).subscribe({ error: () => {} });
    this.persistStateToPostgresDb();
  }

  removeLead(leadId: string): void {
    this.leads.update(list => list.filter(l => l.id !== leadId));
    this.persistStateToPostgresDb();
  }

  addEmailAccount(account: EmailAccountConfig): void {
    this.emailAccounts.update(list => [...list, account]);
    this.persistStateToPostgresDb();
  }

  removeEmailAccount(accountId: string): void {
    this.emailAccounts.update(list => list.filter(a => a.id !== accountId));
    this.persistStateToPostgresDb();
  }

  private buildInitialQuotes(): PortalQuote[] {
    return buildSeedQuotes(this.pricingEngine);
  }

  private buildInitialChainedInvoices(): VeriFactuInvoice[] {
    return buildSeedChainedInvoices(this.verifactuXml);
  }
}
