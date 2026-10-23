export type UserRole =
  | 'SUPERADMIN'
  | 'GERENCIA'
  | 'OFICINA_TECNICA'
  | 'ALMACEN_OBRA'
  | 'ADMINISTRACION';

export type PortalThemeMode = 'noir' | 'ivory';

export interface PortalUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  tenantId: string;
  tenantName: string;
  branchName: string;
}

export type MatrixPricingMode = 'CARPENTRY_ONLY' | 'INCLUDES_BASE_GLASS';

export type OpeningTypeCode =
  | 'PRACTICABLE_1H'
  | 'OSCILOBATIENTE_1H'
  | 'OSCILOBATIENTE_2H'
  | 'CORREDERA_2H'
  | 'ELEVABLE_2H'
  | 'PUERTA_PIVOTANTE'
  | 'FIJO_PANORAMICO';

export type OpeningHandCode =
  | 'DERECHA_INTERIOR'
  | 'IZQUIERDA_INTERIOR'
  | 'AMBAS_HOJAS_ACTIVA_DER'
  | 'CORREDERA_HOJA_ACTIVA_DER'
  | 'CORREDERA_HOJA_ACTIVA_IZQ'
  | 'FIJO_SIN_APERTURA';

export type FinishColorCategory =
  | 'BLANCO_ESTANDAR'
  | 'FOLIO_1_CARA'
  | 'FOLIO_2_CARAS'
  | 'LACADO_QUALICOAT'
  | 'BICOLOR_ARQUITECTONICO'
  | 'MADERA_NOBLE';

export interface CatalogSeries {
  id: string;
  code: string;
  publicName: string;
  supplierBrand: string;
  showSupplierOnWeb: boolean;
  material: 'PVC' | 'ALUMINIO' | 'MIXTO' | 'PUERTAS';
  openingType: OpeningTypeCode;
  pricingMode: MatrixPricingMode;
  baseGlassIncludedCreditPerM2: number;
  supplierDiscountChain: number[];
  retailMarginMultiplier: number;
  colorSurchargePercent: Record<FinishColorCategory, number>;
  widthsMm: number[];
  heightsMm: number[];
  matrixTariffPrices: number[][];
  minWidthMm: number;
  maxWidthMm: number;
  minHeightMm: number;
  maxHeightMm: number;
  onlineStoreEnabled: boolean;
}

export interface GlassComposition {
  id: string;
  code: string;
  name: string;
  thicknessMm: number;
  ugValue: string;
  rwDb: number;
  gSolar: string;
  costPerM2Eur: number;
  minBillableM2: number;
  weightKgPerM2: number;
  isSafetyLaminated: boolean;
}

export interface ShutterAndSolarOption {
  id: string;
  code: string;
  name: string;
  category: 'SIN_PERSIANA' | 'MONOBLOCK_PVC' | 'CAJON_OBRA' | 'MOSQUITERA';
  boxHeightDeductionMm: number;
  pricePerM2Eur: number;
  motorAddonEur: number;
}

export interface QuoteHoleLine {
  id: string;
  posNumber: number;
  roomLocation: string;
  seriesId: string;
  seriesName: string;
  openingType: OpeningTypeCode;
  openingHand: OpeningHandCode;
  widthMm: number;
  heightMm: number;
  quantity: number;
  finishCategory: FinishColorCategory;
  glassId: string;
  glassName: string;
  shutterId: string;
  shutterName: string;
  hasMotor: boolean;
  tapajuntasMm: 0 | 40 | 60 | 80;
  hasPremarco: boolean;
  hasDesmontaje: boolean;
  isLowSillUnder900Mm: boolean;
  stepWidthUsedMm: number;
  stepHeightUsedMm: number;
  carpentryNetCostEur: number;
  glassNetCostEur: number;
  extrasNetCostEur: number;
  unitPvpEur: number;
  totalLinePvpEur: number;
  unitWeightKg: number;
  cteSuaSafetyWarning: string | null;
}

export interface PortalQuote {
  id: string;
  code: string;
  clientName: string;
  clientNif: string;
  clientPhone: string;
  clientEmail: string;
  workAddress: string;
  projectType: 'OBRA_NUEVA' | 'REFORMA_VIVIENDA' | 'SOLO_SUMINISTRO';
  isHabitualResidence: boolean;
  clientSigned10PercentDeclaration: boolean;
  holes: QuoteHoleLine[];
  installationLaborPvpEur: number;
  auxiliaryMeansPvpEur: number;
  materialsCostRatioPercent: number;
  qualifiesForReducedVat10: boolean;
  appliedVatPercent: 21 | 10 | 0;
  subtotalPvpEur: number;
  vatAmountEur: number;
  totalPvpEur: number;
  status: 'BORRADOR' | 'ENVIADO' | 'ACEPTADO_EN_PEDIDO';
  createdAtIso: string;
}

