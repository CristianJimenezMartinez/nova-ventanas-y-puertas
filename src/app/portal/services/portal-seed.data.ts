import {
  CatalogSeries,
  CrmLeadItem,
  EmailAccountConfig,
  EmailMessageItem,
  GlassComposition,
  PortalQuote,
  ShutterAndSolarOption,
  VeriFactuInvoice,
  WarehouseOrder
} from '../models/portal.models';
import { PricingMatrixEngineService } from './pricing-matrix-engine.service';
import { VeriFactuXmlService } from './verifactu-xml.service';

export const INITIAL_CATALOG_SERIES: CatalogSeries[] = [
  {
    id: 'serie-nova-therm-82',
    code: 'NT-82-OB2H',
    publicName: 'NOVA THERM 82 Triple Junta · Oscilobatiente 2 Hojas',
    supplierBrand: 'Gama Europea PVC Clase A (7 Cámaras)',
    showSupplierOnWeb: false,
    material: 'PVC',
    openingType: 'OSCILOBATIENTE_2H',
    pricingMode: 'CARPENTRY_ONLY',
    baseGlassIncludedCreditPerM2: 0,
    supplierDiscountChain: [50, 5],
    retailMarginMultiplier: 1.75,
    colorSurchargePercent: {
      BLANCO_ESTANDAR: 0,
      FOLIO_1_CARA: 18,
      FOLIO_2_CARAS: 28,
      LACADO_QUALICOAT: 25,
      BICOLOR_ARQUITECTONICO: 32,
      MADERA_NOBLE: 38
    },
    widthsMm: [800, 1000, 1200, 1400, 1600, 1800, 2000],
    heightsMm: [800, 1000, 1200, 1400, 1600, 2000, 2200],
    matrixTariffPrices: [
      [420, 465, 515, 565, 620, 680, 745],
      [460, 510, 565, 625, 685, 750, 820],
      [505, 560, 620, 685, 755, 825, 900],
      [555, 615, 680, 750, 825, 905, 985],
      [610, 675, 745, 820, 900, 985, 1075],
      [715, 790, 875, 965, 1060, 1160, 1265],
      [780, 865, 955, 1050, 1155, 1265, 1380]
    ],
    minWidthMm: 600,
    maxWidthMm: 2400,
    minHeightMm: 600,
    maxHeightMm: 2400,
    onlineStoreEnabled: true
  },
  {
    id: 'serie-nova-alu-minimal-75',
    code: 'NAM-75-HO1H',
    publicName: 'NOVA ALU MINIMAL 75 RPT · Hoja Oculta 1 Hoja Oscilobatiente',
    supplierBrand: 'Sistema Arquitectónico Aluminio Hoja Oculta',
    showSupplierOnWeb: false,
    material: 'ALUMINIO',
    openingType: 'OSCILOBATIENTE_1H',
    pricingMode: 'INCLUDES_BASE_GLASS',
    baseGlassIncludedCreditPerM2: 34,
    supplierDiscountChain: [45, 5],
    retailMarginMultiplier: 1.8,
    colorSurchargePercent: {
      BLANCO_ESTANDAR: 0,
      FOLIO_1_CARA: 14,
      FOLIO_2_CARAS: 22,
      LACADO_QUALICOAT: 12,
      BICOLOR_ARQUITECTONICO: 24,
      MADERA_NOBLE: 35
    },
    widthsMm: [600, 800, 1000, 1200, 1400, 1600],
    heightsMm: [800, 1000, 1200, 1400, 1600, 2100],
    matrixTariffPrices: [
      [510, 565, 625, 690, 760, 835],
      [560, 625, 690, 765, 845, 925],
      [620, 690, 765, 845, 930, 1020],
      [685, 760, 840, 930, 1025, 1125],
      [755, 835, 925, 1020, 1125, 1235],
      [890, 985, 1090, 1205, 1325, 1455]
    ],
    minWidthMm: 500,
    maxWidthMm: 1600,
    minHeightMm: 600,
    maxHeightMm: 2300,
    onlineStoreEnabled: true
  },
  {
    id: 'serie-nova-horizon-lift',
    code: 'NHL-160-EL2H',
    publicName: 'NOVA HORIZON LIFT Cota Cero · Corredera Elevable 2 Hojas',
    supplierBrand: 'Sistema Elevable Minimalista Cota Cero',
    showSupplierOnWeb: false,
    material: 'ALUMINIO',
    openingType: 'ELEVABLE_2H',
    pricingMode: 'CARPENTRY_ONLY',
    baseGlassIncludedCreditPerM2: 0,
    supplierDiscountChain: [42, 5],
    retailMarginMultiplier: 1.75,
    colorSurchargePercent: {
      BLANCO_ESTANDAR: 0,
      FOLIO_1_CARA: 15,
      FOLIO_2_CARAS: 22,
      LACADO_QUALICOAT: 10,
      BICOLOR_ARQUITECTONICO: 20,
      MADERA_NOBLE: 35
    },
    widthsMm: [2000, 2500, 3000, 3500, 4000, 4500],
    heightsMm: [2000, 2200, 2400, 2600, 2800],
    matrixTariffPrices: [
      [1890, 2140, 2420, 2720, 3050, 3410],
      [2040, 2310, 2610, 2940, 3290, 3680],
      [2210, 2500, 2825, 3180, 3560, 3980],
      [2390, 2710, 3060, 3440, 3860, 4310],
      [2590, 2935, 3315, 3730, 4185, 4675]
    ],
    minWidthMm: 1800,
    maxWidthMm: 5500,
    minHeightMm: 1900,
    maxHeightMm: 3000,
    onlineStoreEnabled: false
  },
  {
    id: 'serie-nova-shield-rc3',
    code: 'NSH-95-PIV',
    publicName: 'NOVA SHIELD Pivot & Acorazada RC3 · Puerta Entrada Coplanar',
    supplierBrand: 'División Puertas Monumentales RC3',
    showSupplierOnWeb: false,
    material: 'PUERTAS',
    openingType: 'PUERTA_PIVOTANTE',
    pricingMode: 'CARPENTRY_ONLY',
    baseGlassIncludedCreditPerM2: 0,
    supplierDiscountChain: [40],
    retailMarginMultiplier: 1.7,
    colorSurchargePercent: {
      BLANCO_ESTANDAR: 0,
      FOLIO_1_CARA: 12,
      FOLIO_2_CARAS: 18,
      LACADO_QUALICOAT: 10,
      BICOLOR_ARQUITECTONICO: 18,
      MADERA_NOBLE: 26
    },
    widthsMm: [1000, 1200, 1400, 1600, 1800],
    heightsMm: [2100, 2300, 2500, 2800, 3000],
    matrixTariffPrices: [
      [2450, 2720, 3010, 3340, 3690],
      [2680, 2980, 3295, 3650, 4030],
      [2940, 3260, 3610, 3990, 4410],
      [3290, 3650, 4040, 4470, 4940],
      [3620, 4015, 4445, 4920, 5435]
    ],
    minWidthMm: 900,
    maxWidthMm: 2000,
    minHeightMm: 2000,
    maxHeightMm: 3200,
    onlineStoreEnabled: false
  }
];

