// ===== Cotizador de repuestos · Google Apps Script =====
// Guarda solicitudes en Sheets, fotos en Drive, envía correos y atiende el panel de Sergio.
var CLAVE_ADMIN = 'cambia-esta-clave';   // <-- CAMBIAR: clave del panel admin.html
var EMAIL_SERGIO = '';                   // Correo donde avisar de cada solicitud nueva (opcional)
var NOMBRE = 'Sergio Escobar';

var ENC = ['ID','Fecha','Estado','Asignado a','Cliente','Teléfono','Correo','Marca','Modelo','Año','Patente',
  'Chasis (VIN)','Tipo de repuesto','Entrega','Comuna','Repuesto','Código','Cantidad','Precio unitario',
  'Costo despacho','Comentarios','Fotos','Enlaces fotos'];

function hoja_() { return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function fecha_(f) { return f instanceof Date ? Utilities.formatDate(f, Session.getScriptTimeZone(), 'dd-MM-yyyy HH:mm') : String(f); }
function clp_(n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }

function leer_() {
  var v = hoja_().getDataRange().getValues();
  if (v.length < 2) return [];
  return v.slice(1).map(function (f) { var o = {}; v[0].forEach(function (k, j) { o[k] = f[j]; }); return o; });
}

function agrupar_(filas) {
  var m = {}, orden = [];
  filas.forEach(function (f) {
    var id = f['ID'];
    if (!m[id]) {
      m[id] = { id: id, fecha: fecha_(f['Fecha']), estado: f['Estado'], cliente: f['Cliente'], tel: String(f['Teléfono']),
        correo: f['Correo'], marca: f['Marca'], modelo: f['Modelo'], anio: f['Año'], patente: f['Patente'], vin: f['Chasis (VIN)'],
        tipo: f['Tipo de repuesto'], entrega: f['Entrega'], comuna: f['Comuna'], despacho: 0, comentarios: f['Comentarios'],
        fotos: String(f['Enlaces fotos'] || '').split('\n').filter(Boolean), items: [] };
      orden.push(id);
    }
    if (Number(f['Costo despacho'])) m[id].despacho = Number(f['Costo despacho']);
    m[id].items.push({ repuesto: f['Repuesto'], codigo: f['Código'], cantidad: Number(f['Cantidad']) || 1, precio: Number(f['Precio unitario']) || 0 });
  });
  return orden.map(function (id) { var c = m[id]; c.total = totalCaso_(c); return c; }).reverse();
}
function totalCaso_(c) { return c.items.reduce(function (a, i) { return a + i.precio * i.cantidad; }, 0) + (c.despacho || 0); }

function doGet(e) {
  var p = e.parameter || {};
  var casos = agrupar_(leer_());
  if (p.accion === 'listar') {
    if (p.clave !== CLAVE_ADMIN) return json_({ error: 'Clave incorrecta' });
    return json_({ casos: casos });
  }
  var c = casos.filter(function (x) { return x.id === String(p.id).toUpperCase(); })[0];
  if (!c) return json_({ encontrado: false });
  var conPrecio = c.estado !== 'Nuevo';
  return json_({ encontrado: true, estado: c.estado, despacho: conPrecio ? c.despacho : 0, total: conPrecio ? c.total : 0,
    items: c.items.map(function (i) { return { repuesto: i.repuesto, cantidad: i.cantidad, precio: conPrecio ? i.precio : 0 }; }) });
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  return data.accion === 'cotizar' ? cotizar_(data) : nueva_(data);
}

function nueva_(data) {
  var enlaces = [], rows = data.rows || [];
  if (!rows.length) return json_({ error: 'sin datos' });
  var id = rows[0]['ID'];
  if (data.fotos && data.fotos.length) {
    var it = DriveApp.getFoldersByName('Cotizaciones - fotos');
    var carpeta = it.hasNext() ? it.next() : DriveApp.createFolder('Cotizaciones - fotos');
    data.fotos.forEach(function (f, i) {
      var m = /^data:(.+?);base64,(.*)$/.exec(f.data);
      if (!m) return;
      enlaces.push(carpeta.createFile(Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], id + '_' + (i + 1) + '.jpg')).getUrl());
    });
  }
  var h = hoja_();
  if (h.getLastRow() === 0) { h.appendRow(ENC); h.getRange('F:F').setNumberFormat('@'); }
  rows.forEach(function (r) {
    r['Enlaces fotos'] = enlaces.join('\n');
    h.appendRow(ENC.map(function (k) { return r[k] !== undefined ? r[k] : ''; }));
  });

  var r0 = rows[0];
  var detalle = rows.map(function (r) { return '- ' + r['Cantidad'] + ' x ' + r['Repuesto']; }).join('\n');
  var vehiculo = r0['Marca'] + ' ' + r0['Modelo'] + ' ' + (r0['Año'] || '');
  try {
    if (EMAIL_SERGIO) MailApp.sendEmail(EMAIL_SERGIO, 'Nueva cotización ' + id,
      'Cliente: ' + r0['Cliente'] + ' (' + r0['Teléfono'] + ')\nVehículo: ' + vehiculo + '\nEntrega: ' + r0['Entrega'] + ' ' + (r0['Comuna'] || '') + '\n\n' + detalle);
    if (r0['Correo']) MailApp.sendEmail(r0['Correo'], 'Recibimos tu solicitud ' + id + ' · ' + NOMBRE,
      'Hola ' + r0['Cliente'] + ',\n\nRecibimos tu solicitud de cotización.\nN° de solicitud: ' + id + '\nVehículo: ' + vehiculo + '\n\nRepuestos:\n' + detalle +
      '\n\nTe contactaremos con tu cotización a la brevedad.' + (data.pagina ? '\nPuedes ver el estado aquí: ' + data.pagina + '?id=' + id : '') + '\n\n' + NOMBRE);
  } catch (err) {}
  return json_({ ok: true });
}

function cotizar_(data) {
  if (data.clave !== CLAVE_ADMIN) return json_({ error: 'Clave incorrecta' });
  var h = hoja_(), v = h.getDataRange().getValues(), cabecera = v[0];
  var col = function (k) { return cabecera.indexOf(k) + 1; };
  var n = 0, correo = '', cliente = '';
  for (var i = 1; i < v.length; i++) {
    if (v[i][0] !== data.id) continue;
    var fila = i + 1;
    h.getRange(fila, col('Estado')).setValue(data.estado);
    if (data.precios && data.precios[n] !== undefined) h.getRange(fila, col('Precio unitario')).setValue(data.precios[n]);
    h.getRange(fila, col('Costo despacho')).setValue(n === 0 ? (data.despacho || 0) : '');
    correo = v[i][col('Correo') - 1]; cliente = v[i][col('Cliente') - 1];
    n++;
  }
  if (data.notificar && correo && data.estado === 'Cotizado') {
    var c = agrupar_(leer_()).filter(function (x) { return x.id === data.id; })[0];
    var lineas = c.items.map(function (i) { return '- ' + i.cantidad + ' x ' + i.repuesto + ': ' + clp_(i.precio * i.cantidad); }).join('\n');
    try {
      MailApp.sendEmail(correo, 'Tu cotización ' + data.id + ' · ' + NOMBRE,
        'Hola ' + cliente + ',\n\nTu cotización está lista:\n\n' + lineas + (c.despacho ? '\nDespacho: ' + clp_(c.despacho) : '') +
        '\n\nTOTAL (IVA incluido): ' + clp_(c.total) + '\n\nResponde este correo o escríbenos para confirmar.\n\n' + NOMBRE);
    } catch (err) {}
  }
  return json_({ ok: true, filas: n });
}
