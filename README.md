# 🏛️ NOVA Ventanas & Puertas — Documentación Técnica y Arquitectura (Grupo Soto)

Plataforma web oficial (`novaventanasypuertas.com` / `novaventanasypuertas.es`) y arquitectura del futuro **Portal Interno Multitenant (`portal.novaventanasypuertas.com`)** para **NOVA Ventanas & Puertas**, división especializada en carpintería arquitectónica, cerramientos minimalistas y sistemas Passivhaus de **Grupo Soto Empresarial S.L.**

> [!IMPORTANT]
> **Mapa de Documentación Oficial del Proyecto:**
> 1. **[`AGENTS.md`](AGENTS.md)**: Reglas inquebrantables de ingeniería y gobernanza para IA, subagentes y desarrolladores (**máximo 500 líneas por archivo/componente** y **prohibición de compilar/desplegar directo en el VPS de 4 GB RAM — uso exclusivo de GitHub Actions**).
> 2. **[`README.md`](README.md)** *(este documento)*: Inventario actual de la web pública, componentes activos/en reserva, catálogos PDF traducidos y configuración SEO/AIO.
> 3. **[`PLAN_MAESTRO_ARQUITECTURA_NOVA.md`](PLAN_MAESTRO_ARQUITECTURA_NOVA.md)**: Arquitectura completa del **Portal Multitenant (`portal.novaventanasypuertas.com`)**, estrategia de **Marca Propia NOVA** con ingeniería real, **Motor de Precios por Matriz de Medidas ($\text{Ancho} \times \text{Alto}$)** con croquis SVG, CRM de Obras, **Facturación VeriFactu en 3 Modos** (Descarga XML/ZIP para gestoría desde el Día 1 + Cofre de Certificado `.p12`/`.pfx` + Envío directo AEAT), **Preparación nativa para Venta Online / E-Commerce (`Pay-by-Link`, Configurador A Medida con Compra Online y Stock)** y las **7 Etapas de ejecución**.
> 4. **[`INFRAESTRUCTURA_VPS_GRUPO_SOTO.md`](INFRAESTRUCTURA_VPS_GRUPO_SOTO.md)**: Topología del servidor VPS, asignación de puertos (`3004` reservado para `nova-api`), base de datos (`db_nova`) y protocolo de portabilidad entre servidores.

---

## 📐 1. Estado Actual de la Web Pública (`novaventanasypuertas.com`)

- **Framework:** Angular 17.3 (Standalone Components, Angular Signals, TypeScript 5.4).
- **Sistema de Diseño:** *Quiet Luxury Architectural* — estética editorial minimalista en tonos **Deep Noir (`#0D0D0D`)**, **Champagne Brass (`#C6AD82`)** y **Warm Ivory (`#F5F2EB`)**, con tipografía **Manrope**.
- **Servicio de Datos Principal:** [`NovaService`](src/app/core/services/nova.service.ts) + modelos en [`nova.model.ts`](src/app/core/models/nova.model.ts).
- **Política de Marca en Web Pública:** Las gamas se presentan bajo **nomenclatura técnica propia de NOVA** respaldada por estándares normativos reales (CTE, DIN, EN), sin exponer marcas de fabricantes terceros en la web pública hasta que la dirección lo determine (gestionándose el fabricante como campo interno opcional en el backoffice).

### 1.1. Flujo de Experiencia Activo (`HomeComponent`)
El flujo principal en [`home.component.html`](src/app/pages/home/home.component.html) se estructura en **12 bloques modulares**:

