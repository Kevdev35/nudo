# Design System

Sistema de diseño basado en CSS custom properties integradas con Tailwind CSS v4.

## Tokens de Color

### Modo Claro (`:root`)

```css
--nudo-bg:              #ffffff;    /* Fondo principal */
--nudo-surface:         #f7f7f8;    /* Fondo de cards, superficies */
--nudo-border:          #e5e5ea;    /* Bordes generales */
--nudo-text-primary:    #1d1d1f;    /* Texto principal */
--nudo-text-secondary:  #6e6e73;    /* Texto secundario */
--nudo-text-tertiary:   #aeaeb2;    /* Texto deshabilitado, placeholder */
--nudo-accent:          #0a84ff;    /* Acento principal (botones, links) */
--nudo-success:         #248a3d;    /* Estados de éxito */
--nudo-warning:         #b5590a;    /* Estados de advertencia */
--nudo-radius-lg:       18px;       /* Border radius grande */
--nudo-radius-md:       14px;       /* Border radius mediano */
```

### Modo Oscuro (`.dark`)

```css
--nudo-bg:              #141414;
--nudo-surface:         #1c1c1c;
--nudo-border:          #2a2a2a;
--nudo-text-primary:    #f5f5f5;
--nudo-text-secondary:  #a1a1aa;
--nudo-text-tertiary:   #525252;
--nudo-accent:          #3b82f6;
--nudo-success:         #22c55e;
--nudo-warning:         #f59e0b;
```

## Uso con Tailwind

Los tokens están registrados en `@theme` para usarlos como clases de utility:

```html
<!-- Colores de fondo -->
<div class="bg-nudo-bg">Fondo principal</div>
<div class="bg-nudo-surface">Superficie</div>

<!-- Colores de texto -->
<p class="text-nudo-text-primary">Texto principal</p>
<p class="text-nudo-text-secondary">Texto secundario</p>
<p class="text-nudo-text-tertiary">Texto terciario</p>

<!-- Acento -->
<button class="bg-nudo-accent text-white">Botón principal</button>
<a class="text-nudo-accent">Link</a>

<!-- Bordes -->
<div class="border border-nudo-border">Con borde</div>

<!-- Éxito y advertencia -->
<span class="text-nudo-success">Completado</span>
<span class="text-nudo-warning">Pendiente</span>
```

## Dark Mode

El dark mode se activa con la clase `.dark` en cualquier elemento padre:

```html
<!-- Forzar dark mode en una sección -->
<main class="dark bg-nudo-bg text-nudo-text-primary">
  ...
</main>
```

La variante custom está definida en `layout.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

El `ThemeToggle` componente alterna la clase `.dark` en `<html>` y guarda en `localStorage`.

## Componentes del Sistema

### Botón (`Button.svelte`)

```svelte
<script lang="ts">
  let { icon, class: className, children, ...props }: Props = $props();
</script>

<button class="bg-nudo-accent text-white rounded-xl px-5 py-2.5 ... {className}" {...props}>
  {#if icon}<i class="{icon}"></i>{/if}
  {@render children()}
</button>
```

Uso:
```svelte
<Button onclick={openModal}>
  <i class="ri-add-line"></i> Nuevo proyecto
</Button>

<Button type="submit" icon="ri-save-line">Guardar</Button>
```

### Logo (`Logo.svelte`)

```svelte
<Logo showBadge={true} />
<Logo showBadge={false} class="[&_span]:text-white!" />
```

### Navbar (`Navbar.svelte`)

```svelte
<Navbar data={pageData} />
```

Muestra logo, saludo al usuario y botón de logout.

## Claves de Uso

### Border Radius

| Clase | Valor | Uso |
|-------|-------|-----|
| `rounded-3xl` | 24px | Cards grandes, modales |
| `rounded-2xl` | 16px | Inputs, cards medianas |
| `rounded-xl` | 12px | Botones, badges |
| `rounded-full` | 9999px | Pills, avatares |

### Sombras

```css
/* Card normal */
shadow-sm

/* Card hover */
hover:shadow-md

/* Modal */
shadow-2xl

/* Botón accent */
shadow-lg shadow-nudo-accent/30
```

### Transiciones

```css
/* Hover suave */
transition-all duration-150

/* Solo colores */
transition-colors

/* Solo sombra */
transition-shadow
```

## Agregar Nuevos Tokens

### Paso 1: Agregar en `layout.css`

```css
:root {
  --nudo-mi-token: #valor;
}

.dark {
  --nudo-mi-token: #valor-dark;
}
```

### Paso 2: Registrar en `@theme`

```css
@theme {
  --color-nudo-mi-token: var(--nudo-mi-token);
}
```

### Paso 3: Usar en HTML

```html
<div class="bg-nudo-mi-token">...</div>
```

## Iconos

Se usa la librería **Remix Icons**. Importar en `+layout.svelte`:

```svelte
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css" />
```

Uso:
```svelte
<i class="ri-add-line"></i>
<i class="ri-delete-bin-line"></i>
<i class="ri-folder-3-line"></i>
<i class="ri-booklet-line"></i>
```

Ver catálogo completo: https://remixicon.com/
