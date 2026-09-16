# Arquitectura Hexagonal

Nudo implementa el patrón **Ports & Adapters** (arquitectura hexagonal). El objetivo es separar la lógica de negocio de los detalles de implementación (base de datos, framework web, UI).

## Las 3 Capas

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION                        │
│         routes/ + ui/ (SvelteKit + Svelte 5)         │
│                                                      │
│   Páginas, layouts, componentes, form actions        │
└──────────────────────┬──────────────────────────────┘
                       │ usa
                       ▼
┌─────────────────────────────────────────────────────┐
│                     CORE                             │
│        entities/ + ports/ + use-cases/               │
│                                                      │
│   Interfaces, lógica de negocio pura                 │
│   SIN dependencias de frameworks o DB                │
└──────────────────────┬──────────────────────────────┘
                       │ usa
                       ▼
┌─────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE                       │
│       db/ (Drizzle + SQLite) + auth/ (Argon2)        │
│                                                      │
│   Repositorios, esquemas, conexión a DB, auth        │
└─────────────────────────────────────────────────────┘
```

## Core (Dominio)

### Entities — Interfaces puras

Entidades son interfaces TypeScript. No tienen dependencias externas.

```ts
// src/lib/core/entities/note-entity.ts

export interface Note {
    id: string;
    project_id: string;
    order: number;
    content: string;
    color: string | null;
    completed?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

// Tipo para crear registros (sin id ni timestamps)
export type NewNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

**Convenciones:**
- IDs son `string` (UUIDs generados por la DB)
- Timestamps: `createdAt`, `updatedAt`, `deletedAt` (Date | null)
- Soft-delete: `deletedAt` es `null` cuando el registro está activo
- `New___` es el tipo para inserciones (sin campos auto-generados)

### Ports — Contratos

Ports definen qué operaciones están disponibles, sin importar cómo se implementan.

```ts
// src/lib/core/ports/note-repository.ts

import { type Note, type NewNote } from '@entities/note-entity';

export interface NoteRepository {
    create(data: NewNote): Promise<Note>;
    findById(id: Note['id']): Promise<Note | null>;
    listByProject(projectId: Note['project_id']): Promise<Note[]>;
    update(id: Note['id'], data: Partial<Pick<NewNote, 'content' | 'order' | 'completed' | 'color'>>): Promise<Note>;
    softDelete(id: Note['id']): Promise<Note>;
}
```

**Tipos de ports:**
- `*Repository` — CRUD de entidades
- `AuthProvider` — Hash de passwords, sesiones

### Use Cases — Lógica de negocio

Cada use case es una **factory function** que recibe los ports como dependencias y retorna una función asíncrona.

```ts
// src/lib/core/use-cases/create-note.ts

import type { NoteRepository } from "@ports/note-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createNoteUseCase(
    noteRepo: NoteRepository,
    projectRepo: ProjectRepository
) {
    // Retorna la función que ejecuta la lógica
    return async (
        userId: string,
        projectId: string,
        data: { content: string; order: number; color?: string | null }
    ) => {
        // 1. Verificar ownership del proyecto
        const project = await projectRepo.findById(projectId);
        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        // 2. Crear la nota
        const newNote = await noteRepo.create({
            project_id: projectId,
            content: data.content,
            order: data.order,
            color: data.color ?? null,
        });

        return newNote;
    };
}
```

**Patrón de cada use case:**
1. Factory function que recibe ports
2. Retorna función asíncrona que recibe datos
3. Verifica ownership (`project.user_id === userId`)
4. Ejecuta operación en el repositorio
5. Retorna resultado

## Infrastructure (Adaptadores)

### Repositorios

Implementan los ports usando Drizzle ORM con SQLite.

```ts
// src/lib/infrastructure/db/repositories/notes-repository.ts

import { note } from "@infrastructure/db/schema/note";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, and, isNull } from 'drizzle-orm';
import type { NoteRepository } from "@ports/note-repository";
import type { NewNote } from "@entities/note-entity";

export function createNoteRepository(db: LibSQLDatabase): NoteRepository {
    return {
        async create(data: NewNote) {
            const [newNote] = await db.insert(note).values(data).returning();
            return newNote;
        },

        async findById(id) {
            const results = await db.select().from(note).where(eq(note.id, id));
            return results[0] ?? null;
        },

        async listByProject(projectId) {
            return await db.select().from(note)
                .where(and(eq(note.project_id, projectId), isNull(note.deletedAt)));
        },

        async update(id, data) {
            const [updated] = await db.update(note).set(data)
                .where(eq(note.id, id)).returning();
            return updated;
        },

        async softDelete(id) {
            const [deleted] = await db.update(note)
                .set({ deletedAt: new Date() })
                .where(eq(note.id, id)).returning();
            return deleted;
        },
    };
}
```

### Conexión a la DB

```ts
// src/lib/infrastructure/db/connection.ts

import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL } from '$env/static/private';

export const db = drizzle({
    connection: {
        url: DATABASE_URL  // file:local.db para SQLite
    }
});
```

### Autenticación

```ts
// src/lib/infrastructure/auth/session-auth-provider.ts

import { hash, verify } from '@node-rs/argon2';
import { randomBytes, createHash } from 'crypto';

export function createAuthProvider(sessionRepo: SessionRepository): AuthProvider {
    return {
        async hashPassword(password) {
            return hash(password, {
                memoryCost: 19456,
                timeCost: 2,
                parallelism: 1,
                outputLen: 32
            });
        },

        async createSession(userId) {
            const token = randomBytes(20).toString('hex');
            const sessionId = createHash('sha256').update(token).digest('hex');
            const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 días

            await sessionRepo.create({
                id: sessionId,
                user_id: userId,
                expiresAt
            });

            return { token, expiresAt };
        },

        async validateSession(token) {
            const sessionId = createHash('sha256').update(token).digest('hex');
            const session = await sessionRepo.findById(sessionId);

            if (!session || session.expiresAt < new Date()) {
                return null;
            }
            return { userId: session.user_id };
        },
    };
}
```

## Presentation (SvelteKit)

### Hooks Server

El hook `hooks.server.ts` se ejecuta en cada request y valida la sesión:

```ts
// src/hooks.server.ts

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("session");

    if (!token) {
        event.locals.user = null;
        return resolve(event);
    }

    const result = await authProvider.validateSession(token);

    if (result) {
        event.locals.user = await userRepo.findById(result.userId);
    } else {
        event.cookies.delete('session', { path: '/' });
        event.locals.user = null;
    }

    return resolve(event);
};
```

### Route Servers

Las acciones (form submissions) y loads usan los use-cases:

```ts
// src/routes/(app)/projects/[id]/notes/+page.server.ts

import { createNoteUseCase } from '@use-cases/create-note';
import { createNoteRepository } from '@infrastructure/db/repositories/notes-repository';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';
import { db } from '@infrastructure/db/connection';

const noteRepo = createNoteRepository(db);
const projectRepo = createProjectRepository(db);
const createNote = createNoteUseCase(noteRepo, projectRepo);

export const actions = {
    createNote: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const content = formData.get('content') as string;

        return await createNote(locals.user.id, projectId, { content, order: 0 });
    }
};
```

## Patrones Clave

### Ownership Chain

Cada use-case verifica que el usuario owns el recurso a través de la cadena de relaciones:

```
User → Project → Note/Kanban/Markdown/File
User → Client → Project
```

Ejemplo: Para borrar una nota, se verifica:
1. El proyecto pertenece al usuario (`project.user_id === userId`)
2. La nota pertenece al proyecto (`note.project_id === projectId`)

### Soft Delete

Ninguna entidad se borra físicamente. Se marca `deletedAt` con la fecha actual:

```ts
async softDelete(id) {
    const [deleted] = await db.update(note)
        .set({ deletedAt: new Date() })
        .where(eq(note.id, id))
        .returning();
    return deleted;
}
```

Las consultas excluyen registros borrados con `isNull(note.deletedAt)`.

### Factory Functions

Todas las dependencias se inyectan como parámetros:

```ts
// ❌ MAL — dependencia hardcodeada
import { db } from '@infrastructure/db/connection';
const noteRepo = createNoteRepository(db);

// ✅ BIEN — inyección de dependencias
export function createNoteUseCase(noteRepo: NoteRepository, projectRepo: ProjectRepository) {
    return async (userId, projectId, data) => { ... };
}
```

## Cambiar Base de Datos

El proyecto usa SQLite via libSQL. Para cambiar a otra DB (PostgreSQL, MySQL, etc.):

1. Cambiar el driver en `connection.ts`:
   ```ts
   // PostgreSQL
   import { drizzle } from 'drizzle-orm/node-postgres';
   export const db = drizzle(process.env.DATABASE_URL!);
   ```

2. Cambiar el dialect en `drizzle.config.ts`:
   ```ts
   export default defineConfig({
       dialect: 'postgresql',  // era 'sqlite'
       dbCredentials: { url: process.env.DATABASE_URL }
   });
   ```

3. Actualizar los repositorios si es necesario (algunas funciones SQL pueden diferir)

4. Regenerar migraciones:
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```
