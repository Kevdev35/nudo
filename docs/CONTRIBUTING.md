# Contributing

Guía paso a paso para agregar nuevas funcionalidades al sistema.

## Agregar una Nueva Entidad

Vamos a usar el ejemplo de crear una entidad **`Tag`** (etiquetas para proyectos).

### Paso 1: Entity

Crear `src/lib/core/entities/tag-entity.ts`:

```ts
export interface Tag {
    id: string;
    project_id: string;
    name: string;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewTag = Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

### Paso 2: Port (Repository Interface)

Crear `src/lib/core/ports/tag-repository.ts`:

```ts
import { type Tag, type NewTag } from '@entities/tag-entity';

export interface TagRepository {
    create(data: NewTag): Promise<Tag>;
    findById(id: Tag['id']): Promise<Tag | null>;
    listByProject(projectId: Tag['project_id']): Promise<Tag[]>;
    update(id: Tag['id'], data: Partial<Pick<NewTag, 'name' | 'color'>>): Promise<Tag>;
    softDelete(id: Tag['id']): Promise<Tag>;
}
```

### Paso 3: Schema Drizzle

Crear `src/lib/infrastructure/db/schema/tag.ts`:

```ts
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { project } from "./project";

export const tag = sqliteTable('tag', {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    project_id: text().notNull().references(() => project.id),
    name: text().notNull(),
    color: text(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: 'timestamp' }),
});
```

Registrar en `src/lib/infrastructure/db/schema/index.ts`:

```ts
export * from './tag';
```

### Paso 4: Repository (Implementación)

Crear `src/lib/infrastructure/db/repositories/tag-repository.ts`:

```ts
import { tag } from "@infrastructure/db/schema/tag";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq, and, isNull } from 'drizzle-orm';
import type { TagRepository } from "@ports/tag-repository";
import type { NewTag } from "@entities/tag-entity";

export function createTagRepository(db: LibSQLDatabase): TagRepository {
    return {
        async create(data: NewTag) {
            const [newTag] = await db.insert(tag).values(data).returning();
            return newTag;
        },
        async findById(id) {
            const results = await db.select().from(tag).where(eq(tag.id, id));
            return results[0] ?? null;
        },
        async listByProject(projectId) {
            return await db.select().from(tag)
                .where(and(eq(tag.project_id, projectId), isNull(tag.deletedAt)));
        },
        async update(id, data) {
            const [updated] = await db.update(tag).set(data)
                .where(eq(tag.id, id)).returning();
            return updated;
        },
        async softDelete(id) {
            const [deleted] = await db.update(tag)
                .set({ deletedAt: new Date() })
                .where(eq(tag.id, id)).returning();
            return deleted;
        },
    };
}
```

### Paso 5: Use Cases

Crear `src/lib/core/use-cases/create-tag.ts`:

```ts
import type { TagRepository } from "@ports/tag-repository";
import type { ProjectRepository } from "@ports/project-repository";

export function createTagUseCase(tagRepo: TagRepository, projectRepo: ProjectRepository) {
    return async (userId: string, projectId: string, data: { name: string; color?: string | null }) => {
        const project = await projectRepo.findById(projectId);
        if (!project || project.user_id !== userId) {
            throw new Error('Proyecto no encontrado');
        }

        return await tagRepo.create({
            project_id: projectId,
            name: data.name,
            color: data.color ?? null,
        });
    };
}
```

Crear use cases para `get`, `list`, `update`, `delete` siguiendo el mismo patrón.

### Paso 6: Route Server

Crear `src/routes/(app)/projects/[id]/tags/+page.server.ts`:

```ts
import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '@infrastructure/db/connection';
import { createTagRepository } from '@infrastructure/db/repositories/tag-repository';
import { createProjectRepository } from '@infrastructure/db/repositories/project-repository';
import { createTagUseCase } from '@use-cases/create-tag';

const tagRepo = createTagRepository(db);
const projectRepo = createProjectRepository(db);
const createTag = createTagUseCase(tagRepo, projectRepo);

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) throw redirect(302, '/login');
    const tags = await tagRepo.listByProject(params.id);
    return { tags };
};

export const actions: Actions = {
    createTag: async ({ request, locals, params }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const name = formData.get('name') as string;

        try {
            await createTag(locals.user.id, params.id, { name });
        } catch (error) {
            return fail(400, { error: (error as Error).message });
        }
    }
};
```

### Paso 7: Route Page

Crear `src/routes/(app)/projects/[id]/tags/+page.svelte`:

```svelte
<script lang="ts">
    import type { PageData } from './$types';
    let { data }: { data: PageData } = $props();
</script>

<section class="flex flex-col gap-5 px-8 pb-12 pt-1">
    <div class="flex items-center justify-between flex-wrap gap-4">
        <h1 class="text-nudo-text-primary font-extrabold tracking-tight m-0"
            style="font-size:clamp(26px,3vw,34px)">
            Tags
        </h1>
    </div>

    <div class="flex flex-col gap-2">
        {#each data.tags as tag}
            <div class="flex items-center gap-4 px-5 py-4 bg-nudo-surface rounded-3xl">
                <p class="text-base font-semibold text-nudo-text-primary">{tag.name}</p>
            </div>
        {/each}
    </div>
</section>
```

### Paso 8: Agregar Tab de Navegación

En `src/routes/(app)/projects/[id]/+layout.svelte`, agregar el tab:

```svelte
<a href="/projects/{data.project.id}/tags"
   class="tab"
   aria-current={$page.url.pathname.endsWith('/tags') ? 'page' : undefined}>
    Tags
</a>
```

### Paso 9: Migrar la DB

```bash
pnpm db:push
```

### Paso 10: Verificar

```bash
pnpm check
```

---

## Convenciones de Código

### Nombres de Archivos

| Capa | Patrón | Ejemplo |
|------|--------|---------|
| Entity | `*-entity.ts` | `note-entity.ts` |
| Port | `*-repository.ts` | `note-repository.ts` |
| Schema | `*.ts` (singular) | `note.ts` |
| Repository | `*-repository.ts` | `notes-repository.ts` |
| Use case | `*.ts` (verbo) | `create-note.ts` |
| Route | `+page.svelte` / `+page.server.ts` | — |

### Imports

Usar siempre los aliases configurados:

```ts
// ✅ BIEN
import { type Note } from '@entities/note-entity';
import type { NoteRepository } from '@ports/note-repository';
import { note } from '@infrastructure/db/schema/note';

// ❌ MAL
import { type Note } from '../../../lib/core/entities/note-entity';
```

### Tipado

- Usar `type` para imports de tipos: `import type { ... }`
- Entidades usan interfaces, no types
- Use cases usan `Pick<>` o tipos inline para los datos de entrada

### Form Actions

```ts
export const actions: Actions = {
    miAction: async ({ request, locals, params }) => {
        // 1. Verificar auth
        if (!locals.user) throw redirect(302, '/login');

        // 2. Obtener datos del form
        const formData = await request.formData();

        // 3. Ejecutar use case
        try {
            await miUseCase(locals.user.id, params.id, { ... });
        } catch (error) {
            return fail(400, { error: (error as Error).message });
        }
    }
};
```

### Componentes Svelte

- Usar `$props()` para recibir datos (Svelte 5 runes)
- Usar `$state()` para estado reactivo
- Usar `$derived()` para valores calculados
- Separadores de sección: `class="flex flex-col gap-5 px-8 pb-12 pt-1"`
- Tokens `nudo-*` para colores, nunca colores hardcodeados
