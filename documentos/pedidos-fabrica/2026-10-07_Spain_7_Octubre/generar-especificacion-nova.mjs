import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const scratchDir = 'C:/Users/Cayse/.gemini/antigravity/brain/ed479916-f175-4b53-a0bd-a530091dde26/scratch';
const htmlPath = path.join(scratchDir, 'nova_spec_no_logo.html');
const outputPdfNoLogo = 'C:/Proyectos/Grupo Soto/nova-ventanas-y-puertas/documentos/pedidos-fabrica/2026-10-07_Spain_7_Octubre/Especificacion_Tecnica_Spain_7_Octubre_Sin_Logo.pdf';
const outputPdfArtifact = 'C:/Users/Cayse/.gemini/antigravity/brain/ed479916-f175-4b53-a0bd-a530091dde26/Especificacion_Tecnica_Spain_7_Octubre_Sin_Logo.pdf';

fs.mkdirSync(scratchDir, { recursive: true });

/**
 * Generates an exact CAD-style vector SVG for each window position
 */
function renderWindowSvg(pos) {
  const svgW = 240;
  const svgH = 198;

  const maxW = 166;
  const maxH = 128;
  const ratio = pos.w / pos.h;

  let drawW, drawH;
  if (ratio >= maxW / maxH) {
    drawW = maxW;
    drawH = Math.max(40, Math.round(maxW / ratio));
    // Give wide multi-pane windows a slightly more generous visual height like the CAD software does
    if (pos.num === 11) drawH = 76;
    if (pos.num === 3) drawH = 38;
  } else {
    drawH = maxH;
    drawW = Math.max(64, Math.round(maxH * ratio));
  }

  const x0 = Math.round(42 + (176 - drawW) / 2);
  const y0 = Math.round(26 + (132 - drawH) / 2);
  const frameT = 5.5;
  const sillH = 4;

  let elements = [];

  // 1. Top overall dimension line
  const dimTopY = y0 - 11;
  elements.push(`
    <line x1="${x0}" y1="${y0 - 2}" x2="${x0}" y2="${dimTopY - 4}" stroke="#111" stroke-width="0.7"/>
    <line x1="${x0 + drawW}" y1="${y0 - 2}" x2="${x0 + drawW}" y2="${dimTopY - 4}" stroke="#111" stroke-width="0.7"/>
    <line x1="${x0}" y1="${dimTopY}" x2="${x0 + drawW}" y2="${dimTopY}" stroke="#111" stroke-width="0.7"/>
    <line x1="${x0 - 2}" y1="${dimTopY + 2}" x2="${x0 + 2}" y2="${dimTopY - 2}" stroke="#111" stroke-width="0.8"/>
    <line x1="${x0 + drawW - 2}" y1="${dimTopY + 2}" x2="${x0 + drawW + 2}" y2="${dimTopY - 2}" stroke="#111" stroke-width="0.8"/>
    <text x="${x0 + drawW / 2}" y="${dimTopY - 3}" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" fill="#000">${pos.w}</text>
  `);

  // 2. Left vertical dimension line
  const dimLeftX = x0 - 13;
  const totalDrawH = drawH + sillH;
  elements.push(`
    <line x1="${x0 - 2}" y1="${y0}" x2="${dimLeftX - 4}" y2="${y0}" stroke="#111" stroke-width="0.7"/>
    <line x1="${x0 - 2}" y1="${y0 + totalDrawH}" x2="${dimLeftX - 4}" y2="${y0 + totalDrawH}" stroke="#111" stroke-width="0.7"/>
    <line x1="${dimLeftX}" y1="${y0}" x2="${dimLeftX}" y2="${y0 + totalDrawH}" stroke="#111" stroke-width="0.7"/>
    <line x1="${dimLeftX - 2}" y1="${y0 + 2}" x2="${dimLeftX + 2}" y2="${y0 - 2}" stroke="#111" stroke-width="0.8"/>
    <line x1="${dimLeftX - 2}" y1="${y0 + totalDrawH + 2}" x2="${dimLeftX + 2}" y2="${y0 + totalDrawH - 2}" stroke="#111" stroke-width="0.8"/>
    <text x="${dimLeftX - 4}" y="${y0 + totalDrawH / 2}" text-anchor="middle" transform="rotate(-90, ${dimLeftX - 4}, ${y0 + totalDrawH / 2})" font-family="Arial, sans-serif" font-size="9.5" fill="#000">${pos.h}</text>
  `);

  // 3. Outer PVC Frame
  elements.push(`
    <rect x="${x0}" y="${y0}" width="${drawW}" height="${drawH}" fill="#0095D9" stroke="#111" stroke-width="1"/>
    <rect x="${x0 + frameT}" y="${y0 + frameT}" width="${drawW - 2 * frameT}" height="${drawH - 2 * frameT}" fill="#0095D9" stroke="#111" stroke-width="0.8"/>
    <line x1="${x0}" y1="${y0}" x2="${x0 + frameT}" y2="${y0 + frameT}" stroke="#111" stroke-width="0.7"/>
    <line x1="${x0 + drawW}" y1="${y0}" x2="${x0 + drawW - frameT}" y2="${y0 + frameT}" stroke="#111" stroke-width="0.7"/>
    <line x1="${x0}" y1="${y0 + drawH}" x2="${x0 + frameT}" y2="${y0 + drawH - frameT}" stroke="#111" stroke-width="0.7"/>
    <line x1="${x0 + drawW}" y1="${y0 + drawH}" x2="${x0 + drawW - frameT}" y2="${y0 + drawH - frameT}" stroke="#111" stroke-width="0.7"/>
    <rect x="${x0}" y="${y0 + drawH}" width="${drawW}" height="${sillH}" fill="#5BB53B" stroke="#111" stroke-width="0.8"/>
  `);

  // 4. Panes / Columns
  const cols = pos.cols;
  const totalColW = cols.reduce((acc, c) => acc + c.w, 0);
  const innerX = x0 + frameT;
  const innerY = y0 + frameT;
  const innerW = drawW - 2 * frameT;
  const innerH = drawH - 2 * frameT;
  const mullionT = 4.5;

  let curInnerX = innerX;
  let curOuterX = x0;
  const bottomDimY = y0 + totalDrawH + 14;

  // Compute column pixel widths (ensure narrow fixed panes like 280mm have at least 18px interior width)
  const availPaneW = innerW - (cols.length - 1) * mullionT;
  const rawWidths = cols.map(c => Math.max(18, Math.round(availPaneW * (c.w / totalColW))));
  const sumRaw = rawWidths.reduce((a, b) => a + b, 0);
  rawWidths[0] += (availPaneW - sumRaw);

  cols.forEach((col, idx) => {
    const isLast = idx === cols.length - 1;
    const pw = rawWidths[idx];
    const px = curInnerX;
    const py = innerY;
    const ph = innerH;

    if (!isLast) {
      const mx = px + pw;
      elements.push(`
        <rect x="${mx}" y="${y0 + 2}" width="${mullionT}" height="${drawH - 4}" fill="#0095D9" stroke="#111" stroke-width="0.8"/>
        <line x1="${mx + mullionT / 2}" y1="${y0 + 2}" x2="${mx + mullionT / 2}" y2="${y0 + drawH - 2}" stroke="#111" stroke-width="0.5"/>
      `);
    }

    if (col.type === 'fixed') {
      const bead = 2.5;
      elements.push(`
        <rect x="${px + bead}" y="${py + bead}" width="${pw - 2 * bead}" height="${ph - 2 * bead}" fill="#0095D9" stroke="#111" stroke-width="0.6"/>
      `);
      const lw = col.label.length > 2 ? 20 : (col.label.length === 1 ? 9.5 : 16);
      const lx = pw > 32 ? px + pw - lw - 5 : px + (pw - lw) / 2;
      const ly = py + 5;
      elements.push(`
        <rect x="${lx}" y="${ly}" width="${lw}" height="11.5" fill="#FFF" stroke="#333" stroke-width="0.4"/>
        <text x="${lx + lw / 2}" y="${ly + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#000">${col.label}</text>
      `);
    } else {
      const sashT = 5.5;
      const bead = 2.2;
      const gx = px + sashT + bead;
      const gy = py + sashT + bead;
      const gw = pw - 2 * (sashT + bead);
      const gh = ph - 2 * (sashT + bead);

      elements.push(`
        <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#0095D9" stroke="#111" stroke-width="0.9"/>
        <rect x="${px + sashT}" y="${py + sashT}" width="${pw - 2 * sashT}" height="${ph - 2 * sashT}" fill="#0095D9" stroke="#111" stroke-width="0.8"/>
        <rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="#0095D9" stroke="#111" stroke-width="0.6"/>
        <line x1="${px}" y1="${py}" x2="${px + sashT}" y2="${py + sashT}" stroke="#111" stroke-width="0.6"/>
        <line x1="${px + pw}" y1="${py}" x2="${px + pw - sashT}" y2="${py + sashT}" stroke="#111" stroke-width="0.6"/>
        <line x1="${px}" y1="${py + ph}" x2="${px + sashT}" y2="${py + ph - sashT}" stroke="#111" stroke-width="0.6"/>
        <line x1="${px + pw}" y1="${py + ph}" x2="${px + pw - sashT}" y2="${py + ph - sashT}" stroke="#111" stroke-width="0.6"/>
      `);

      if (col.type === 'turn-tilt-right') {
        elements.push(`
          <line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy + gh / 2}" stroke="#111" stroke-width="0.7"/>
          <line x1="${gx}" y1="${gy + gh}" x2="${gx + gw}" y2="${gy + gh / 2}" stroke="#111" stroke-width="0.7"/>
          <line x1="${gx}" y1="${gy + gh}" x2="${gx + gw / 2}" y2="${gy}" stroke="#111" stroke-width="0.7"/>
          <line x1="${gx + gw}" y1="${gy + gh}" x2="${gx + gw / 2}" y2="${gy}" stroke="#111" stroke-width="0.7"/>
          <rect x="${px + pw - sashT - 1}" y="${py + ph / 2 - 4.5}" width="3.8" height="9" fill="#FFF" stroke="#111" stroke-width="0.6"/>
          <line x1="${px + pw - sashT + 0.9}" y1="${py + ph / 2}" x2="${px + pw - sashT + 0.9}" y2="${py + ph / 2 + 7.5}" stroke="#111" stroke-width="1.2"/>
        `);
      } else if (col.type === 'turn-tilt-left') {
        elements.push(`
          <line x1="${gx + gw}" y1="${gy}" x2="${gx}" y2="${gy + gh / 2}" stroke="#111" stroke-width="0.7"/>
          <line x1="${gx + gw}" y1="${gy + gh}" x2="${gx}" y2="${gy + gh / 2}" stroke="#111" stroke-width="0.7"/>
          <line x1="${gx}" y1="${gy + gh}" x2="${gx + gw / 2}" y2="${gy}" stroke="#111" stroke-width="0.7"/>
          <line x1="${gx + gw}" y1="${gy + gh}" x2="${gx + gw / 2}" y2="${gy}" stroke="#111" stroke-width="0.7"/>
          <rect x="${px + sashT - 2.8}" y="${py + ph / 2 - 4.5}" width="3.8" height="9" fill="#FFF" stroke="#111" stroke-width="0.6"/>
          <line x1="${px + sashT - 0.9}" y1="${py + ph / 2}" x2="${px + sashT - 0.9}" y2="${py + ph / 2 + 7.5}" stroke="#111" stroke-width="1.2"/>
        `);
      } else if (col.type === 'duoport-left') {
        elements.push(`
          <rect x="${px + sashT - 2.8}" y="${py + ph / 2 - 4.5}" width="3.8" height="9" fill="#FFF" stroke="#111" stroke-width="0.6"/>
          <line x1="${px + sashT - 0.9}" y1="${py + ph / 2}" x2="${px + sashT - 0.9}" y2="${py + ph / 2 + 7.5}" stroke="#111" stroke-width="1.2"/>
        `);
      }

      const lw = 21.5;
      const lx = gx + gw - lw - 4 > gx + 3 ? gx + gw - lw - 4 : gx + (gw - lw) / 2;
      const ly = gy + 4;
      elements.push(`
        <rect x="${lx}" y="${ly}" width="${lw}" height="11.5" fill="#FFF" stroke="#333" stroke-width="0.4"/>
        <text x="${lx + lw / 2}" y="${ly + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#000">${col.label}</text>
      `);

      if (col.ap) {
        const apW = 15;
        const apX = gx + 3.5;
        const apY = gy + gh - 15;
        elements.push(`
          <rect x="${apX}" y="${apY}" width="${apW}" height="11.5" fill="#FFF" stroke="#333" stroke-width="0.4"/>
          <text x="${apX + apW / 2}" y="${apY + 9}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#000">AP</text>
        `);
      }
    }

    if (cols.length > 1) {
      const subW = isLast
        ? (x0 + drawW - curOuterX)
        : Math.round((px + pw + mullionT / 2) - curOuterX);
      const sx1 = curOuterX;
      const sx2 = curOuterX + subW;
      elements.push(`
        <line x1="${sx1}" y1="${y0 + totalDrawH + 3}" x2="${sx1}" y2="${bottomDimY + 3}" stroke="#111" stroke-width="0.6"/>
        ${isLast ? `<line x1="${sx2}" y1="${y0 + totalDrawH + 3}" x2="${sx2}" y2="${bottomDimY + 3}" stroke="#111" stroke-width="0.6"/>` : ''}
        <line x1="${sx1}" y1="${bottomDimY}" x2="${sx2}" y2="${bottomDimY}" stroke="#111" stroke-width="0.6"/>
        <text x="${(sx1 + sx2) / 2}" y="${bottomDimY - 2.5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#000">${col.w}</text>
      `);
      curOuterX = sx2;
    }

    curInnerX += pw + mullionT;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">
    ${elements.join('\n')}
  </svg>`;
}

const positions = [
  {
    num: 1,
    qty: 2,
    w: 1200,
    h: 1150,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '30A activPilot GAM(A) PVC',
    colorEmbellecedores: 'Blanco WS',
    peso: '139.76',
    superficie: '2.760 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (10.016 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 600, label: '1.1.1', type: 'turn-tilt-right', ap: true },
      { w: 600, label: '1.2.1', type: 'turn-tilt-left', ap: true }
    ]
  },
  {
    num: 2,
    qty: 1,
    w: 1170,
    h: 2300,
    producto: 'Ventana',
    perfil: 'Protec WHS 72',
    color: 'Perfil blanco (junta negra)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: null,
    colorEmbellecedores: null,
    peso: '109.61',
    superficie: '2.691 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (7.248 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 1170, label: '1.1', type: 'fixed', ap: false }
    ]
  },
  {
    num: 3,
    qty: 1,
    w: 3530,
    h: 458,
    producto: 'Ventana',
    perfil: 'Protec WHS 72',
    color: 'Perfil blanco (junta negra)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: null,
    colorEmbellecedores: null,
    peso: '76.22',
    superficie: '1.617 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (8.284 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 1177, label: '1.1', type: 'fixed', ap: false },
      { w: 1177, label: '1.2', type: 'fixed', ap: false },
      { w: 1177, label: '1.3', type: 'fixed', ap: false }
    ]
  },
  {
    num: 4,
    qty: 1,
    w: 2340,
    h: 2300,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '46 Duoport 100/160S GAM activPilot',
    colorEmbellecedores: 'Blanco WS',
    peso: '229.00',
    superficie: '5.382 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (9.588 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 1170, label: '1.1', type: 'fixed', ap: false },
      { w: 1170, label: '1.1.1', type: 'duoport-left', ap: false }
    ]
  },
  {
    num: 5,
    qty: 1,
    w: 1200,
    h: 580,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '30A activPilot GAM(A) PVC',
    colorEmbellecedores: 'Blanco WS',
    peso: '37.64',
    superficie: '0.696 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (3.868 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 1200, label: '1.1.1', type: 'turn-tilt-right', ap: true }
    ]
  },
  {
    num: 6,
    qty: 1,
    w: 900,
    h: 1230,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '30A activPilot GAM(A) PVC',
    colorEmbellecedores: 'Blanco WS',
    peso: '54.46',
    superficie: '1.107 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (4.568 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 900, label: '1.1.1', type: 'turn-tilt-left', ap: true }
    ]
  },
  {
    num: 7,
    qty: 2,
    w: 1910,
    h: 2090,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '46 Duoport 100/160S GAM activPilot',
    colorEmbellecedores: 'Blanco WS',
    peso: '349.51',
    superficie: '7.984 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (16.616 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 955, label: '1.1', type: 'fixed', ap: false },
      { w: 955, label: '1.1.1', type: 'duoport-left', ap: false }
    ]
  },
  {
    num: 8,
    qty: 1,
    w: 2050,
    h: 1150,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '46 Duoport 100/160S GAM activPilot',
    colorEmbellecedores: 'Blanco WS',
    peso: '111.78',
    superficie: '2.357 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (6.708 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 1025, label: '1.1', type: 'fixed', ap: false },
      { w: 1025, label: '1.1.1', type: 'duoport-left', ap: false }
    ]
  },
  {
    num: 9,
    qty: 1,
    w: 1500,
    h: 1150,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '46 Duoport 100/160S GAM activPilot',
    colorEmbellecedores: 'Blanco WS',
    peso: '84.84',
    superficie: '1.725 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (5.608 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 750, label: '1.1', type: 'fixed', ap: false },
      { w: 750, label: '1.1.1', type: 'duoport-left', ap: false }
    ]
  },
  {
    num: 10,
    qty: 1,
    w: 900,
    h: 1150,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '30A activPilot GAM(A) PVC',
    colorEmbellecedores: 'Blanco WS',
    peso: '51.33',
    superficie: '1.035 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (4.408 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 900, label: '1.1.1', type: 'turn-tilt-right', ap: true }
    ]
  },
  {
    num: 11,
    qty: 1,
    w: 3040,
    h: 1250,
    producto: 'Ventana',
    perfil: 'Lux (70 mm) SOFTLINE',
    color: 'Perfil blanco (junta gris)',
    vidrio: '44.1-10-6M1',
    intercalario: 'Aluminio',
    herraje: '30A activPilot GAM(A) PVC',
    colorEmbellecedores: 'Blanco WS',
    peso: '163.60',
    superficie: '3.800 m²',
    otrosCodigo: '110777000000',
    otrosDesc: 'Perfil en T (gris) (8.888 m)',
    otrosCant: '1',
    otrosUd: 'ud.',
    cols: [
      { w: 1840, label: '1.1', type: 'fixed', ap: false },
      { w: 920, label: '1.1.1', type: 'turn-tilt-right', ap: true },
      { w: 280, label: '3', type: 'fixed', ap: false }
    ]
  }
];

function renderPositionBlock(pos) {
  return `
    <div class="pos-block">
      <div class="pos-main">
        <div class="pos-left">
          <div class="pos-header-line">
            <span>Nº de posición: &nbsp;&nbsp;<strong>${pos.num}</strong></span>
            <span>Cant.: <strong>${pos.qty}</strong></span>
          </div>
          <div class="pos-diagram">
            ${renderWindowSvg(pos)}
          </div>
        </div>
        <div class="pos-specs">
          <div class="spec-row"><span class="spec-label">Producto:</span><span class="spec-val">${pos.producto}</span></div>
          <div class="spec-row"><span class="spec-label">Ancho x Alto (mm):</span><span class="spec-val">${pos.w}x${pos.h}</span></div>
          <div class="spec-row"><span class="spec-label">Tipo de perfil:</span><span class="spec-val">${pos.perfil}</span></div>
          <div class="spec-row"><span class="spec-label">Color:</span><span class="spec-val">${pos.color}</span></div>
          <div class="spec-row"><span class="spec-label">Acristalamiento:</span><span class="spec-val">${pos.vidrio}</span></div>
          <div class="spec-row"><span class="spec-label">Intercalario:</span><span class="spec-val">${pos.intercalario}</span></div>
          ${pos.herraje ? `<div class="spec-row"><span class="spec-label">Herraje:</span><span class="spec-val">${pos.herraje}</span></div>` : ''}
          ${pos.colorEmbellecedores ? `<div class="spec-row"><span class="spec-label">Color de embellecedores:</span><span class="spec-val">${pos.colorEmbellecedores}</span></div>` : ''}
          <div class="spec-row"><span class="spec-label">Peso de la posición (kg):</span><span class="spec-val">${pos.peso}</span></div>
          <div class="spec-row"><span class="spec-label">Superficie:</span><span class="spec-val">${pos.superficie}</span></div>
        </div>
      </div>

      <div class="otros-title">Otros elementos:</div>
      <table class="otros-table">
        <thead>
          <tr>
            <th style="width: 22%;">Código</th>
            <th style="width: 58%;">Descripción</th>
            <th style="width: 10%;">Cant.</th>
            <th style="width: 10%;">Ud.</th>
          </tr>
        </thead>
        <tbody>
          <tr class="group-row">
            <td colspan="4">Calculados en la estructura</td>
          </tr>
          <tr>
            <td>${pos.otrosCodigo}</td>
            <td>${pos.otrosDesc}</td>
            <td style="text-align: center;">${pos.otrosCant}</td>
            <td style="text-align: center;">${pos.otrosUd}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// Official NOVA Logo SVG (exact geometry from src/assets/logo-nova.svg)
const novaLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 108" width="255" height="60" fill="none">
  <g transform="translate(5, 4)">
    <rect x="3" y="3" width="74" height="74" rx="4" stroke="#C5A059" stroke-width="7" />
    <line x1="39" y1="3" x2="39" y2="77" stroke="#C5A059" stroke-width="7" />
    <line x1="39" y1="40" x2="77" y2="40" stroke="#C5A059" stroke-width="7" />
  </g>
  <text x="104" y="60" font-family="'Segoe UI', Arial, sans-serif" font-size="52" font-weight="800" letter-spacing="4" fill="#0D0D0D">NOVA</text>
  <line x1="282" y1="17" x2="282" y2="71" stroke="#C5A059" stroke-width="2.5" />
  <text x="298" y="38" font-family="'Segoe UI', Arial, sans-serif" font-size="18.5" font-weight="700" letter-spacing="4" fill="#0D0D0D">VENTANAS</text>
  <text x="298" y="64" font-family="'Segoe UI', Arial, sans-serif" font-size="18.5" font-weight="700" letter-spacing="4" fill="#0D0D0D">&amp; PUERTAS</text>
  <text x="8" y="100" font-family="'Segoe UI', Arial, sans-serif" font-size="10.2" font-weight="700" letter-spacing="2.3" fill="#222222">FABRICANTE DE VENTANAS DE ALTA CALIDAD</text>
</svg>
`;

const pages = [
  { pageNum: 1, time: '07.10.2026 11:00:59', items: [positions[0], positions[1]], isFirst: true, isLast: false },
  { pageNum: 2, time: '07.10.2026 11:01:02', items: [positions[2], positions[3], positions[4]], isFirst: false, isLast: false },
  { pageNum: 3, time: '07.10.2026 11:01:04', items: [positions[5], positions[6], positions[7]], isFirst: false, isLast: false },
  { pageNum: 4, time: '07.10.2026 11:01:06', items: [positions[8], positions[9]], isFirst: false, isLast: false },
  { pageNum: 5, time: '07.10.2026 11:01:06', items: [positions[10]], isFirst: false, isLast: true }
];

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Especificación Técnica NOVA — Spain 7 de octubre</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #111;
      background: #fff;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 11mm 13mm 11mm 13mm;
      position: relative;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .page:last-child {
      page-break-after: auto;
    }
    .page-content {
      flex: 1;
    }

    /* Header on Page 1 */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .header-logo {
      padding-top: 0px;
    }
    .header-right {
      width: 59%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .title-banner {
      width: 100%;
      background: #BCE29E;
      border: 1.5px solid #222;
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      padding: 6px 12px;
      color: #111;
    }
    .header-dates {
      margin-top: 5px;
      width: 245px;
      font-size: 11.5px;
      line-height: 1.4;
      border-bottom: 1px solid #222;
      padding-bottom: 4px;
    }
    .date-row {
      display: flex;
      justify-content: space-between;
    }

    .argon-banner {
      width: 100%;
      background: #BCE29E;
      border: 1.5px solid #222;
      text-align: center;
      font-size: 16.5px;
      font-weight: 700;
      padding: 5px 10px;
      margin-bottom: 8px;
      color: #111;
    }

    /* Position block */
    .pos-block {
      border-top: 1px solid #222;
      padding-top: 5px;
      margin-bottom: 8px;
    }
    .pos-main {
      display: flex;
      align-items: stretch;
      min-height: 205px;
    }
    .pos-left {
      width: 40%;
      padding-right: 6px;
    }
    .pos-header-line {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 2px;
      padding-right: 18px;
    }
    .pos-diagram {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .pos-specs {
      width: 60%;
      font-size: 11.5px;
      padding-top: 6px;
    }
    .spec-row {
      display: flex;
      line-height: 1.52;
    }
    .spec-label {
      width: 44%;
      color: #111;
      padding-right: 8px;
    }
    .spec-val {
      width: 56%;
      color: #111;
      border-left: 1px solid #222;
      padding-left: 10px;
    }

    /* Otros elementos table */
    .otros-title {
      font-size: 11px;
      font-weight: 700;
      margin: 2px 0 3px 0;
    }
    .otros-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      margin-bottom: 2px;
    }
    .otros-table th {
      background: #B5B5B5;
      border: 1px solid #222;
      padding: 2.5px 6px;
      font-weight: 700;
      text-align: center;
    }
    .otros-table td {
      border: 1px solid #222;
      padding: 2.5px 6px;
    }
    .otros-table tr.group-row td {
      background: #DADADA;
      font-weight: 400;
      padding: 2px 6px;
    }

    /* Summary on Page 5 (without prices or money block) */
    .order-summary {
      border-top: 1.5px solid #222;
      padding-top: 12px;
      margin-top: 8px;
    }
    .summary-grid {
      width: 62%;
      font-size: 12px;
      line-height: 1.7;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
    }
    .summary-spacer {
      height: 10px;
    }
    .signature-block {
      border-top: 1px solid #222;
      margin-top: 22px;
      padding-top: 14px;
      font-size: 13.5px;
      font-weight: 700;
    }

    /* Footer */
    .page-footer {
      border-top: 1px solid #222;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #111;
    }
    .footer-center {
      font-size: 11.5px;
      margin-right: 42%;
    }
  </style>
</head>
<body>
  ${pages.map(p => `
    <div class="page">
      <div class="page-content">
        ${p.isFirst ? `
          <div class="doc-header">
            <div class="header-logo"></div>
            <div class="header-right">
              <div class="title-banner">Spain 7 de octubre</div>
              <div class="header-dates">
                <div class="date-row"><span>Fecha de fabricación:</span><span>15.10.2026</span></div>
                <div class="date-row"><span>Fecha de montaje:</span><span>07.10.2026</span></div>
              </div>
            </div>
          </div>
          <div class="argon-banner">
            100% de los acristalamientos rellenos con gas inerte ARGÓN
          </div>
        ` : ''}

        ${p.items.map(item => renderPositionBlock(item)).join('\n')}

        ${p.isLast ? `
          <div class="order-summary">
            <div class="summary-grid">
              <div class="summary-row">
                <span>Cantidad de estructuras en el pedido</span>
                <span>13 uds.</span>
              </div>
              <div class="summary-row">
                <span>Superficie total del pedido</span>
                <span>31,371 m²</span>
              </div>
              <div class="summary-spacer"></div>
              <div class="summary-row">
                <span>Cantidad de mosquiteras en el pedido</span>
                <span>0 uds.</span>
              </div>
              <div class="summary-row">
                <span>Superficie total de mosquiteras</span>
                <span>0,000 m²</span>
              </div>
            </div>
            <div class="signature-block">
              Conforme con el cliente_________________________________
            </div>
          </div>
        ` : ''}
      </div>

      <div class="page-footer">
        <span>Fecha: ${p.time}</span>
        <span class="footer-center">Página &nbsp; ${p.pageNum} &nbsp; de &nbsp; 5</span>
      </div>
    </div>
  `).join('\n')}
</body>
</html>`;

fs.writeFileSync(htmlPath, html, 'utf8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
execFileSync(edgePath, [
  '--headless',
  '--disable-gpu',
  `--print-to-pdf=${outputPdfNoLogo}`,
  '--no-pdf-header-footer',
  htmlPath
]);

fs.copyFileSync(outputPdfNoLogo, outputPdfArtifact);
console.log('PDF sin logo generado:', outputPdfNoLogo);
