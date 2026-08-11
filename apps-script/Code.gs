/**
 * Web App del catálogo — Cuchillos Galucho
 * =========================================
 *
 * Sirve el contenido del Google Sheet como JSON para la web (Next.js).
 *
 * Endpoints:
 *   GET  <url>                      → hoja INVENTARIO (solo columnas públicas)
 *   GET  <url>?sheet=ACCESOS_WEB    → hoja ACCESOS_WEB (clientes mayoristas)
 *   GET  <url>?config=precios       → { markupPct } leído de COSTOS!M5
 *   POST <url>  body {accion:"venta", …}  → registra una venta en la hoja VENTAS
 *   POST <url>  body {accion:"acceso_web", password, nombre, celular, ciudad}
 *                                    → agrega un contacto a ACCESOS_WEB (panel de Raúl)
 *
 *   Solo se sirven por ?sheet= las hojas de SHEETS_PUBLICAS — el resto
 *   (COSTOS, VENTAS, etc.) contienen datos internos y devuelven error.
 *
 * IMPORTANTE — columnas públicas:
 *   La URL del Web App es pública, así que para la hoja INVENTARIO solo se
 *   exponen las columnas de COLUMNAS_PUBLICAS. Los costos internos (HOJA,
 *   BOTON, SOLDADO, CORTE, M.OBRA, CABO, GASTOS, BRONCE, CAJA, TENEDOR,
 *   SUB TOTAL, X2, Extra, VAINA, JUEGO, VALORHOJA) nunca salen del sheet.
 *
 * Cómo desplegar (una sola vez):
 *   1. Abrir el Google Sheet nuevo → Extensiones → Apps Script
 *   2. Pegar este archivo completo reemplazando lo que haya
 *   3. Implementar → Nueva implementación → tipo "Aplicación web"
 *        - Ejecutar como: Yo
 *        - Acceso: Cualquier usuario
 *   4. Copiar la URL (termina en /exec) y ponerla en .env.local:
 *        SHEETS_WEBAPP_URL='https://script.google.com/macros/s/…/exec'
 *
 * Cómo actualizar el código después:
 *   Implementar → Administrar implementaciones → ✏️ editar → Versión: Nueva
 *   (si se crea una implementación nueva, cambia la URL y hay que
 *   actualizar .env.local)
 *
 * Dólar automático (una sola vez):
 *   El precio (TOTAL) se calcula con fórmulas del Sheet que toman el dólar
 *   de COSTOS!M2. Para que esa celda se actualice sola con el dólar oficial
 *   todos los días (y el precio se ajuste solo si sube el dólar):
 *     1. En el editor de Apps Script → reloj ⏰ "Activadores" (Triggers)
 *          en el menú lateral izquierdo → "+ Añadir activador"
 *     2. Función a ejecutar: actualizarDolar
 *     3. Origen del evento: Basado en tiempo → Temporizador diario
 *        → elegir un horario (ej: 6–7 de la mañana) → Guardar
 *   A partir de ahí corre solo. Si la API del dólar falla algún día, la
 *   celda conserva el último valor válido (no la deja en blanco ni rompe
 *   el sheet).
 *
 * Recomendación en el Sheet:
 *   Formatear la columna IMAGEN como "Texto sin formato"
 *   (Formato → Número → Texto sin formato) para que valores como "7-9"
 *   no se autoconviertan en fechas.
 */

var SHEET_CATALOGO = "INVENTARIO";
var SHEET_VENTAS = "VENTAS";
var SHEET_ACCESOS = "ACCESOS_WEB";
var ACCESOS_HEADERS_DEFAULT = ["NOMBRE", "CELULAR", "CIUDAD"];

// Contraseña que debe mandar el panel de Raúl para poder agregar accesos.
// Ya se valida también del lado de Next.js; esto es una segunda barrera.
var PASSWORD_ACCESOS = "distribuidoraherrera@gmail.com";

// Únicas hojas que el web app sirve por ?sheet= (la URL es pública)
var SHEETS_PUBLICAS = ["INVENTARIO", "ACCESOS_WEB"];

// % de ganancia minorista: hoja COSTOS, celda M5 (ej: 90 → precio = TOTAL × 1.9)
var SHEET_COSTOS = "COSTOS";
var CELDA_MARKUP = "M5";
var MARKUP_DEFAULT = 90;

