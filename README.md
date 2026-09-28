# Cotiza tu repuesto

Página para que los **clientes** soliciten cotizaciones de repuestos, y una **hoja de cálculo en línea (Google Sheets)** compartida en tiempo real donde **Sergio Escobar** y sus vendedores gestionan cada caso.
Marcas: Suzuki, Mazda, Renault, Great Wall (GWM), Haval, Changan y DFSK. Fuente: Inter.

```
Cliente (index.html) ──► Hoja de Google "Cotizaciones" ◄──► Sergio y vendedores (en tiempo real)
```

## Qué pasa cuando un cliente cotiza
1. Completa datos, vehículo (VIN opcional), repuestos, tipo, entrega y hasta 3 fotos.
2. Aparece **al instante** una nueva fila por repuesto en la hoja, con estado *Nuevo*, y las fotos en una carpeta de Drive (con enlace en la hoja).
3. El cliente recibe un correo de respaldo (si lo dejó) y Sergio un aviso (si configuras `EMAIL_SERGIO`).

## Cómo se trabaja en la hoja
- **Vendedor:** lista desplegable (se llena en la pestaña *Vendedores*). Al elegirlo, el estado pasa solo a *Asignado* y se copia a todas las filas de ese pedido.
- **Estado:** lista desplegable con colores (Nuevo, Asignado, Cotizado, Aprobado, Cerrado).
- **Precio unitario:** al escribirlo, el estado pasa a *Cotizado*; *Subtotal* y *Total cotización* se calculan solos.
- **Menú Cotizador** (arriba, junto a Ayuda):
  - *Avisar al vendedor*: le envía el caso por correo y abre un enlace de WhatsApp con el resumen.
  - *Enviar cotización al cliente en PDF*: envía el PDF por correo y marca el caso como *Cotizado*.
- Para que cada vendedor vea solo lo suyo: *Datos → Filtros → Crear vista de filtro* y filtrar por su nombre.
- Descargar como Excel: *Archivo → Descargar → Microsoft Excel (.xlsx)*.

## Puesta en marcha
1. Crea una **hoja de cálculo nueva** en Google Sheets.
2. *Extensiones → Apps Script*, pega `apps-script.gs` y guarda. (Opcional: completa `EMAIL_SERGIO` y `LOGO_URL`.)
3. Ejecuta la función `configurarHoja` (o recarga la hoja y usa el menú *Cotizador → Configurar hoja*) y autoriza los permisos (Sheets, Drive, correo).
4. *Implementar → Nueva implementación → Aplicación web*: ejecutar como **yo**, acceso **cualquier persona**. Copia la URL que termina en `/exec`.
   Si cambias el código más adelante, crea una **nueva implementación**.
5. En `config.js` completa `WHATSAPP`, `EMAIL` y `SHEETS_URL`.
6. En la pestaña **Vendedores** escribe nombre, WhatsApp (sin +) y correo de cada uno.
7. **Compartir la hoja:** botón *Compartir* → agrega el correo de cada vendedor como **Editor**. Todos ven los cambios al instante.
8. **Publicar la página del cliente:** sube `index.html`, `config.js` y `logo.png` a un repositorio de GitHub → *Settings → Pages* → rama `main`, carpeta `/ (root)`.

## Privacidad
- La hoja contiene datos de clientes: compártela solo con personas de confianza (no con "cualquiera con el enlace").
- Las fotos quedan visibles para quien tenga su enlace, para que los vendedores puedan abrirlas.
- El cliente puede consultar el estado con su número de solicitud, y solo ve estado, repuestos y precios.

## Video de fondo
- Guarda tu video como `fondo.mp4` en la misma carpeta que `index.html` y súbelo al repositorio.
- Se reproduce solo, sin sonido y en bucle, con una capa oscura para que el formulario se lea bien. Si el archivo no existe, la página se ve normal.
- No se muestra si la persona tiene activado "reducir movimiento" o ahorro de datos.
- Recomendado: 10 a 20 segundos, 1280 px de ancho, sin audio y **menos de 10 MB** (GitHub permite hasta 100 MB por archivo, pero un video pesado hace lenta la página en celulares). Para comprimirlo con ffmpeg:
  `ffmpeg -i original.mp4 -vf "scale=1280:-2" -an -crf 28 -preset slow -movflags +faststart fondo.mp4`
- Para cambiar el nombre o desactivarlo, edita `VIDEO_FONDO` en `config.js`.

## Validaciones y sucursales
- Teléfono: siempre `+56 9` + 8 dígitos. Correo: obligatorio, con `@` y dominio, y debe repetirse igual.
- Ciudad y comuna salen de `ZONAS` en `config.js`. Con **Retiro en sucursal** se listan las sucursales de esa ciudad (primero las de su comuna); con **Despacho** se pide la dirección.
- Edita `SUCURSALES` en `config.js` con nombre, ciudad, comuna, dirección y horario reales. La ciudad y comuna deben escribirse igual que en `ZONAS`.

Las sucursales reales (Concepción, Talcahuano, Los Ángeles, Chillán, Osorno, Huechuraba y La Florida) están cargadas en `SUCURSALES`. Para agregar una, copia una línea, cambia sus datos y verifica que su ciudad y comuna existan en `ZONAS`.
