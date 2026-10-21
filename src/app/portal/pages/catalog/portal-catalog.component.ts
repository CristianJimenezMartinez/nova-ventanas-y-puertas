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
  readonly bulkPercentDelta = signal<number>(5);
  readonly excelPasteText = signal<string>('');
  readonly showNewSeriesModal = signal<boolean>(false);
  readonly feedbackBanner = signal<string>('');

  // Campos para crear una nueva serie autogestionada
  readonly newCode = signal<string>('NT-76-PRAC');
  readonly newPublicName = signal<string>('NOVA THERM 76 Practicable · Serie Residencial');
  readonly newSupplierBrand = signal<string>('Fabricante Europeo PVC');
  readonly newMaterial = signal<'PVC' | 'ALUMINIO' | 'MIXTO' | 'PUERTAS'>('PVC');
  readonly newPricingMode = signal<MatrixPricingMode>('CARPENTRY_ONLY');

  readonly activeSeries = computed<CatalogSeries | undefined>(() =>
    this.store.catalogSeries().find(s => s.id === this.selectedSeriesId()) || this.store.catalogSeries()[0]
  );

  selectSeries(id: string): void {
    this.selectedSeriesId.set(id);
    this.feedbackBanner.set('');
  }

  applyBulkPercentage(): void {
    const s = this.activeSeries();
    if (!s) return;
    this.store.applyBulkTariffPercentage(s.id, this.bulkPercentDelta());
    this.feedbackBanner.set(
      `✓ Tarifa de "${s.publicName}" actualizada un ${this.bulkPercentDelta() > 0 ? '+' : ''}${this.bulkPercentDelta()}% en todas las celdas.`
    );
  }

  applyExcelPaste(): void {
    const s = this.activeSeries();
    if (!s || !this.excelPasteText().trim()) return;
    const ok = this.store.updateSeriesMatrixFromPastedText(s.id, this.excelPasteText());
    if (ok) {
      this.feedbackBanner.set('✓ Matriz 2D importada correctamente desde portapapeles Excel / CSV.');
      this.excelPasteText.set('');
    } else {
      this.feedbackBanner.set('⚠ Formato no válido: pega al menos 2 filas y 2 columnas numéricas separadas por tabulador o punto y coma.');
    }
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
