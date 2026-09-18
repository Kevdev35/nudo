<!-- at-mos:start -->
## at-mos — generador de @theme para Tailwind v4

Este proyecto usa **at-mos** para generar y mantener el bloque `@theme` de Tailwind v4.
Si no está instalado: `npx @kevdev35/at-mos` o `pnpm add -g @kevdev35/at-mos`.

### Uso en modo headless (recomendado para agentes)

Todos los comandos responden JSON (`{"ok":true|false,...}`). Añade `--json`.
Para el contrato completo: `at-mos ai --json`.

```bash
at-mos env --json                                          # reconocer el proyecto
at-mos init --from tokens.json --output <css> --yes --json # generar el @theme
at-mos list --json                                         # listar variables
at-mos update --add --name --color-x --value "#fff" --json # agregar variable
at-mos update --edit --name --color-x --value "#fff" --json # editar variable
at-mos update --delete --names --color-x --json            # eliminar variable
```

### Reglas

- `stdout` = solo JSON; `stderr` = mensajes humanos (usa `2>/dev/null` para parsear limpio).
- Errores con categoría para saber si fue culpa del agente o de la herramienta:
  - `caller` → el comando/datos fueron incorrectos. Corrige y reintenta.
  - `environment` → estado del proyecto (sin CSS, package.json inválido). Adaptate.
  - `tool` → bug interno de at-mos. No reintentes; reporta con el stack incluido.
<!-- at-mos:end -->

## Repo: Nudo (SvelteKit + Svelte 5)

Gestor de proyectos estilo Notion (notas, markdown con versiones, kanban, archivos, clientes). Stack: SvelteKit 2 + Svelte 5 (runes forzado), TypeScript 6, Vite 8, Tailwind v4, Drizzle ORM + libSQL (**Turso**), pnpm, adapter-netlify. Documentación detallada en `docs/`.

### Comandos

- `pnpm dev` — dev server en `:5173`
- `pnpm check` — único gate (svelte-check). **No hay lint ni tests en el repo.**
- `pnpm db:push` — sincroniza schema → DB (dev)
- `pnpm db:generate` / `pnpm db:migrate` — migraciones
- `pnpm db:studio` — UI de la DB

### Base de datos (Turso, no sqlite local)

- `drizzle.config.ts` y `connection.ts` **exigen** `DATABASE_URL` **y** `DATABASE_AUTH_TOKEN` (error fatal si falta). `.env.example` solo lista `DATABASE_URL`; copiarlo tal cual rompe `db:*` y la app.
- Dialect real es `turso` (libsql cloud), no `sqlite` como dicen los docs.

### Arquitectura hexagonal

```
routes → use-cases → ports ← infrastructure (db/, auth/, storage/)
```

- `src/lib/core/` (entities + ports + use-cases) es dominio puro: sin imports de SvelteKit/ORM.
- Use-cases = factory que recibe ports y devuelve async fn; siempre verifican ownership (`project.user_id === userId`, cadenas Note/Kanban/Markdown/File → Project → User).
- Feature nuevo: entity (`*-entity.ts`) → port (`*-repository.ts`) → schema Drizzle + export en `schema/index.ts` → repo (`createXRepository(db)`) → use-case → ruta. Ver `docs/CONTRIBUTING.md`.

### Convenciones

- Usar aliases (`@core`, `@entities`, `@use-cases`, `@ports`, `@infrastructure`, `@db`, `@auth`, `@ui`, `@components`, `@layouts`, `@stores`), nunca imports relativos largos. Viven en `vite.config.ts`.
- Soft-delete vía `deletedAt` en todas las tablas (excepto `session` y `markdown_doc_version`, inmutables). Consultas filtran `isNull(tabla.deletedAt)`.
- IDs UUID con `$defaultFn(() => crypto.randomUUID())` y timestamps con `$defaultFn(() => new Date())`.
- Naming: `*-repository.ts` (ports y repos), schema singular (`note.ts`), use-case verbo (`create-note.ts`).

### UI / tema

- `@theme` en `src/routes/layout.css` lo genera at-mos (usa los comandos de arriba; no editarlo a mano).
- Tokens `nudo-*` de `layout.css` dan utilitarios (`bg-nudo-surface`, `text-nudo-text-primary`). Nunca hardcodear colores.
- Dark mode = clase `.dark` en `<html>` vía `@custom-variant dark`.

### Gotchas

- Runes de Svelte 5 está forzado en `vite.config.ts` — sintaxis legada no compila.
- `pnpm check` hoy falla solo por WIP sin commitear en `src/routes/projects/[id]/files/` (hay warnings preexistentes aparte).
- Auth: cookie httponly `session` (token → hash sha256), Argon2; `hooks.server.ts` valida y puebla `locals.user`, rutas `(app)` redirigen a `/login`.
- Upload de archivos (sin commitear) usa Cloudflare R2 (`src/lib/infrastructure/storage/r2-storage.ts` + env vars `R2_*`).

### Docs obsoletos (verificar contra `src/` antes de confiar)

- `README.md` "Estado del proyecto" está desactualizado: auth, UI y rutas ya están implementadas.
- `docs/DATABASE.md` dice dialect `sqlite`; el real es `turso`.
- `docs/ROUTES.md` marca `files` como pendiente; ya hay WIP (`+page.server.ts` + R2).
