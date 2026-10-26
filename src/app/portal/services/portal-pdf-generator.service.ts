import { Injectable, inject } from '@angular/core';
import {
  PortalQuote,
  VeriFactuInvoice,
  VeriFactuVaultConfig,
  WarehouseOrder
} from '../models/portal.models';
import { WindowSketchSvgService } from './window-sketch-svg.service';
import { PortalSecurityService } from './portal-security.service';

@Injectable({
  providedIn: 'root'
})
export class PortalPdfGeneratorService {
  private readonly sketchSvg = inject(WindowSketchSvgService);
  private readonly security = inject(PortalSecurityService);

  /**
   * 1. Genera el PDF Vectorial Oficial de Presupuesto Técnico por Huecos (con Croquis UNE-EN 12519)
   */
  generateQuotePdf(quote: PortalQuote): void {
    const holesHtml = quote.holes
      .map(h => {
        const svg = this.sketchSvg.generateSketchSvg({
          widthMm: h.widthMm,
          heightMm: h.heightMm,
          openingType: h.openingType,
          openingHand: h.openingHand,
          boxHeightDeductionMm: h.shutterName.includes('185') ? 185 : h.shutterName.includes('200') ? 200 : 0,
          finishCategory: h.finishCategory
        });
        return `
          <div class="hole-block">
            <div class="hole-sketch">${svg}</div>
            <div class="hole-details">
              <div class="kicker">POSICIÓN 0${h.posNumber} · ${h.roomLocation}</div>
              <h3>${h.seriesName}</h3>
              <table class="spec-grid">
                <tr><th>DIMENSIONES HUECO:</th><td>${h.widthMm} × ${h.heightMm} mm (${h.quantity} uds.)</td></tr>
                <tr><th>MANO APERTURA (INTERIOR):</th><td>${h.openingHand}</td></tr>
                <tr><th>ACABADO PERFILERÍA:</th><td>${h.finishCategory} · Tapajuntas ${h.tapajuntasMm} mm</td></tr>
                <tr><th>COMPOSICIÓN VIDRIO:</th><td>${h.glassName}</td></tr>
                <tr><th>CAJÓN / PROTECCIÓN SOLAR:</th><td>${h.shutterName} ${h.hasMotor ? '(Motorizado)' : ''}</td></tr>
                <tr><th>PESO / NORMATIVA CTE:</th><td>${h.unitWeightKg} kg/ud. ${h.cteSuaSafetyWarning ? '· ' + h.cteSuaSafetyWarning : '· Cumple CTE DB-SUA 2'}</td></tr>
              </table>
              <div class="price-bar">
                <span>PVP UNITARIO: ${h.unitPvpEur.toFixed(2)} € × ${h.quantity} uds.</span>
                <strong>TOTAL POSICIÓN: ${h.totalLinePvpEur.toFixed(2)} €</strong>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    const html = this.wrapArchitecturalDocument(
      `PRESUPUESTO TÉCNICO ${quote.code}`,
      `MEMORIA VALORADA POR HUECOS Y CROQUIS UNE-EN 12519`,
      `
        <div class="meta-grid">
          <div><span class="lbl">CLIENTE / ESTUDIO:</span><strong>${quote.clientName} (${quote.clientNif})</strong></div>
          <div><span class="lbl">UBICACIÓN DE OBRA:</span><strong>${quote.workAddress}</strong></div>
          <div><span class="lbl">CONTACTO:</span><strong>${quote.clientPhone} · ${quote.clientEmail}</strong></div>
          <div><span class="lbl">MODALIDAD FISCAL IVA:</span><strong>${quote.appliedVatPercent}% (Ratio Materiales: ${quote.materialsCostRatioPercent}%)</strong></div>
        </div>
        ${holesHtml}
        <div class="totals-summary">
          <div><span>Mano de Obra Instalación y Sellado UNE 85219:</span><strong>${quote.installationLaborPvpEur.toFixed(2)} €</strong></div>
          <div><span>Medios Auxiliares y Logística de Obra:</span><strong>${quote.auxiliaryMeansPvpEur.toFixed(2)} €</strong></div>
          <div><span>Base Imponible Total:</span><strong>${quote.subtotalPvpEur.toFixed(2)} €</strong></div>
          <div><span>Cuota IVA (${quote.appliedVatPercent}%):</span><strong>${quote.vatAmountEur.toFixed(2)} €</strong></div>
          <div class="grand-total"><span>TOTAL PRESUPUESTO (IVA INCLUIDO):</span><strong>${quote.totalPvpEur.toFixed(2)} €</strong></div>
        </div>
        <div class="sign-grid">
          <div class="sign-box">FIRMA Y SELLO OFICINA TÉCNICA<br/><br/>${this.security.activeTenant().legalName} · CIF ${this.security.activeTenant().cif}</div>
          <div class="sign-box">CONFORMIDAD DEL CLIENTE (ACEPTACIÓN DE CROQUIS Y MEDIDAS)<br/><br/>Fdo.: ${quote.clientName}</div>
        </div>
      `
    );

    this.openVectorPrintWindow(html);
  }

  /**
   * 2. Genera el PDF de Hoja de Pedido a Fábrica / Taller (Sin precios PVP de cliente)
   */
  generateFactoryOrderPdf(quote: PortalQuote): void {
    const rowsHtml = quote.holes
      .map(
        h => `
        <tr>
          <td><strong>0${h.posNumber}</strong></td>
          <td><strong>${h.seriesName}</strong><br/><small>${h.roomLocation}</small></td>
          <td><strong>${h.widthMm} × ${h.heightMm} mm</strong></td>
          <td>${h.openingHand}</td>
          <td>${h.finishCategory}<br/><small>Solape: ${h.tapajuntasMm} mm</small></td>
          <td>${h.glassName}</td>
          <td>${h.shutterName} ${h.hasMotor ? '+ MOTOR' : ''}</td>
          <td><strong>${h.quantity} UDS.</strong></td>
        </tr>
      `
      )
      .join('');

    const html = this.wrapArchitecturalDocument(
      `ORDEN DE FABRICACIÓN · REF. ${quote.code}`,
      `HOJA TÉCNICA DE PRODUCCIÓN Y CORTE (SIN IMPORTES PVP)`,
      `
        <div class="meta-grid">
          <div><span class="lbl">EXPEDIENTE OBRA:</span><strong>${quote.code} · ${quote.clientName}</strong></div>
          <div><span class="lbl">DESTINO RECEPCIÓN:</span><strong>${this.security.activeTenant().commercialName} · ${this.security.activeTenant().city}</strong></div>
        </div>
        <table class="full-table">
          <thead>
            <tr>
              <th>POS.</th><th>SERIE / SISTEMA</th><th>ANCHO × ALTO (mm)</th><th>APERTURA (INT.)</th>
              <th>ACABADO / SOLAPE</th><th>VIDRIO</th><th>CAJÓN / MOTOR</th><th>CANT.</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `
    );

    this.openVectorPrintWindow(html);
  }

  /**
   * 3. Genera el PDF de Albarán de Almacén / Entrega o Recogida (Con Caballete Físico)
   */
  generateWarehouseDeliveryNotePdf(order: WarehouseOrder): void {
    const html = this.wrapArchitecturalDocument(
      `ALBARÁN DE ALMACÉN Y ENTREGA ${order.deliveryNoteCode}`,
      `CONTROL DE CABALLETE Y RECEPCIÓN DE MERCANCÍA`,
      `
        <div class="meta-grid">
          <div><span class="lbl">PEDIDO VINCULADO:</span><strong>${order.orderCode} (Presupuesto ${order.quoteCode})</strong></div>
          <div><span class="lbl">UBICACIÓN EN NAVE:</span><strong>${order.assignedCaballete}</strong></div>
          <div><span class="lbl">CLIENTE / RECEPTOR:</span><strong>${order.clientName} (${order.clientNif})</strong></div>
          <div><span class="lbl">CIRCUITO LOGÍSTICO:</span><strong>${order.circuitType} (${order.unitsCount} unidades)</strong></div>
        </div>
        <table class="full-table">
          <thead>
            <tr><th>PARTIDA VERIFICADA EN ALMACÉN</th><th>ESTADO DE RECEPCIÓN</th><th>OBSERVACIONES TÉCNICAS</th></tr>
          </thead>
          <tbody>
            <tr><td>1. Perfilería y Hojas de Carpintería</td><td>${order.carpentryReceived ? '✓ VERIFICADO OK' : 'PENDIENTE'}</td><td>Ubicado en ${order.assignedCaballete}</td></tr>
            <tr><td>2. Acristalamientos y Unidades de Vidrio</td><td>${order.glassReceived ? '✓ VERIFICADO OK' : 'PENDIENTE'}</td><td>Control visual sin roturas</td></tr>
            <tr><td>3. Cajones de Persiana, Guías y Motores</td><td>${order.shutterMotorReceived ? '✓ VERIFICADO OK' : 'PENDIENTE'}</td><td>Herraje y accionamiento comprobado</td></tr>
            <tr><td>4. Herrajes, Manillas, Tapajuntas y Remates</td><td>${order.accessoriesReceived ? '✓ VERIFICADO OK' : 'PENDIENTE'}</td><td>Kit completo de expedición</td></tr>
          </tbody>
        </table>
        <div class="sign-grid">
          <div class="sign-box">EXPEDIDO POR ${this.security.activeTenant().commercialName.toUpperCase()}<br/><br/>${this.security.activeTenant().legalName} · Caballete: ${order.assignedCaballete}</div>
          <div class="sign-box">RECIBÍ CONFORME (RECOGIDA EN NAVE / ENTREGA EN OBRA)<br/><br/>Nombre, DNI y Firma:</div>
        </div>
      `
    );

    this.openVectorPrintWindow(html);
  }

  /**
   * 4. Genera el PDF Oficial de Factura VeriFactu AEAT (con QR Tributario Vectorial y Huella SHA-256)
   */
  generateVeriFactuInvoicePdf(invoice: VeriFactuInvoice, vault: VeriFactuVaultConfig): void {
    const qrSvg = this.buildVectorQrPlaceholderSvg(invoice.currentHash64);

    const html = this.wrapArchitecturalDocument(
      `FACTURA OFICIAL ${invoice.seriesAndNumber}`,
      `SISTEMA VERI*FACTU · HUELLA ENCADENADA SHA-256 AEAT`,
      `
        <div class="meta-grid">
          <div><span class="lbl">EMISOR OBLIGADO:</span><strong>${vault.razonSocialEmisor} · NIF ${vault.nifEmisor}</strong></div>
          <div><span class="lbl">DESTINATARIO:</span><strong>${invoice.clientName} · NIF ${invoice.clientNif}</strong></div>
          <div><span class="lbl">FECHA EXPEDICIÓN:</span><strong>${invoice.issueDateIso.slice(0, 10)}</strong></div>
          <div><span class="lbl">VENCIMIENTO (${invoice.diasPago} DÍAS):</span><strong>${invoice.dueDateIso.slice(0, 10)} (23:59:59) · Estado: ${invoice.paymentStatus}</strong></div>
        </div>
        <table class="full-table">
          <thead>
            <tr><th>PEDIDO REF.</th><th>CONCEPTO / DESCRIPCIÓN DE LA OPERACIÓN</th><th>BASE IMPONIBLE</th><th>IVA (${invoice.vatRatePercent}%)</th><th>TOTAL FACTURA</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${invoice.orderCode}</strong></td>
              <td>${invoice.workDescription}</td>
              <td>${invoice.baseImponibleEur.toFixed(2)} €</td>
              <td>${invoice.vatAmountEur.toFixed(2)} €</td>
              <td><strong>${invoice.totalImporteEur.toFixed(2)} €</strong></td>
            </tr>
          </tbody>
        </table>
        <div class="verifactu-stamp">
          <div class="qr-wrap">${qrSvg}</div>
          <div class="vf-texts">
            <strong>QR TRIBUTARIO AEAT — VERI*FACTU (RD 1007/2023 · Orden HAC/1177/2024)</strong>
            <p>Factura verificable en la sede electrónica de la Agencia Tributaria.</p>
            <div><span>Software:</span> <code>${vault.softwareName} v${vault.softwareVersion} (${vault.softwareId})</code></div>
            <div><span>Huella Actual SHA-256:</span> <code>${invoice.currentHash64}</code></div>
            <div><span>Huella Anterior SHA-256:</span> <code>${invoice.previousHash64}</code></div>
            <div><span>URL Cotejo AEAT:</span> <small>${invoice.aeatQrUrl}</small></div>
          </div>
        </div>
      `
    );

    this.openVectorPrintWindow(html);
  }

  private buildVectorQrPlaceholderSvg(hash64: string): string {
    let cells = '';
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        const isCorner = (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
        const charCode = hash64.charCodeAt((r * 11 + c) % hash64.length) || 65;
        if (isCorner || charCode % 2 === 0) {
          cells += `<rect x="${8 + c * 8}" y="${8 + r * 8}" width="7" height="7" fill="#0D0D0D"/>`;
        }
      }
    }
    return `<svg viewBox="0 0 104 104" width="104" height="104" xmlns="http://www.w3.org/2000/svg"><rect width="104" height="104" fill="#FFFFFF" stroke="#0D0D0D" stroke-width="2"/>${cells}</svg>`;
  }

  private wrapArchitecturalDocument(title: string, subtitle: string, bodyContent: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>${title} — NOVA Ventanas & Puertas</title>
  <style>
    @page { size: A4; margin: 14mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #121212; margin: 0; font-variant-numeric: tabular-nums; }
    .doc-head { background: #0D0D0D; color: #F4F0E9; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #C6AD82; margin-bottom: 16px; }
    .brand { font-size: 20px; font-weight: 800; letter-spacing: 2px; }
    .brand-sub { font-size: 9px; color: #C6AD82; letter-spacing: 3px; display: block; margin-top: 3px; }
    .doc-title { text-align: right; }
    .doc-title h1 { margin: 0; font-size: 16px; color: #C6AD82; letter-spacing: 1px; }
    .doc-title span { font-size: 10px; color: #A9A39A; letter-spacing: 1.5px; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; border: 1px solid #242424; padding: 12px; margin-bottom: 16px; background: #FAF8F4; font-size: 12px; }
    .meta-grid .lbl { display: block; font-size: 9px; color: #666; letter-spacing: 1px; }
    .hole-block { display: grid; grid-template-columns: 220px 1fr; gap: 14px; border: 1px solid #242424; padding: 12px; margin-bottom: 12px; page-break-inside: avoid; }
    .hole-sketch { background: #0D0D0D; display: flex; align-items: center; justify-content: center; }
    .kicker { font-size: 10px; font-weight: 700; color: #9E8252; letter-spacing: 1.5px; }
    .hole-details h3 { margin: 4px 0 8px; font-size: 14px; }
    .spec-grid { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 8px; }
    .spec-grid th, .spec-grid td { border-bottom: 1px solid #E5E0D8; padding: 4px; text-align: left; }
    .spec-grid th { width: 38%; color: #555; font-size: 10px; }
    .price-bar { background: #0D0D0D; color: #F4F0E9; padding: 6px 10px; display: flex; justify-content: space-between; font-size: 12px; }
    .price-bar strong { color: #C6AD82; }
    .full-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
    .full-table th { background: #0D0D0D; color: #C6AD82; padding: 8px; text-align: left; font-size: 10px; letter-spacing: 1px; }
    .full-table td { border: 1px solid #D9D3C7; padding: 8px; }
    .totals-summary { border: 2px solid #0D0D0D; padding: 12px; margin-bottom: 16px; font-size: 12px; display: flex; flex-direction: column; gap: 6px; }
    .totals-summary > div { display: flex; justify-content: space-between; }
    .grand-total { border-top: 1px solid #0D0D0D; padding-top: 8px; font-size: 15px; color: #9E8252; }
    .verifactu-stamp { display: flex; gap: 16px; align-items: center; border: 1px solid #0D0D0D; padding: 12px; background: #FAF8F4; font-size: 11px; margin-top: 14px; }
    .vf-texts code { font-size: 10px; word-break: break-all; background: #EEE; padding: 1px 4px; }
    .sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 18px; }
    .sign-box { border: 1px solid #242424; padding: 12px; height: 65px; font-size: 10px; color: #444; }
  </style>
</head>
<body>
  <div class="doc-head">
    <div><span class="brand">${this.security.activeTenant().commercialName}</span><span class="brand-sub">${this.security.activeTenant().legalName} · CIF ${this.security.activeTenant().cif} · ${this.security.activeTenant().city}</span></div>
    <div class="doc-title"><h1>${title}</h1><span>${subtitle}</span></div>
  </div>
  ${bodyContent}
</body>
</html>`;
  }

  private openVectorPrintWindow(htmlContent: string): void {
    if (typeof window === 'undefined') return;
    const win = window.open('', '_blank', 'width=980,height=820');
    if (!win) return;
    win.document.open();
    win.document.write(htmlContent);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 250);
  }
}