| Orden | Componente | Selector | Función Principal |
| :---: | :--- | :--- | :--- |
| 01 | **Header** | `<app-header>` | Navegación fija con marca NOVA / Grupo Soto, menú hamburguesa móvil con bloqueo de scroll y CTA directo. |
| 02 | **Hero** | `<app-hero>` | Portada arquitectónica de gran formato con manifiesto de marca y acceso a soluciones/showroom. |
| 03 | **Details** | `<app-details>` | *«La diferencia está en los detalles»*: foco en perfilería oculta, encuentros limpios y hermeticidad. |
| 04 | **Solutions** | `<app-solutions>` | Las 5 familias: **Ventanas**, **Puertas**, **Correderas**, **Cerramientos** y **Grandes Formatos**. |
| 05 | **Materials** | `<app-materials>` | Comparativa interactiva de los 4 materiales del showroom: **Aluminio RPT**, **PVC Passivhaus**, **Mixto (Aluminio-Madera)** y **Madera Laminada**. |
| 06 | **Solution Finder** | `<app-solution-finder>` | Recomendador interactivo según necesidad (*Ventana / Puerta / Cerramiento*) y prioridad (*Aislamiento / Diseño / Seguridad / Eficiencia*), con enlace directo a WhatsApp preconfigurado. |
| 07 | **Brand Pillars** | `<app-brand-pillars>` | Los 5 pilares de NOVA: `01 Diseño`, `02 Calidad`, `03 Aislamiento`, `04 Seguridad`, `05 Eficiencia Energética`. |
| 08 | **Architecture** | `<app-architecture>` | Integración arquitectónica de muros cortina y grandes luces para obra nueva y prescripción técnica. |
| 09 | **Projects** | `<app-projects>` | Galería filtrable de proyectos reales (*Casa Mediterránea*, *Villa Altorreal*, *Ático Gran Vía*, *Finca Bioclimática*). |
| 10 | **Showroom** | `<app-showroom>` | Presentación del showroom físico en Pol. Ind. La Serreta (Molina de Segura, Murcia) y reserva de cita técnica. |
| 11 | **Final CTA** | `<app-final-cta>` | Cierre de conversión para arquitectos, interioristas y particulares. |
| 12 | **Footer** | `<app-footer>` | Datos fiscales de Grupo Soto, contacto directo (`+34 613 75 42 71`, `info@novaventanasypuertas.com`) y enlaces legales. |

### 1.2. Módulos en Reserva (Prototipo v1 en `components/`)
Existen 6 componentes adicionales en `src/app/pages/home/components/` y su servicio asociado [`ProductService`](src/app/core/services/product.service.ts) que no se renderizan actualmente en la portada pero contienen lógica reutilizable para el futuro catálogo técnico:
- `configurador` (asistente de presupuesto multipaso)
- `product-showcase` (fichas técnicas detalladas por serie — pendientes de actualizar a nomenclatura técnica oficial NOVA en la Etapa 1)
- `passivhaus-tech` (comparador técnico de transmitancia $U_w$)
- `nextgen-banner` (información de subvenciones europeas Next Generation EU)
- `showroom-gallery` (muestrario de acabados RAL y foliados madera)
- `testimonials-faq` (preguntas frecuentes y garantías)

---

## 📚 2. Biblioteca Interna de Catálogos Técnicos (PDF)

En el directorio local [`document-pdf/traducidos/`](document-pdf/traducidos/) (ignorado en Git por peso de binarios) se encuentran los **4 catálogos técnicos de referencia** traducidos íntegramente al español técnico, auditados con **0 términos residuales** y personalizados con la identidad corporativa de **NOVA · Grupo Soto** (**262 páginas en total**):

| Archivo PDF | Páginas | Tamaño | Contenido Técnico de Referencia Interna |
| :--- | :---: | :---: | :--- |
| **`NOVA_Catalogo_Maestro_Sistemas_ES.pdf`** | **133** | 47,1 MB | **Catálogo Maestro de Sistemas**:<br>• **Sistemas PVC (60/70/72/82 mm):** Perfilería de 4 a 7 cámaras, doble y triple junta EPDM.<br>• **Correderas Elevables PVC:** Sistemas de gran formato (hasta 6,5 m × 2,7 m).<br>• **Sistemas de Aluminio RPT y Muro Cortina:** Series minimalistas, hoja oculta, elevables a cota cero y fachadas ligeras.<br>• **Herrajes y Domótica:** Herraje perimetral de seguridad RC1–RC3 (DIN EN 1627), cerraduras multipunto automáticas/electromecánicas, control biométrico y venecianas integradas en cámara de vidrio. |
| **`NOVA_Catalogo_Puertas_Seguridad_ES.pdf`** | **98** | 184,2 MB | **Catálogo de Puertas de Seguridad y Acorazadas**:<br>• Tecnología de fabricación (corte láser, conformado, recubrimiento polimérico).<br>• Colecciones residenciales completas (**Europe**, **Modern**, **Classic**, **Decoline**) con despiece de colores, maderas e insertos inox/acrílicos. |
| **`T-Group_Catalogo_2_ES_NOVA_v3.pdf`** | **16** | 66,6 MB | **Catálogo de Puertas de Entrada Residenciales**:<br>• Gama Smart Doors, paneles HPL de alta densidad, sistemas correderos, tabla de foliados y acabados arquitectónicos. |
| **`NOVA_Catalogo_Mallorquinas_Skuro_ES.pdf`** | **15** | 17,7 MB | **Catálogo de Contraventanas y Mallorquinas de PVC**:<br>• Sistemas Padovana, Vicentina, Monoblock, herrajes rústicos regulables y lamas fijas u orientables. |

---

