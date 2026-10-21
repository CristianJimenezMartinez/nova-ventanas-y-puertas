# 🏛️ Mapa de Infraestructura VPS Grupo Soto & Nova Ventanas y Puertas

**Servidor VPS Actual:** IONOS Cloud  
**IP Pública:** `212.227.248.132`  
**Sistema Operativo:** Ubuntu 24.04.4 LTS (Linux 6.8.0)  
**Usuario Principal:** `antigravity`  
**Clave de Acceso:** `SVEfKv9go2TKlU6N7wiy` (y clave SSH local autorizada `bentian-admin-key`)  
**Última Actualización:** 21 de Octubre de 2026  

---

## 💻 1. Especificaciones de Hardware y Regla Zero-Build
* **CPU:** 1 vCore / KVM
* **Memoria RAM:** 3.8 GiB (Sin Swap activo). Uso base ~3.0 GiB (~796 MiB libres).
* **Almacenamiento:** Disco SSD 116 GB (12 GB en uso, 104 GB libres - 11%).
* **Regla de Oro:** **CERO COMPILACIONES EN EL VPS (Zero-Build)**. Todo `npm run build` o `ng build` debe ejecutarse exclusivamente en GitHub Actions (runners de 16 GB RAM) para evitar saturar la RAM del VPS y disparar el Linux OOM-Killer.

---

## 🚀 2. Matriz de Sitios y Aplicaciones en el VPS (Actual + Reserva Portal NOVA)

| Proyecto / Dominio | Tipo | Backend (PM2) | Puerto Interno | Base de Datos | Directorio en VPS | Estado |
|---|---|---|---|---|---|---|
| **Nova Web Pública**<br>`novaventanasypuertas.com`<br>`novaventanasypuertas.es` | **SPA Estática (Nginx Directo)** | *Ninguno (0 MB RAM)* | `80 / 443` (Nginx) | *No requiere* | `/var/www/nova-ventanas-y-puertas/browser` | ✅ En Producción (SSL Let's Encrypt activo) |
| **Nova Portal Multitenant**<br>`portal.novaventanasypuertas.com` | **SPA Backoffice + API NestJS** | `nova-api` *(Reservado)* | `3004` *(Reservado)* | `db_nova` *(Reservada)* | `/var/www/nova-portal/browser`<br>`/var/www/nova-portal/api` | 📋 Planificado en [Plan Maestro](PLAN_MAESTRO_ARQUITECTURA_NOVA.md) (100% Portable de VPS) |
| **Serenity Wellness Center**<br>`serenitywellnesscenter.es` | SSR Angular + NestJS | `serenity-api` (id: 3) | `3001` | `db_serenity` | `/var/www/Serenity` | ✅ En Producción (SSL Let's Encrypt activo) |
| **División del Automóvil**<br>`gruposotodivisiondelautomovil.es` | SSR Angular + NestJS | `automovil-api` (id: 0) | `3002` | `db_automovil` | `/var/www/Automovil` | ✅ En Producción (SSL Let's Encrypt activo) |
| **Hub Central**<br>`hub.gruposoto.es` | API NestJS | `hub-api` (id: 2) | `3003` | `db_hub` | `/var/www/Hub` | ✅ En Producción (SSL Let's Encrypt activo) |
| **Grupo Soto Corporativo**<br>`gruposoto.es` | Portal Web | En Nginx / SSR | `3000 / 4000` | `gruposoto` | `/var/www/GrupoSoto` | ✅ En Producción (SSL Let's Encrypt activo) |

---

## 🔒 3. Nginx: Sitios Activos y Planificados (`/etc/nginx/sites-enabled/`)
1. `gruposoto-apps.conf` ➔ Proxy inverso hacia los backends NestJS (puertos `3000`, `3001`, `3002`, `3003`).
2. `novaventanasypuertas.conf` ➔ Servicio estático HTTP/2 HTTPS optimizado con Gzip, caché de 1 año para assets con hash y fallback de SPA (`try_files $uri $uri/ /index.html;`).
3. `portal-novaventanasypuertas.conf` *(Planificado Etapa 2)* ➔ Subdominio `portal.novaventanasypuertas.com` con cabecera `X-Robots-Tag: noindex, nofollow`, sirviendo el frontend del backoffice y redirigiendo `/api/v1/*` al puerto interno `3004` (`nova-api`).

---

## 🗄️ 4. Bases de Datos PostgreSQL (`127.0.0.1:5432`)
* **Usuario Administrador:** `soto_admin`
* **Bases de datos en servidor:**
  * `db_automovil` (División del Automóvil)
  * `db_hub` (Hub Central)
  * `db_serenity` (Serenity Wellness Center)
  * `gruposoto` (Portal Corporativo)
  * `db_nova` *(Reservada para el Portal Multitenant de NOVA: CRM, Tarifador por Medidas, Obras y Facturación)*

---

## ⚡ 5. Estrategia de Separación Web Pública vs. Portal Multitenant (Portabilidad de VPS)
Para garantizar velocidad máxima en la captación de clientes y libertad total para escalar el ERP/CRM de construcción:
1. **Web Pública (`novaventanasypuertas.com`):** Se mantiene como SPA estática servida directamente por Nginx desde `/var/www/nova-ventanas-y-puertas/browser` (0 MB de RAM en Node/PM2 y TTFB < 20 ms).
2. **Portal Interno Multitenant (`portal.novaventanasypuertas.com`):** Vive en su propio subdominio, su propio bloque Nginx y su propia base de datos (`db_nova`).
3. **Migración futura a otro VPS sin tiempo de inactividad:**
   - Cuando se desee mover el Portal Multitenant a un VPS dedicado, basta con restaurar `pg_dump` de `db_nova` en el nuevo servidor, desplegar `nova-api` + `nova-portal` allí, y cambiar el registro DNS `A` de `portal.novaventanasypuertas.com` a la nueva IP. La web pública principal no sufre ni un segundo de corte.
