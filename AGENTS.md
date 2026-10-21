# 🏛️ REGLAS INQUEBRANTABLES DE INGENIERÍA Y GOBERNANZA — NOVA (Grupo Soto)

Estas reglas son de **cumplimiento obligatorio y automático** para el agente principal y para **todos los subagentes** que trabajen en el repositorio `nova-ventanas-y-puertas` (tanto en la Web Pública `novaventanasypuertas.com` como en el Portal Multitenant `portal.novaventanasypuertas.com` y su API `nova-api`).

---

## 🚨 REGLA CRÍTICA 1: Despliegue Exclusivo por GitHub Actions (PROHIBIDO Compilar o Hacer Deploy Directo en el VPS)
1. El servidor VPS de producción (`212.227.248.132`) cuenta con **3.8 GiB de RAM** compartidos entre PostgreSQL, Nginx y varios backends en PM2.
2. **QUEDA TERMINANTEMENTE PROHIBIDO** ejecutar `npm run build`, `ng build`, `npx prisma migrate dev`, `npm install` pesados o hacer despliegues directos manuales dentro del VPS que consuman RAM/CPU y puedan tumbar el servidor (Linux OOM-Killer).
3. **Todo cambio que vaya a producción DEBE subirse mediante `git commit` y `git push origin main`** para que **GitHub Actions** (en su runner de 16 GB de RAM) ejecute la compilación y transfiera únicamente el paquete compilado (`deploy-bundle.tar.gz`) al VPS.
4. Por SSH en el VPS solo se permiten comandos ligeros de diagnóstico, lectura de logs, creación de esquemas SQL ligeros o recarga de configuración (`nginx -t && systemctl reload nginx`, `pm2 reload`).

---

## 📏 REGLA CRÍTICA 2: Límite Estricto de 500 Líneas por Archivo/Componente (Arquitectura Modular)
1. **Ningún archivo del proyecto (`.ts`, `.html`, `.scss`) puede superar jamás las 500 líneas de código** (objetivo recomendado: **150 a 300 líneas** por archivo).
2. Si un componente, vista o servicio se acerca a ese límite (por ejemplo: el Configurador 2D de Ventanas, el Presupuestador por Huecos, la Tabla de Facturación o el Editor de Matrices), **es obligatorio dividirlo en sub-componentes pequeños y especializados**:
   - **Componentes Contenedores (Smart/Page):** Orquestan el estado y las llamadas a servicios.
   - **Sub-componentes de Presentación (Dumb/UI):** Reciben inputs (`@Input()` / `input()`) y emiten eventos (`@Output()` / `output()`), como `quote-header`, `quote-hole-row`, `window-sketch-svg`, `matrix-grid-editor`, `invoice-verifactu-modal`.
   - **Servicios de Dominio divididos por responsabilidad:** Nunca crear un "mega-servicio" de 1.000 líneas; separar en servicios cohesivos (ej. `PricingMatrixService`, `GlassCalculationService`, `WindowSketchSvgService`).

---

## 🎨 REGLA CRÍTICA 3: Sistema de Diseño Unificado (*Quiet Luxury Architectural*)
1. Tanto la Web Pública como el CRM (`portal.novaventanasypuertas.com`) comparten la misma identidad visual definida en `src/styles.scss`:
   - **Geometría de Arista Viva (`border-radius: 0px`):** Botones, inputs, tablas, tarjetas, badges y modales usan esquinas rectas a $90^\circ$ (inspiradas en perfiles arquitectónicos).
   - **Paleta Oficial NOVA:** Negro Principal `#0D0D0D`, Superficies `#141414` / `#171717`, Bordes de `1px` `#242424`, Blanco Cálido `#F4F0E9`, Piedra `#A9A39A` y acento Latón Cepillado / Champagne `#C6AD82`.
   - **Doble Tema en el CRM:** Soporte nativo para alternar entre **"Noir Showroom" (Oscuro `#0D0D0D`)** y **"Warm Ivory" (Claro `#F4F0E9` para oficina y sol directo en obra)** manteniendo el Sidebar lateral en `#0D0D0D` con acento `#C6AD82`.
   - **Tipografía `Manrope` con `font-variant-numeric: tabular-nums`** obligatorio en todas las tablas de medidas (`mm`), porcentajes e importes (`€`).

---

## 🏷️ REGLA CRÍTICA 4: Política de Marca Propia NOVA en la Web Pública
1. **No atar la web pública a marcas de fabricantes terceros** (como VEKA, Reynaers, Cortizo, etc.) hasta que la dirección lo indique expresamente.
2. En la web pública, todos los sistemas se presentan bajo **Gamas Técnicas Propias de NOVA** respaldadas por normativas reales (**CTE DB-HE, DB-HR, DB-SUA, UNE-EN 12207/12208/12210, DIN EN 1627 RC2/RC3**).
3. En la base de datos del Portal (`ProductSeries`), el fabricante real se guarda como un campo interno opcional (`supplierBrand`) con un interruptor `showSupplierOnWeb: boolean` (`false` por defecto).

---

## 🛡️ REGLA CRÍTICA 5: Blindaje de Seguridad, Facturación, VeriFactu y Portabilidad de VPS
1. **Independencia de Subdominio y Portabilidad:** El portal vive en `portal.novaventanasypuertas.com` con base de datos PostgreSQL aislada (`db_nova`) y configuración 100% parametrizada por variables de entorno (`.env`), sin rutas ni IPs hardcodeadas.
2. **Prohibición de los 5 Bugs de Riesgo/Facturación:**
   - Usar siempre `diasPago ?? 0` (nunca `diasPago || 30`).
   - Normalizar todas las fechas de vencimiento a las `23:59:59.999` del día de vencimiento.
   - Separar siempre la columna de **Estado Operativo** (`EN_FABRICACION`, `EN_ALMACEN`, `INSTALADO`) del **Estado Financiero**.
   - **Jamás ocultar ni bloquear el botón de Emitir Factura ni el de Registrar Cobro**, y permitir pasar a factura directamente desde **Almacén** en pedidos de solo suministro sin montaje.
3. **VeriFactu Evolutivo:** Toda factura emitida genera su huella encadenada `SHA-256` oficial de la AEAT, código QR en el PDF, descarga de XML oficial y paquete `.ZIP` para gestoría, dejando preparado el cofre de certificado `.p12`/`.pfx` (`AES-256-GCM`) para firma `XAdES-EPES` y envío directo SOAP a la AEAT.

---

## ⚙️ REGLA CRÍTICA 6: Estándares Técnicos Angular 17+ y NestJS
1. **Frontend Angular:** Usar Standalone Components, Signals (`signal`, `computed`), control flow moderno o directivas limpias, tipado estricto TypeScript (evitar `any`), accesibilidad (`aria-label`) y estilos encapsulados limpios que no superen el budget de `angular.json`.
2. **Backend NestJS + Prisma:** Validación estricta con `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`), guards JWT con verificación real de firma y `tokenVersion`, y filtrado obligatorio por `tenantId` en todas las consultas de base de datos.
3. **Documento de Referencia Obligatorio:** Antes de diseñar o implementar cualquier módulo, consultar siempre [`PLAN_MAESTRO_ARQUITECTURA_NOVA.md`](PLAN_MAESTRO_ARQUITECTURA_NOVA.md).
