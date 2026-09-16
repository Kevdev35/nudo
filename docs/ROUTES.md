# Rutas

Mapa completo de rutas, layouts y endpoints de la aplicación.

## Estructura de Rutas

```
src/routes/
├── +layout.svelte                    # Layout raíz (CSS, favicon, remixicon)
├── +page.svelte                      # Landing page (/)
├── layout.css                        # Tokens y estilos globales
│
├── (auth)/                           # Grupo de autenticación
│   ├── login/
│   │   ├── +page.server.ts           # Acción: login
│   │   └── +page.svelte              # Formulario de login
│   └── register/
│       ├── +page.server.ts           # Acción: registro
│       └── +page.svelte              # Formulario de registro
│
└── (app)/                            # Grupo autenticado
    ├── dashboard/
    │   ├── +page.server.ts           # Load: proyectos + clientes
    │   └── +page.svelte              # Dashboard principal
    ├── clients/
    │   ├── +page.server.ts           # Load: clientes + acción crear
    │   └── +page.svelte              # Gestión de clientes
    └── projects/[id]/
        ├── +layout.server.ts         # Load: proyecto + cliente
        ├── +layout.svelte            # Shell del proyecto (topbar, tabs)
        ├── +page.server.ts           # Load: overview del proyecto
        ├── +page.svelte              # Dashboard del proyecto
        ├── search/
        │   └── +server.ts            # GET: búsqueda global
        ├── notes/
        │   ├── +page.server.ts       # CRUD notas
        │   └── +page.svelte          # Lista de notas
        ├── markdown/
        │   ├── +page.server.ts       # Load + crear doc
        │   ├── +page.svelte          # Lista de docs
        │   └── [docId]/
        │       ├── +page.server.ts   # Load + actualizar doc
        │       └── +page.svelte      # Editor Markdown
        ├── kanban/
        │   ├── +page.server.ts       # CRUD tablero/listas/tarjetas
        │   └── +page.svelte          # Tablero Kanban
        └── files/
            └── +page.svelte          # (Pendiente: no implementado)
```

## Páginas Públicas

### `/` — Landing Page

| Archivo | Tipo |
|---------|------|
| `+page.svelte` | Página marketing |

Contiene: hero, features, arquitectura, roadmap, donaciones, footer.

---

## Auth (`(auth)/`)

### `/login`

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Action | `default`: login con email/password |
| `+page.svelte` | Page | Formulario (email, password) |

**Acciones:**
- `default` → Valida credenciales, crea sesión, redirect a `/dashboard`

### `/register`

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Action | `default`: registro |
| `+page.svelte` | Page | Formulario (name, email, password) |

**Acciones:**
- `default` → Crea usuario, redirect a `/login`

---

## App (`(app)/`)

 Todas las rutas en este grupo requieren autenticación. El hook `hooks.server.ts` valida la sesión y populate `locals.user`.

### `/dashboard`

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Actions | Lista proyectos, crea proyecto |
| `+page.svelte` | Page | Dashboard con lista de proyectos |

**Load:**
- `projects` → Proyectos del usuario
- `clients` → Clientes del usuario

**Acciones:**
- `createProject` → Crea proyecto nuevo
- `logout` → Elimina sesión, redirect a `/`

### `/clients`

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Action | Lista y crea clientes |
| `+page.svelte` | Page | Gestión de clientes |

**Load:**
- `clients` → Clientes del usuario

**Acciones:**
- `createClient` → Crea cliente nuevo

---

## Projects (`/projects/[id]/`)

### Layout del Proyecto

`+layout.server.ts` carga el proyecto y cliente para todas las sub-rutas:

```ts
export const load: PageServerLoad = async ({ locals, params }) => {
    const project = await getProject(locals.user.id, params.id);
    const client = project.client_id
        ? await getClient(locals.user.id, project.client_id)
        : null;
    return { project, client };
};
```

`+layout.svelte` provee el shell compartido:
- Topbar (back link, search, settings)
- Hero (nombre, status, descripción, presupuesto, cliente)
- Tabs de navegación (General, Notas, Markdown, Kanban, Archivos)
- Búsqueda global con debounce

