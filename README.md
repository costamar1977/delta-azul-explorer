# Delta del Azul Explorer

PWA offline-first para que los visitantes de Camping Delta del Azul (PN Lago Puelo) identifiquen
flora y fauna del bosque andino-patagónico y la selva valdiviana, con o sin señal.

## Cómo correrla en local

```bash
npm install
npm run dev
```

Abre en `http://localhost:5173`.

## Modo foto con IA (opcional)

El catálogo funciona 100% offline sin ninguna configuración adicional. El modo foto con IA es
opcional y requiere dos API keys gratuitas:

1. **Pl@ntNet** (flora): pedir key en https://my.plantnet.org/ — escribirles contando que es para
   una app sin fines de lucro de un camping dentro de un parque nacional, para calificar al tier
   gratuito.
2. **iNaturalist** (fauna): crear una app OAuth en https://www.inaturalist.org/oauth/applications/new
   y generar un token de usuario. Uso sujeto a los términos de iNaturalist (límite de ~60
   solicitudes/min, atribución obligatoria — ya incluida en la UI).

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

Sin estas keys, la app funciona igual pero el modo foto muestra "modo demo" en vez de sugerir
especies.

## Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para desplegar, con el service worker de Workbox ya configurado
para precachear todo el catálogo.

## Desplegar en Netlify

1. Subir este proyecto a un repositorio de GitHub (o arrastrar la carpeta directamente en
   https://app.netlify.com/drop para una prueba rápida sin repo).
2. En Netlify: **New site from Git** → elegir el repo.
3. Build command: `npm run build` — Publish directory: `dist` (ya configurado en `netlify.toml`,
   Netlify lo detecta solo).
4. Si se configuran las API keys de Pl@ntNet/iNaturalist, agregarlas en **Site settings → Environment
   variables** con los mismos nombres de `.env.example` (`VITE_PLANTNET_API_KEY`,
   `VITE_INATURALIST_TOKEN`) y volver a desplegar.
5. Netlify da un dominio gratuito tipo `nombre-random.netlify.app`; se puede personalizar a un
   subdominio propio en **Domain settings**.

Los visitantes instalan la app tocando "Agregar a pantalla de inicio" desde el navegador del
celular — no hace falta subirla a Google Play ni App Store.

## Qué falta antes de publicar

- **Revisión del dataset**: `src/data/especies.json` es un punto de partida generado como parte
  del desarrollo. Antes de publicar convendría que un guardaparque de APN o una guía de campo
  publicada revise nombres, rasgos distintivos y estados de conservación.
- **Fotos reales**: cada especie tiene un campo `fotoUrl` con placeholder. Reemplazar con fotos
  propias, banco de imágenes con licencia libre, o fotos de iNaturalist con atribución.
- **Mapa real**: `src/components/mapa/MapaEstatico.jsx` espera una imagen en
  `public/mapa-camping.png` — por ahora muestra un fondo gris de relleno.
- **Email de contacto**: el botón "Reportar avistamiento" en la sección Ecosistema apunta a
  `administracion@campingdeltadelazul.com.ar` — cambiar por el mail real en
  `src/components/ecosistema/SeccionEcosistema.jsx`.

## Estructura

Ver el árbol de carpetas en `src/` — cada función vive en su propia carpeta dentro de
`src/components/` (catálogo, ficha, buscador, identificar-foto, avistamientos, mapa, ecosistema,
comunes). El catálogo de especies es JSON estático (`src/data/especies.json`), no hay backend ni
base de datos en la nube: todo corre en el cliente.
