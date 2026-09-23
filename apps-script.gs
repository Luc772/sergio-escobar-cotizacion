// ===== Cotizador de repuestos · Google Apps Script vinculado a tu Hoja de cálculo =====
// La hoja "Cotizaciones" es el registro compartido en tiempo real (tú y tus vendedores la editan a la vez).
var NOMBRE = 'Sergio Escobar';
var EMAIL_SERGIO = '';        // Aviso por correo de cada solicitud nueva (opcional)
var VALIDEZ_DIAS = 5;         // Vigencia de la cotización en el PDF
var LOGO_URL = '';            // Opcional: URL pública del logo, ej: https://TU-USUARIO.github.io/REPO/logo.png

var HOJA = 'Cotizaciones', HOJA_VEND = 'Vendedores';
var ESTADOS = ['Nuevo', 'Asignado', 'Cotizado', 'Aprobado', 'Cerrado'];
var ENC = ['ID','Fecha','Estado','Vendedor','Cliente','Teléfono','Correo','Marca','Modelo','Año','Patente','Chasis (VIN)',
  'Tipo de repuesto','Entrega','Comuna','Repuesto','Código','Cantidad','Precio unitario (IVA incl.)','Subtotal',
  'Costo despacho','Total cotización','Comentarios','Fotos'];
var C = { ID:1, FECHA:2, ESTADO:3, VEND:4, CLI:5, TEL:6, MAIL:7, MARCA:8, MOD:9, ANIO:10, PAT:11, VIN:12, TIPO:13, ENT:14, COM:15,
  REP:16, COD:17, CANT:18, PRE:19, SUB:20, DESP:21, TOT:22, NOTAS:23, FOTOS:24 };

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clp_(n) { return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function hoja_() { return ss_().getSheetByName(HOJA) || configurar_(); }

// ---------- Configuración de la hoja (colores, listas desplegables, fórmulas) ----------
function configurar_() {
  var ss = ss_(), h = ss.getSheetByName(HOJA) || ss.insertSheet(HOJA, 0);
  h.getRange(1, 1, 1, ENC.length).setValues([ENC]).setFontWeight('bold').setBackground('#1f3a5f').setFontColor('#ffffff').setWrap(true);
  h.setFrozenRows(1); h.setFrozenColumns(1);
  h.getRange('A:B').setNumberFormat('@'); h.getRange('F:F').setNumberFormat('@'); h.getRange('S:V').setNumberFormat('$#,##0');
  var v = ss.getSheetByName(HOJA_VEND);
  if (!v) {
    v = ss.insertSheet(HOJA_VEND);
    v.getRange(1, 1, 1, 3).setValues([['Nombre', 'WhatsApp (sin +)', 'Correo']]).setFontWeight('bold');
    v.appendRow(['Vendedor 1', '', '']); v.appendRow(['Vendedor 2', '', '']);
    v.getRange('B:B').setNumberFormat('@');
  }
  h.getRange(2, C.ESTADO, 999, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build());
  h.getRange(2, C.VEND, 999, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInRange(v.getRange('A2:A50'), true).setAllowInvalid(true).build());
  var col = { Nuevo: '#d0e2ff', Asignado: '#fff3bf', Cotizado: '#ffd8a8', Aprobado: '#c3f0ca', Cerrado: '#e0e0e0' };
  var rng = h.getRange(2, C.ESTADO, 999, 1);
  h.setConditionalFormatRules(ESTADOS.map(function (e) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(e).setBackground(col[e]).setRanges([rng]).build();
  }));
  [12, 15, 10, 10, 16, 14, 22, 12, 12, 7, 10, 18, 16, 14, 12, 30, 12, 9, 16, 12, 12, 14, 26, 30].forEach(function (w, i) { h.setColumnWidth(i + 1, w * 8); });
  return h;
}

