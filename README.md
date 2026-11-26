# Nido · landing

Landing pública de Nido. Proyecto independiente: no modifica el repositorio ni el deploy de la app.

- HTML, CSS y JS estáticos, sin build. Se publica tal cual en GitHub Pages (o Vercel/Netlify).
- Fuentes autohospedadas (`assets/fonts`, Fraunces e Inter, licencia SIL OFL).
- Capturas reales de la app en `assets/app` (WebP, 1600, 2560 y 3840 px), con una cursada **ficticia** (Martina en español, Emma en inglés y Beatriz en portugués; Diseño Gráfico). Ningún dato es de una persona real.

## Descarga para Windows

El botón «Descargar para Windows» apunta a:

```
https://github.com/PlateStudio-ar/nido-landing/releases/latest/download/Nido-Setup.exe
```

Para que funcione hay que crear un *release* en este repo y subir el instalador con el nombre exacto
`Nido-Setup.exe`. Cada release nuevo reemplaza al anterior sin tocar la landing.
La URL se cambia en un solo lugar: el atributo `data-download` del `<body>` en `index.html`.

La landing detecta la plataforma: en Windows el botón principal descarga; en Mac abre la versión web.
En el celu todavía no se muestra la versión móvil: el botón lleva a la sección de descarga.

## Idiomas

Español (en el HTML), inglés y portugués (en `i18n.js`). Cada texto traducible lleva `data-i18n="clave"`
(o `data-i18n-alt`, `data-i18n-aria`, `data-i18n-content`). El idioma se elige con `?lang=es|en|pt`,
después con lo que la persona eligió antes y si no, con el idioma del navegador (inglés si no es es/pt).
Al agregar un texto nuevo, sumá su clave en `en` y en `pt`.

## Regenerar las capturas

`tools/capturas/` levanta la app (repo `nido`) contra un backend falso local con datos de ejemplo:

```bash
python3 tools/capturas/server.py 54321 2026-11-26          # backend falso
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=demo npx vite --port 1420   # en el repo nido
python3 tools/capturas/appshot.py salida.png --theme light --time 09:10   # Chrome con --remote-debugging-port=9333
```

Para inglés y portugués: `python3 tools/capturas/server.py 54321 2026-11-26 en` (datos de ejemplo traducidos)
y `python3 tools/capturas/shots_i18n.py en assets-salida/`. La interfaz se traduce solo en el navegador de captura
(`tr.js`): la app no cambia. Las capturas de cada idioma van en `assets/app/en/` y `assets/app/pt/`.
Cuando la app tenga su propia traducción, conviene volver a sacarlas sin `tr.js`.

Las capturas se sacan a 3x (3840 px de ancho) y se publican en WebP a 1600, 2560 y 3840 px.

Ningún dato sale de la máquina: no se usa Supabase ni ninguna cuenta real.
