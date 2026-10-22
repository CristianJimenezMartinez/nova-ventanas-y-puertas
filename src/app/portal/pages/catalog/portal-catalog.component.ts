import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortalStoreService } from '../../services/portal-store.service';
import { CatalogSeries, MatrixPricingMode } from '../../models/portal.models';

@Component({
  selector: 'app-portal-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-catalog.component.html',
  styleUrls: ['./portal-catalog.component.scss']
})
export class PortalCatalogComponent {
  readonly store = inject(PortalStoreService);

  readonly selectedSeriesId = signal<string>(this.store.catalogSeries()[0]?.id || '');
  readonly bulkPercentDelta = signal<number>(10);
  readonly bulkEuroDelta = signal<number>(25);
  readonly excelPasteText = signal<string>('');
  readonly showNewSeriesModal = signal<boolean>(false);
  readonly feedbackBanner = signal<string>('');

  // Campos para crear una nueva serie desde Central
  readonly newCode = signal<string>('');
  readonly newPublicName = signal<string>('');
  readonly newSupplierBrand = signal<string>('');
  readonly newMaterial = signal<'PVC' | 'ALUMINIO' | 'MIXTO' | 'PUERTAS'>('PVC');
  readonly newPricingMode = signal<MatrixPricingMode>('CARPENTRY_ONLY');

  readonly activeSeries = computed<CatalogSeries | undefined>(() =>
    this.store.catalogSeries().find(s => s.id === this.selectedSeriesId()) || this.store.catalogSeries()[0]
  );

  readonly activeMarginPercent = computed<number>(() => {
    const s = this.activeSeries();
    if (!s) return 75;
    return Math.round((s.retailMarginMultiplier - 1) * 100);
  });

  selectSeries(id: string): void {
    this.selectedSeriesId.set(id);
    this.feedbackBanner.set('');
  }

  updateMarginPercent(newPct: number): void {
    const s = this.activeSeries();
    if (!s) return;
    const safePct = Math.max(0, Number(newPct) || 0);
    const multiplier = Math.round((1 + safePct / 100) * 100) / 100;
    this.store.catalogSeries.update(list =>
      list.map(item => (item.id === s.id ? { ...item, retailMarginMultiplier: multiplier } : item))
    );
    this.store.persistStateToPostgresDb();
    this.feedbackBanner.set(
      `✓ Ganancia comercial de "${s.publicName}" ajustada al +${safePct}% (Multiplicador ×${multiplier}).`
    );
  }

  applyBulkPercentage(): void {
    const s = this.activeSeries();
    if (!s) return;
    const pct = Number(this.bulkPercentDelta()) || 0;
    const factor = 1 + pct / 100;
    this.store.catalogSeries.update(list =>
      list.map(item =>
        item.id !== s.id
          ? item
          : {
              ...item,
              matrixTariffPrices: item.matrixTariffPrices.map(row =>
                row.map(cell => Math.max(1, Math.round(cell * factor * 100) / 100))
              )
            }
      )
    );
    this.store.persistStateToPostgresDb();
    this.feedbackBanner.set(
      `✓ Todos los precios de "${s.publicName}" actualizados un ${pct > 0 ? '+' : ''}${pct}%.`
    );
  }

  applyBulkEuroAmount(): void {
    const s = this.activeSeries();
    if (!s) return;
    const euros = Number(this.bulkEuroDelta()) || 0;
    this.store.catalogSeries.update(list =>
      list.map(item =>
        item.id !== s.id
          ? item
          : {
              ...item,
              matrixTariffPrices: item.matrixTariffPrices.map(row =>
                row.map(cell => Math.max(1, Math.round((cell + euros) * 100) / 100))
              )
            }
      )
    );
    this.store.persistStateToPostgresDb();
    this.feedbackBanner.set(
      `✓ Sumados ${euros > 0 ? '+' : ''}${euros} € a todas las medidas de "${s.publicName}".`
    );
  }

  updateCellPrice(rowIdx: number, colIdx: number, newPrice: number): void {
    const s = this.activeSeries();
    if (!s) return;
    const val = Math.max(0, Number(newPrice) || 0);
    this.store.catalogSeries.update(list =>
      list.map(item => {
        if (item.id !== s.id) return item;
        const copy = item.matrixTariffPrices.map((r, rI) =>
          r.map((c, cI) => (rI === rowIdx && cI === colIdx ? val : c))
        );
        return { ...item, matrixTariffPrices: copy };
      })
    );
    this.store.persistStateToPostgresDb();
  }

