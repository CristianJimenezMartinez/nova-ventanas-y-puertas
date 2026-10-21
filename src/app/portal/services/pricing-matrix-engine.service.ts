import { Injectable } from '@angular/core';
import {
  CatalogSeries,
  FinishColorCategory,
  GlassComposition,
  OpeningHandCode,
  QuoteHoleLine,
  ShutterAndSolarOption
} from '../models/portal.models';

export interface HoleCalculationInput {
  id?: string;
  posNumber: number;
  roomLocation: string;
  series: CatalogSeries;
  openingHand: OpeningHandCode;
  widthMm: number;
  heightMm: number;
  quantity: number;
  finishCategory: FinishColorCategory;
  glass: GlassComposition;
  shutter: ShutterAndSolarOption;
  hasMotor: boolean;
  tapajuntasMm: 0 | 40 | 60 | 80;
  hasPremarco: boolean;
  hasDesmontaje: boolean;
  isLowSillUnder900Mm: boolean;
}

export interface Vat10PercentAssessment {
  totalMaterialsNetEur: number;
  totalQuoteBaseEur: number;
  materialsRatioPercent: number;
  qualifiesFor10PercentVat: boolean;
  recommendedVatPercent: 21 | 10 | 0;
  explanation: string;
}

@Injectable({
  providedIn: 'root'
})
export class PricingMatrixEngineService {
  /**
   * Calcula una posición de carpintería aplicando:
   * 1. Escalón superior en la Matriz 2D (Ancho x Alto) descontando altura de cajón si aplica.
   * 2. Recargo por color/folio/bicolor.
   * 3. Cadena de descuentos de compra del proveedor (ej. -50% -5%).
   * 4. Modalidad CARPENTRY_ONLY vs INCLUDES_BASE_GLASS (abono de vidrio base).
   * 5. Mínimo de facturación de vidrio de 0.50 m² por hoja y alerta CTE DB-SUA 2.
   */
  calculateHoleLine(input: HoleCalculationInput): QuoteHoleLine {
    const { series, glass, shutter } = input;
    const widthMm = Math.max(series.minWidthMm, Math.min(series.maxWidthMm, input.widthMm));
    const heightMm = Math.max(series.minHeightMm, Math.min(series.maxHeightMm, input.heightMm));

    // 1. Búsqueda por escalón superior (Step-Up) en Matriz 2D
    const wIdx = this.findStepUpIndex(series.widthsMm, widthMm);
    const hIdx = this.findStepUpIndex(series.heightsMm, heightMm);
    const stepWidthUsedMm = series.widthsMm[wIdx] ?? series.widthsMm[series.widthsMm.length - 1];
    const stepHeightUsedMm = series.heightsMm[hIdx] ?? series.heightsMm[series.heightsMm.length - 1];

    const baseTariffPrice = series.matrixTariffPrices[hIdx]?.[wIdx] ?? 420;

    // 2. Recargo de Acabado / Foliado / Lacado
    const colorSurchargePct = series.colorSurchargePercent[input.finishCategory] ?? 0;
    const tariffWithColor = baseTariffPrice * (1 + colorSurchargePct / 100);

    // 3. Cadena de Descuentos de Proveedor en Cascada
    const netFactor = series.supplierDiscountChain.reduce(
      (acc, disc) => acc * (1 - disc / 100),
      1
    );
    let carpentryNetCostEur = tariffWithColor * netFactor;

    // 4. Superficie de vidrio real y mínimo de 0.50 m² por hoja
    const leavesCount =
      series.openingType === 'OSCILOBATIENTE_2H' ||
      series.openingType === 'CORREDERA_2H' ||
      series.openingType === 'ELEVABLE_2H'
        ? 2
        : 1;
    const effectiveGlassHeightMm = Math.max(300, heightMm - shutter.boxHeightDeductionMm - 110);
    const effectiveGlassWidthPerLeafMm = Math.max(250, widthMm / leavesCount - 110);

    const rawLeafAreaM2 = (effectiveGlassWidthPerLeafMm * effectiveGlassHeightMm) / 1_000_000;
    const billableLeafAreaM2 = Math.max(glass.minBillableM2 || 0.5, rawLeafAreaM2);
    const totalBillableGlassAreaM2 = billableLeafAreaM2 * leavesCount;

    // Si la matriz del fabricante ya incluye un vidrio base 4/16/4, descontamos su abono neto
    if (series.pricingMode === 'INCLUDES_BASE_GLASS') {
      const baseGlassCredit = totalBillableGlassAreaM2 * series.baseGlassIncludedCreditPerM2;
      carpentryNetCostEur = Math.max(95, carpentryNetCostEur - baseGlassCredit);
    }

    const glassNetCostEur = this.round2(totalBillableGlassAreaM2 * glass.costPerM2Eur);
    carpentryNetCostEur = this.round2(carpentryNetCostEur);

    // 5. Cajón de Persiana, Motorización y Perfiles Adicionales (Tapajuntas, Premarco, Desmontaje)
    const totalOpeningAreaM2 = (widthMm * heightMm) / 1_000_000;
    const perimeterLinearMeters = (2 * (widthMm + heightMm)) / 1000;

    let extrasNetCostEur = shutter.pricePerM2Eur * totalOpeningAreaM2;
    if (input.hasMotor && shutter.category !== 'SIN_PERSIANA') {
      extrasNetCostEur += shutter.motorAddonEur;
    }
    if (input.tapajuntasMm > 0) {
      const tapajuntasRatePerM = input.tapajuntasMm >= 80 ? 11.5 : input.tapajuntasMm >= 60 ? 9.0 : 7.2;
      extrasNetCostEur += perimeterLinearMeters * tapajuntasRatePerM;
    }
    if (input.hasPremarco) {
      extrasNetCostEur += perimeterLinearMeters * 14.5;
    }
    if (input.hasDesmontaje) {
      extrasNetCostEur += 48;
    }
    extrasNetCostEur = this.round2(extrasNetCostEur);

    // 6. PVP Unitario aplicando Multiplicador de Margen Comercial NOVA
    const totalUnitNetCost = carpentryNetCostEur + glassNetCostEur + extrasNetCostEur;
    const unitPvpEur = this.round2(totalUnitNetCost * series.retailMarginMultiplier);
    const qty = Math.max(1, input.quantity);
    const totalLinePvpEur = this.round2(unitPvpEur * qty);

    // 7. Peso de la unidad (kg) y validación normativa CTE DB-SUA 2 (Seguridad frente a impacto)
    const frameWeightKg = perimeterLinearMeters * 4.2;
    const glassWeightKg = totalBillableGlassAreaM2 * glass.weightKgPerM2;
    const unitWeightKg = this.round2(frameWeightKg + glassWeightKg);

    let cteSuaSafetyWarning: string | null = null;
    const requiresSafetyGlass =
      input.isLowSillUnder900Mm ||
      heightMm >= 1950 ||
      totalOpeningAreaM2 >= 2.4 ||
      series.openingType === 'PUERTA_PIVOTANTE' ||
      series.openingType === 'ELEVABLE_2H';

    if (requiresSafetyGlass && !glass.isSafetyLaminated) {
      cteSuaSafetyWarning =
        'AVISO CTE DB-SUA 2: Por altura de antepecho (<900 mm), balconera o gran formato, la normativa exige Vidrio Laminar de Seguridad (3+3 / 4+4 / 6+6).';
    }

    return {
      id: input.id || `hole-${Date.now()}-${input.posNumber}`,
      posNumber: input.posNumber,
      roomLocation: input.roomLocation || `Posición ${input.posNumber}`,
      seriesId: series.id,
      seriesName: series.publicName,
      openingType: series.openingType,
      openingHand: input.openingHand,
      widthMm,
      heightMm,
      quantity: qty,
      finishCategory: input.finishCategory,
      glassId: glass.id,
      glassName: glass.name,
      shutterId: shutter.id,
      shutterName: shutter.name,
      hasMotor: input.hasMotor,
      tapajuntasMm: input.tapajuntasMm,
      hasPremarco: input.hasPremarco,
      hasDesmontaje: input.hasDesmontaje,
      isLowSillUnder900Mm: input.isLowSillUnder900Mm,
      stepWidthUsedMm,
      stepHeightUsedMm,
      carpentryNetCostEur,
      glassNetCostEur,
      extrasNetCostEur,
      unitPvpEur,
      totalLinePvpEur,
      unitWeightKg,
      cteSuaSafetyWarning
    };
  }

