/**
 * Web App del catálogo — Cuchillos Galucho
 * =========================================
 *
 * Sirve el contenido del Google Sheet como JSON para la web (Next.js).
 *
 * Endpoints:
 *   GET <url>                      → hoja INVENTARIO (solo columnas públicas)
 *   GET <url>?sheet=ACCESOS_WEB    → hoja ACCESOS_WEB (clientes mayoristas)
 *   GET <url>?sheet=<NOMBRE>       → cualquier otra hoja por nombre
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
 * Recomendación en el Sheet:
 *   Formatear la columna IMAGEN como "Texto sin formato"
 *   (Formato → Número → Texto sin formato) para que valores como "7-9"
 *   no se autoconviertan en fechas.
 */

var SHEET_CATALOGO = "INVENTARIO";

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
  var nombre =
    (e && e.parameter && e.parameter.sheet) ? String(e.parameter.sheet) : SHEET_CATALOGO;

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

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
