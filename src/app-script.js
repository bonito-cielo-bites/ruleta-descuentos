const SHEET_ID = "PONER AQUI El ID del Google Sheet";
const SHEET_NAME = "Hoja 1"; // o el nombre de tu pestaña

function sanitize(val) {
    var s = String(val || "").trim();
    return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
    var lock = LockService.getScriptLock();
    try {
        lock.waitLock(10000); // espera hasta 10 s para evitar escrituras simultáneas

        var sheet = SpreadsheetApp
            .openById(SHEET_ID)
            .getSheetByName(SHEET_NAME);

        var data = JSON.parse(e.postData.contents);
        var telefono = data.telefono || "";
        // solo dígitos para la comparación (ignora +57, espacios, etc.)
        var telefonoNorm = telefono.replace(/\D/g, "");

        var row = [
            sanitize(data.nombre),
            sanitize(data.apellido),
            telefono,
            sanitize(data.premio),
            sanitize(data.codigo),
            sanitize(data.fecha) || new Date().toISOString()
        ];

        // telefono es la clave primaria — buscar fila existente en columna C
        var lastRow = sheet.getLastRow();
        var existingRow = -1;
        if (lastRow > 1 && telefonoNorm) {
            var telefonos = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
            for (var i = 0; i < telefonos.length; i++) {
                if (String(telefonos[i][0]).replace(/\D/g, "") === telefonoNorm) {
                    existingRow = i + 2; // +2: índice 1-based + saltar encabezado
                    break;
                }
            }
        }

        if (existingRow > 0) {
            return ContentService
                .createTextOutput(JSON.stringify({ status: "duplicate", message: "Este número ya participó" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        sheet.appendRow(row);

        return ContentService
            .createTextOutput(JSON.stringify({ status: "ok" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

// Respuesta de prueba para confirmar que el script está activo
function doGet() {
    return ContentService.createTextOutput("✓ API Bonito Cielo activa");
}