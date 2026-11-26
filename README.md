# Nido · landing

Landing pública de Nido. Proyecto independiente: no modifica el repositorio ni el deploy de la app.

- HTML, CSS y JS estáticos, sin build. Se publica tal cual en GitHub Pages (o Vercel/Netlify).
- Fuentes autohospedadas (`assets/fonts`, Fraunces e Inter, licencia SIL OFL).
- Capturas reales de la app en `assets/app` (WebP, 1440 y 2400 px), con una cursada **ficticia** (Lucía, Diseño Gráfico). Ningún dato es de una persona real.

## Descarga para Windows

El botón «Descargar para Windows» apunta a:

```
https://github.com/PlateStudio-ar/nido-landing/releases/latest/download/Nido-Setup.exe
```

Para que funcione hay que crear un *release* en este repo y subir el instalador con el nombre exacto
`Nido-Setup.exe`. Cada release nuevo reemplaza al anterior sin tocar la landing.
La URL se cambia en un solo lugar: el atributo `data-download` del `<body>` en `index.html`.

La landing detecta la plataforma: en Windows el botón principal descarga; en Mac, iPhone, iPad y Android
el botón principal abre la versión web.

## Regenerar las capturas

`tools/capturas/` levanta la app (repo `nido`) contra un backend falso local con datos de ejemplo:

```bash
python3 tools/capturas/server.py 54321 2026-11-26          # backend falso
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=demo npx vite --port 1420   # en el repo nido
python3 tools/capturas/appshot.py salida.png --theme light --time 09:10   # Chrome con --remote-debugging-port=9333
```

Ningún dato sale de la máquina: no se usa Supabase ni ninguna cuenta real.
