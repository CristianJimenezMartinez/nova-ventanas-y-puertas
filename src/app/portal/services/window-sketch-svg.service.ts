import { Injectable } from '@angular/core';
import { FinishColorCategory, OpeningHandCode, OpeningTypeCode } from '../models/portal.models';

export interface WindowSketchParams {
  widthMm: number;
  heightMm: number;
  openingType: OpeningTypeCode;
  openingHand: OpeningHandCode;
  boxHeightDeductionMm: number;
  finishCategory: FinishColorCategory;
}

@Injectable({
  providedIn: 'root'
})
export class WindowSketchSvgService {
  /**
   * Genera el croquis técnico vectorial SVG parametrizado (UNE-EN 12519 · VISTO DESDE EL INTERIOR)
   * Ultraligero (< 5 KB), sin dependencias externas.
   */
  generateSketchSvg(params: WindowSketchParams): string {
    const wMm = Math.max(400, Math.min(6000, params.widthMm || 1200));
    const hMm = Math.max(400, Math.min(4000, params.heightMm || 1400));
    const boxMm = params.boxHeightDeductionMm || 0;

    // Escala proporcional dentro del lienzo 360 x 280
    const maxDrawW = 220;
    const maxDrawH = 175;
    const ratio = Math.min(maxDrawW / wMm, maxDrawH / hMm);

    const drawW = Math.round(wMm * ratio);
    const drawH = Math.round(hMm * ratio);
    const x0 = Math.round((360 - drawW) / 2);
    const y0 = Math.round((245 - drawH) / 2) + 12;

    const boxDrawH = boxMm > 0 ? Math.max(18, Math.round(boxMm * ratio)) : 0;
    const winY = y0 + boxDrawH;
    const winH = Math.max(40, drawH - boxDrawH);
    const frameT = 8;

    const frameStroke = this.getFrameColor(params.finishCategory);
    const glassFill = 'rgba(198, 173, 130, 0.07)';
    const champagne = '#C6AD82';

    const innerX = x0 + frameT;
    const innerY = winY + frameT;
    const innerW = drawW - frameT * 2;
    const innerH = winH - frameT * 2;

    let leavesSvg = '';
    const isTwoLeaves =
      params.openingType === 'OSCILOBATIENTE_2H' ||
      params.openingType === 'CORREDERA_2H' ||
      params.openingType === 'ELEVABLE_2H';

    if (isTwoLeaves) {
      const halfW = Math.round(innerW / 2);
      // Hoja Izquierda y Hoja Derecha
      leavesSvg += `
        <rect x="${innerX}" y="${innerY}" width="${halfW}" height="${innerH}" fill="${glassFill}" stroke="${frameStroke}" stroke-width="2"/>
        <rect x="${innerX + halfW}" y="${innerY}" width="${innerW - halfW}" height="${innerH}" fill="${glassFill}" stroke="${frameStroke}" stroke-width="2"/>
        <line x1="${innerX + halfW}" y1="${winY}" x2="${innerX + halfW}" y2="${winY + winH}" stroke="${champagne}" stroke-width="2"/>
      `;

      if (params.openingType === 'CORREDERA_2H' || params.openingType === 'ELEVABLE_2H') {
        const midY = innerY + Math.round(innerH / 2);
        leavesSvg += `
          <line x1="${innerX + 18}" y1="${midY}" x2="${innerX + halfW - 18}" y2="${midY}" stroke="${champagne}" stroke-width="1.8"/>
          <polyline points="${innerX + halfW - 26},${midY - 5} ${innerX + halfW - 16},${midY} ${innerX + halfW - 26},${midY + 5}" fill="none" stroke="${champagne}" stroke-width="1.8"/>
          <line x1="${innerX + halfW + 18}" y1="${midY}" x2="${innerX + innerW - 18}" y2="${midY}" stroke="${champagne}" stroke-width="1.8"/>
          <polyline points="${innerX + halfW + 26},${midY - 5} ${innerX + halfW + 16},${midY} ${innerX + halfW + 26},${midY + 5}" fill="none" stroke="${champagne}" stroke-width="1.8"/>
        `;
      } else {
        // Oscilobatiente 2 Hojas (UNE-EN 12519: vértice en el lado de la manilla)
        leavesSvg += `
          <polyline points="${innerX},${innerY} ${innerX + halfW},${innerY + Math.round(innerH / 2)} ${innerX},${innerY + innerH}" fill="none" stroke="${champagne}" stroke-width="1.3"/>
          <polyline points="${innerX + innerW},${innerY} ${innerX + halfW},${innerY + Math.round(innerH / 2)} ${innerX + innerW},${innerY + innerH}" fill="none" stroke="${champagne}" stroke-width="1.3"/>
          <polyline points="${innerX + halfW},${innerY + innerH} ${innerX + halfW + Math.round(halfW / 2)},${innerY} ${innerX + innerW},${innerY + innerH}" fill="none" stroke="${champagne}" stroke-width="1.2" stroke-dasharray="4 3"/>
          <rect x="${innerX + halfW - 6}" y="${innerY + Math.round(innerH / 2) - 8}" width="4" height="16" fill="${champagne}"/>
        `;
      }
    } else {
      // 1 Hoja / Fijo / Pivotante
      leavesSvg += `
        <rect x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}" fill="${glassFill}" stroke="${frameStroke}" stroke-width="2"/>
      `;

      if (params.openingType === 'PRACTICABLE_1H' || params.openingType === 'OSCILOBATIENTE_1H') {
        const opensRight = params.openingHand !== 'IZQUIERDA_INTERIOR';
        const hingeX = opensRight ? innerX + innerW : innerX;
        const handleX = opensRight ? innerX : innerX + innerW;
        const midY = innerY + Math.round(innerH / 2);

        leavesSvg += `
          <polyline points="${hingeX},${innerY} ${handleX},${midY} ${hingeX},${innerY + innerH}" fill="none" stroke="${champagne}" stroke-width="1.4"/>
          <rect x="${opensRight ? handleX + 2 : handleX - 6}" y="${midY - 8}" width="4" height="16" fill="${champagne}"/>
        `;

        if (params.openingType === 'OSCILOBATIENTE_1H') {
          leavesSvg += `
            <polyline points="${innerX},${innerY + innerH} ${innerX + Math.round(innerW / 2)},${innerY} ${innerX + innerW},${innerY + innerH}" fill="none" stroke="${champagne}" stroke-width="1.2" stroke-dasharray="4 3"/>
          `;
        }
      } else if (params.openingType === 'PUERTA_PIVOTANTE') {
        const pivotX = innerX + Math.round(innerW * 0.28);
        leavesSvg += `
          <line x1="${pivotX}" y1="${winY - 4}" x2="${pivotX}" y2="${winY + winH + 4}" stroke="${champagne}" stroke-width="2" stroke-dasharray="5 3"/>
          <rect x="${innerX + innerW - 12}" y="${innerY + Math.round(innerH * 0.25)}" width="3" height="${Math.round(innerH * 0.5)}" fill="${champagne}"/>
        `;
      } else {
        // Fijo Panorámico
        leavesSvg += `
          <line x1="${innerX + 12}" y1="${innerY + innerH - 12}" x2="${innerX + 34}" y2="${innerY + innerH - 34}" stroke="${champagne}" stroke-width="1.2"/>
          <line x1="${innerX + 18}" y1="${innerY + innerH - 10}" x2="${innerX + 36}" y2="${innerY + innerH - 28}" stroke="${champagne}" stroke-width="1.2"/>
        `;
      }
    }

    const shutterSvg =
      boxDrawH > 0
        ? `
      <rect x="${x0}" y="${y0}" width="${drawW}" height="${boxDrawH}" fill="#1A1A1A" stroke="${champagne}" stroke-width="1.5"/>
      <line x1="${x0 + 6}" y1="${y0 + Math.round(boxDrawH / 2)}" x2="${x0 + drawW - 6}" y2="${y0 + Math.round(boxDrawH / 2)}" stroke="rgba(198,173,130,0.45)" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="${x0 + Math.round(drawW / 2)}" y="${y0 + Math.round(boxDrawH / 2) + 3}" text-anchor="middle" fill="${champagne}" font-size="8" font-family="Inter, sans-serif" letter-spacing="1">CAJÓN ${boxMm} MM</text>
    `
        : '';

    return `
      <svg viewBox="0 0 360 280" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="360" height="280" fill="#181816"/>
        <text x="14" y="18" fill="#C6AD82" font-size="9.5" font-weight="600" font-family="Inter, sans-serif">Vista interior (${wMm} × ${hMm} mm)</text>
        ${shutterSvg}
        <!-- Marco Exterior -->
        <rect x="${x0}" y="${winY}" width="${drawW}" height="${winH}" fill="none" stroke="${frameStroke}" stroke-width="3"/>
        ${leavesSvg}
        <!-- Cota Horizontal (Ancho Total mm) -->
        <line x1="${x0}" y1="${y0 + drawH + 16}" x2="${x0 + drawW}" y2="${y0 + drawH + 16}" stroke="${champagne}" stroke-width="1"/>
        <line x1="${x0}" y1="${y0 + drawH + 11}" x2="${x0}" y2="${y0 + drawH + 21}" stroke="${champagne}" stroke-width="1"/>
        <line x1="${x0 + drawW}" y1="${y0 + drawH + 11}" x2="${x0 + drawW}" y2="${y0 + drawH + 21}" stroke="${champagne}" stroke-width="1"/>
        <text x="${x0 + Math.round(drawW / 2)}" y="${y0 + drawH + 28}" text-anchor="middle" fill="${champagne}" font-size="10" font-weight="700" font-family="Inter, sans-serif">${wMm} mm</text>
        <!-- Cota Vertical (Alto Total mm) -->
        <line x1="${x0 + drawW + 16}" y1="${y0}" x2="${x0 + drawW + 16}" y2="${y0 + drawH}" stroke="${champagne}" stroke-width="1"/>
        <line x1="${x0 + drawW + 11}" y1="${y0}" x2="${x0 + drawW + 21}" y2="${y0}" stroke="${champagne}" stroke-width="1"/>
        <line x1="${x0 + drawW + 11}" y1="${y0 + drawH}" x2="${x0 + drawW + 21}" y2="${y0 + drawH}" stroke="${champagne}" stroke-width="1"/>
        <text x="${x0 + drawW + 24}" y="${y0 + Math.round(drawH / 2) + 3}" fill="${champagne}" font-size="10" font-weight="700" font-family="Inter, sans-serif">${hMm} mm</text>
      </svg>
    `;
  }

  private getFrameColor(finish: FinishColorCategory): string {
    switch (finish) {
      case 'BLANCO_ESTANDAR':
        return '#F4F0E9';
      case 'MADERA_NOBLE':
      case 'FOLIO_1_CARA':
      case 'FOLIO_2_CARAS':
        return '#C6AD82';
      default:
        return '#8E8A83';
    }
  }
}
