# 🏛️ Mapa de Infraestructura VPS Grupo Soto & Nova Ventanas y Puertas

**Servidor VPS:** IONOS Cloud  
**IP Pública:** `212.227.248.132`  
**Sistema Operativo:** Ubuntu 24.04.4 LTS (Linux 6.8.0)  
**Usuario Principal:** `antigravity`  
**Clave de Acceso:** `SVEfKv9go2TKlU6N7wiy` (y clave SSH local autorizada `bentian-admin-key`)  
**Fecha de Auditoría:** 9 de Septiembre de 2026  

---

## 💻 1. Especificaciones de Hardware
* **CPU:** 1 vCore / KVM
* **Memoria RAM:** 3.8 GiB (Sin Swap activo). Uso actual ~3.0 GiB (796 MiB disponibles).
* **Almacenamiento:** Disco SSD 116 GB (12 GB en uso, 104 GB libres - 11%).
* **Regla de Oro:** **CERO COMPILACIONES EN EL VPS (Zero-Build)**. Todo `npm run build` o `ng build` debe correr en GitHub Actions (16 GB RAM) para no disparar el Linux OOM-Killer.

---

## 🚀 2. Matriz de Sitios y Aplicaciones en el VPS

| Proyecto / Dominio | Tipo | Backend (PM2) | Puerto Interno | Base de Datos | Directorio en VPS | Estado SSL (Certbot) |
|---|---|---|---|---|---|---|
| **Nova Ventanas y Puertas**<br>`novaventanasypuertas.com`<br>`novaventanasypuertas.es` | **SPA Estática (Nginx Directo)** | *Ninguno (0 MB RAM)* | `80 / 443` (Nginx) | *No requiere* | `/var/www/nova-ventanas-y-puertas/browser` | ✅ Activo Let's Encrypt (Expira 08/12/2026) |
| **Serenity Wellness Center**<br>`serenitywellnesscenter.es` | SSR Angular + NestJS | `serenity-api` (id: 3) | `3001` | `db_serenity` | `/var/www/Serenity` | ✅ Activo Let's Encrypt (Expira 17/11/2026) |
| **División del Automóvil**<br>`gruposotodivisiondelautomovil.es` | SSR Angular + NestJS | `automovil-api` (id: 0) | `3002` | `db_automovil` | `/var/www/Automovil` | ✅ Activo Let's Encrypt (Expira 17/11/2026) |
| **Hub Central**<br>`hub.gruposoto.es` | API NestJS | `hub-api` (id: 2) | `3003` | `db_hub` | `/var/www/Hub` | ✅ Activo Let's Encrypt (Expira 22/10/2026) |
| **Grupo Soto Corporativo**<br>`gruposoto.es` | Portal Web | En Nginx / SSR | `3000 / 4000` | `gruposoto` | `/var/www/GrupoSoto` | ✅ Activo Let's Encrypt (Expira 25/10/2026) |

---

## 🔒 3. Nginx: Sitios Activos (`/etc/nginx/sites-enabled/`)
1. `gruposoto-apps.conf` ➔ Proxy inverso hacia los backends NestJS (puertos 3000, 3001, 3002, 3003).
2. `novaventanasypuertas.conf` ➔ Servicio estático HTTP/2 HTTPS optimizado con Gzip, caché de 1 año para assets con hash y fallback de SPA para Angular Router (`try_files $uri $uri/ /index.html;`).

---

## 🗄️ 4. Bases de Datos PostgreSQL (`127.0.0.1:5432`)
* **Usuario Administrador:** `soto_admin`
* **Bases de datos alojadas:**
  * `db_automovil`
  * `db_hub`
  * `db_serenity`
  * `gruposoto`

---

## ⚡ 5. ¿Por qué Nova no necesita servidor Node/PM2?
A diferencia de Serenity y Automóvil (que tienen CRM con base de datos, generación de PDFs y autenticación JWT en NestJS), **NOVA Ventanas y Puertas** está diseñada como una experiencia web de arquitectura de interiores premium ultrarrápida:
* **Nginx sirve los archivos estáticos precompilados directamente desde RAM** sin intermediarios.
* **Cero consumo de CPU y RAM residual** en el servidor.
* **Velocidad de carga milimétrica (Time to First Byte < 20ms)**.
* **Seguridad infranqueable**: No hay endpoints ni procesos Node expuestos que puedan sufrir caídas.