  updateGlassPrice(glassId: string, newPrice: number): void {
    const val = Math.max(0, Number(newPrice) || 0);
    this.store.glassCompositions.update(list =>
      list.map(g => (g.id === glassId ? { ...g, costPerM2Eur: val } : g))
    );
    this.store.persistStateToPostgresDb();
  }

  applyExcelPaste(): void {
    const s = this.activeSeries();
    if (!s || !this.excelPasteText().trim()) return;
    const rows = this.excelPasteText()
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
    if (rows.length < 2) {
      this.feedbackBanner.set('⚠ Pega al menos 2 filas y 2 columnas numéricas desde Excel.');
      return;
    }
    this.store.catalogSeries.update(list =>
      list.map(item => {
        if (item.id !== s.id) return item;
        const widthsMm = Array.from({ length: rows[0].length }, (_, idx) => 800 + idx * 200);
        const heightsMm = Array.from({ length: rows.length }, (_, idx) => 800 + idx * 200);
        return { ...item, widthsMm, heightsMm, matrixTariffPrices: rows };
      })
    );
    this.store.persistStateToPostgresDb();
    this.feedbackBanner.set('✓ Tabla de precios importada y guardada.');
    this.excelPasteText.set('');
  }

  togglePricingMode(series: CatalogSeries): void {
    const nextMode: MatrixPricingMode =
      series.pricingMode === 'CARPENTRY_ONLY' ? 'INCLUDES_BASE_GLASS' : 'CARPENTRY_ONLY';
    this.store.catalogSeries.update(list =>
      list.map(s =>
        s.id === series.id
          ? {
              ...s,
              pricingMode: nextMode,
              baseGlassIncludedCreditPerM2: nextMode === 'INCLUDES_BASE_GLASS' ? 34 : 0
            }
          : s
      )
    );
  }

  toggleOnlineSale(series: CatalogSeries): void {
    this.store.catalogSeries.update(list =>
      list.map(s => (s.id === series.id ? { ...s, onlineStoreEnabled: !s.onlineStoreEnabled } : s))
    );
  }

  createNewSeries(): void {
    const id = `serie-custom-${Date.now()}`;
    const created: CatalogSeries = {
      id,
      code: this.newCode().trim() || 'NOVA-CUSTOM',
      publicName: this.newPublicName().trim() || 'Nueva Serie NOVA',
      supplierBrand: this.newSupplierBrand().trim() || 'Gama Propia NOVA',
      showSupplierOnWeb: false,
      material: this.newMaterial(),
      openingType: 'OSCILOBATIENTE_2H',
      pricingMode: this.newPricingMode(),
      baseGlassIncludedCreditPerM2: this.newPricingMode() === 'INCLUDES_BASE_GLASS' ? 32 : 0,
      supplierDiscountChain: [50, 5],
      retailMarginMultiplier: 1.75,
      colorSurchargePercent: {
        BLANCO_ESTANDAR: 0,
        FOLIO_1_CARA: 16,
        FOLIO_2_CARAS: 26,
        LACADO_QUALICOAT: 20,
        BICOLOR_ARQUITECTONICO: 30,
        MADERA_NOBLE: 38
      },
      widthsMm: [800, 1000, 1200, 1400, 1600],
      heightsMm: [800, 1000, 1200, 1400, 1600],
      matrixTariffPrices: [
        [390, 435, 480, 530, 585],
        [430, 480, 530, 585, 645],
        [475, 530, 585, 645, 710],
        [525, 585, 645, 710, 780],
        [580, 645, 710, 785, 860]
      ],
      minWidthMm: 600,
      maxWidthMm: 2200,
      minHeightMm: 600,
      maxHeightMm: 2200,
      onlineStoreEnabled: true
    };

    this.store.addCatalogSeries(created);
    this.selectedSeriesId.set(id);
    this.showNewSeriesModal.set(false);
    this.feedbackBanner.set(`✓ Nueva serie "${created.publicName}" incorporada al catálogo con su matriz base.`);
  }
}