export type WarehouseCircuitType =
  | 'FABRICA_TERMINADA'
  | 'BARRAS_TALLER'
  | 'KIT_CAJON_MOSQUITERA'
  | 'SUMINISTRO_SIN_MONTAJE';

export type WarehouseOperationalStatus =
  | 'EN_FABRICACION'
  | 'RECIBIDO_PARCIAL'
  | 'COMPLETO_EN_ALMACEN'
  | 'LISTO_RECOGIDA_ENTREGA'
  | 'EN_OBRA'
  | 'INSTALADO';

export type WarehouseFinancialStatus =
  | 'PENDIENTE_FACTURAR'
  | 'ANTICIPO_50_FACTURADO'
  | 'FACTURADO_TOTAL'
  | 'COBRADO_COMPLETO';

export interface WarehouseOrder {
  id: string;
  orderCode: string;
  quoteCode: string;
  clientName: string;
  clientNif: string;
  workAddress: string;
  circuitType: WarehouseCircuitType;
  assignedCaballete: string;
  unitsCount: number;
  totalAmountEur: number;
  carpentryReceived: boolean;
  glassReceived: boolean;
  shutterMotorReceived: boolean;
  accessoriesReceived: boolean;
  operationalStatus: WarehouseOperationalStatus;
  financialStatus: WarehouseFinancialStatus;
  deliveryNoteCode: string;
  updatedAtIso: string;
}

export type InvoicePaymentStatus = 'COBRADA' | 'EN_PLAZO' | 'HOY_VENCE' | 'VENCIDA';

export interface VeriFactuInvoice {
  id: string;
  seriesAndNumber: string;
  invoiceType: 'F1_ORDINARIA' | 'ANTICIPO_OBRA' | 'CERTIFICACION' | 'R1_RECTIFICATIVA';
  orderCode: string;
  clientName: string;
  clientNif: string;
  workDescription: string;
  issueDateIso: string;
  diasPago: number;
  dueDateIso: string;
  baseImponibleEur: number;
  vatRatePercent: 21 | 10 | 0;
  vatAmountEur: number;
  retencionGarantia5PercentEur: number;
  totalImporteEur: number;
  cobradoEur: number;
  operationalStatus: WarehouseOperationalStatus;
  paymentStatus: InvoicePaymentStatus;
  previousHash64: string;
  currentHash64: string;
  aeatQrUrl: string;
  aeatSubmissionState: 'HUELLA_GENERADA' | 'EXPORTADO_GESTORIA' | 'ENVIADO_AEAT_OK';
}

export interface VeriFactuVaultConfig {
  activeMode: 'MODO_1_XML_QR' | 'MODO_2_PACK_GESTORIA' | 'MODO_3_ENVIO_DIRECTO_AEAT';
  softwareName: string;
  softwareId: string;
  softwareVersion: string;
  nifEmisor: string;
  razonSocialEmisor: string;
  environment: 'AEAT_SANDBOX_PRUEBAS' | 'AEAT_PRODUCCION';
  certificateLoaded: boolean;
  certificateFileName: string;
  certificateSubject: string;
  certificateValidUntil: string;
  autoSendOnIssue: boolean;
}

export interface EmailAccountConfig {
  id: string;
  aliasName: string;
  emailAddress: string;
  department: 'PRESUPUESTOS' | 'FACTURACION' | 'FABRICA_COMPRAS' | 'GENERAL';
  smtpHost: string;
  smtpPort: number;
  imapHost: string;
  imapPort: number;
  useTls: boolean;
  status: 'CONECTADO_OK' | 'PENDIENTE_VERIFICAR';
  signatureHtml: string;
}

export interface EmailMessageItem {
  id: string;
  folder: 'ENVIADOS' | 'RECIBIDOS' | 'PLANTILLAS';
  accountEmail: string;
  counterpartEmail: string;
  counterpartName: string;
  subject: string;
  linkedDocumentCode: string;
  snippet: string;
  sentAtIso: string;
  openedByClient: boolean;
}

export interface CrmLeadItem {
  id: string;
  tenantId?: string;
  createdAtIso: string;
  fullName: string;
  nif?: string;
  phone: string;
  email: string;
  city: string;
  projectType: string;
  recommendedSystem: string;
  status: 'NUEVO_WEB' | 'VISITA_AGENDADA' | 'PRESUPUESTADO';
}

export interface PortalTenantCompany {
  id: string;
  commercialName: string;
  legalName: string;
  cif: string;
  city: string;
  invoicePrefix: string;
  catalogPolicy: 'LOCKED_BY_CENTRAL' | 'CUSTOM_MARGIN_ALLOWED';
  adminEmail: string;
  active: boolean;
  leadsCount?: number;
  quotesCount?: number;
  ordersCount?: number;
  invoicesCount?: number;
  invoicedTotalEur?: number;
}

export interface PortalManagedUser {
  id: string;
  tenantId: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  tokenVersion?: number;
}
