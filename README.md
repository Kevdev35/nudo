# NUDO

App hecha a la medida del **desarrollador** — no para competir en el mercado, sino como núcleo interno para organizar ideas de proyectos, notas, PDFs y avances. Pensada para ser un núcleo bien documentado y modular: que otras personas puedan modificarlo o construir un SaaS a partir de él.

> **Estado actual:** en desarrollo. Arquitectura y base de datos iniciadas; UI y auth pendientes (ver [Estado del proyecto](#estado-del-proyecto)).

---

## Índice

- [Concepto](#concepto)
- [Alcance (MVP)](#alcance-mvp)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Scripts](#scripts)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Path aliases](#path-aliases)
- [Arquitectura](#arquitectura)
- [Modelo de datos](#modelo-de-datos)
- [Tema / diseño (at-mos)](#tema--diseño-at-mos)
- [Estado del proyecto](#estado-del-proyecto)
- [Roadmap](#roadmap)

---

## Concepto

Nudo es un espacio de trabajo donde cada **Proyecto** guarda todo su contexto:

- Tipo de proyecto y presupuesto.
- Ideas en bloques de texto.
- Fotos, esquemas y UML.
- Markdowns para ideas a detalle o prompts de IA.
- Área estilo kanban (Trello/MeisterTask) con notas y listas ordenadas tipo to-do.

La entidad **Cliente** está separada de **Proyecto**: un proyecto propio no tiene cliente asociado; un proyecto de cliente sí (con nombre, contacto y notas).

### Flujo de usuario

```
Login → Dashboard (últimos actualizados / pendientes / terminados)
     → "Nuevo proyecto" → panel (nombre, tipo propio/cliente, descripción)
     → Vista de proyecto (kanban, to-do, archivos, markdown)
```

---

## Alcance (MVP)

- Proyectos con tipo, presupuesto e ideas.
- Archivos (UML/PNG/Figma) y carpetas.
- Markdown con historial de versiones.
- Tablero kanban con listas y tarjetas.
- Entidad Cliente separada de Proyecto.

**Fuera del MVP (futuro):** líneas de tiempo estilo Gantt y capa de IA (resúmenes, búsqueda semántica, auto-tagging).

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev) (runes) |
| Lenguaje | TypeScript 6 |
| Build | Vite 8 |
| Estilos | Tailwind CSS v4 (+ `@tailwindcss/forms`, `@tailwindcss/typography`) |
| Tema | [at-mos](https://www.npmjs.com/package/@kevdev35/at-mos) (genera el bloque `@theme`) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) + `drizzle-kit` |
| Base de datos | SQLite (libsql, `@libsql/client`) |
| Deploy | [adapter-netlify](https://www.npmjs.com/package/@sveltejs/adapter-netlify) |
| Gestor de paquetes | pnpm |

---

## Requisitos

- Node.js (versión acorde a `engines`; `engine-strict=true` está activo en `.npmrc`).
- [pnpm](https://pnpm.io).

---

## Instalación

```bash
pnpm install
```

### Variables de entorno

Copia `.env.example` a `.env` y configura la URL de la base de datos:

```bash
# .env
DATABASE_URL=file:local.db
```

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Levanta el servidor de desarrollo |
| `pnpm build` | Compila para producción |
| `pnpm preview` | Previsualiza el build |
| `pnpm check` | Chequeo de tipos con `svelte-check` |
| `pnpm check:watch` | Chequeo de tipos en modo watch |
| `pnpm db:push` | Sincroniza el esquema con la DB (push) |
| `pnpm db:generate` | Genera migraciones a partir del esquema |
| `pnpm db:migrate` | Aplica las migraciones |
| `pnpm db:studio` | Abre Drizzle Studio (UI para la DB) |

---

## Estructura del proyecto

```
src/
├── lib/
│   ├── core/                    # Lógica de negocio pura (sin SvelteKit ni ORM)
│   │   ├── entities/            # Tipos/interfaces: Project, Client, Note, MarkdownDoc, KanbanCard...
│   │   ├── use-cases/           # Casos de uso: createProject, moveKanbanCard, saveMarkdownVersion...
│   │   └── ports/               # Contratos que la infraestructura debe implementar
│   │       ├── project-repository.ts
│   │       ├── client-repository.ts
│   │       └── auth-provider.ts
│   │
│   ├── infrastructure/          # Implementaciones concretas de los ports
│   │   ├── db/
│   │   │   ├── schema/          # Esquema de Drizzle (tablas)
│   │   │   ├── repositories/    # Implementación real de los repositories
│   │   │   └── client.ts        # Conexión a la DB
│   │   └── auth/
│   │       └── session-auth-provider.ts
│   │
│   ├── ui/                      # Componentes Svelte reutilizables
│   │   ├── components/
│   │   ├── layouts/
│   │   └── stores/
│   │
│   └── config/                  # Variables de entorno, constantes
│
├── routes/                      # Rutas de SvelteKit
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── projects/[id]/
│   │   └── clients/
│   └── (auth)/
│       ├── login/
│       └── register/
│
└── hooks.server.ts              # Middleware de auth, etc.
```

---

## Path aliases

Definidos en `vite.config.ts` mediante `kit.alias` (SvelteKit los inyecta en TypeScript automáticamente).

| Alias | Ruta |
|-------|------|
| `$lib/*` | `src/lib/*` |
| `@core/*` | `src/lib/core/*` |
| `@entities/*` | `src/lib/core/entities/*` |
| `@use-cases/*` | `src/lib/core/use-cases/*` |
| `@ports/*` | `src/lib/core/ports/*` |
| `@infrastructure/*` | `src/lib/infrastructure/*` |
| `@db/*` | `src/lib/infrastructure/db/*` |
| `@auth/*` | `src/lib/infrastructure/auth/*` |
| `@ui/*` | `src/lib/ui/*` |
| `@components/*` | `src/lib/ui/components/*` |
| `@layouts/*` | `src/lib/ui/layouts/*` |
| `@stores/*` | `src/lib/ui/stores/*` |
| `@config/*` | `src/lib/config/*` |

```ts
import Button from '@components/Button.svelte';
import { createClientRepository } from '@infrastructure/db/repositories/client-repository';
```

---

## Arquitectura

Arquitectura **hexagonal (ports & adapters)** sobre SvelteKit:

- **`lib/core/`** — dominio puro. No depende de SvelteKit ni del ORM.
  - `entities`: tipos e interfaces de dominio.
  - `use-cases`: lógica de aplicación.
  - `ports`: interfaces (contratos) que la infraestructura implementa.
- **`lib/infrastructure/`** — adaptadores concretos.
  - `db`: Drizzle + SQLite (esquema, repositorios, conexión).
  - `auth`: proveedor de sesión.
- **`lib/ui/`** — componentes Svelte reutilizables.
- **`routes/`** — rutas de SvelteKit que invocan los use-cases.

**Flujo de dependencias:**

```
routes → use-cases → ports ← infrastructure (db, auth)
```

La regla de oro: el núcleo (`core`) no conoce la infraestructura; solo define contratos (`ports`) que la infraestructura implementa.

---

## Modelo de datos

Entidades definidas:

`User`, `Client`, `Project` (con `client_id` opcional), `Note`, `MarkdownDoc` + `MarkdownVersion` (historial), `File`, `KanbanBoard` → `KanbanList` → `KanbanCard`, `ProjectMember` (preparado para roles).

Reglas globales:

- **Soft-delete** en todas las tablas (`deleted_at`).
- **UUID** como claves primarias.
- `user_id` como propietario desde el día 1.

### Tablas ya implementadas (Drizzle)

| Tabla | Campos principales | Detalles |
|-------|--------------------|----------|
| `user` | `id`, `name`, `email` (único), `password_hash` | soft-delete, timestamps |
| `client` | `id`, `user_id`, `name`, `contact_info`, `notes` | soft-delete, timestamps |
| `session` | `id`, `user_id` (FK → `user`), `expires_at` | `created_at` |

Esquema en `src/lib/infrastructure/db/schema/`, exportado desde `index.ts`.

---

## Tema / diseño (at-mos)

El bloque `@theme` de Tailwind v4 se genera y mantiene con **at-mos**.

```bash
at-mos env --json                                           # reconocer el proyecto
at-mos init --from tokens.json --output <css> --yes --json  # generar el @theme
at-mos list --json                                          # listar variables
at-mos update --add --name --color-x --value "#fff" --json  # agregar variable
```

> Todos los comandos responden JSON con `--json`. Ver `AGENTS.md` para el contrato completo.

---

## Estado del proyecto

**Implementado:**

- Configuración base (SvelteKit + Svelte 5 runes + Tailwind v4 + Drizzle + adapter Netlify).
- Path aliases y `.gitignore` (ignora `.db`, `.sqlite`, `.sqlite3` y sus `-journal`/`-shm`/`-wal`).
- Entidades de dominio: `Client`, `User`.
- Port: `ClientRepository`.
- Esquema Drizzle: `user`, `client`, `session`.
- Repositorio: `ClientRepository` (`create`, `findById`, `listByUser`, `update`, `softDelete`).

**Pendiente:**

- `infrastructure/db/client.ts` (conexión real a la DB).
- `UserRepository` y use-cases.
- Auth (`session-auth-provider` + `hooks.server.ts`).
- UI (components/layouts/stores) y rutas `(app)` / `(auth)`.

---

## Roadmap

1. Completar la capa de datos (conexión + repositorios restantes).
2. Implementar auth (sesión + cookie + Argon2).
3. Casos de uso y API de las rutas `(app)`.
4. UI y flujo de proyecto/kanban/markdown.
5. *Futuro:* Gantt y capa de IA.
