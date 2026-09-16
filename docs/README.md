# Nudo — Documentación

> Un proyecto. Un contexto. Herramienta de gestión de proyectos para desarrolladores freelance.

## Qué es Nudo

Nudo es una aplicación web tipo Notion para gestionar proyectos de software. Concentra notas, documentación Markdown, tableros Kanban, archivos y clientes en un solo lugar, evitando que la información se dispersa entre múltiples herramientas.

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | SvelteKit 2 + Svelte 5 (Runes) |
| Lenguaje | TypeScript 6 |
| Build | Vite 8 |
| Estilos | Tailwind CSS v4 |
| ORM | Drizzle ORM |
| Base de datos | SQLite (libSQL) |
| Auth | Argon2 + session cookies |
| Icons | Remix Icons |
| DnD | @thisux/sveltednd |
| Markdown | marked v18 |
| Deploy | Netlify |

## Quick Start

```bash
# 1. Clonar e instalar
git clone https://github.com/tu-usuario/nudo.git
cd nudo
pnpm install

# 2. Configurar entorno
cp .env.example .env

# 3. Crear base de datos
pnpm db:push

# 4. Ejecutar
pnpm dev
```

Abrir `http://localhost:5173`, registrarse y empezar a usar.

## Estructura del Proyecto

```
src/
├── lib/
│   ├── core/                    # Capa de dominio (framework-agnostic)
│   │   ├── entities/            # Interfaces TypeScript puras
│   │   ├── ports/               # Contratos de repositorios y auth
│   │   └── use-cases/           # Lógica de negocio
│   ├── infrastructure/          # Adaptadores externos
│   │   ├── auth/                # Proveedor de sesiones (Argon2)
│   │   └── db/                  # Drizzle ORM + SQLite
│   │       ├── schema/          # Definiciones de tablas
│   │       ├── repositories/    # Implementación de ports
│   │       └── connection.ts    # Conexión a la base de datos
│   └── ui/                      # Componentes Svelte reutilizables
│       ├── components/          # Button, Logo, Navbar, ThemeToggle
│       └── stores/              # Theme store (dark mode)
└── routes/                      # Páginas SvelteKit
    ├── (auth)/                  # Login y Register
    └── (app)/                   # Dashboard, Clients, Projects
```

## Documentación

| Archivo | Contenido |
|---------|-----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitectura hexagonal, capas, patrones |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Tokens de diseño, Tailwind, dark mode |
| [SETUP.md](./SETUP.md) | Instalación, entorno, scripts |
| [ENTITIES.md](./ENTITIES.md) | Todas las entidades y sus relaciones |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Cómo agregar nuevas funcionalidades |
| [ROUTES.md](./ROUTES.md) | Mapa de rutas, layouts, endpoints |
| [DATABASE.md](./DATABASE.md) | Schema Drizzle, migraciones, relaciones |

## Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm check        # Type checking con svelte-check
pnpm db:push      # Empujar schema a la DB (desarrollo)
pnpm db:generate  # Generar migraciones
pnpm db:migrate   # Ejecutar migraciones
pnpm db:studio    # Drizzle Studio (UI de la DB)
```

## Licencia

MIT