// ---------- Recepción de solicitudes desde la página del cliente ----------
function doPost(e) {
  var data = JSON.parse(e.postData.contents), rows = data.rows || [];
  if (!rows.length) return json_({ error: 'sin datos' });
  var id = rows[0]['ID'], enlaces = [];
  if (data.fotos && data.fotos.length) {
    var it = DriveApp.getFoldersByName('Cotizaciones - fotos');
    var carpeta = it.hasNext() ? it.next() : DriveApp.createFolder('Cotizaciones - fotos');
    data.fotos.forEach(function (f, i) {
      var m = /^data:(.+?);base64,(.*)$/.exec(f.data);
      if (!m) return;
      var arch = carpeta.createFile(Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], id + '_' + (i + 1) + '.jpg'));
      arch.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);   // para que los vendedores las abran
      enlaces.push(arch.getUrl());
    });
  }
  var h = hoja_();
  rows.forEach(function (r, i) {
    var g = function (k) { return r[k] === undefined ? '' : r[k]; }, f = h.getLastRow() + 1;
    h.getRange(f, 1, 1, ENC.length).setValues([[g('ID'), g('Fecha'), 'Nuevo', '', g('Cliente'), g('Teléfono'), g('Correo'), g('Marca'), g('Modelo'),
      g('Año'), g('Patente'), g('Chasis (VIN)'), g('Tipo de repuesto'), g('Entrega'), g('Comuna'), g('Repuesto'), g('Código'), g('Cantidad'),
      '', '', '', '', g('Comentarios'), i === 0 ? enlaces.join('\n') : '']]);
    h.getRange(f, C.SUB).setFormula('=IF(S' + f + '="","",R' + f + '*S' + f + ')');
    if (i === 0) h.getRange(f, C.TOT).setFormula('=SUMIF($A:$A,A' + f + ',$T:$T)+N(U' + f + ')');
  });

  var r0 = rows[0], vehiculo = r0['Marca'] + ' ' + r0['Modelo'] + ' ' + (r0['Año'] || '');
  var detalle = rows.map(function (r) { return '- ' + r['Cantidad'] + ' x ' + r['Repuesto']; }).join('\n');
  try {
    if (EMAIL_SERGIO) MailApp.sendEmail(EMAIL_SERGIO, 'Nueva cotización ' + id,
      'Cliente: ' + r0['Cliente'] + ' (' + r0['Teléfono'] + ')\nVehículo: ' + vehiculo + '\nEntrega: ' + r0['Entrega'] + ' ' + (r0['Comuna'] || '') + '\n\n' + detalle + '\n\nHoja: ' + ss_().getUrl());
    if (r0['Correo']) MailApp.sendEmail(r0['Correo'], 'Recibimos tu solicitud ' + id + ' · ' + NOMBRE,
      'Hola ' + r0['Cliente'] + ',\n\nRecibimos tu solicitud de cotización.\nN° de solicitud: ' + id + '\nVehículo: ' + vehiculo + '\n\nRepuestos:\n' + detalle +
      '\n\nTe contactaremos con tu cotización a la brevedad.' + (data.pagina ? '\nPuedes ver el estado aquí: ' + data.pagina + '?id=' + id : '') + '\n\n' + NOMBRE);
  } catch (err) {}
  return json_({ ok: true });
}

// ---------- Consulta de estado para el cliente (solo estado, repuestos y precios) ----------
function doGet(e) {
  var id = String((e.parameter || {}).id || '').toUpperCase().trim(), v = hoja_().getDataRange().getValues(), items = [], estado = '', desp = 0;
  for (var i = 1; i < v.length; i++) {
    if (String(v[i][0]).toUpperCase() !== id) continue;
    estado = v[i][C.ESTADO - 1];
    desp = desp || Number(v[i][C.DESP - 1]) || 0;
    items.push({ repuesto: v[i][C.REP - 1], cantidad: Number(v[i][C.CANT - 1]) || 1, precio: Number(v[i][C.PRE - 1]) || 0 });
  }
  if (!items.length) return json_({ encontrado: false });
  var ver = ['Cotizado', 'Aprobado', 'Cerrado'].indexOf(estado) > -1;
  var total = ver ? items.reduce(function (a, x) { return a + x.precio * x.cantidad; }, desp) : 0;
  return json_({ encontrado: true, estado: estado, despacho: ver ? desp : 0, total: total,
    items: items.map(function (x) { return { repuesto: x.repuesto, cantidad: x.cantidad, precio: ver ? x.precio : 0 }; }) });
}

