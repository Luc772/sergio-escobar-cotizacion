# Cotiza tu repuesto

Página web para que los **clientes** soliciten la cotización de repuestos de su vehículo. Cada solicitud genera un registro automático (ID único) que llega a una hoja tipo Excel para que **Sergio Escobar** tome el caso.

El logo de Sergio Escobar está incrustado en `index.html` (copia en `logo.png`).

Marcas: Suzuki, Mazda, Renault, Great Wall (GWM), Haval, Changan y DFSK. Fuente: Inter.

## Cómo funciona

1. El cliente ingresa sus datos, su vehículo y los repuestos que necesita (sin precios).
2. Se genera un ID (`COT-AAAAMMDD-XXXX`) y la solicitud se guarda como filas (una por repuesto) en Google Sheets.
3. El cliente puede además enviarla por WhatsApp o correo y descargar una copia en Excel.
4. Sergio trabaja desde la hoja: cambia la columna **Estado** (Nuevo, Cotizado, Aprobado, Cerrado) y completa precios. Se puede descargar como `.xlsx`.

## Puesta en marcha

### 1. Configurar los datos de contacto
En `index.html`, busca el bloque `CONFIG`:

```js
const CONFIG={
  NOMBRE:'Sergio Escobar',
  WHATSAPP:'56912345678',  // formato internacional, sin +
  EMAIL:'correo@ejemplo.cl',
  SHEETS_URL:'URL_DEL_APPS_SCRIPT'
};
```

### 2. Conectar Google Sheets (registro automático)
1. Crea una hoja de cálculo nueva en Google Sheets.
2. **Extensiones → Apps Script**, pega el contenido de `apps-script.gs` y guarda.
3. **Implementar → Nueva implementación → Aplicación web**: *Ejecutar como:* yo; *Quién tiene acceso:* cualquier persona. Autoriza los permisos.
4. Copia la URL que termina en `/exec` y pégala en `SHEETS_URL`.

Si `SHEETS_URL` queda vacío, la página igual funciona: el cliente envía su solicitud por WhatsApp o correo.

### 3. Publicar en GitHub Pages
1. Sube `index.html`, `apps-script.gs` y `README.md` a un repositorio.
2. **Settings → Pages**: *Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. Quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`. Comparte ese enlace con los clientes.

## Privacidad
Los datos del cliente van a la hoja de Google del dueño, no al repositorio. No subas a GitHub Excels con datos reales de clientes.
