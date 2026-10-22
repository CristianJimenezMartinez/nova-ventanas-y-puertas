import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CatalogSeries,
  CrmLeadItem,
  EmailAccountConfig,
  EmailMessageItem,
  GlassComposition,
  PortalQuote,
  PortalThemeMode,
  PortalUser,
  ShutterAndSolarOption,
  UserRole,
  VeriFactuInvoice,
  VeriFactuVaultConfig,
  WarehouseOperationalStatus,
  WarehouseOrder
} from '../models/portal.models';
import {
  INITIAL_CATALOG_SERIES,
  INITIAL_CRM_LEADS,
  INITIAL_EMAIL_ACCOUNTS,
  INITIAL_EMAIL_MESSAGES,
  INITIAL_GLASS_COMPOSITIONS,
  INITIAL_SHUTTER_OPTIONS,
  INITIAL_WAREHOUSE_ORDERS
} from './portal-seed.data';
import { VeriFactuXmlService } from './verifactu-xml.service';
import { PricingMatrixEngineService } from './pricing-matrix-engine.service';

@Injectable({
  providedIn: 'root'
})
export class PortalStoreService {
  private readonly http = inject(HttpClient);
  private readonly verifactuXml = inject(VeriFactuXmlService);
  private readonly pricingEngine = inject(PricingMatrixEngineService);

  readonly themeMode = signal<PortalThemeMode>('noir');
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

  constructor() {
    this.hydrateFromPostgresDb();
  }