### `/projects/[id]/` — Overview

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load | Estadísticas y actividad |
| `+page.svelte` | Page | Dashboard del proyecto |

**Load:**
- `notes` → Notas del proyecto
- `boards` → Tableros con listas y tarjetas
- `docs` → Documentos Markdown
- `files` → Archivos

### `/projects/[id]/search` — Búsqueda

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+server.ts` | GET | Endpoint de búsqueda JSON |

**Parámetros de query:**
- `q` → Texto de búsqueda (mínimo 2 caracteres)

**Busca en:** notas, tarjetas Kanban, docs Markdown, archivos.

### `/projects/[id]/notes` — Notas

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Actions | CRUD de notas |
| `+page.svelte` | Page | Lista/grid de notas con colores |

**Acciones:**
- `createNote` → Crea nota (content, color)
- `deleteNote` → Elimina nota
- `toggleComplete` → Marcar completada/pendiente
- `editNote` → Editar contenido y color

### `/projects/[id]/markdown` — Documentos

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Action | Lista y crea docs |
| `+page.svelte` | Page | Lista de documentos |

**Acciones:**
- `createMarkdownDoc` → Crea documento nuevo

### `/projects/[id]/markdown/[docId]` — Editor

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Action | Carga y guarda doc |
| `+page.svelte` | Page | Editor split-screen (textarea + preview) |

**Acciones:**
- `updateDoc` → Guarda contenido (crea versión)

### `/projects/[id]/kanban` — Tablero

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.server.ts` | Load + Actions | CRUD completo Kanban |
| `+page.svelte` | Page | Tablero con drag-and-drop |

**Acciones:**
- `createBoard` → Crea tablero
- `createList` → Crea columna
- `createCard` → Crea tarjeta
- `moveCard` → Mueve tarjeta entre columnas
- `updateCard` → Actualiza tarjeta
- `deleteCard` → Elimina tarjeta
- `toggleCardComplete` → Marcar completada

### `/projects/[id]/files` — Archivos

| Archivo | Tipo | Descripción |
|---------|------|------------|
| `+page.svelte` | Page | (Pendiente: no implementado) |

---

## Layouts

### Layout Raíz (`+layout.svelte`)

```svelte
<script>
    import '../layout.css';
    import 'remixicon/fonts/remixicon.css';
</script>

<slot />
```

### Layout Auth (`(auth)/+layout.svelte`)

No existe layout específico. Las páginas de auth manejan su propio layout con grid de 2 columnas.

### Layout App (`(app)/+layout.svelte`)

No existe layout específico. Cada página incluye `<Navbar>`.

### Layout Proyecto (`projects/[id]/+layout.svelte`)

Shell compartido para todas las páginas del proyecto:
- Topbar con back link y búsqueda
- Hero con metadata del proyecto
- Tabs de navegación con indicador animado

---

## Endpoints API

### GET `/projects/[id]/search?q=...`

Búsqueda global dentro de un proyecto.

**Response:**
```json
{
    "results": [
        { "type": "note", "id": "...", "title": "...", "content": "..." },
        { "type": "card", "id": "...", "title": "...", "description": "..." },
        { "type": "doc", "id": "...", "title": "...", "content": "..." },
        { "type": "file", "id": "...", "name": "...", "type": "image" }
    ]
}
```

---

## Autenticación

### Cookie de Sesión

- Nombre: `session`
- Tipo: HTTP-only cookie
- Expiración: 30 días
- Generación: `randomBytes(20).toString('hex')` → SHA-256 hash como ID de sesión

### Hook de Validación

```ts
// hooks.server.ts
const token = event.cookies.get("session");
if (token) {
    const result = await authProvider.validateSession(token);
    event.locals.user = result ? await userRepo.findById(result.userId) : null;
}
```

### Protección de Rutas

Las rutas `(app)/` dependen de `locals.user`. Si no hay usuario, los load/actions redirigen a `/login`.