// ---------- Automatismos al editar la hoja (estado y vendedor se copian a todo el pedido) ----------
function onEdit(e) {
  try {
    var h = e.range.getSheet(), f = e.range.getRow(), c = e.range.getColumn();
    if (h.getName() !== HOJA || f < 2) return;
    var est = h.getRange(f, C.ESTADO);
    if (c === C.VEND && e.value && est.getValue() === 'Nuevo') est.setValue('Asignado');
    if (c === C.PRE && e.value && ['Nuevo', 'Asignado'].indexOf(est.getValue()) > -1) est.setValue('Cotizado');
    if (c === C.VEND || c === C.ESTADO || c === C.PRE) {
      propagar_(h, h.getRange(f, 1).getValue(), C.ESTADO, est.getValue());
      if (c === C.VEND) propagar_(h, h.getRange(f, 1).getValue(), C.VEND, e.value || '');
    }
  } catch (err) {}
}
function propagar_(h, id, col, val) {
  var ids = h.getRange(2, 1, Math.max(h.getLastRow() - 1, 1), 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) h.getRange(i + 2, col).setValue(val);
}

// ---------- Menú "Cotizador" dentro de la hoja ----------
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Cotizador')
    .addItem('Configurar hoja (solo la primera vez)', 'configurarHoja')
    .addItem('Avisar al vendedor (fila seleccionada)', 'avisarVendedor')
    .addItem('Enviar cotización al cliente en PDF (fila seleccionada)', 'enviarCotizacion')
    .addToUi();
}
function configurarHoja() { configurar_(); SpreadsheetApp.getUi().alert('Hoja lista: listas desplegables, colores y fórmulas configurados.'); }

function caso_() {
  var h = ss_().getActiveSheet(), rng = h.getActiveRange();
  if (h.getName() !== HOJA || !rng || rng.getRow() < 2) throw new Error('Selecciona una fila de la pestaña "Cotizaciones".');
  var id = String(h.getRange(rng.getRow(), 1).getValue());
  return h.getDataRange().getValues().filter(function (r, i) { return i > 0 && String(r[0]) === id; });
}
function resumen_(filas) {
  var r = filas[0];
  return r[0] + '\nCliente: ' + r[C.CLI - 1] + ' (' + r[C.TEL - 1] + ')\nVehículo: ' + r[C.MARCA - 1] + ' ' + r[C.MOD - 1] + ' ' + (r[C.ANIO - 1] || '') +
    (r[C.PAT - 1] ? ' · Patente ' + r[C.PAT - 1] : '') + (r[C.VIN - 1] ? '\nVIN: ' + r[C.VIN - 1] : '') + '\nTipo: ' + r[C.TIPO - 1] + ' · ' + r[C.ENT - 1] + ' ' + (r[C.COM - 1] || '') +
    '\nRepuestos:\n' + filas.map(function (f) { return '- ' + f[C.CANT - 1] + ' x ' + f[C.REP - 1] + (f[C.COD - 1] ? ' (' + f[C.COD - 1] + ')' : ''); }).join('\n') +
    (r[C.NOTAS - 1] ? '\nComentarios: ' + r[C.NOTAS - 1] : '') + (r[C.FOTOS - 1] ? '\nFotos:\n' + r[C.FOTOS - 1] : '');
}

function avisarVendedor() {
  var ui = SpreadsheetApp.getUi(), filas = caso_(), vend = filas[0][C.VEND - 1];
  if (!vend) { ui.alert('Primero elige un vendedor en la columna "Vendedor".'); return; }
  var vs = ss_().getSheetByName(HOJA_VEND).getDataRange().getValues(), info = null;
  for (var i = 1; i < vs.length; i++) if (vs[i][0] === vend) info = vs[i];
  var txt = 'Nueva cotización para ti, ' + vend + ':\n' + resumen_(filas), msg = '';
  if (info && info[2]) { MailApp.sendEmail(info[2], 'Nueva cotización ' + filas[0][0], txt + '\n\nHoja: ' + ss_().getUrl()); msg = 'Correo enviado a ' + vend + '. '; }
  if (info && info[1]) {
    ui.showModalDialog(HtmlService.createHtmlOutput('<p style="font-family:Arial">' + msg + '</p><p style="font-family:Arial"><a target="_blank" href="https://wa.me/' +
      String(info[1]).replace(/\D/g, '') + '?text=' + encodeURIComponent(txt) + '">Abrir WhatsApp de ' + vend + '</a></p>').setWidth(360).setHeight(130), 'Avisar al vendedor');
  } else ui.alert(msg || 'Agrega el correo o WhatsApp del vendedor en la pestaña "Vendedores".');
}

