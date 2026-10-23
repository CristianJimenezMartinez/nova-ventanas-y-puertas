# 🛡️ Integridad de Infraestructura Nginx y SSL en VPS

1. **Convivencia Segura en el VPS (`212.227.248.132`):**
   - El despliegue de Nova Ventanas y Puertas opera en `/etc/nginx/sites-available/novaventanasypuertas.conf` (`novaventanasypuertas.com`).
   - Jamás tocar, desvincular o modificar `/etc/nginx/sites-enabled/default` (`gruposoto.es`).

2. **Aislamiento SSL:**
   - Nova utiliza su propio certificado SSL.
   - Prohibido modificar virtualhosts de otras divisiones.

3. **Puerto Asignado:**
   - Backend API Nova: Puerto `3006`.