  private hydrateFromPostgresDb(): void {
    this.http
      .get<{
        hasStoredState: boolean;
        state: Record<string, unknown> | null;
        leads: CrmLeadItem[];
      }>('/api/v1/state')
      .subscribe({
        next: res => {
          if (res.hasStoredState && res.state) {
            const st = res.state as Record<string, unknown>;
            if (Array.isArray(st['catalogSeries'])) this.catalogSeries.set(st['catalogSeries'] as CatalogSeries[]);
            if (Array.isArray(st['quotes'])) this.quotes.set(st['quotes'] as PortalQuote[]);
            if (Array.isArray(st['warehouseOrders'])) this.warehouseOrders.set(st['warehouseOrders'] as WarehouseOrder[]);
            if (Array.isArray(st['invoices'])) this.invoices.set(st['invoices'] as VeriFactuInvoice[]);
            if (Array.isArray(st['emailAccounts'])) {
              const loaded = st['emailAccounts'] as EmailAccountConfig[];
              const hasGerencia = loaded.some(a => a.emailAddress.toLowerCase() === 'gerencia@gruposoto.es');
              this.emailAccounts.set(hasGerencia ? loaded : [INITIAL_EMAIL_ACCOUNTS[0], ...loaded]);
            }
            if (Array.isArray(st['emailMessages'])) this.emailMessages.set(st['emailMessages'] as EmailMessageItem[]);
          } else {
            this.persistStateToPostgresDb();
          }
          if (Array.isArray(res.leads) && res.leads.length > 0) {
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
    this.http.put('/api/v1/state', payload).subscribe({
      next: () => this.dbSyncedStatus.set('SINCRONIZADO_DB_NOVA'),
      error: () => this.dbSyncedStatus.set('MODO_LOCAL')
    });
  }

  toggleTheme(): void {
    this.themeMode.set(this.themeMode() === 'noir' ? 'ivory' : 'noir');
  }

  setRole(role: UserRole, roleLabel: string): void {
    this.currentUser.update(u => ({ ...u, role, roleLabel }));
  }

  loginWithCredentials(email: string, role: UserRole = 'SUPERADMIN'): void {
    const labels: Record<UserRole, string> = {
      SUPERADMIN: 'Administrador Total · Gerencia Grupo Soto',
      GERENCIA: 'Gerencia & Dirección',
      OFICINA_TECNICA: 'Oficina Técnica & Presupuestos',
      COMERCIAL: 'Asesor Comercial Showroom',
      MEDIDOR_OBRA: 'Técnico Medidor en Obra',
      INSTALADOR_MONTAJE: 'Jefe de Equipo Instalador',
      ADMINISTRACION_FACTURACION: 'Administración & VeriFactu',
      COLABORADOR_EXTERNO: 'Arquitecto / Distribuidor B2B'
    };
    const normalizedEmail = (email || 'gerencia@gruposoto.es').trim().toLowerCase();
    const fullName =
      normalizedEmail === 'gerencia@gruposoto.es'
        ? 'Gerencia General · Grupo Soto'
        : 'Usuario Corporativo · NOVA';
    this.currentUser.update(u => ({
      ...u,
      fullName,
      email: normalizedEmail,
      role,
      roleLabel: labels[role]
    }));
    this.isAuthenticated.set(true);
  }

  applyBulkTariffPercentage(seriesId: string, percentageDelta: number): void {
    const factor = 1 + percentageDelta / 100;
    this.catalogSeries.update(list =>
      list.map(s =>
        s.id !== seriesId
          ? s
          : {
              ...s,
              matrixTariffPrices: s.matrixTariffPrices.map(row =>
                row.map(cell => Math.round(cell * factor * 100) / 100)
              )
            }
      )
    );
    this.persistStateToPostgresDb();
  }

  updateSeriesMatrixFromPastedText(seriesId: string, rawText: string): boolean {
    const rows = rawText
      .trim()
      .split(/\r?\n/)
      .map(line =>
        line
          .trim()
          .split(/[\t;,\s]+/)
          .map(v => Number(v.replace(',', '.')))
          .filter(n => !Number.isNaN(n) && n > 0)
      )
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

  saveQuoteAndConvertToOrder(quote: PortalQuote): void {
    this.quotes.update(list => [quote, ...list]);
    const newOrder: WarehouseOrder = {
      id: `ord-${Date.now()}`,
      orderCode: `PED-2026-0${115 + this.warehouseOrders().length}`,
      quoteCode: quote.code,
      clientName: quote.clientName,
      clientNif: quote.clientNif,
      workAddress: quote.workAddress,
      circuitType: quote.projectType === 'SOLO_SUMINISTRO' ? 'SUMINISTRO_SIN_MONTAJE' : 'FABRICA_TERMINADA',
      assignedCaballete: `CABALLETE A-0${this.warehouseOrders().length + 4}`,
      unitsCount: quote.holes.reduce((acc, h) => acc + h.quantity, 0),
      totalAmountEur: quote.totalPvpEur,
      carpentryReceived: false,
      glassReceived: false,
      shutterMotorReceived: false,
      accessoriesReceived: false,
      operationalStatus: 'EN_FABRICACION',
      financialStatus: 'PENDIENTE_FACTURAR',
      deliveryNoteCode: `ALB-2026-009${this.warehouseOrders().length + 5}`,
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

  addEmailAccount(account: EmailAccountConfig): void {
    this.emailAccounts.update(list => [...list, account]);
    this.persistStateToPostgresDb();
  }

  sendEmailMessage(msg: Omit<EmailMessageItem, 'id' | 'sentAtIso' | 'openedByClient'>): void {
    const created: EmailMessageItem = {
      ...msg,
      id: `emsg-${Date.now()}`,
      sentAtIso: new Date().toISOString(),
      openedByClient: false
    };
    this.emailMessages.update(list => [created, ...list]);
    this.http.post('/api/v1/emails/send', created).subscribe({ error: () => {} });
    this.persistStateToPostgresDb();
  }

  private buildInitialQuotes(): PortalQuote[] {
    const h1 = this.pricingEngine.calculateHoleLine({
      id: 'h-init-1', posNumber: 1, roomLocation: 'Salón Principal · Mirador Sur',
      series: INITIAL_CATALOG_SERIES[0], openingHand: 'AMBAS_HOJAS_ACTIVA_DER',
      widthMm: 1600, heightMm: 1400, quantity: 2, finishCategory: 'FOLIO_2_CARAS',
      glass: INITIAL_GLASS_COMPOSITIONS[1], shutter: INITIAL_SHUTTER_OPTIONS[1],
      hasMotor: true, tapajuntasMm: 60, hasPremarco: true, hasDesmontaje: true, isLowSillUnder900Mm: false
    });
    const base = h1.totalLinePvpEur + 1770;
    return [{
      id: 'quo-init-1', code: 'PRE-2026-0192', clientName: 'Estudio Arquitectura Valcárcel SLP',
      clientNif: 'B73910245', clientPhone: '+34 620 44 18 90', clientEmail: 'estudio@valcarcelarquitectura.es',
      workAddress: 'Urb. Altorreal, Av. del Golf 42 · Molina de Segura', projectType: 'REFORMA_VIVIENDA',
      isHabitualResidence: true, clientSigned10PercentDeclaration: true, holes: [h1],
      installationLaborPvpEur: 1450, auxiliaryMeansPvpEur: 320, materialsCostRatioPercent: 36.4,
      qualifiesForReducedVat10: true, appliedVatPercent: 10, subtotalPvpEur: base,
      vatAmountEur: Math.round(base * 10) / 100, totalPvpEur: Math.round(base * 110) / 100,
      status: 'ACEPTADO_EN_PEDIDO', createdAtIso: new Date(Date.now() - 86400000 * 3).toISOString()
    }];
  }

  private buildInitialChainedInvoices(): VeriFactuInvoice[] {
    const nifEmisor = 'B73849102';
    const genesis = '0'.repeat(64);
    const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString();
    const todayIso = new Date().toISOString();
    const h1 = this.verifactuXml.computeDeterministicAeatHash64({
      nifEmisor, seriesAndNumber: 'FAC-2026001', issueDateIso: fiveDaysAgo,
      invoiceType: 'ANTICIPO_OBRA', vatAmountEur: 675.0, totalImporteEur: 7425.0, previousHash64: genesis
    });
    const h2 = this.verifactuXml.computeDeterministicAeatHash64({
      nifEmisor, seriesAndNumber: 'FAC-2026002', issueDateIso: todayIso,
      invoiceType: 'F1_ORDINARIA', vatAmountEur: 631.73, totalImporteEur: 3640.0, previousHash64: h1
    });
    return [
      {
        id: 'inv-02', seriesAndNumber: 'FAC-2026002', invoiceType: 'F1_ORDINARIA', orderCode: 'PED-2026-0107',
        clientName: 'Reformas Integrales Levante SL (Recogida Almacén)', clientNif: 'B30884129',
        workDescription: 'Suministro Carpintería NOVA THERM 82 · Albarán ALB-2026-0091 (Sin Montaje)',
        issueDateIso: todayIso, diasPago: 0, dueDateIso: this.verifactuXml.computeNormalizedDueDateIso(todayIso, 0),
        baseImponibleEur: 3008.27, vatRatePercent: 21, vatAmountEur: 631.73, retencionGarantia5PercentEur: 0,
        totalImporteEur: 3640.0, cobradoEur: 0, operationalStatus: 'LISTO_RECOGIDA_ENTREGA', paymentStatus: 'HOY_VENCE',
        previousHash64: h1, currentHash64: h2,
        aeatQrUrl: this.verifactuXml.buildAeatQrVerificationUrl(nifEmisor, 'FAC-2026002', todayIso, 3640, h2),
        aeatSubmissionState: 'HUELLA_GENERADA'
      },
      {
        id: 'inv-01', seriesAndNumber: 'FAC-2026001', invoiceType: 'ANTICIPO_OBRA', orderCode: 'PED-2026-0104',
        clientName: 'Estudio Arquitectura Valcárcel SLP', clientNif: 'B73910245',
        workDescription: 'Anticipo 50% Pedido PED-2026-0104 · Villa Altorreal',
        issueDateIso: fiveDaysAgo, diasPago: 15, dueDateIso: this.verifactuXml.computeNormalizedDueDateIso(fiveDaysAgo, 15),
        baseImponibleEur: 6750.0, vatRatePercent: 10, vatAmountEur: 675.0, retencionGarantia5PercentEur: 0,
        totalImporteEur: 7425.0, cobradoEur: 7425.0, operationalStatus: 'COMPLETO_EN_ALMACEN', paymentStatus: 'COBRADA',
        previousHash64: genesis, currentHash64: h1,
        aeatQrUrl: this.verifactuXml.buildAeatQrVerificationUrl(nifEmisor, 'FAC-2026001', fiveDaysAgo, 7425, h1),
        aeatSubmissionState: 'EXPORTADO_GESTORIA'
      }
    ];
  }
}
