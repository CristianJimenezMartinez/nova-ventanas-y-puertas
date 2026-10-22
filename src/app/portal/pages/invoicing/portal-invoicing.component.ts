import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PortalStoreService } from '../../services/portal-store.service';
import { VeriFactuXmlService } from '../../services/verifactu-xml.service';
import { PortalPdfGeneratorService } from '../../services/portal-pdf-generator.service';
import { VeriFactuInvoice, VeriFactuVaultConfig } from '../../models/portal.models';

@Component({
  selector: 'app-portal-invoicing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-invoicing.component.html',
  styleUrls: ['./portal-invoicing.component.scss']
})
export class PortalInvoicingComponent {
  readonly store = inject(PortalStoreService);
  private readonly xmlService = inject(VeriFactuXmlService);
  private readonly pdfGenerator = inject(PortalPdfGeneratorService);
  private readonly router = inject(Router);

  readonly showIssueModal = signal<boolean>(false);
  readonly showVaultModal = signal<boolean>(false);
  readonly selectedXmlPreview = signal<string>('');
  readonly feedbackMsg = signal<string>('');

  // Campos para emitir factura manual / anticipo / certificación / rectificativa
  readonly newInvoiceType = signal<'F1_ORDINARIA' | 'ANTICIPO_OBRA' | 'CERTIFICACION' | 'R1_RECTIFICATIVA'>('F1_ORDINARIA');
  readonly newOrderCode = signal<string>('PED-2026-0115');
  readonly newClientName = signal<string>('Promociones Residenciales Levante SL');
  readonly newClientNif = signal<string>('B73491820');
  readonly newDescription = signal<string>('Certificación Carpintería Arquitectónica NOVA · Fase 1');
  readonly newDiasPago = signal<number>(0);
  readonly newBaseImponible = signal<number>(4800);
  readonly newVatRate = signal<21 | 10 | 0>(10);
  readonly newRetencion5Pct = signal<boolean>(false);

  // Campos para el Cofre de Certificado Digital (.p12 / .pfx)
  readonly certFilenameInput = signal<string>('Certificado_Representante_GRUPO_SOTO_2026.p12');
  readonly certSubjectInput = signal<string>('CN=GRUPO SOTO EMPRESARIAL SL - NIF B73849102 (FNMT)');

  setVeriFactuMode(mode: VeriFactuVaultConfig['activeMode']): void {
    this.store.verifactuVault.update(v => ({ ...v, activeMode: mode }));
    this.feedbackMsg.set(`✓ Modo VeriFactu actualizado a: ${mode}`);
  }

  activateCertificateInVault(): void {
    this.store.verifactuVault.update(v => ({
      ...v,
      certificateLoaded: true,
      certificateFileName: this.certFilenameInput(),
      certificateSubject: this.certSubjectInput(),
      activeMode: 'MODO_3_ENVIO_DIRECTO_AEAT',
      autoSendOnIssue: true
    }));
    this.showVaultModal.set(false);
    this.feedbackMsg.set(
      '✓ Certificado .P12 vinculado en el Cofre AES-256-GCM. Modo 3 (Firma XAdES-EPES + Envío AEAT) preparado.'
    );
  }

  issueNewChainedInvoice(): void {
    const base = Math.max(1, this.newBaseImponible());
    const retencion = this.newRetencion5Pct() ? Math.round(base * 0.05 * 100) / 100 : 0;

    // REGLA 5: diasPago ?? 0
    const safeDias = this.newDiasPago() ?? 0;

    const created = this.store.createChainedInvoice({
      invoiceType: this.newInvoiceType(),
      orderCode: this.newOrderCode(),
      clientName: this.newClientName(),
      clientNif: this.newClientNif(),
      workDescription: this.newDescription(),
      diasPago: safeDias,
      baseImponibleEur: base,
      vatRatePercent: this.newVatRate(),
      retencionGarantia5PercentEur: retencion,
      operationalStatus: 'INSTALADO'
    });

    this.showIssueModal.set(false);
    this.feedbackMsg.set(
      `✓ Factura ${created.seriesAndNumber} emitida y encadenada · Huella SHA-256: ${created.currentHash64.slice(0, 20)}...`
    );
  }

  collectInvoice(inv: VeriFactuInvoice): void {
    this.store.registerInvoiceCollection(inv.id);
    this.feedbackMsg.set(`✓ Cobro registrado para la factura ${inv.seriesAndNumber} (${inv.totalImporteEur.toFixed(2)} €).`);
  }

  downloadOfficialXml(inv: VeriFactuInvoice): void {
    this.xmlService.downloadXmlFile(inv, this.store.verifactuVault());
    this.feedbackMsg.set(`✓ Archivo XML Oficial AEAT (${inv.seriesAndNumber}) descargado.`);
  }

  downloadInvoicePdf(inv: VeriFactuInvoice): void {
    this.pdfGenerator.generateVeriFactuInvoicePdf(inv, this.store.verifactuVault());
  }

  sendInvoiceByEmail(inv: VeriFactuInvoice): void {
    this.store.security.pendingEmailDraft.set({
      recipientName: inv.clientName,
      recipientEmail: 'facturacion@cliente.es',
      linkedDocCode: inv.seriesAndNumber,
      subject: `Factura ${inv.seriesAndNumber} (${inv.totalImporteEur.toFixed(2)} €) · ${this.store.security.activeTenant().commercialName}`,
      messageBody: `Estimado/a ${inv.clientName},\n\nAdjuntamos la factura ${inv.seriesAndNumber} correspondiente a ${inv.workDescription} por un importe total de ${inv.totalImporteEur.toFixed(2)} €.`
    });
    this.router.navigate(['/portal/correos']);
  }

  previewXml(inv: VeriFactuInvoice): void {
    const xml = this.xmlService.generateOfficialRegistroAltaXml(inv, this.store.verifactuVault());
    this.selectedXmlPreview.set(xml);
  }

  exportGestoriaPack(): void {
    this.xmlService.downloadGestoriaLibroCsv(this.store.invoices(), this.store.verifactuVault());
    this.feedbackMsg.set('✓ Libro Registro VeriFactu (.CSV para Gestoría / Asesoría Fiscal) descargado.');
  }
}
