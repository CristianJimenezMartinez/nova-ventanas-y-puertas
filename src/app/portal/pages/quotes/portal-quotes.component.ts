import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PortalStoreService } from '../../services/portal-store.service';
import { PricingMatrixEngineService } from '../../services/pricing-matrix-engine.service';
import { WindowSketchSvgService } from '../../services/window-sketch-svg.service';
import { PortalPdfGeneratorService } from '../../services/portal-pdf-generator.service';
import {
  CrmLeadItem,
  FinishColorCategory,
  OpeningHandCode,
  PortalQuote,
  QuoteHoleLine
} from '../../models/portal.models';
import { ClientSearchComponent } from '../../components/client-search/client-search.component';

@Component({
  selector: 'app-portal-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientSearchComponent],
  templateUrl: './portal-quotes.component.html',
  styleUrls: ['./portal-quotes.component.scss']
})
export class PortalQuotesComponent {
  readonly store = inject(PortalStoreService);
  private readonly pricingEngine = inject(PricingMatrixEngineService);
  private readonly sketchService = inject(WindowSketchSvgService);
  private readonly pdfGenerator = inject(PortalPdfGeneratorService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  // Datos de Cabecera del Presupuesto (sin datos ficticios)
  readonly activeQuoteId = signal<string>('');
  readonly activeQuoteCode = signal<string>('');
  readonly clientName = signal<string>('');
  readonly clientNif = signal<string>('');
  readonly clientPhone = signal<string>('');
  readonly clientEmail = signal<string>('');
  readonly workAddress = signal<string>('');
  readonly projectType = signal<'OBRA_NUEVA' | 'REFORMA_VIVIENDA' | 'SOLO_SUMINISTRO'>('REFORMA_VIVIENDA');
  readonly isHabitualResidence = signal<boolean>(true);
  readonly clientSigned10PercentDeclaration = signal<boolean>(true);
  readonly installationLaborPvpEur = signal<number>(0);
  readonly auxiliaryMeansPvpEur = signal<number>(0);

  // Parámetros del Hueco en Configuración Activa
  readonly roomLocation = signal<string>('Ventana 1');
  readonly selectedSeriesId = signal<string>(this.store.catalogSeries()[0].id);
  readonly openingHand = signal<OpeningHandCode>('DERECHA_INTERIOR');
  readonly widthMm = signal<number>(1200);
  readonly heightMm = signal<number>(1200);
  readonly quantity = signal<number>(1);
  readonly finishCategory = signal<FinishColorCategory>('BLANCO_ESTANDAR');
  readonly selectedGlassId = signal<string>(this.store.glassCompositions()[0].id);
  readonly selectedShutterId = signal<string>(this.store.shutterOptions()[0].id);
  readonly hasMotor = signal<boolean>(false);
  readonly tapajuntasMm = signal<0 | 40 | 60 | 80>(40);
  readonly hasPremarco = signal<boolean>(false);
  readonly hasDesmontaje = signal<boolean>(false);
  readonly isLowSillUnder900Mm = signal<boolean>(false);

  // Ajuste de Ganancia por Porcentaje (%) y por Precio (€) en la ventana activa
  readonly customMarginPct = signal<number | null>(null);
  readonly customExtraEur = signal<number>(0);
  readonly manualUnitPriceEur = signal<number | null>(null);

  // Ajuste Global al pie del presupuesto (% y €)
  readonly globalAdjustPercent = signal<number>(0);
  readonly globalAdjustEur = signal<number>(0);

  // Lista de Huecos del Presupuesto
  readonly holes = signal<QuoteHoleLine[]>([]);
  readonly statusMessage = signal<string>('');

  constructor() {
    const draft = this.store.security.pendingQuoteDraft();
    if (draft) {
      this.clientName.set(draft.clientName);
      this.clientNif.set(draft.clientNif || '');
      this.clientPhone.set(draft.clientPhone);
      this.clientEmail.set(draft.clientEmail);
      this.workAddress.set(draft.workAddress);
      this.projectType.set(draft.projectType);
      this.store.security.pendingQuoteDraft.set(null);
    }
  }

  onClientPicked(c: CrmLeadItem): void {
    this.clientName.set(c.fullName);
    this.clientNif.set(c.nif || '');
    this.clientPhone.set(c.phone);
    this.clientEmail.set(c.email);
    this.workAddress.set(c.city);
    this.statusMessage.set(`✓ Datos del cliente "${c.fullName}" cargados.`);
  }

  saveCurrentClientToDirectory(): void {
    const name = this.clientName().trim();
    if (!name) return;
    this.store.registerWebLead({
      fullName: name,
      nif: this.clientNif().trim(),
      phone: this.clientPhone().trim(),
      email: this.clientEmail().trim(),
      city: this.workAddress().trim() || 'Murcia',
      projectType: this.projectType(),
      recommendedSystem: 'Cliente guardado desde Presupuestos'
    });
    this.statusMessage.set(`✓ Cliente "${name}" guardado en la cartera de clientes para próximos presupuestos.`);
  }

  readonly activeSeries = computed(() =>
    this.store.catalogSeries().find(s => s.id === this.selectedSeriesId()) || this.store.catalogSeries()[0]
  );

  readonly activeGlass = computed(() =>
    this.store.glassCompositions().find(g => g.id === this.selectedGlassId()) || this.store.glassCompositions()[0]
  );

  readonly activeShutter = computed(() =>
    this.store.shutterOptions().find(sh => sh.id === this.selectedShutterId()) || this.store.shutterOptions()[0]
  );

  // Cálculo en tiempo real de la posición actual (conectando Catálogo + Ganancia % + Precio €)
  readonly liveHoleCalculation = computed<QuoteHoleLine>(() => {
    const baseLine = this.pricingEngine.calculateHoleLine({
      posNumber: this.holes().length + 1,
      roomLocation: this.roomLocation(),
      series: this.activeSeries(),
      openingHand: this.openingHand(),
      widthMm: this.widthMm(),
      heightMm: this.heightMm(),
      quantity: this.quantity(),
      finishCategory: this.finishCategory(),
      glass: this.activeGlass(),
      shutter: this.activeShutter(),
      hasMotor: this.hasMotor(),
      tapajuntasMm: this.tapajuntasMm(),
      hasPremarco: this.hasPremarco(),
      hasDesmontaje: this.hasDesmontaje(),
      isLowSillUnder900Mm: this.isLowSillUnder900Mm()
    });
    const unitNetCost =
      Math.round(
        (baseLine.carpentryNetCostEur + baseLine.glassNetCostEur + baseLine.extrasNetCostEur) * 100
      ) / 100;
    const defaultPct = Math.round((this.activeSeries().retailMarginMultiplier - 1) * 100);
    const activePct = this.customMarginPct() ?? defaultPct;
    const extraEur = Number(this.customExtraEur()) || 0;
    const manualUnit = this.manualUnitPriceEur();

    const finalUnitPvp =
      manualUnit !== null && manualUnit > 0
        ? Math.round(manualUnit * 100) / 100
        : Math.max(1, Math.round((unitNetCost * (1 + activePct / 100) + extraEur) * 100) / 100);
    const qty = Math.max(1, baseLine.quantity);
    return {
      ...baseLine,
      unitPvpEur: finalUnitPvp,
      totalLinePvpEur: Math.round(finalUnitPvp * qty * 100) / 100
    };
  });

  readonly effectiveMarginPercent = computed<number>(() => {
    const calc = this.liveHoleCalculation();
    const net = calc.carpentryNetCostEur + calc.glassNetCostEur + calc.extrasNetCostEur;
    if (net <= 0) return 0;
    return Math.round(((calc.unitPvpEur - net) / net) * 100);
  });

  readonly effectiveProfitEurPerUnit = computed<number>(() => {
    const calc = this.liveHoleCalculation();
    const net = calc.carpentryNetCostEur + calc.glassNetCostEur + calc.extrasNetCostEur;
    return Math.round((calc.unitPvpEur - net) * 100) / 100;
  });

  onMarginPercentInput(pct: number): void {
    this.manualUnitPriceEur.set(null);
    this.customMarginPct.set(Number(pct) || 0);
  }

  onExtraEuroInput(eur: number): void {
    this.manualUnitPriceEur.set(null);
    this.customExtraEur.set(Number(eur) || 0);
  }

  onManualUnitPriceInput(price: number): void {
    const val = Number(price);
    this.manualUnitPriceEur.set(val > 0 ? val : null);
  }

  updateHoleRowUnitPrice(holeId: string, newUnitPvp: number): void {
    const price = Math.max(0, Number(newUnitPvp) || 0);
    this.holes.update(list =>
      list.map(h =>
        h.id !== holeId
          ? h
          : {
              ...h,
              unitPvpEur: price,
              totalLinePvpEur: Math.round(price * h.quantity * 100) / 100
            }
      )
    );
  }

  updateHoleRowQuantity(holeId: string, newQty: number): void {
    const qty = Math.max(1, Math.round(Number(newQty) || 1));
    this.holes.update(list =>
      list.map(h =>
        h.id !== holeId
          ? h
          : {
              ...h,
              quantity: qty,
              totalLinePvpEur: Math.round(h.unitPvpEur * qty * 100) / 100
            }
      )
    );
  }

  // Croquis Vectorial SVG UNE-EN 12519 en tiempo real
  readonly liveSketchSafeSvg = computed<SafeHtml>(() => {
    const svg = this.sketchService.generateSketchSvg({
      widthMm: this.widthMm(),
      heightMm: this.heightMm(),
      openingType: this.activeSeries().openingType,
      openingHand: this.openingHand(),
      boxHeightDeductionMm: this.activeShutter().boxHeightDeductionMm,
      finishCategory: this.finishCategory()
    });
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });

  // Evaluación automática de la Regla del 40% para IVA Reducido 10%
  readonly vatAssessment = computed(() =>
    this.pricingEngine.assessReducedVatRule(
      this.holes(),
      this.installationLaborPvpEur(),
      this.auxiliaryMeansPvpEur(),
      this.projectType(),
      this.isHabitualResidence(),
      this.clientSigned10PercentDeclaration()
    )
  );

  readonly quoteTotals = computed(() => {
    const assessment = this.vatAssessment();
    const rawBase = assessment.totalQuoteBaseEur;
    const pctAdj = Number(this.globalAdjustPercent()) || 0;
    const eurAdj = Number(this.globalAdjustEur()) || 0;
    const base = Math.max(0, Math.round((rawBase * (1 + pctAdj / 100) + eurAdj) * 100) / 100);
    const vatPct = assessment.recommendedVatPercent;
    const vatEur = Math.round(base * (vatPct / 100) * 100) / 100;
    const totalEur = Math.round((base + vatEur) * 100) / 100;
    return { base, vatPct, vatEur, totalEur };
  });

  addCurrentHoleToQuote(): void {
    const line = this.liveHoleCalculation();
    this.holes.update(list => [...list, line]);
    this.statusMessage.set(
      `✓ Posición 0${line.posNumber} (${line.roomLocation} · ${line.widthMm}×${line.heightMm} mm) añadida al presupuesto.`
    );
  }

  removeHole(id: string): void {
    this.holes.update(list =>
      list.filter(h => h.id !== id).map((h, idx) => ({ ...h, posNumber: idx + 1 }))
    );
  }

  private ensureHolesPopulated(): void {
    if (this.holes().length === 0) {
      this.holes.set([this.liveHoleCalculation()]);
    }
  }

  private buildCurrentQuoteSnapshot(): PortalQuote {
    this.ensureHolesPopulated();
    const totals = this.quoteTotals();
    const assessment = this.vatAssessment();
    const seq = 1 + this.store.quotes().length;
    return {
      id: this.activeQuoteId() || `quo-${Date.now()}`,
      code: this.activeQuoteCode() || `PRE-2026-${String(seq).padStart(3, '0')}`,
      clientName: this.clientName().trim() || 'Cliente',
      clientNif: this.clientNif().trim(),
      clientPhone: this.clientPhone().trim(),
      clientEmail: this.clientEmail().trim(),
      workAddress: this.workAddress().trim(),
      projectType: this.projectType(),
      isHabitualResidence: this.isHabitualResidence(),
      clientSigned10PercentDeclaration: this.clientSigned10PercentDeclaration(),
      holes: this.holes(),
      installationLaborPvpEur: this.installationLaborPvpEur(),
      auxiliaryMeansPvpEur: this.auxiliaryMeansPvpEur(),
      materialsCostRatioPercent: assessment.materialsRatioPercent,
      qualifiesForReducedVat10: assessment.qualifiesFor10PercentVat,
      appliedVatPercent: totals.vatPct,
      subtotalPvpEur: totals.base,
      vatAmountEur: totals.vatEur,
      totalPvpEur: totals.totalEur,
      status: 'ENVIADO',
      createdAtIso: new Date().toISOString()
    };
  }

  private persistClientIfPresent(refLabel: string): void {
    if (this.clientName().trim()) {
      this.store.registerWebLead({
        fullName: this.clientName().trim(),
        nif: this.clientNif().trim(),
        phone: this.clientPhone().trim(),
        email: this.clientEmail().trim(),
        city: this.workAddress().trim() || 'Murcia',
        projectType: this.projectType(),
        recommendedSystem: refLabel
      });
    }
  }

  saveCurrentQuote(): void {
    const q = this.buildCurrentQuoteSnapshot();
    this.activeQuoteId.set(q.id);
    this.activeQuoteCode.set(q.code);
    this.store.saveQuoteOnly(q);
    this.persistClientIfPresent(`Presupuesto ${q.code}`);
    this.statusMessage.set(`✓ Presupuesto ${q.code} y datos del cliente (${q.clientName}) guardados.`);
  }

  resetQuoteForm(): void {
    this.activeQuoteId.set('');
    this.activeQuoteCode.set('');
    this.clientName.set('');
    this.clientNif.set('');
    this.clientPhone.set('');
    this.clientEmail.set('');
    this.workAddress.set('');
    this.holes.set([]);
    this.installationLaborPvpEur.set(0);
    this.auxiliaryMeansPvpEur.set(0);
    this.statusMessage.set('Formulario limpio para nuevo presupuesto.');
  }

  loadSavedQuote(q: PortalQuote): void {
    this.activeQuoteId.set(q.id);
    this.activeQuoteCode.set(q.code);
    this.clientName.set(q.clientName);
    this.clientNif.set(q.clientNif);
    this.clientPhone.set(q.clientPhone);
    this.clientEmail.set(q.clientEmail);
    this.workAddress.set(q.workAddress);
    this.projectType.set(q.projectType);
    this.holes.set([...q.holes]);
    this.installationLaborPvpEur.set(q.installationLaborPvpEur);
    this.auxiliaryMeansPvpEur.set(q.auxiliaryMeansPvpEur);
    this.statusMessage.set(`✓ Presupuesto ${q.code} cargado en el editor.`);
  }

  deleteSavedQuote(id: string): void {
    this.store.removeQuote(id);
  }

  downloadQuotePdf(): void {
    this.pdfGenerator.generateQuotePdf(this.buildCurrentQuoteSnapshot());
  }

  downloadFactoryOrderPdf(): void {
    this.pdfGenerator.generateFactoryOrderPdf(this.buildCurrentQuoteSnapshot());
  }

  approveAndSendToWarehouse(): void {
    const newQuote = { ...this.buildCurrentQuoteSnapshot(), status: 'ACEPTADO_EN_PEDIDO' as const };
    this.persistClientIfPresent(`Pedido desde ${newQuote.code}`);
    this.store.saveQuoteAndConvertToOrder(newQuote);
    this.router.navigate(['/portal/almacen']);
  }

  sendSavedQuoteToWarehouse(q: PortalQuote): void {
    this.store.saveQuoteAndConvertToOrder({ ...q, status: 'ACEPTADO_EN_PEDIDO' });
    this.router.navigate(['/portal/almacen']);
  }
}