export const INITIAL_GLASS_COMPOSITIONS: GlassComposition[] = [
  {
    id: 'glass-be-argon-4-16-4',
    code: 'VID-BE-24',
    name: 'Doble 4 / 16 Argón / 4 Bajo Emisivo + Control Solar',
    thicknessMm: 24,
    ugValue: '1.0 W/m²K',
    rwDb: 33,
    gSolar: '0.38',
    costPerM2Eur: 44,
    minBillableM2: 0.5,
    weightKgPerM2: 20,
    isSafetyLaminated: false
  },
  {
    id: 'glass-laminar-silence-44-16-6',
    code: 'VID-LAM-SIL-30',
    name: 'Seguridad Acústico 4+4.2 Silence / 16 Argón / 6 Control Solar (CTE DB-SUA 2)',
    thicknessMm: 30,
    ugValue: '1.0 W/m²K',
    rwDb: 42,
    gSolar: '0.36',
    costPerM2Eur: 78,
    minBillableM2: 0.5,
    weightKgPerM2: 35,
    isSafetyLaminated: true
  },
  {
    id: 'glass-triple-passiv-48',
    code: 'VID-TRI-PASSIV-48',
    name: 'Triple Passivhaus 4+4.2 / 14 Ar / 4 / 14 Ar / 4+4.2 Doble Bajo Emisivo',
    thicknessMm: 48,
    ugValue: '0.5 W/m²K',
    rwDb: 46,
    gSolar: '0.34',
    costPerM2Eur: 124,
    minBillableM2: 0.5,
    weightKgPerM2: 50,
    isSafetyLaminated: true
  },
  {
    id: 'glass-rc2-66-16-6',
    code: 'VID-RC2-34',
    name: 'Antirrobo 6+6.2 Butiral Acústico / 16 Argón / 6 Templado Solar',
    thicknessMm: 34,
    ugValue: '1.0 W/m²K',
    rwDb: 45,
    gSolar: '0.36',
    costPerM2Eur: 112,
    minBillableM2: 0.5,
    weightKgPerM2: 45,
    isSafetyLaminated: true
  }
];

