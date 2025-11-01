# NovaForum Frontend
 
 Interfaz de usuario de NovaForum, construida con Astro. Este paquete contiene las páginas públicas y la capa de presentación que consumirá las APIs del backend de NovaForum.
 
 ## ✨ Objetivos
 - **Rendimiento**: sitios estáticos/SSR rápidos con Astro.
 - **Simplicidad**: estructura clara y fácil de mantener.
 - **Escalabilidad**: componentes reutilizables y separaciones por dominios.
 
 ## 🔧 Requisitos
 - Node.js 18+ (recomendado LTS)
 - npm o pnpm
 
 ## 📁 Estructura del proyecto
 
 ```text
 Front/
 ├── public/
 │   └── favicon.svg
 ├── src/
 │   ├── assets/
 │   │   └── astro.svg
 │   ├── components/
 │   │   └── Welcome.astro
 │   ├── layouts/
 │   │   └── Layout.astro
 │   └── pages/
 │       └── index.astro
 └── package.json
 ```
 
 - **public/**: archivos estáticos servidos tal cual.
 - **src/pages/**: rutas del sitio; cada archivo mapea a una ruta.
 - **src/components/**: componentes UI reutilizables.
 - **src/layouts/**: layouts compartidos para páginas.
 - **src/assets/**: imágenes, íconos y recursos estáticos usados por el código.
 
 ## 🧞 Scripts
 Ejecuta los comandos desde `Front/` en una terminal.
 
 | Comando                   | Descripción                                        |
 | :------------------------ | :------------------------------------------------- |
 | `npm install`             | Instala dependencias                               |
 | `npm run dev`             | Inicia el servidor local en `http://localhost:4321`|
 | `npm run build`           | Genera la build de producción en `./dist/`         |
 | `npm run preview`         | Previsualiza la build localmente                    |
 | `npm run astro ...`       | Ejecuta comandos del CLI de Astro                   |
 | `npm run astro -- --help` | Ayuda del CLI de Astro                              |
 
 ## 🚀 Desarrollo local
 1. Instala dependencias: `npm install`.
 2. Levanta el entorno: `npm run dev`.
 3. Abre el navegador en `http://localhost:4321`.
 
 ## 🧩 Convenciones
 - Componentes y páginas con nombres descriptivos en PascalCase.
 - Mantén los estilos y lógica de presentación dentro de `src/`.
 - Evita lógica de negocio en el frontend; consume servicios del backend.
 
 ## 📦 Build y despliegue
 - `npm run build` genera la salida en `dist/` lista para servir en cualquier hosting estático o adaptadores SSR de Astro.
 - Configura el proveedor de despliegue según tu infraestructura (Netlify, Vercel, etc.).
 
 ## 🔗 Recursos
 - Documentación de Astro: https://docs.astro.build
 
 ---

