# Database

Schema de Drizzle ORM con SQLite (libSQL).

## Configuración

**Archivo:** `drizzle.config.ts`

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/infrastructure/db/schema/index.ts',
    dialect: 'sqlite',
    dbCredentials: { url: process.env.DATABASE_URL },
    verbose: true,
    strict: true
});
```

**Conexión:** `src/lib/infrastructure/db/connection.ts`

```ts
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL } from '$env/static/private';

export const db = drizzle({
    connection: { url: DATABASE_URL }
});
```

**URL por defecto:** `file:local.db` (SQLite local)

---

## Tablas

### `user`

```sql
CREATE TABLE user (
    id            TEXT PRIMARY KEY,          -- UUID
    name          TEXT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    INTEGER NOT NULL,          -- Timestamp
    updated_at    INTEGER NOT NULL,          -- Timestamp
    deleted_at    INTEGER                   -- Soft-delete
);
```

### `session`

```sql
CREATE TABLE session (
    id         TEXT PRIMARY KEY,             -- SHA-256 del token
    user_id    TEXT NOT NULL REFERENCES user(id),
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
```

> No tiene `deleted_at`. Se borra físicamente.

### `client`

```sql
CREATE TABLE client (
    id           TEXT PRIMARY KEY,           -- UUID
    user_id      TEXT NOT NULL,
    name         TEXT NOT NULL,
    contact_info TEXT,
    notes        TEXT,
    created_at   INTEGER NOT NULL,
    updated_at   INTEGER NOT NULL,
    deleted_at   INTEGER
);
```

### `project`

```sql
CREATE TABLE project (
    id          TEXT PRIMARY KEY,            -- UUID
    user_id     TEXT NOT NULL REFERENCES user(id),
    client_id   TEXT REFERENCES client(id),
    name        TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'pendiente'
                CHECK(status IN ('activo', 'pendiente', 'terminado')),
    budget      REAL,
    created_at  INTEGER NOT NULL,
    updated_at  INTEGER NOT NULL,
    deleted_at  INTEGER
);
```

### `note`

```sql
CREATE TABLE note (
    id         TEXT PRIMARY KEY,             -- UUID
    project_id TEXT NOT NULL REFERENCES project(id),
    "order"    INTEGER NOT NULL,
    content    TEXT NOT NULL,
    color      TEXT,
    completed  INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    deleted_at INTEGER
);
```

### `markdowndoc`

```sql
CREATE TABLE markdowndoc (
    id              TEXT PRIMARY KEY,        -- UUID
    project_id      TEXT NOT NULL REFERENCES project(id),
    title           TEXT DEFAULT 'Sin titulo',
    current_content TEXT DEFAULT '',
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL,
    deleted_at      INTEGER
);
```

### `markdowndocversion`

```sql
CREATE TABLE markdowndocversion (
    id               TEXT PRIMARY KEY,       -- UUID
    markdown_doc_id  TEXT NOT NULL REFERENCES markdowndoc(id),
    content          TEXT NOT NULL,
    version_number   INTEGER NOT NULL,
    created_at       INTEGER NOT NULL
);
```

> No tiene `updated_at` ni `deleted_at`. Las versiones son inmutables.

### `file`

```sql
CREATE TABLE file (
    id          TEXT PRIMARY KEY,            -- UUID
    project_id  TEXT NOT NULL REFERENCES project(id),
    type        TEXT NOT NULL
                CHECK(type IN ('image', 'uml', 'figma_link', 'other')),
    url_or_path TEXT NOT NULL,
    name        TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    deleted_at  INTEGER
);
```

> No tiene `updated_at`.

### `kanbanboard`

```sql
CREATE TABLE kanbanboard (
    id         TEXT PRIMARY KEY,             -- UUID
    project_id TEXT NOT NULL REFERENCES project(id),
    name       TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    deleted_at INTEGER
);
```

### `kanbanlist`

```sql
CREATE TABLE kanbanlist (
    id              TEXT PRIMARY KEY,        -- UUID
    kanban_board_id TEXT NOT NULL REFERENCES kanbanboard(id),
    name            TEXT NOT NULL,
    "order"         INTEGER NOT NULL,
    created_at      INTEGER NOT NULL,
    deleted_at      INTEGER
);
```

### `kanbancard`

```sql
CREATE TABLE kanbancard (
    id             TEXT PRIMARY KEY,         -- UUID
    kanban_list_id TEXT NOT NULL REFERENCES kanbanlist(id),
    title          TEXT DEFAULT 'Sin titulo',
    description    TEXT,
    completed      INTEGER DEFAULT 0,
    "order"        INTEGER NOT NULL,
    created_at     INTEGER NOT NULL,
    updated_at     INTEGER NOT NULL,
    deleted_at     INTEGER
);
```

---

## Relaciones (Foreign Keys)

```
user.id          ← session.user_id
user.id          ← project.user_id
client.id        ← project.client_id
project.id       ← note.project_id
project.id       ← markdowndoc.project_id
project.id       ← file.project_id
project.id       ← kanbanboard.project_id
markdowndoc.id   ← markdowndocversion.markdown_doc_id
kanbanboard.id   ← kanbanlist.kanban_board_id
kanbanlist.id    ← kanbancard.kanban_list_id
```

---

## Índices

### Índice compuesto en note

```sql
CREATE UNIQUE INDEX IF NOT EXISTS note_project_order_unique
    ON note (project_id, "order");
```

Garantiza que no haya dos notas con el mismo orden dentro de un proyecto.

---

## Drizzle ORM — Patrones de Uso

### Conexión

```ts
import { db } from '@infrastructure/db/connection';
```

### Insertar

```ts
const [newNote] = await db.insert(note).values({
    project_id: projectId,
    content: 'Mi nota',
    order: 0,
    color: 'amarillo',
}).returning();
```

### Seleccionar

```ts
// Uno
const [result] = await db.select().from(note).where(eq(note.id, id));
return result ?? null;

// Muchos
const results = await db.select().from(note)
    .where(and(
        eq(note.project_id, projectId),
        isNull(note.deletedAt)
    ));
```

### Actualizar

```ts
const [updated] = await db.update(note)
    .set({ content: 'Nuevo contenido', color: 'azul' })
    .where(eq(note.id, id))
    .returning();
```

### Soft Delete

```ts
const [deleted] = await db.update(note)
    .set({ deletedAt: new Date() })
    .where(eq(note.id, id))
    .returning();
```

### Operadores de Drizzle

```ts
import { eq, and, or, isNull, isNotNull, like, desc, asc } from 'drizzle-orm';

// Igualdad
eq(note.id, id)

// AND
and(eq(note.project_id, projectId), isNull(note.deletedAt))

// IS NULL (para soft-delete)
isNull(note.deletedAt)

// LIKE (búsqueda)
like(note.content, `%${searchTerm}%`)

// Orden
desc(note.createdAt)
asc(note.order)
```

---

## Migraciones

### Crear migración

```bash
pnpm db:generate
```

Genera archivos SQL en `drizzle/` basándose en los cambios del schema.

### Aplicar migraciones

```bash
pnpm db:migrate
```

### Empujar directamente (desarrollo)

```bash
pnpm db:push
```

Compara el schema con la DB y hace los cambios necesarios. Útil en desarrollo.

### Drizzle Studio

```bash
pnpm db:studio
```

Abre una UI web en `localhost:5174` para inspeccionar y editar la DB.

---

## Cambiar a Otra Base de Datos

SQLite está bien para desarrollo y proyectos pequeños. Para producción con múltiples usuarios, considera PostgreSQL o MySQL.

### PostgreSQL

1. Instalar driver:
   ```bash
   pnpm add pg
   pnpm add -D @types/pg
   ```

2. Cambiar `connection.ts`:
   ```ts
   import { drizzle } from 'drizzle-orm/node-postgres';
   export const db = drizzle(process.env.DATABASE_URL!);
   ```

3. Cambiar `drizzle.config.ts`:
   ```ts
   export default defineConfig({
       dialect: 'postgresql',
       dbCredentials: { url: process.env.DATABASE_URL }
   });
   ```

4. Actualizar `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/nudo
   ```

5. Regenerar:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

### MySQL

1. Instalar driver:
   ```bash
   pnpm add mysql2
   ```

2. Cambiar `connection.ts`:
   ```ts
   import { drizzle } from 'drizzle-orm/mysql2';
   export const db = drizzle(process.env.DATABASE_URL!);
   ```

3. Cambiar `drizzle.config.ts`:
   ```ts
   export default defineConfig({
       dialect: 'mysql',
       dbCredentials: { url: process.env.DATABASE_URL }
   });
   ```

### Turso (libSQL Cloud)

Turso es la versión cloud de SQLite. Compatible sin cambios de código:

```env
DATABASE_URL=libsql://tu-db tu-org.turso.io?authToken=tu-token
```

Solo cambia la URL en `.env`. El driver `@libsql/client` ya está instalado.

---

## Schema Index

Todas las tablas se exportan desde un barrel file:

```ts
// src/lib/infrastructure/db/schema/index.ts

export * from './client';
export * from './user';
export * from './session';
export * from './project';
export * from './note';
export * from './markdown-doc';
export * from './markdown-doc-version';
export * from './file';
export * from './kanban-board';
export * from './kanban-list';
export * from './kanban-card';
```

Al agregar una nueva tabla, agregar su export aquí.