export const INITIAL_SHUTTER_OPTIONS: ShutterAndSolarOption[] = [
  {
    id: 'shutter-none',
    code: 'SIN-CAJON',
    name: 'Sin cajón de persiana (Luz 100% libre)',
    category: 'SIN_PERSIANA',
    boxHeightDeductionMm: 0,
    pricePerM2Eur: 0,
    motorAddonEur: 0
  },
  {
    id: 'shutter-monoblock-185',
    code: 'CAJ-ISO-185',
    name: 'Cajón Monoblock Termoacústico Rw 42dB (185 mm) + Lama Aluminio Térmica',
    category: 'MONOBLOCK_PVC',
    boxHeightDeductionMm: 185,
    pricePerM2Eur: 86,
    motorAddonEur: 135
  },
  {
    id: 'shutter-autoblocante-200',
    code: 'CAJ-SEC-200',
    name: 'Cajón Aislado 200 mm + Lama Aluminio Extruido Autoblocante Antirrobo',
    category: 'MONOBLOCK_PVC',
    boxHeightDeductionMm: 200,
    pricePerM2Eur: 142,
    motorAddonEur: 165
  }
];

export const INITIAL_WAREHOUSE_ORDERS: WarehouseOrder[] = [
  {
    id: 'ord-01',
    orderCode: 'PED-2026-0104',
    quoteCode: 'PRE-2026-0192',
    clientName: 'Estudio Arquitectura Valcárcel SLP',
    clientNif: 'B73910245',
    workAddress: 'Urb. Altorreal, Av. del Golf 42 · Molina de Segura',
    circuitType: 'FABRICA_TERMINADA',
    assignedCaballete: 'CABALLETE A-03',
    unitsCount: 9,
    totalAmountEur: 14850.0,
    carpentryReceived: true,
    glassReceived: true,
    shutterMotorReceived: true,
    accessoriesReceived: true,
    operationalStatus: 'COMPLETO_EN_ALMACEN',
    financialStatus: 'ANTICIPO_50_FACTURADO',
    deliveryNoteCode: 'ALB-2026-0088',
    updatedAtIso: new Date().toISOString()
  },
  {
    id: 'ord-02',
    orderCode: 'PED-2026-0107',
    quoteCode: 'PRE-2026-0198',
    clientName: 'Reformas Integrales Levante SL (Solo Suministro B2B)',
    clientNif: 'B30884129',
    workAddress: 'Recogida directa en Almacén Pol. La Serreta (Sin Montaje)',
    circuitType: 'SUMINISTRO_SIN_MONTAJE',
    assignedCaballete: 'ZONA EXPEDICIÓN B-01',
    unitsCount: 4,
    totalAmountEur: 3640.0,
    carpentryReceived: true,
    glassReceived: true,
    shutterMotorReceived: true,
    accessoriesReceived: true,
    operationalStatus: 'LISTO_RECOGIDA_ENTREGA',
    financialStatus: 'PENDIENTE_FACTURAR',
    deliveryNoteCode: 'ALB-2026-0091',
    updatedAtIso: new Date().toISOString()
  },
  {
    id: 'ord-03',
    orderCode: 'PED-2026-0111',
    quoteCode: 'PRE-2026-0204',
    clientName: 'D. Alejandro Morales Cano · Ático Gran Vía',
    clientNif: '48519203L',
    workAddress: 'Gran Vía Escultor Salzillo 18, 7ºA · Murcia',
    circuitType: 'KIT_CAJON_MOSQUITERA',
    assignedCaballete: 'CABALLETE A-08',
    unitsCount: 6,
    totalAmountEur: 8920.0,
    carpentryReceived: true,
    glassReceived: false,
    shutterMotorReceived: true,
    accessoriesReceived: true,
    operationalStatus: 'RECIBIDO_PARCIAL',
    financialStatus: 'ANTICIPO_50_FACTURADO',
    deliveryNoteCode: 'ALB-2026-0094',
    updatedAtIso: new Date().toISOString()
  }
];

