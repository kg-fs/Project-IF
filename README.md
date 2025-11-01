# NovaForum — Resumen
 
 - **Misión**: Facilitar que las personas compartan conocimiento y opiniones a través de artículos y reseñas en una comunidad abierta.
 - **Visión**: Convertirse en el foro y hub de contenidos de referencia donde la calidad y la colaboración impulsan el aprendizaje.
 - **Propuesta de valor (Hero)**: "Comparte conocimiento, descubre reseñas y participa en una comunidad que te ayuda a decidir mejor".
 - **Funcionalidades clave**:
   - Publicación y lectura de artículos.
   - Reseñas y valoraciones de contenido.
   - Gestión de usuarios y autenticación.

# Project-IF (NovaForum)
 
 Monorepo del proyecto NovaForum con dos aplicaciones:
 
 - **Front/**: interfaz de usuario construida con Astro.
 - **Back/**: API REST construida con Express y MySQL.
 
 ## Estructura
 - **Front/**: páginas, componentes, layouts y assets del frontend.
 - **Back/**: servidor Express, rutas, controladores y conexión a base de datos.
 - **API-Testing-Postman.md**: guía/colecciones para pruebas de API (si aplica).
 
 ## Requisitos generales
 - Node.js 18+
 - npm o pnpm
 - MySQL 8.x (o compatible)
 
 ## Frontend (Front/)
 - Framework: Astro
 - Puerto de desarrollo: `http://localhost:4321`
 
 **Scripts (desde `Front/`):**
 - `npm install`: instala dependencias
 - `npm run dev`: inicia servidor de desarrollo
 - `npm run build`: build de producción en `dist/`
 - `npm run preview`: previsualiza la build
 
 Más detalles en `Front/README.md`.
 
 ## Backend (Back/)
 - Runtime: Node.js + Express
 - DB: MySQL (mysql2/promise)
 - CORS: permite `http://localhost:4321`
 - Puerto: `3000` (por defecto)
 
 **Scripts (desde `Back/`):**
 - `npm install`: instala dependencias
 - `npm run dev`: desarrollo con `nodemon app.js`
 - `npm start`: producción con `node app.js`
 
 **Variables de entorno (`Back/.env`):**
 - `DB_HOST`
 - `DB_USER`
 - `DB_PASSWORD`
 - `DB_PORT` (opcional, por defecto 3306)
 - `DB_NAME`
 
 ## Desarrollo local
 1. Configura MySQL y crea la base de datos indicada en `DB_NAME`.
 2. En `Back/`, crea `.env` con las variables requeridas.
 3. En dos terminales separadas:
    - Front: `cd Front && npm install && npm run dev`
    - Back: `cd Back && npm install && npm run dev`
 4. Abre `http://localhost:4321` para el frontend. La API corre en `http://localhost:3000`.
 
 ## Build y despliegue
 - Frontend: `npm run build` genera `Front/dist/` listo para hosting estático o SSR con adaptadores de Astro.
 - Backend: `npm start` levanta el servidor Express; asegúrate de configurar variables de entorno en el entorno de despliegue.
 
 ## Recursos
 - Astro: https://docs.astro.build
 - Express: https://expressjs.com/
