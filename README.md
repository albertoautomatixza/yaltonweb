# Yalton Replica (base para GitHub + Bolt)

Este repositorio contiene una réplica inicial estática de la home de Yalton para seguir iterando diseño.

## Estructura

- `index.html`: estructura principal de la landing.
- `styles.css`: estilos base responsivos.
- `package.json`: scripts para correr en local y en entornos tipo Bolt.
- `vite.config.js`: configuración mínima para servir como proyecto web estático.

## Requisitos

- Node.js 18+

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

## Subir a GitHub

Si este repo aún no está vinculado a remoto:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

## Pasarlo a Bolt

1. Sube este repo a GitHub.
2. En Bolt, elige **Import from GitHub**.
3. Selecciona el repo.
4. Bolt detectará `package.json`.
5. Ejecuta `npm install` y `npm run dev` dentro de Bolt para continuar el rediseño.

## Siguientes pasos recomendados

- Reemplazar imágenes temporales por assets reales de marca.
- Replicar el header y hero del sitio original 1:1.
- Separar secciones en componentes si migras a React/Vue.