export const INITIAL_EMAIL_ACCOUNTS: EmailAccountConfig[] = [
  {
    id: 'mail-gerencia-soto',
    aliasName: 'Gerencia General · Grupo Soto (Administrador)',
    emailAddress: 'gerencia@gruposoto.es',
    department: 'GENERAL',
    smtpHost: 'smtp.ionos.es',
    smtpPort: 587,
    imapHost: 'imap.ionos.es',
    imapPort: 993,
    useTls: true,
    status: 'CONECTADO_OK',
    signatureHtml: 'Gerencia General · GRUPO SOTO EMPRESARIAL SL · NOVA Ventanas & Puertas'
  },
  {
    id: 'mail-presupuestos',
    aliasName: 'NOVA Oficina Técnica & Presupuestos',
    emailAddress: 'presupuestos@novaventanasypuertas.com',
    department: 'PRESUPUESTOS',
    smtpHost: 'smtp.ionos.es',
    smtpPort: 587,
    imapHost: 'imap.ionos.es',
    imapPort: 993,
    useTls: true,
    status: 'CONECTADO_OK',
    signatureHtml: 'Oficina Técnica · NOVA Ventanas & Puertas (Grupo Soto) · Pol. Ind. La Serreta, Molina de Segura'
  },
  {
    id: 'mail-facturacion',
    aliasName: 'NOVA Administración & VeriFactu',
    emailAddress: 'administracion@novaventanasypuertas.com',
    department: 'FACTURACION',
    smtpHost: 'smtp.ionos.es',
    smtpPort: 587,
    imapHost: 'imap.ionos.es',
    imapPort: 993,
    useTls: true,
    status: 'CONECTADO_OK',
    signatureHtml: 'Departamento de Administración y Facturación VeriFactu · GRUPO SOTO EMPRESARIAL SL'
  },
  {
    id: 'mail-compras',
    aliasName: 'NOVA Logística & Pedidos a Fábrica',
    emailAddress: 'compras@novaventanasypuertas.com',
    department: 'FABRICA_COMPRAS',
    smtpHost: 'smtp.ionos.es',
    smtpPort: 587,
    imapHost: 'imap.ionos.es',
    imapPort: 993,
    useTls: true,
    status: 'CONECTADO_OK',
    signatureHtml: 'Almacén y Compras · NOVA Ventanas & Puertas · Recepción de Mercancía La Serreta'
  }
];

export const INITIAL_EMAIL_MESSAGES: EmailMessageItem[] = [
  {
    id: 'emsg-01',
    folder: 'ENVIADOS',
    accountEmail: 'presupuestos@novaventanasypuertas.com',
    counterpartEmail: 'estudio@valcarcelarquitectura.es',
    counterpartName: 'Estudio Arquitectura Valcárcel SLP',
    subject: 'Propuesta Técnica PRE-2026-0192 · Villa Altorreal (Croquis UNE-EN 12519 adjunto)',
    linkedDocumentCode: 'PRE-2026-0192',
    snippet: 'Adjuntamos dossier técnico con memoria de carpintería NOVA THERM 82 y NOVA HORIZON LIFT Cota Cero...',
    sentAtIso: new Date(Date.now() - 86400000 * 2).toISOString(),
    openedByClient: true
  },
  {
    id: 'emsg-02',
    folder: 'ENVIADOS',
    accountEmail: 'administracion@novaventanasypuertas.com',
    counterpartEmail: 'contabilidad@reformaslevante.es',
    counterpartName: 'Reformas Integrales Levante SL',
    subject: 'Aviso de Material Listo en Almacén · Pedido PED-2026-0107 (Caballete B-01)',
    linkedDocumentCode: 'PED-2026-0107',
    snippet: 'Su pedido de solo suministro se encuentra completo y revisado en nuestra zona de expedición...',
    sentAtIso: new Date(Date.now() - 3600000 * 5).toISOString(),
    openedByClient: true
  }
];