// Valor del dólar (oficial, venta): hoja COSTOS, celda M2. Las fórmulas del
// sheet que calculan TOTAL toman el dólar de acá — actualizarDolar() la
// mantiene al día sola (ver activador en el encabezado de este archivo).
var CELDA_DOLAR = "M2";
var URL_DOLAR_API = "https://dolarapi.com/v1/dolares/oficial";

var VENTAS_HEADERS = [
  "FECHA",
  "REMITO",
  "VENDEDOR",
  "CLIENTE",
  "CIUDAD",
  "CELULAR",
  "PRODUCTO",
  "MEDIDA",
  "CANTIDAD",
  "PRECIO UNIT",
  "SUBTOTAL",
  "TOTAL REMITO",
];

var COLUMNAS_PUBLICAS = [
  "ID",
  "ORDEN",
  "IMAGEN",
  "SHEET",
  "MODELO",
  "DESCRIPCION",
  "UNIDADES",
  "TOTAL",
  "TIPOHOJA",
];

function doGet(e) {
  if (e && e.parameter && e.parameter.config === "precios") {
    return configPrecios_();
  }

  var nombre =
    (e && e.parameter && e.parameter.sheet) ? String(e.parameter.sheet) : SHEET_CATALOGO;

  if (SHEETS_PUBLICAS.indexOf(nombre.toUpperCase()) === -1) {
    return json_({ error: "Hoja no disponible: " + nombre });
  }

  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!hoja) {
    return json_({ error: "No existe la hoja: " + nombre });
  }

  // getDisplayValues() devuelve los valores tal como se ven en la hoja
  // ("$ 4.379", "1-3"), evitando que Sheets serialice fechas o números crudos.
  var valores = hoja.getDataRange().getDisplayValues();
  if (valores.length < 2) return json_([]);

  var headers = valores[0].map(function (h) {
    return String(h).trim();
  });

  // Para el inventario, solo dejar pasar las columnas públicas
  var esCatalogo = nombre.toUpperCase() === SHEET_CATALOGO;
  var visible = headers.map(function (h) {
    if (!h) return false;
    if (!esCatalogo) return true;
    return COLUMNAS_PUBLICAS.indexOf(h.toUpperCase()) !== -1;
  });

  var rows = [];
  for (var i = 1; i < valores.length; i++) {
    var fila = valores[i];
    var obj = {};
    var vacia = true;
    for (var c = 0; c < headers.length; c++) {
      if (!visible[c]) continue;
      var v = fila[c];
      if (String(v).trim() !== "") vacia = false;
      obj[headers[c]] = v;
    }
    if (!vacia) rows.push(obj);
  }

  return json_(rows);
}

// Config pública de precios: solo expone el % de markup, nunca la hoja COSTOS
function configPrecios_() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_COSTOS);
  var markup = hoja ? Number(hoja.getRange(CELDA_MARKUP).getValue()) : NaN;
  if (isNaN(markup) || markup <= 0) markup = MARKUP_DEFAULT;
  return json_({ markupPct: markup });
}

/**
 * Registra una venta (remito de Raúl) en la hoja VENTAS — una fila por ítem.
 * Si la hoja no existe, la crea con los encabezados de VENTAS_HEADERS.
 *
 * Body esperado (JSON):
 *   { accion: "venta", remito, vendedor, cliente, ciudad, celular, total,
 *     items: [{ producto, medida, cantidad, precioUnit, subtotal }] }
 */
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "JSON inválido" });
  }

  if (!data || !data.accion) {
    return json_({ ok: false, error: "Payload inválido" });
  }

  if (data.accion === "acceso_web") {
    return registrarAccesoWeb_(data);
  }

  if (data.accion !== "venta" || !Array.isArray(data.items) || data.items.length === 0) {
    return json_({ ok: false, error: "Payload inválido" });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(SHEET_VENTAS);
  if (!hoja) {
    hoja = ss.insertSheet(SHEET_VENTAS);
    hoja.appendRow(VENTAS_HEADERS);
    hoja.getRange(1, 1, 1, VENTAS_HEADERS.length).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }

  var fecha = new Date();
  var filas = data.items.map(function (it) {
    return [
      fecha,
      String(data.remito || ""),
      String(data.vendedor || ""),
      String(data.cliente || ""),
      String(data.ciudad || ""),
      String(data.celular || ""),
      String(it.producto || ""),
      String(it.medida || ""),
      Number(it.cantidad) || 0,
      Number(it.precioUnit) || 0,
      Number(it.subtotal) || 0,
      Number(data.total) || 0,
    ];
  });

  hoja
    .getRange(hoja.getLastRow() + 1, 1, filas.length, VENTAS_HEADERS.length)
    .setValues(filas);

  return json_({ ok: true, filas: filas.length });
}

