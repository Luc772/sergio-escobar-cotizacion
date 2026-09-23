// Google Apps Script: guarda cada solicitud del cotizador como filas en una hoja de Google Sheets.
// Se puede abrir y descargar como Excel (Archivo → Descargar → .xlsx).
var ENCABEZADOS = ['ID','Fecha','Estado','Asignado a','Cliente','Teléfono','Correo','Marca','Modelo','Año','Patente','Repuesto','Código','Cantidad','Comentarios'];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (hoja.getLastRow() === 0) hoja.appendRow(ENCABEZADOS);
  data.rows.forEach(function (r) {
    hoja.appendRow(ENCABEZADOS.map(function (h) { return r[h] !== undefined ? r[h] : ''; }));
  });
  return ContentService.createTextOutput('ok');
}
