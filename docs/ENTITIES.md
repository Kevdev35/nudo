# Entidades

Todas las interfaces TypeScript del dominio. Cada entidad tiene su archivo en `src/lib/core/entities/`.

## Patrón General

```ts
export interface Entidad {
    id: string;                    // UUID, auto-generado
    // ... campos específicos ...
    createdAt: Date;               // Fecha de creación
    updatedAt: Date;               // Fecha de última actualización
    deletedAt: Date | null;        // Soft-delete (null = activo)
}

// Tipo para crear registros (sin campos auto-generados)
export type NewEntidad = Omit<Entidad, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

---

## User

**Archivo:** `src/lib/core/entities/user-entity.ts`

```ts
export interface User {
    id: string;
    name: string | null;
    email: string;
    password_hash: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `name` | string \| null | Nombre del usuario |
| `email` | string | Email único |
| `password_hash` | string | Hash Argon2 de la contraseña |
| `createdAt` | Date | Timestamp de creación |
| `updatedAt` | Date | Timestamp de actualización |
| `deletedAt` | Date \| null | Soft-delete |

---

## Session

**Archivo:** `src/lib/core/entities/session-entity.ts`

```ts
export interface Session {
    id: string;
    user_id: string;
    createdAt: Date;
    expiresAt: Date;
}

export type NewSession = Omit<Session, 'createdAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | SHA-256 del token |
| `user_id` | string | FK → User.id |
| `createdAt` | Date | Timestamp de creación |
| `expiresAt` | Date | Expiración (30 días) |

> **Nota:** Session NO tiene soft-delete. Se borra físicamente.

---

## Client

**Archivo:** `src/lib/core/entities/client_entity.ts`

```ts
export interface Client {
    id: string;
    user_id: string;
    name: string;
    contact_info: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewClient = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `user_id` | string | FK → User.id (owner) |
| `name` | string | Nombre del cliente |
| `contact_info` | string \| null | Email, teléfono, dirección |
| `notes` | string \| null | Notas adicionales |

---

## Project

**Archivo:** `src/lib/core/entities/project-entity.ts`

```ts
export type ProjectStatus = 'activo' | 'pendiente' | 'terminado';

export interface Project {
    id: string;
    user_id: string;
    client_id: string | null;
    name: string;
    description: string | null;
    status: ProjectStatus;
    budget: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `user_id` | string | FK → User.id (owner) |
| `client_id` | string \| null | FK → Client.id (opcional) |
| `name` | string | Nombre del proyecto |
| `description` | string \| null | Descripción |
| `status` | ProjectStatus | `'activo'` \| `'pendiente'` \| `'terminado'` |
| `budget` | number \| null | Presupuesto |

---

## Note

**Archivo:** `src/lib/core/entities/note-entity.ts`

```ts
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

export type NewNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `project_id` | string | FK → Project.id |
| `order` | number | Orden de visualización |
| `content` | string | Contenido de la nota |
| `color` | string \| null | Color de fondo (`'amarillo'`, `'rosa'`, etc.) |
| `completed` | number \| undefined | 0 = pendiente, 1 = completada |

---

## MarkdownDoc

**Archivo:** `src/lib/core/entities/markdown-doc-entity.ts`

```ts
export interface MarkdownDoc {
    id: string;
    project_id: string;
    title: string;
    current_content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewMarkdownDoc = Omit<MarkdownDoc, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `project_id` | string | FK → Project.id |
| `title` | string | Título del documento |
| `current_content` | string | Contenido Markdown actual |

---

## MarkdownDocVersion

**Archivo:** `src/lib/core/entities/markdown-version-entity.ts`

```ts
export interface MarkdownDocVersion {
    id: string;
    markdown_doc_id: string;
    content: string;
    version_number: number;
    createdAt: Date;
}

export type NewMarkdownDocVersion = Omit<MarkdownDocVersion, 'id' | 'createdAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `markdown_doc_id` | string | FK → MarkdownDoc.id |
| `content` | string | Contenido en esta versión |
| `version_number` | number | Número de versión (1, 2, 3...) |

> **Nota:** No tiene soft-delete ni updatedAt. Las versiones son inmutables.

---

## ProjectFile

**Archivo:** `src/lib/core/entities/file-entity.ts`

```ts
export type TypeFile = 'image' | 'uml' | 'figma_link' | 'other';

export interface ProjectFile {
    id: string;
    project_id: string;
    type: TypeFile;
    url_or_path: string;
    name: string;
    createdAt: Date;
    deletedAt: Date | null;
}

export type NewProjectFile = Omit<ProjectFile, 'id' | 'createdAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `project_id` | string | FK → Project.id |
| `type` | TypeFile | `'image'` \| `'uml'` \| `'figma_link'` \| `'other'` |
| `url_or_path` | string | URL externa o ruta local |
| `name` | string | Nombre descriptivo |

---

## KanbanBoard

**Archivo:** `src/lib/core/entities/kanban-board-entity.ts`

```ts
export interface KanbanBoard {
    id: string;
    project_id: string;
    name: string;
    createdAt: Date;
    deletedAt: Date | null;
}

export type NewKanbanBoard = Omit<KanbanBoard, 'id' | 'createdAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `project_id` | string | FK → Project.id |
| `name` | string | Nombre del tablero |

---

## KanbanList

**Archivo:** `src/lib/core/entities/kanban-list-entity.ts`

```ts
export interface KanbanList {
    id: string;
    kanban_board_id: string;
    name: string;
    order: number;
    createdAt: Date;
    deletedAt: Date | null;
}

export type NewKanbanList = Omit<KanbanList, 'id' | 'createdAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `kanban_board_id` | string | FK → KanbanBoard.id |
| `name` | string | Nombre de la columna |
| `order` | number | Posición en el tablero |

---

## KanbanCard

**Archivo:** `src/lib/core/entities/kanban-card-entity.ts`

```ts
export interface KanbanCard {
    id: string;
    kanban_list_id: string;
    title: string;
    description: string | null;
    completed?: number;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export type NewKanbanCard = Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
```

| Campo | Tipo | Descripción |
|-------|------|------------|
| `id` | string | UUID |
| `kanban_list_id` | string | FK → KanbanList.id |
| `title` | string | Título de la tarjeta |
| `description` | string \| null | Descripción opcional |
| `completed` | number \| undefined | 0 = pendiente, 1 = completada |
| `order` | number | Posición en la columna |

---

## Diagrama de Relaciones

```
User (1) ──── (N) Project ──── (N) Note
   │                │
   │                ├── (N) MarkdownDoc ──── (N) MarkdownDocVersion
   │                │
   │                ├── (N) ProjectFile
   │                │
   │                ├── (N) KanbanBoard ──── (N) KanbanList ──── (N) KanbanCard
   │                │
   │                └── (N) Client (opcional, client_id)
   │
   └── (N) Session

User (1) ──── (N) Client
```

### Cadenas de Ownership

Para acceder a cualquier entidad, se verifica la cadena:

```
Note → Project → User (verificar project.user_id === userId)
KanbanCard → KanbanList → KanbanBoard → Project → User
MarkdownDoc → Project → User
ProjectFile → Project → User
Client → User (verificar client.user_id === userId)
```
