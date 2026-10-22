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
  FinishColorCategory,
  OpeningHandCode,
  PortalQuote,
  QuoteHoleLine
} from '../../models/portal.models';

@Component({
  selector: 'app-portal-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Lista de Huecos del Presupuesto
  readonly holes = signal<QuoteHoleLine[]>([]);
  readonly statusMessage = signal<string>('');

  constructor() {
    const draft = this.store.security.pendingQuoteDraft();
    if (draft) {
      this.clientName.set(draft.clientName);
      this.clientPhone.set(draft.clientPhone);
      this.clientEmail.set(draft.clientEmail);
      this.workAddress.set(draft.workAddress);
      this.projectType.set(draft.projectType);
      this.store.security.pendingQuoteDraft.set(null);
    }
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

  // Cálculo en tiempo real de la posición actual
  readonly liveHoleCalculation = computed<QuoteHoleLine>(() =>
    this.pricingEngine.calculateHoleLine({
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
    })
  );

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
    const base = assessment.totalQuoteBaseEur;
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

  private buildCurrentQuoteSnapshot(): PortalQuote {
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

  saveCurrentQuote(): void {
    const q = this.buildCurrentQuoteSnapshot();
    this.activeQuoteId.set(q.id);
    this.activeQuoteCode.set(q.code);
    this.store.saveQuoteOnly(q);
    this.statusMessage.set(`✓ Presupuesto ${q.code} (${q.clientName}) guardado.`);
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

  sendQuoteByEmail(): void {
    const q = this.buildCurrentQuoteSnapshot();
    this.store.saveQuoteOnly(q);
    this.store.security.pendingEmailDraft.set({
      recipientName: q.clientName,
      recipientEmail: q.clientEmail,
      linkedDocCode: q.code,
      subject: `Presupuesto ${q.code} (${q.totalPvpEur.toFixed(2)} €) · ${this.store.security.activeTenant().commercialName}`,
      messageBody: `Estimado/a ${q.clientName},\n\nAdjuntamos su presupuesto ${q.code} (${q.holes.length} posiciones) por un importe total de ${q.totalPvpEur.toFixed(2)} € (IVA incluido).\n\nQuedamos a su disposición.`
    });
    this.router.navigate(['/portal/correos']);
  }

  approveAndSendToWarehouse(): void {
    const newQuote = { ...this.buildCurrentQuoteSnapshot(), status: 'ACEPTADO_EN_PEDIDO' as const };
    this.store.saveQuoteAndConvertToOrder(newQuote);
    this.router.navigate(['/portal/almacen']);
  }
}
