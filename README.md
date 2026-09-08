# 🪟 Nova Ventanas y Puertas — Grupo Soto

Plataforma web vitrina (showroom digital de alta gama) para **Nova Ventanas y Puertas**, división especializada en cerramientos y carpintería de altas prestaciones de **Grupo Soto** (`novaventanasypuertas.com` / `novaventanasypuertas.es`).

Inspirada en el modelo de referencia líder del sector **[Replus.es](https://replus.es/)**, la web combina diseño premium, catálogo interactivo de soluciones, cotizador express para captación de clientes y optimización extrema para posicionamiento SEO local en la Región de Murcia y España.

---

## ✨ Características y Secciones Implementadas

1. **Header Corporativo & Brand Identity**:
   - Logotipo vectorizado de Nova Ventanas y Puertas con sello de pertenencia a Grupo Soto.
   - Selector reactivo de **Modo Claro / Modo Oscuro**.
   - Acceso directo a WhatsApp y botón prioritario de cotización.
   - Menú responsive con navegación fluida por anclas (`smooth-scroll`).

2. **Hero Section de Alto Impacto**:
   - Propuesta de valor clara en confort acústico, hermeticidad y eficiencia energética.
   - 4 métricas técnicas de confianza ($0.72\text{ W/m²K}$ $U_w$, $-48\text{ dB}$, hasta $4.000€$ de ayuda NextGen y $10\text{ años}$ de garantía).

3. **Banner Ayudas Europeas Next Generation EU**:
   - Explicación de subvenciones a fondo perdido (40-60%) y deducciones fiscales en IRPF.
   - Tramitación integral "llave en mano" por parte del equipo técnico de Grupo Soto.

4. **Vitrina Interactiva de Soluciones (Catálogo 2026)**:
   - Filtros por categoría:
     - 🪟 **Ventanas de PVC** (Nova Thermo 76, Nova Passiv 88).
     - 📐 **Ventanas de Aluminio RPT** (Nova Alu Minimal 70, Nova Horizon Slide).
     - 🚪 **Puertas Acorazadas & Entrada** (Nova Master Gate RC3).
     - 💎 **Cortinas de Cristal** (Nova Panorama Glass sin perfiles verticales).
     - ☀️ **Techos Móviles & Pérgolas** (Nova Sky Bioclimatic motorizados).
     - ⚙️ **Persianas Túnel & Mosquiteras** (Aislamiento térmico monoblock).
   - Tira técnica en cada tarjeta: Transmitancia $U_w$, Atenuación Acústica, Profundidad de perfil y Hermeticidad.

5. **Configurador / Cotizador Express**:
   - Asistente en 3 pasos: Cerramiento ➔ Material y Volumen ➔ Ubicación y Datos.
   - Generación instantánea del mensaje pre-rellenado para envío directo a **WhatsApp** o solicitud de visita de medición gratuita.

6. **Ingeniería Passivhaus & Eficiencia Energética**:
   - Comparador visual de transmitancia térmica ($U_w$) frente a ventanas antiguas y convencionales.
   - Los 4 pilares: perfil multicámara, soldadura invisible, triple junta perimetral y vidrios con gas Argón.

7. **Showroom de Proyectos & Muestrario de Acabados**:
   - Casos reales de reformas en Altorreal (Molina de Segura), Gran Vía de Murcia, La Manga y Cieza.
   - Muestrario interactivo de colores y texturas (Gris Antracita 7016, Negro Azabache, Roble Dorado, Nogal, etc.).

8. **Garantías y Preguntas Frecuentes (FAQs)**:
   - Acordeón interactivo con dudas sobre obras, plazos, homologaciones y subvenciones.

9. **Footer Corporativo**:
   - Datos de contacto directo en Molina de Segura (`+34 613 75 42 71`, `gerencia@gruposoto.es`), horarios, sellos CE y vinculación a las políticas RGPD de Grupo Soto.

---

## 🛠️ Tecnologías y Arquitectura

- **Framework**: Angular 17+ (Standalone Components, Signals reactivos).
- **Estilos**: SCSS modular con variables globales CSS y presupuestos estrictos (<6kB por componente).
- **Iconografía**: SVG inline vectoriales + Lucide Icons optimizados.
- **Rendimiento**: Carga perezosa (Lazy Loading) por rutas, imágenes optimizadas y `loading="lazy"`.
- **Gobernanza**: Cumple al 100% el manual técnico y de atomización de componentes de Grupo Soto (`normas_diseno_monorepo.md`).

---

## 🚀 Comandos de Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo local
npm start
# Abre tu navegador en: http://localhost:4200/

# 3. Compilación de producción
npm run build
# Los archivos optimizados se generan en: dist/nova-ventanas-y-puertas/browser
```

---

## 🌐 Guía de Despliegue en IONOS

### 1. Configuración de DNS en el Panel de IONOS
En el panel de control de IONOS para los dominios **`novaventanasypuertas.com`** y **`novaventanasypuertas.es`**:
1. Ve a **Dominios & SSL** ➔ Administrar dominio ➔ Pestaña **DNS**.
2. Modifica el **Registro A** de `@` y `www` para que apunten a la dirección IP pública de tu VPS en IONOS (ej. `82.165.xx.xx`).
3. *(Aviso)*: **NO tocar los registros MX** para mantener intacto el correo corporativo.

### 2. Despliegue con Nginx en el Servidor VPS
1. Compila el proyecto localmente o en el servidor:
   ```bash
   npm run build
   ```
2. Sube la carpeta `dist/nova-ventanas-y-puertas/browser` a la ruta `/var/www/nova-ventanas-y-puertas/browser` del VPS.
3. Copia el archivo `nginx-nova.conf` a `/etc/nginx/sites-available/novaventanasypuertas.conf`.
4. Habilita el sitio y recarga Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/novaventanasypuertas.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```
5. Emite los certificados SSL gratuitos con Certbot:
   ```bash
   sudo certbot --nginx -d novaventanasypuertas.com -d www.novaventanasypuertas.com -d novaventanasypuertas.es -d www.novaventanasypuertas.es
   ```