/**
 * Agrega un contacto mayorista (nombre, celular, ciudad) a la hoja
 * ACCESOS_WEB — usado por el panel de Raúl. Si la hoja no existe la crea;
 * si existe pero le faltan columnas NOMBRE/CELULAR/CIUDAD, las agrega al
 * final para no romper columnas ya usadas (ej: MAIL).
 *
 * Body esperado (JSON):
 *   { accion: "acceso_web", password, nombre, celular, ciudad }
 */
function registrarAccesoWeb_(data) {
  if (String(data.password || "") !== PASSWORD_ACCESOS) {
    return json_({ ok: false, error: "Contraseña incorrecta" });
  }

  var celular = String(data.celular || "").replace(/\D/g, "");
  var nombre = String(data.nombre || "").trim();
  var ciudad = String(data.ciudad || "").trim();

  if (!nombre || celular.length < 8) {
    return json_({ ok: false, error: "Faltan datos: nombre y celular son obligatorios" });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(SHEET_ACCESOS);

  if (!hoja) {
    hoja = ss.insertSheet(SHEET_ACCESOS);
    hoja.appendRow(ACCESOS_HEADERS_DEFAULT);
    hoja.getRange(1, 1, 1, ACCESOS_HEADERS_DEFAULT.length).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }

  var lastCol = Math.max(hoja.getLastColumn(), 1);
  var headers = hoja.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h).trim().toUpperCase();
  });

  function colIndex(nombreCol) {
    var idx = headers.indexOf(nombreCol);
    if (idx === -1) {
      headers.push(nombreCol);
      hoja.getRange(1, headers.length).setValue(nombreCol).setFontWeight("bold");
      idx = headers.length - 1;
    }
    return idx;
  }

  var iNombre = colIndex("NOMBRE");
  var iCelular = colIndex("CELULAR");
  var iCiudad = colIndex("CIUDAD");

  var fila = new Array(headers.length).fill("");
  fila[iNombre] = nombre;
  fila[iCelular] = celular;
  fila[iCiudad] = ciudad;

  hoja.getRange(hoja.getLastRow() + 1, 1, 1, fila.length).setValues([fila]);

  return json_({ ok: true });
}

/**
 * Trae el dólar oficial (venta) y lo escribe en COSTOS!M2. Las fórmulas del
 * sheet que arman TOTAL a partir de esa celda recalculan solas apenas
 * cambia, así que el precio queda al día automáticamente.
 *
 * Se ejecuta sola vía un activador diario basado en tiempo (configurar una
 * vez desde el editor de Apps Script — ver el encabezado de este archivo).
 * También se puede correr a mano desde el editor para probarla.
 */
function actualizarDolar() {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_COSTOS);
  if (!hoja) {
    Logger.log("[dolar] No existe la hoja " + SHEET_COSTOS);
    return;
  }

  try {
    var res = UrlFetchApp.fetch(URL_DOLAR_API, { muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) {
      throw new Error("HTTP " + res.getResponseCode());
    }
    var data = JSON.parse(res.getContentText());
    var venta = Number(data && data.venta);
    if (!venta || isNaN(venta) || venta <= 0) {
      throw new Error("Respuesta inválida: " + res.getContentText());
    }
    hoja.getRange(CELDA_DOLAR).setValue(venta);
    Logger.log("[dolar] Actualizado a " + venta);
  } catch (err) {
    // Si la API falla, no tocar la celda: el sheet conserva el último valor válido
    Logger.log("[dolar] No se pudo actualizar: " + (err && err.message ? err.message : err));
  }
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
