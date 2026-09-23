# Cotiza tu repuesto

Página web para que los **clientes** soliciten cotizaciones de repuestos, y un **panel privado** para que **Sergio Escobar** las gestione. Marcas: Suzuki, Mazda, Renault, Great Wall (GWM), Haval, Changan y DFSK. Fuente: Inter.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página pública del cliente (formulario, fotos, consulta de estado, botón de WhatsApp) |
| `admin.html` | Panel privado de Sergio: ver solicitudes, poner precios, cambiar estado, PDF y Excel |
| `config.js` | Configuración común (WhatsApp, correo, URL del script, vigencia) |
| `apps-script.gs` | Código de Google Apps Script (registro en Sheets, fotos en Drive, correos) |
| `logo.png` | Logo |

## Flujo

1. El cliente completa datos, vehículo (con VIN opcional), repuestos, tipo (original/alternativo/económico), entrega (retiro/despacho) y hasta 3 fotos.
2. Se genera un ID (`COT-AAAAMMDD-XXXX`); la solicitud queda en Google Sheets, las fotos en Drive, y se envían correos (aviso a Sergio y respaldo al cliente si dejó correo).
3. Sergio entra a `admin.html`, ingresa los precios (IVA incluido) y despacho, y guarda: el estado pasa a *Cotizado* y el cliente recibe su cotización por correo. También puede imprimir/guardar el **PDF** con logo.
4. El cliente puede consultar el estado y los valores con su número de solicitud en `index.html` (o con el enlace del correo).
5. Todo se puede descargar como Excel desde el panel o desde la propia hoja de Google.

## Puesta en marcha

1. **Google Sheets:** crea una hoja nueva → *Extensiones → Apps Script* → pega `apps-script.gs`.
2. En el script cambia `CLAVE_ADMIN` (clave del panel) y, si quieres avisos, `EMAIL_SERGIO`.
3. *Implementar → Nueva implementación → Aplicación web* (ejecutar como: yo; acceso: cualquier persona). Autoriza los permisos (Sheets, Drive y correo). Copia la URL `/exec`.
   Si actualizas el código más adelante, crea una **nueva implementación** para que tome los cambios.
4. En `config.js` completa `WHATSAPP`, `EMAIL` y `SHEETS_URL`.
5. **GitHub Pages:** sube todos los archivos a un repositorio → *Settings → Pages* → rama `main`, carpeta `/ (root)`.
   - Clientes: `https://TU-USUARIO.github.io/REPO/`
   - Sergio: `https://TU-USUARIO.github.io/REPO/admin.html`

## Notas de seguridad
- La clave del panel se valida en Google, no en la página; usa una clave larga y no la compartas.
- La consulta de estado por ID solo muestra estado, repuestos y precios, nunca datos personales.
- No subas a GitHub Excels con datos reales de clientes.
- Sin `SHEETS_URL` la página igual funciona (envío por WhatsApp/correo), pero no habrá registro, consulta de estado ni panel.