export const INITIAL_CRM_LEADS: CrmLeadItem[] = [
  {
    id: 'lead-01',
    createdAtIso: new Date(Date.now() - 3600000 * 14).toISOString(),
    fullName: 'Dra. Carmen Riquelme Gómez',
    phone: '+34 648 11 29 40',
    email: 'carmen.riquelme@clinicarq.es',
    city: 'Altorreal · Molina de Segura',
    projectType: 'OBRA_NUEVA',
    recommendedSystem: 'NOVA HORIZON LIFT Cota Cero + NOVA THERM 82',
    status: 'VISITA_AGENDADA'
  }
];

export function buildSeedQuotes(pricingEngine: PricingMatrixEngineService): PortalQuote[] {
  const h1 = pricingEngine.calculateHoleLine({
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

export function buildSeedChainedInvoices(verifactuXml: VeriFactuXmlService): VeriFactuInvoice[] {
  const nifEmisor = 'B73849102';
  const genesis = '0'.repeat(64);
  const fiveDaysAgo = new Date(Date.now() - 86400000 * 5).toISOString();
  const todayIso = new Date().toISOString();
  const h1 = verifactuXml.computeDeterministicAeatHash64({
    nifEmisor, seriesAndNumber: 'FAC-2026001', issueDateIso: fiveDaysAgo,
    invoiceType: 'ANTICIPO_OBRA', vatAmountEur: 675.0, totalImporteEur: 7425.0, previousHash64: genesis
  });
  const h2 = verifactuXml.computeDeterministicAeatHash64({
    nifEmisor, seriesAndNumber: 'FAC-2026002', issueDateIso: todayIso,
    invoiceType: 'F1_ORDINARIA', vatAmountEur: 631.73, totalImporteEur: 3640.0, previousHash64: h1
  });
  return [
    {
      id: 'inv-02', seriesAndNumber: 'FAC-2026002', invoiceType: 'F1_ORDINARIA', orderCode: 'PED-2026-0107',
      clientName: 'Reformas Integrales Levante SL (Recogida Almacén)', clientNif: 'B30884129',
      workDescription: 'Suministro Carpintería NOVA THERM 82 · Albarán ALB-2026-0091 (Sin Montaje)',
      issueDateIso: todayIso, diasPago: 0, dueDateIso: verifactuXml.computeNormalizedDueDateIso(todayIso, 0),
      baseImponibleEur: 3008.27, vatRatePercent: 21, vatAmountEur: 631.73, retencionGarantia5PercentEur: 0,
      totalImporteEur: 3640.0, cobradoEur: 0, operationalStatus: 'LISTO_RECOGIDA_ENTREGA', paymentStatus: 'HOY_VENCE',
      previousHash64: h1, currentHash64: h2,
      aeatQrUrl: verifactuXml.buildAeatQrVerificationUrl(nifEmisor, 'FAC-2026002', todayIso, 3640, h2),
      aeatSubmissionState: 'HUELLA_GENERADA'
    },
    {
      id: 'inv-01', seriesAndNumber: 'FAC-2026001', invoiceType: 'ANTICIPO_OBRA', orderCode: 'PED-2026-0104',
      clientName: 'Estudio Arquitectura Valcárcel SLP', clientNif: 'B73910245',
      workDescription: 'Anticipo 50% Pedido PED-2026-0104 · Villa Altorreal',
      issueDateIso: fiveDaysAgo, diasPago: 15, dueDateIso: verifactuXml.computeNormalizedDueDateIso(fiveDaysAgo, 15),
      baseImponibleEur: 6750.0, vatRatePercent: 10, vatAmountEur: 675.0, retencionGarantia5PercentEur: 0,
      totalImporteEur: 7425.0, cobradoEur: 7425.0, operationalStatus: 'COMPLETO_EN_ALMACEN', paymentStatus: 'COBRADA',
      previousHash64: genesis, currentHash64: h1,
      aeatQrUrl: verifactuXml.buildAeatQrVerificationUrl(nifEmisor, 'FAC-2026001', fiveDaysAgo, 7425, h1),
      aeatSubmissionState: 'EXPORTADO_GESTORIA'
    }
  ];
}
