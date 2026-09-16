# Setup

Guía de instalación y configuración del entorno de desarrollo.

## Requisitos

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (requerido por `.npmrc`)
- **Git**

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/nudo.git
cd nudo

# 2. Instalar dependencias
pnpm install
```

## Configuración del Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env
```

El archivo `.env` tiene una variable:

```env
DATABASE_URL=file:local.db
```

Para SQLite local, esto es todo. La DB se crea automáticamente en `local.db` en la raíz del proyecto.

### Cambiar ubicación de la DB

```env
# Relativo a la raíz del proyecto
DATABASE_URL=file:./data/nudo.db

# Ruta absoluta
DATABASE_URL=file:/home/usuario/nudo.db
```

## Base de Datos

### Crear/actualizar tablas

```bash
# Empujar schema directamente a la DB (desarrollo)
pnpm db:push
```

Este comando lee el schema de Drizzle y crea/actualiza las tablas en `local.db`.

### Generar migraciones

```bash
# Generar archivos de migración en drizzle/
pnpm db:generate
```

### Ejecutar migraciones

```bash
# Aplicar migraciones pendientes
pnpm db:migrate
```

### Drizzle Studio

```bash
# Abrir UI web para inspeccionar la DB
pnpm db:studio
```

## Scripts

| Script | Descripción |
|--------|------------|
| `pnpm dev` | Servidor de desarrollo en `localhost:5173` |
| `pnpm build` | Build de producción |
| `pnpm preview` | Vista previa del build |
| `pnpm check` | Type checking (svelte-check) |
| `pnpm check:watch` | Type checking en watch mode |
| `pnpm db:push` | Empujar schema a la DB |
| `pnpm db:generate` | Generar migraciones |
| `pnpm db:migrate` | Ejecutar migraciones |
| `pnpm db:studio` | Abrir Drizzle Studio |

## Estructura de la DB

La base de datos tiene 12 tablas:

| Tabla | Descripción |
|-------|------------|
| `user` | Usuarios registrados |
| `session` | Sesiones activas |
| `client` | Clientes |
| `project` | Proyectos |
| `note` | Notas por proyecto |
| `markdowndoc` | Documentos Markdown |
| `markdowndocversion` | Versiones de documentos |
| `file` | Archivos del proyecto |
| `kanbanboard` | Tableros Kanban |
| `kanbanlist` | Columnas del tablero |
| `kanbancard` | Tarjetas del tablero |

Ver [DATABASE.md](./DATABASE.md) para detalles completos del schema.

## Aliases de Importación

Estos atajos están configurados en `vite.config.ts`:

```ts
'@core':           './src/lib/core'
'@entities':       './src/lib/core/entities'
'@use-cases':      './src/lib/core/use-cases'
'@ports':          './src/lib/core/ports'
'@infrastructure': './src/lib/infrastructure'
'@db':             './src/lib/infrastructure/db'
'@auth':           './src/lib/infrastructure/auth'
'@ui':             './src/lib/ui'
'@components':     './src/lib/ui/components'
'@layouts':        './src/lib/ui/layouts'
'@stores':         './src/lib/ui/stores'
```

Uso en código:

```ts
// En vez de:
import { createNoteUseCase } from '../../../lib/core/use-cases/create-note';

// Se usa:
import { createNoteUseCase } from '@use-cases/create-note';
```

## Deployment

### Netlify

El proyecto usa `@sveltejs/adapter-netlify`. Configurar:

```bash
# Build de producción
pnpm build

# El output está en .netlify/
```

Variables de entorno en Netlify:
- `DATABASE_URL` = URL de la DB (libSQL/Turso para producción)

### Cambiar Adapter

Para otros hosting, cambiar el adapter en `vite.config.ts`:

```ts
// Vercel
import adapter from '@sveltejs/adapter-vercel';

// Node
import adapter from '@sveltejs/adapter-node';

// Static
import adapter from '@sveltejs/adapter-static';
```

## Solución de Problemas

### Error: `DATABASE_URL is not set`

Asegúrate de que `.env` existe y tiene `DATABASE_URL=file:local.db`.

### Error: `Cannot find module '@use-cases/...'`

Verifica que los aliases están en `vite.config.ts` y ejecuta `pnpm prepare`.

### Error en `pnpm check`

Ejecutar `pnpm prepare` antes para sincronizar SvelteKit.

### La DB está vacía

```bash
pnpm db:push
```
