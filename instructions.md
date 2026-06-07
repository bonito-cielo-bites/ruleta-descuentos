# Guía de despliegue y personalización
## Ruleta Digital — Bonito Cielo

> Esta guía permite replicar, publicar y personalizar la ruleta desde **cualquier cuenta** sin depender del artefacto original de Claude.

---

## Tabla de contenido

1. [Prerrequisitos](#1-prerrequisitos)
2. [Configuración del proyecto](#2-configuración-del-proyecto)
3. [Despliegue en Vercel](#3-despliegue-en-vercel)
4. [Publicación con Canva](#4-publicación-con-canva)
5. [Integración con Google Sheets](#5-integración-con-google-sheets)
6. [Paleta de colores oficial de Bonito Cielo](#6-paleta-de-colores-oficial-de-bonito-cielo)

---

## 1. Prerrequisitos (Agent)

Verifica que todo esté listo abriendo una terminal:

```bash
node -v    # debe mostrar v18 o superior
pnpm -v    # debe mostrar v8 o superior
git -v     # debe mostrar cualquier versión
```

En caso de no estar instalados, instala las siguientes herramientas:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18 o superior | https://nodejs.org |
| pnpm | 8 o superior | https://pnpm.io/installation |
| Git | cualquier versión | https://git-scm.com |
| Cuenta Vercel (gratuita) | — | https://vercel.com |
| Cuenta Google (para Sheets) | — | https://google.com |

**Instala pnpm** una sola vez después de tener Node.js:

```bash
npm install -g pnpm
```



---

## 2. Configuración del proyecto (Agent)

### 2.1 Crear la aplicación React

Ejecuta los siguientes comandos en tu terminal:

```bash
pnpm create vite@latest ruleta-descuentos -- --template react
cd ruleta-descuentos
pnpm install
```

### 2.2 Reemplazar el componente principal (Agent)

1. Abre el proyecto en tu editor de código (VS Code recomendado).
2. Elimina el contenido de `src/App.jsx`.
3. Pega **todo** el código del artefacto de Claude (el archivo `.jsx` descargado) dentro de `src/App.jsx`.
4. Elimina el contenido de `src/App.css` y de `src/index.css` (el artefacto ya incluye sus propios estilos).

### 2.3 Verificar que funciona localmente (Agent)

```bash
pnpm dev
```

Abre el navegador en `http://localhost:5173` — deberías ver la ruleta funcionando.

> **Nota sobre el almacenamiento local:** el artefacto usa `window.storage`, que es una API exclusiva de Claude.ai. Al ejecutarse fuera de Claude, esta API no existe. En la sección 5 se explica cómo reemplazarla por Google Sheets. Por ahora, para una prueba local rápida, reemplaza las líneas de `window.storage` con `localStorage` (ver paso 5.4).

---

## 3. Despliegue en Vercel 

### 3.1 Subir el proyecto a GitHub (Agent)

```bash
git init
git add .
git commit -m "ruleta bonito cielo - versión inicial"
```

### 3.2 Conectar Vercel con GitHub (Human)

1. Ve a https://vercel.com y haz clic en **Add New → Project**.
2. Selecciona el repositorio `ruleta-descuentos`.
3. Vercel detectará automáticamente que es un proyecto Vite. No cambies nada.
4. Haz clic en **Deploy**.

En 1–2 minutos tendrás una URL pública, por ejemplo:
```
https://ruleta-descuentos.vercel.app
```

### 3.4 Dominio personalizado (opcional) (Human)

En Vercel → tu proyecto → **Settings → Domains**, puedes agregar un dominio propio como `ruleta.bonitocielo.co`. Solo necesitas apuntar el DNS de tu dominio al servidor de Vercel siguiendo sus instrucciones.

---

## 4. Publicación con Canva (Human)

Canva no hospeda aplicaciones de código, pero hay **dos formas complementarias** de usarlo en tu stand:

### Opción A — QR Code para que los clientes escaneen (recomendada para feria)

Esta es la configuración ideal para una feria: el cliente escanea el QR con su propio celular y participa desde ahí.

1. Despliega la app en Vercel (sección 3) y copia la URL.
2. Ve a https://qr.io o https://www.qr-code-generator.com y genera un QR con tu URL de Vercel.
3. Descarga el QR en PNG o SVG.
4. En Canva, diseña el material de tu stand (afiche, pendón, tarjeta) e inserta el QR como imagen.
5. Imprime el diseño o publícalo como pantalla en el stand.

**Diseño sugerido en Canva:**

```
┌─────────────────────────┐
│   ✦ BONITO CIELO ✦      │
│                         │
│  Gira la ruleta y       │
│  gana un descuento      │
│  en tu próxima compra   │
│                         │
│     [ QR CODE ]         │
│                         │
│  Escanea y participa    │
└─────────────────────────┘
```
---

## 5. Integración con Google Sheets

Esta integración reemplaza el almacenamiento local de Claude (`window.storage`) y guarda cada cliente directamente en una hoja de cálculo de Google en tiempo real.

### 5.1 Crear la hoja de cálculo (Human)

1. Ve a https://sheets.google.com y crea una hoja nueva.
2. Llámala **Clientes Ruleta Bonito Cielo**.
3. En la primera fila agrega estos encabezados exactamente:

| A | B | C | D | E |
|---|---|---|---|---|
| Nombre | Telefono | Premio | Codigo | Fecha |

4. Copia el **ID de la hoja** desde la URL. Es la cadena larga entre `/d/` y `/edit`:
```
https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
```

### 5.2 Crear el script receptor (Google Apps Script)

1. En la hoja de cálculo, ve a **Extensiones → Apps Script**.
2. Borra el código que aparece y pega el siguiente:

```javascript
const SHEET_ID = "PEGA_AQUÍ_EL_ID_DE_TU_HOJA";
const SHEET_NAME = "Hoja 1"; // o el nombre de tu pestaña

function doPost(e) {
  try {
    var sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName(SHEET_NAME);

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.name  || "",
      data.phone || "",
      data.prize || "",
      data.code  || "",
      data.date  || new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Respuesta de prueba para confirmar que el script está activo
function doGet() {
  return ContentService.createTextOutput("✓ API Bonito Cielo activa");
}
```

3. Reemplaza `PEGA_AQUÍ_EL_ID_DE_TU_HOJA` con el ID copiado en el paso anterior.
4. Guarda el script con `Ctrl + S` y ponle un nombre, por ejemplo `API Ruleta`.

### 5.3 Publicar el script como Web App

1. Haz clic en **Implementar → Nueva implementación**.
2. En "Tipo", selecciona **Aplicación web**.
3. Configura así:

| Campo | Valor |
|---|---|
| Descripción | API Ruleta v1 |
| Ejecutar como | **Yo** |
| Quién tiene acceso | **Cualquier persona** |

4. Haz clic en **Implementar** y autoriza los permisos cuando Google lo pida.
5. Copia la **URL de la aplicación web** que aparece. Tiene este formato:
```
https://script.google.com/macros/s/XXXXXXXXXXXXXXXXX/exec
```

> Guarda esta URL, la necesitarás en el siguiente paso.

### 5.4 Modificar el componente React

Abre `src/App.jsx` y realiza **dos cambios**:

**Cambio 1 — Agrega la URL del script al inicio del archivo** (después de los imports):

```javascript
// ── Google Sheets endpoint ──────────────────────────────────
const SHEETS_URL = "PEGA_AQUÍ_TU_URL_DE_APPS_SCRIPT";
```

**Cambio 2 — Reemplaza la función `finishSpin`** para que envíe los datos a Sheets y use `localStorage` como respaldo:

```javascript
async function finishSpin() {
  if (!spinning) return;
  setSpinning(false);

  const prize = PRIZES[finalIdx.current];
  const isWin = prize.type === "pct";

  const lead = {
    name:  form.name.trim(),
    phone: "+57" + cleanPhone,
    prize: isWin ? prize.value + "% dcto" : "Casi ganas",
    code:  isWin ? finalCode.current : "—",
    date:  new Date().toLocaleString("es-CO"),
  };

  // Guardar en Google Sheets
  try {
    await fetch(SHEETS_URL, {
      method:  "POST",
      mode:    "no-cors",           // necesario para Apps Script
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(lead),
    });
  } catch (e) {
    console.error("Error enviando a Sheets:", e);
  }

  // Respaldo en localStorage (para el panel del stand)
  const existing = JSON.parse(localStorage.getItem("bc_leads") || "[]");
  const next = [lead, ...existing];
  localStorage.setItem("bc_leads", JSON.stringify(next));
  setLeads(next);

  setResult({ prize, code: finalCode.current });

  if (isWin) {
    setShowConf(true);
    setTimeout(() => setShowConf(false), 2600);
  }
  setTimeout(() => setScreen("result"), 650);
}
```

**Cambio 3 — Adaptar las funciones de carga y guardado** para que usen `localStorage` en vez de `window.storage`:

Reemplaza el `useEffect` de carga:

```javascript
useEffect(() => {
  const saved = localStorage.getItem("bc_leads");
  if (saved) setLeads(JSON.parse(saved));
  setLoading(false);
}, []);
```

Reemplaza la función `clearAll`:

```javascript
async function clearAll() {
  setLeads([]);
  localStorage.removeItem("bc_leads");
  setConfirmClear(false);
}
```

### 5.5 Verificar la integración

1. Corre la app localmente con `pnpm dev`.
2. Registra un cliente de prueba y gira la ruleta.
3. Ve a tu hoja de Google y verifica que aparezca la fila con los datos.
4. Si no aparece, revisa que el script esté desplegado con acceso **"Cualquier persona"** (paso 5.3).

---

## 6. Paleta de colores oficial de Bonito Cielo

Toda la paleta de la app vive en **una sola sección del archivo `src/App.jsx`**: el bloque `const CSS = \`...\`` cerca del inicio del archivo.

### 6.1 Estructura de colores actual (paleta de ejemplo)

```css
/* Fondo principal */
background: radial-gradient(..., #4a3f7d, #2b2658, #1a1640, #120f30)

/* Resplandor del horizonte */
rgba(244,169,136, .42)   /* durazno */

/* Segmentos de la ruleta */
#E3A964   /* ámbar dorado     → segmentos de 5% */
#2C2A5E   /* índigo profundo  → segmentos de 10% */
#6B5B95   /* violeta suave    → segmentos "Casi ganas" */

/* Textos sobre ámbar */
#1B1840   /* índigo oscuro */

/* Textos sobre índigo */
#F4C879   /* dorado claro */

/* Textos sobre violeta */
#FDF6EC   /* crema */

/* Botón principal (gradiente) */
#F4C879 → #E3A964 → #d98f55

/* Texto del botón */
#1B1840
```

### 6.2 Cómo aplicar la paleta de Bonito Cielo

**Paso 1 — Identifica tus colores oficiales.**

Consíguelos de cualquiera de estas fuentes:
- Manual de marca de Bonito Cielo (si existe).
- El diseñador o agencia que creó el logo.
- Abriendo el logo en Photoshop, Illustrator o Figma y usando el cuentagotas.
- Herramienta online gratuita: https://imagecolorpicker.com (sube el logo y extrae los HEX).

Los colores se expresan en formato hexadecimal, por ejemplo: `#FF6B35`.

**Paso 2 — Mapea tus colores a los roles de la app.**

Completa esta tabla con tus colores reales:

| Rol en la app | Color actual | Tu color Bonito Cielo |
|---|---|---|
| Fondo principal (oscuro) | `#1a1640` | `#__________` |
| Fondo secundario | `#2b2658` | `#__________` |
| Acento primario (dorado) | `#E3A964` | `#__________` |
| Acento secundario | `#2C2A5E` | `#__________` |
| Acento terciario | `#6B5B95` | `#__________` |
| Texto principal | `#FDF6EC` | `#__________` |
| Texto sobre acento claro | `#1B1840` | `#__________` |
| Botón gradiente inicio | `#F4C879` | `#__________` |
| Botón gradiente fin | `#d98f55` | `#__________` |

**Paso 3 — Reemplaza los colores en el código.**

Abre `src/App.jsx` y busca cada hex con `Ctrl + H` (buscar y reemplazar) en VS Code:

```
Buscar:    #E3A964
Reemplazar: #TU_COLOR_AQUÍ
```

Repite para cada color de la tabla. El reemplazo global garantiza consistencia en toda la app.

**Paso 4 — Ajusta el gradiente del fondo.**

Busca esta línea en el CSS:

```css
background:
  radial-gradient(120% 80% at 50% -10%, #4a3f7d 0%, #2b2658 38%, #1a1640 70%, #120f30 100%);
```

Reemplaza los cuatro colores del gradiente con versiones de tu color principal en distintos niveles de oscuridad. Puedes generar variaciones en https://www.colorhexa.com (escribe tu color y ve a "Shades").

**Paso 5 — Actualiza los colores de los segmentos de la ruleta.**

Los colores de cada segmento están en el arreglo `PRIZES` al inicio del archivo:

```javascript
const PRIZES = [
  { ..., color: "#E3A964", text: "#1B1840" },  // ← color del segmento / color del texto
  { ..., color: "#2C2A5E", text: "#F4C879" },
  { ..., color: "#6B5B95", text: "#FDF6EC" },
  ...
];
```

Reemplaza `color` con el color del segmento y `text` con el color del texto encima. Asegúrate de que el texto sea siempre legible sobre el fondo del segmento (contraste alto).

**Paso 6 — Verifica los cambios.**

```bash
pnpm dev
```

Revisa visualmente que todos los elementos se vean correctos. Para comprobar contraste de colores usa: https://webaim.org/resources/contrastchecker/

---

## Resumen del flujo completo

```
1. pnpm create vite → pegar código → pnpm dev (prueba local)
        ↓
2. git push → Vercel detecta y despliega automáticamente
        ↓
3. URL pública de Vercel → QR en Canva para el stand
        ↓
4. Apps Script en Google Sheets ← recibe datos en tiempo real
        ↓
5. Aplicar paleta de Bonito Cielo con buscar y reemplazar
```

---

## Preguntas frecuentes

**¿La app funciona sin internet en el stand?**
No. Necesita conexión para cargar las fuentes de Google y para enviar datos a Sheets. Si el Unicentro tiene wifi limitado, asegúrate de tener datos móviles activos en la tablet.

**¿Qué pasa si falla la conexión durante la feria?**
Los datos se guardan en `localStorage` del dispositivo como respaldo. Al recuperar la conexión, puedes exportar el CSV desde el panel del stand (botón ⚙ → PIN → Exportar CSV).

**¿Cuántos clientes puede manejar la hoja de Google?**
Google Sheets soporta hasta 10 millones de celdas por hoja, más que suficiente para cualquier feria.

**¿Puedo cambiar el PIN del panel de administración?**
Sí. Busca esta línea en `src/App.jsx` y cambia el valor:
```javascript
const ADMIN_PIN = "2468"; // ← cambia por tu PIN privado
```

**¿Cómo actualizo la fecha límite del cupón si hay otra feria?**
Busca con `Ctrl + F` el texto `30 de junio` en `src/App.jsx` y reemplázalo con la nueva fecha. Aparece en dos lugares: el banner de entrada y el recuadro del cupón.
