import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PortalStoreService } from '../../services/portal-store.service';
import { PricingMatrixEngineService } from '../../services/pricing-matrix-engine.service';
import { WindowSketchSvgService } from '../../services/window-sketch-svg.service';
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
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);

  // Datos de Cabecera del Presupuesto
  readonly clientName = signal<string>('Residencial Mirador de Altorreal · D. Javier Soto');
  readonly clientNif = signal<string>('48621904K');
  readonly clientPhone = signal<string>('+34 619 82 34 10');
  readonly clientEmail = signal<string>('javier.soto@arquitecturamurcia.es');
  readonly workAddress = signal<string>('Av. de los Pinos 19, Altorreal · Molina de Segura');
  readonly projectType = signal<'OBRA_NUEVA' | 'REFORMA_VIVIENDA' | 'SOLO_SUMINISTRO'>('REFORMA_VIVIENDA');
  readonly isHabitualResidence = signal<boolean>(true);
  readonly clientSigned10PercentDeclaration = signal<boolean>(true);
  readonly installationLaborPvpEur = signal<number>(1650);
  readonly auxiliaryMeansPvpEur = signal<number>(280);

  // Parámetros del Hueco en Configuración Activa
  readonly roomLocation = signal<string>('Salón Principal · Ventanal Jardín');
  readonly selectedSeriesId = signal<string>(this.store.catalogSeries()[0].id);
  readonly openingHand = signal<OpeningHandCode>('DERECHA_INTERIOR');
  readonly widthMm = signal<number>(1400);
  readonly heightMm = signal<number>(1400);
  readonly quantity = signal<number>(2);
  readonly finishCategory = signal<FinishColorCategory>('FOLIO_2_CARAS');
  readonly selectedGlassId = signal<string>(this.store.glassCompositions()[1].id);
  readonly selectedShutterId = signal<string>(this.store.shutterOptions()[1].id);
  readonly hasMotor = signal<boolean>(true);
  readonly tapajuntasMm = signal<0 | 40 | 60 | 80>(60);
  readonly hasPremarco = signal<boolean>(true);
  readonly hasDesmontaje = signal<boolean>(true);
  readonly isLowSillUnder900Mm = signal<boolean>(false);

  // Lista de Huecos del Presupuesto
  readonly holes = signal<QuoteHoleLine[]>([...this.store.quotes()[0].holes]);
  readonly statusMessage = signal<string>('');

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

  approveAndSendToWarehouse(): void {
    const totals = this.quoteTotals();
    const assessment = this.vatAssessment();
    const newQuote: PortalQuote = {
      id: `quo-${Date.now()}`,
      code: `PRE-2026-0${210 + this.store.quotes().length}`,
      clientName: this.clientName(),
      clientNif: this.clientNif(),
      clientPhone: this.clientPhone(),
      clientEmail: this.clientEmail(),
      workAddress: this.workAddress(),
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
      status: 'ACEPTADO_EN_PEDIDO',
      createdAtIso: new Date().toISOString()
    };

    this.store.saveQuoteAndConvertToOrder(newQuote);
    this.router.navigate(['/portal/almacen']);
  }
}