  /**
   * Evalúa la Regla del 40% de Aportación de Materiales (Art. 91.Uno.2.10º Ley 37/1992 del IVA)
   * para determinar si una reforma en vivienda particular tributa al 10% o al 21%.
   */
  assessReducedVatRule(
    holes: QuoteHoleLine[],
    installationLaborPvpEur: number,
    auxiliaryMeansPvpEur: number,
    projectType: 'OBRA_NUEVA' | 'REFORMA_VIVIENDA' | 'SOLO_SUMINISTRO',
    isHabitualResidence: boolean,
    clientSigned10PercentDeclaration: boolean
  ): Vat10PercentAssessment {
    const totalMaterialsNetEur = this.round2(
      holes.reduce(
        (sum, h) => sum + (h.carpentryNetCostEur + h.glassNetCostEur + h.extrasNetCostEur) * h.quantity,
        0
      )
    );
    const totalHolesPvpEur = holes.reduce((sum, h) => sum + h.totalLinePvpEur, 0);
    const totalQuoteBaseEur = this.round2(totalHolesPvpEur + installationLaborPvpEur + auxiliaryMeansPvpEur);

    const materialsRatioPercent =
      totalQuoteBaseEur > 0 ? this.round2((totalMaterialsNetEur / totalQuoteBaseEur) * 100) : 0;

    const qualifiesFor10PercentVat =
      projectType === 'REFORMA_VIVIENDA' &&
      isHabitualResidence &&
      clientSigned10PercentDeclaration &&
      materialsRatioPercent <= 40;

    const recommendedVatPercent: 21 | 10 = qualifiesFor10PercentVat ? 10 : 21;

    let explanation = '';
    if (projectType === 'SOLO_SUMINISTRO') {
      explanation = 'Suministro de carpintería sin instalación en obra: tributación obligatoria al 21% IVA general.';
    } else if (qualifiesFor10PercentVat) {
      explanation = `Apto para IVA Reducido 10%: Reforma en vivienda con coste de materiales aportados del ${materialsRatioPercent}% (≤ 40% de la base imponible).`;
    } else {
      explanation = `Tributación al 21% IVA: El coste de materiales aportados representa el ${materialsRatioPercent}% de la operación (supera el límite legal del 40% o falta declaración de vivienda).`;
    }

    return {
      totalMaterialsNetEur,
      totalQuoteBaseEur,
      materialsRatioPercent,
      qualifiesFor10PercentVat,
      recommendedVatPercent,
      explanation
    };
  }

  private findStepUpIndex(steps: number[], value: number): number {
    const idx = steps.findIndex(s => s >= value);
    return idx >= 0 ? idx : steps.length - 1;
  }

  private round2(val: number): number {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }
}