function enviarCotizacion() {
  var ui = SpreadsheetApp.getUi(), filas = caso_(), r = filas[0], total = 0, desp = 0;
  filas.forEach(function (f) { total += (Number(f[C.CANT - 1]) || 1) * (Number(f[C.PRE - 1]) || 0); desp = desp || Number(f[C.DESP - 1]) || 0; });
  if (!total) { ui.alert('Ingresa primero los precios en la columna "Precio unitario".'); return; }
  total += desp;
  var venc = Utilities.formatDate(new Date(Date.now() + VALIDEZ_DIAS * 864e5), Session.getScriptTimeZone(), 'dd-MM-yyyy');
  var html = '<div style="font-family:Arial;font-size:12px">' + (LOGO_URL ? '<img src="' + LOGO_URL + '" style="height:50px"><br>' : '<h2>' + NOMBRE + '</h2>') +
    '<h3>COTIZACIÓN ' + r[0] + '</h3><p><b>Cliente:</b> ' + r[C.CLI - 1] + '<br><b>Vehículo:</b> ' + r[C.MARCA - 1] + ' ' + r[C.MOD - 1] + ' ' + (r[C.ANIO - 1] || '') +
    (r[C.VIN - 1] ? ' · VIN ' + r[C.VIN - 1] : '') + '<br><b>Entrega:</b> ' + r[C.ENT - 1] + ' ' + (r[C.COM - 1] || '') + '</p>' +
    '<table border="1" cellpadding="5" style="border-collapse:collapse;width:100%"><tr><th>Repuesto</th><th>Cant.</th><th>P. unitario</th><th>Subtotal</th></tr>' +
    filas.map(function (f) { var c = Number(f[C.CANT - 1]) || 1, p = Number(f[C.PRE - 1]) || 0; return '<tr><td>' + f[C.REP - 1] + '</td><td>' + c + '</td><td>' + clp_(p) + '</td><td>' + clp_(c * p) + '</td></tr>'; }).join('') +
    (desp ? '<tr><td colspan="3">Despacho</td><td>' + clp_(desp) + '</td></tr>' : '') + '<tr><td colspan="3"><b>TOTAL (IVA incluido)</b></td><td><b>' + clp_(total) + '</b></td></tr></table>' +
    '<p>Cotización válida hasta el ' + venc + '. Sujeta a disponibilidad de stock.<br>' + NOMBRE + '</p></div>';
  var pdf = HtmlService.createHtmlOutput(html).getBlob().getAs('application/pdf').setName('Cotizacion ' + r[0] + '.pdf');
  if (!r[C.MAIL - 1]) { ui.alert('El cliente no dejó correo. PDF guardado en tu Drive: ' + DriveApp.createFile(pdf).getUrl()); return; }
  MailApp.sendEmail({ to: r[C.MAIL - 1], subject: 'Tu cotización ' + r[0] + ' · ' + NOMBRE, attachments: [pdf],
    body: 'Hola ' + r[C.CLI - 1] + ',\n\nAdjuntamos tu cotización ' + r[0] + '. Total (IVA incluido): ' + clp_(total) + '.\nVálida hasta el ' + venc + '.\n\n' + NOMBRE });
  var h = ss_().getSheetByName(HOJA);
  propagar_(h, r[0], C.ESTADO, 'Cotizado');
  ui.alert('Cotización enviada a ' + r[C.MAIL - 1] + ' y estado actualizado a "Cotizado".');
}
