# Bingazo

Tablero de bingo 75 para proyectar, hecho con [Astro](https://astro.build). El operador anota los números que van saliendo y la audiencia ve el tablero 1–75, el último número, los anteriores y la figura a formar (H, T, X, diagonales, líneas, marco, etc.).

Sitio 100% estático, desplegado en Cloudflare Pages en `bingazo.cantariadigital.cl`.

## Comandos

| Comando           | Acción                                   |
| :---------------- | :--------------------------------------- |
| `npm install`     | Instala dependencias                     |
| `npm run dev`     | Servidor local en `localhost:4321`       |
| `npm run build`   | Genera el sitio en `./dist/`             |
| `npm run check`   | Verifica tipos (astro check)             |
| `npm test`        | Tests de la lógica (`src/lib`)           |

## Estructura

- `src/lib/patterns.ts`: figuras ganadoras (se dibujan con `#` y `.`; agregar una es agregar un bloque).
- `src/lib/bingo.ts`: reglas puras (rangos por columna y lectura de los números cantados).
- `src/scripts/game.ts`: estado, DOM y persistencia en `localStorage`.
- `src/pages/index.astro`: la landing.

## Despliegue (Cloudflare Pages)

Conectar el repositorio en Cloudflare Pages con:

- Build command: `npm run build`
- Build output directory: `dist`
- Node: 22 (variable `NODE_VERSION=22`)

Luego en Custom domains agregar `bingazo.cantariadigital.cl`.