## 🔍 3. SEO, Indexación y Optimización para IA (GEO / AIO)

Toda la capa de descubrimiento para motores de búsqueda (Google, Bing) y motores generativos (ChatGPT, Perplexity, Claude, Google AI Overviews) está implementada en `src/` y declarada en `angular.json`:

1. **[`src/index.html`](src/index.html) — Metadatos y Datos Estructurados JSON-LD:**
   - Entidad principal `@type: "HomeAndConstructionBusiness"` vinculada a `GRUPO SOTO EMPRESARIAL SL`.
   - Geolocalización exacta en Polígono Industrial La Serreta, Molina de Segura (Murcia), con cobertura en Murcia, Alicante y España.
   - `hasOfferCatalog` estructurado con elementos `@type: "Service"` (evitando errores de validación de fragmentos de producto de e-commerce en Google Search Console al tratarse de fabricación a medida sin carrito de compra).
2. **[`src/sitemap.xml`](src/sitemap.xml):** Sitemap XML con extensión `xmlns:image` que indexa las imágenes principales de soluciones arquitectónicas.
3. **[`src/robots.txt`](src/robots.txt):** Directivas limpias apuntando al `sitemap.xml` y referencia a `llms.txt`.
4. **[`src/llms.txt`](src/llms.txt):** Documento Markdown estandarizado para ingesta por LLMs con toda la ficha técnica, materiales, valores y contacto de NOVA.
5. **[`src/humans.txt`](src/humans.txt):** Créditos técnicos de desarrollo, arquitectura UI/UX y estándares empleados.

---

## 🏢 4. Arquitectura de Expansión: Portal Multitenant (`portal.novaventanasypuertas.com`)

Toda la especificación funcional y técnica de la siguiente fase está detallada en **[`PLAN_MAESTRO_ARQUITECTURA_NOVA.md`](PLAN_MAESTRO_ARQUITECTURA_NOVA.md)**:

- **Separación por Subdominio:** `portal.novaventanasypuertas.com` (Backoffice Angular + API NestJS en puerto `3004` + PostgreSQL `db_nova`), independiente de la web pública para facilitar su futura migración a un VPS dedicado cambiando únicamente el registro DNS `A`.
- **Motor de Tarifas por Medidas ($\text{Ancho} \times \text{Alto}$):** Cuadrículas 2D en milímetros editables e importables por el cliente desde Excel/CSV, con salto automático al tramo superior inmediato y suplementos configurables (color $\%$, vidrio $€/\text{m}^2$, persianas, instalación).
- **CRM, Obras y Facturación de Construcción con VeriFactu Evolutivo:** Embudo de leads, cuaderno de medición en obra, presupuestador PDF por huecos con croquis SVG, pedidos a fábrica, semáforo de acopio y facturación de construcción (Anticipos, Liquidación Final, Certificaciones con retención del 5%, Regla del 40% para IVA 10%, 0% ISP), más **VeriFactu en 3 Modos** (Descarga de XML AEAT y paquete `.ZIP` para gestoría desde el Día 1, Cofre para Certificado Digital `.p12`/`.pfx` con firma `XAdES-EPES`/`Facturae`, y envío directo SOAP mTLS a la AEAT activable con un interruptor).
- **Preparación Nativa para E-Commerce y Cobro Online (`Omnicanal`):** Enlaces de firma y pago online de presupuestos/anticipos (`Pay-by-Link` con TPV/Bizum/Financiación), más capacidad de activar venta online directa tanto desde el Configurador 2D A Medida como para productos en stock, con cálculo automático de portes pesados.

---

## ☁️ 5. Infraestructura VPS y Despliegue Continuo (CI/CD)

Documentado en detalle en **[`INFRAESTRUCTURA_VPS_GRUPO_SOTO.md`](INFRAESTRUCTURA_VPS_GRUPO_SOTO.md)**:

- **Servidor VPS (IONOS Cloud):** `212.227.248.132` (Ubuntu 24.04 LTS).
- **Regla Crítica Zero-Build:** Queda prohibido ejecutar `npm run build` dentro del VPS para proteger los 3.8 GiB de RAM compartidos.
- **Pipeline Automatizado ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)):** Compila en GitHub Actions (Node 22, 16 GB RAM), empaqueta `dist/` + `nginx-nova.conf` y despliega vía SCP en `/var/www/nova-ventanas-y-puertas/browser`.

---

## 🛠️ 6. Comandos Rápidos

```bash
# Servidor de desarrollo local (http://localhost:4200/)
npm start

# Compilación de producción local (genera dist/nova-ventanas-y-puertas/browser)
npm run build
```
