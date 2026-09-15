<script lang="ts">

</script>

<main class="bg-[#0d0d0f] text-slate-100 font-sans antialiased selection:bg-rose-600 selection:text-white">

  <!-- Header / Navigation -->
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0d0d0f]/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl font-black tracking-tight text-white uppercase">NUDO</span>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">Open Source</span>
      </div>
      
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <a href="#problema" class="hover:text-white transition-colors">Concepto</a>
        <a href="#caracteristicas" class="hover:text-white transition-colors">Funcionalidades</a>
        <a href="#flujo" class="hover:text-white transition-colors">Flujo</a>
        <a href="#arquitectura" class="hover:text-white transition-colors">Arquitectura</a>
        <a href="#donaciones" class="hover:text-white transition-colors">Soportar</a>
      </nav>

      <div class="flex items-center gap-4">
        <a href="https://github.com" target="_blank" class="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <a href="/login" class="text-sm font-semibold bg-white text-black px-4 py-2 rounded-xl hover:bg-slate-200 transition-all shadow-sm">
          Nudo Online
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-dot-pattern">
    <div class="absolute inset-0 gradient-glow pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10 text-center">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-semibold text-rose-300 mb-6 border border-rose-500/20">
        <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
        Open source. Built for developers.
      </div>

      <h1 class="text-4xl md:text-7xl font-black tracking-tight leading-[1.1] text-white max-w-4xl mx-auto">
        Your project is more than a task list. Concentra todo en un <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-red-600">NUDO</span>.
      </h1>

      <p class="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
        Un proyecto. Un contexto. Nudo mantiene tus ideas, documentación, archivos, tareas y la relación con tus clientes interconectados en un solo lugar.
      </p>

      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="/login" class="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-600/30 transition-all text-center">
          Probar Nudo Online (Gratis)
        </a>
        <a href="https://github.com" target="_blank" class="w-full sm:w-auto px-8 py-3.5 glass-card hover:bg-white/10 text-slate-200 font-semibold rounded-2xl transition-all text-center border border-white/10">
          Self-Hosted / GitHub
        </a>
      </div>

      <!-- MOCKUP UI DE NUDO (Fiel e Intacto) -->
      <div id="preview" class="mt-14 relative mx-auto max-w-5xl text-left">
        <div class="rounded-3xl p-3 bg-gradient-to-b from-white/20 via-white/10 to-transparent shadow-2xl backdrop-blur-2xl">
          <div class="bg-white text-black rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            
            <!-- Window Header / Browser Toolbar -->
            <div class="bg-white px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                <span class="ml-4 font-mono text-[11px] text-slate-400">localhost:5173/projects/b4b4af3a-80b9-4c7c-85b4-74dfd087d9ef/kanban</span>
              </div>
              <div class="font-semibold text-slate-600">NUDO Workspace</div>
            </div>

            <!-- Header de NUDO -->
            <div class="px-8 pt-6 pb-4 bg-white">
              <div class="flex items-center justify-between">
                <a href="#" class="text-sm font-bold text-black flex items-center gap-1">
                  ‹ Mis proyectos
                </a>
                <div class="flex-1 max-w-md mx-8">
                  <div class="relative">
                    <input type="text" disabled placeholder="Buscar notas, markdowns, ar" class="w-full bg-slate-50 text-xs px-4 py-2 rounded-xl border border-slate-100 text-slate-400 placeholder-slate-400" />
                  </div>
                </div>
                <button class="text-xs font-bold text-slate-800 flex items-center gap-1">
                  ⚙ Configuracion de proyecto
                </button>
              </div>

              <!-- Título & Metadatos del Proyecto -->
              <div class="mt-6">
                <h2 class="text-4xl font-black text-black tracking-tight">nudo</h2>
                <div class="mt-2 text-xs font-medium text-slate-600 space-y-1">
                  <p>Esta es una prueba oficial de ver mis proyectos</p>
                  <p>Estado: <span class="text-slate-900 font-semibold">pendiente</span></p>
                  <p>Presupuesto: <span class="text-slate-900 font-semibold">$12343</span></p>
                </div>
              </div>

              <!-- Tabs de Navegación NUDO -->
              <div class="flex items-center gap-6 mt-6 border-b border-slate-100 pb-3 text-xs font-bold text-slate-600">
                <span class="cursor-pointer hover:text-black">General</span>
                <span class="cursor-pointer hover:text-black">Notas</span>
                <span class="cursor-pointer hover:text-black">Markdown</span>
                <span class="text-black font-extrabold border-b-2 border-black pb-3 -mb-3.5">Kanban</span>
                <span class="cursor-pointer hover:text-black">Archivos</span>
              </div>
            </div>

            <!-- Tablero Kanban de NUDO -->
            <div class="p-8 bg-slate-50 border-t border-slate-100">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-black tracking-tight text-black uppercase">PROCESO</h3>
                <button class="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-slate-800">
                  + Nueva columna
                </button>
              </div>

              <!-- Columnas del Kanban -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                <!-- Columna: PENDIENTES -->
                <div class="bg-[#e4e4e7] p-4 rounded-2xl flex flex-col min-h-[220px]">
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-extrabold text-xs tracking-wider text-black uppercase">PENDIENTES</span>
                    <span class="text-xs text-slate-500 font-bold">+</span>
                  </div>
                  <!-- Tarjeta 1 -->
                  <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div class="flex items-start justify-between gap-2">
                      <p class="font-bold text-xs text-black leading-snug">crear un boton de eliminar en tablas de completados</p>
                      <span class="text-slate-300 text-xs">◯</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      agregar un bton que cuando se nombre completado o similar se genere una opcion la cual ya se pueda marcar como terminado como en notas
                    </p>
                  </div>
                </div>

                <!-- Columna: EN PROCESO -->
                <div class="bg-[#e4e4e7] p-4 rounded-2xl flex flex-col min-h-[220px]">
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-extrabold text-xs tracking-wider text-black uppercase">EN PROCESO</span>
                    <span class="text-xs text-slate-500 font-bold">+</span>
                  </div>
                  <p class="text-xs text-slate-400 font-medium mt-2">Sin tarjetas</p>
                </div>

                <!-- Columna: TESTING -->
                <div class="bg-[#e4e4e7] p-4 rounded-2xl flex flex-col min-h-[220px]">
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-extrabold text-xs tracking-wider text-black uppercase">TESTING</span>
                    <span class="text-xs text-slate-500 font-bold">+</span>
                  </div>
                  <!-- Tarjeta 2 -->
                  <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div class="flex items-start justify-between gap-2">
                      <p class="font-bold text-xs text-black leading-snug">agregarle estilo al apartado de clientes</p>
                      <span class="text-slate-300 text-xs">◯</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      debemos agregar estilo al apartado de clientes el cual aun es solo un html basico y plano
                    </p>
                  </div>
                </div>

                <!-- Columna: COMPLETADO -->
                <div class="bg-[#e4e4e7] p-4 rounded-2xl flex flex-col min-h-[220px]">
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-extrabold text-xs tracking-wider text-black uppercase">COMPLETADO</span>
                    <span class="text-xs text-slate-500 font-bold">+</span>
                  </div>
                  <!-- Tarjeta 3 -->
                  <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div class="flex items-start justify-between gap-2">
                      <p class="font-bold text-xs text-black leading-snug">editar tarjetas</p>
                      <span class="text-emerald-500 text-xs font-bold">✓</span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      permitir que se puedan editar tarjetas, tanto nombre como descripcion
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 2: El problema que resuelve Nudo -->
  <section id="problema" class="py-24 border-t border-white/10 bg-[#0d0d0f] relative">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-rose-500">Fragmentación del contexto</span>
        <h2 class="text-3xl md:text-5xl font-black text-white mt-3">Detén la dispersión de tus proyectos</h2>
        <p class="text-slate-400 mt-4 text-base leading-relaxed">
          Los proyectos de software fallan cuando la información está desperdigada. Ideas en una app de notas, tareas en un Kanban, docs en Markdown, diagramas en otra web y archivos en la nube. Nudo elimina el caos.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 items-center">
        <!-- Sin Nudo -->
        <div class="glass-card p-8 rounded-3xl border-rose-500/20 bg-rose-950/10">
          <h3 class="text-xl font-bold text-rose-400 mb-4 flex items-center gap-2">
            <span>✕</span> Sin Nudo (Información Fragmentada)
          </h3>
          <ul class="space-y-3 text-sm text-slate-400">
            <li class="flex items-center gap-2"><span>•</span> Ideas olvidadas en borradores de notas.</li>
            <li class="flex items-center gap-2"><span>•</span> Tareas desconectadas de la documentación técnica.</li>
            <li class="flex items-center gap-2"><span>•</span> Diagramas UML y Figma perdidos entre links.</li>
            <li class="flex items-center gap-2"><span>•</span> Clientes y presupuestos en hojas de cálculo separadas.</li>
          </ul>
        </div>

        <!-- Con Nudo -->
        <div class="glass-card p-8 rounded-3xl border-emerald-500/20 bg-emerald-950/10">
          <h3 class="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <span>✓</span> Con Nudo (Un proyecto. Un contexto.)
          </h3>
          <ul class="space-y-3 text-sm text-slate-300">
            <li class="flex items-center gap-2"><span>•</span> Ideas, notas e investigación centralizadas.</li>
            <li class="flex items-center gap-2"><span>•</span> Documentación Markdown con historial de versiones.</li>
            <li class="flex items-center gap-2"><span>•</span> Tableros Kanban alineados al contexto del software.</li>
            <li class="flex items-center gap-2"><span>•</span> Entidad Cliente separada para diferenciar proyectos personales.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 4: Qué contiene un proyecto (MVP Actual) -->
  <section id="caracteristicas" class="py-24 border-t border-white/10 bg-black/40">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-rose-500">MVP Disponible</span>
        <h2 class="text-3xl md:text-5xl font-black text-white mt-2">Todo lo que tu proyecto necesita</h2>
        <p class="text-slate-400 mt-3 text-sm">Diseñado especialmente para desarrolladores independientes, freelancers y pequeños equipos.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        
        <!-- Feature 1: Información Básica & Presupuesto -->
        <div class="glass-card p-8 rounded-3xl hover:border-rose-500/40 transition-all">
          <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-6 border border-rose-500/20">
            📊
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Información & Presupuesto</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            Controla el tipo de proyecto, descripción general, presupuesto asignado y estado actual en una sola vista.
          </p>
        </div>

        <!-- Feature 2: Markdown & Historial -->
        <div class="glass-card p-8 rounded-3xl hover:border-rose-500/40 transition-all">
          <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-6 border border-rose-500/20">
            📝
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Markdown + Historial</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            Escribe especificaciones técnicas, prompts de IA y notas con historial de versiones integrado para no perder nada.
          </p>
        </div>

        <!-- Feature 3: Kanban Organizado -->
        <div class="glass-card p-8 rounded-3xl hover:border-rose-500/40 transition-all">
          <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-6 border border-rose-500/20">
            📌
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Tableros Kanban</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            Gestión to-do intuitiva con columnas, listas y tarjetas vinculadas al flujo de desarrollo de tu software.
          </p>
        </div>

        <!-- Feature 4: Archivos y Diagramas -->
        <div class="glass-card p-8 rounded-3xl hover:border-rose-500/40 transition-all">
          <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-6 border border-rose-500/20">
            📁
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Archivos y Diagramas</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            Organiza carpetas con diagramas UML, prototipos de Figma, PNGs y recursos multimedia de tu desarrollo.
          </p>
        </div>

        <!-- Feature 5: Entidad Clientes -->
        <div class="glass-card p-8 rounded-3xl hover:border-rose-500/40 transition-all">
          <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-6 border border-rose-500/20">
            👥
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Gestión de Clientes</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            Entidad cliente independiente. Separa fácilmente tus proyectos personales de los trabajos para clientes con datos de contacto.
          </p>
        </div>

        <!-- Feature 6: Ideas & Notas Rápidas -->
        <div class="glass-card p-8 rounded-3xl hover:border-rose-500/40 transition-all">
          <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-6 border border-rose-500/20">
            💡
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Captura de Ideas</h3>
          <p class="text-slate-400 text-xs leading-relaxed">
            Un espacio dinámico para registrar pensamientos, conceptos de arquitectura o investigación sin estructurar.
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- SECCIÓN 5: Flujo Principal -->
  <section id="flujo" class="py-20 border-t border-white/10 bg-[#0d0d0f]">
    <div class="max-w-5xl mx-auto px-6">
      <div class="text-center mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-rose-500">Experiencia de Usuario</span>
        <h2 class="text-3xl md:text-4xl font-black text-white mt-2">Flujo directo, sin fricción</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div class="p-6 rounded-2xl glass-card">
          <span class="text-2xl font-black text-rose-500">01</span>
          <h4 class="font-bold text-white mt-2 text-sm">Dashboard</h4>
          <p class="text-slate-400 text-xs mt-1">Proyectos recientes, pendientes y terminados de un vistazo.</p>
        </div>

        <div class="p-6 rounded-2xl glass-card">
          <span class="text-2xl font-black text-rose-500">02</span>
          <h4 class="font-bold text-white mt-2 text-sm">Nuevo Proyecto</h4>
          <p class="text-slate-400 text-xs mt-1">Define presupuesto, tipo de proyecto o asigna un cliente.</p>
        </div>

        <div class="p-6 rounded-2xl glass-card">
          <span class="text-2xl font-black text-rose-500">03</span>
          <h4 class="font-bold text-white mt-2 text-sm">Vista Unificada</h4>
          <p class="text-slate-400 text-xs mt-1">Navega entre Kanban, Notas, Markdown y Archivos en pestañas.</p>
        </div>

        <div class="p-6 rounded-2xl glass-card">
          <span class="text-2xl font-black text-rose-500">04</span>
          <h4 class="font-bold text-white mt-2 text-sm">Contexto Vivo</h4>
          <p class="text-slate-400 text-xs mt-1">Actualiza avances con trazabilidad completa de tu software.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 12: Piloto Real (Built for real workflows) -->
  <section class="py-16 border-t border-white/10 bg-rose-950/10">
    <div class="max-w-4xl mx-auto px-6 text-center">
      <span class="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">Pilot Program</span>
      <h3 class="text-2xl md:text-3xl font-black text-white mt-4">Built with real project workflows in mind</h3>
      <p class="text-slate-400 text-sm mt-3 leading-relaxed">
        Nudo se valida y pule actualmente en entornos reales de producción junto a agencias afiliadas. Probamos los flujos con proyectos reales para refinarla UX antes de cada lanzamiento masivo.
      </p>
    </div>
  </section>

  <!-- SECCIÓN 13 & 14: Arquitectura Hexagonal y Stack Técnico -->
  <section id="arquitectura" class="py-24 border-t border-white/10 bg-[#0d0d0f]">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-rose-500">Para Contributors y Devs</span>
          <h2 class="text-3xl md:text-4xl font-black text-white mt-2">Arquitectura Hexagonal & Decoupled Core</h2>
          <p class="text-slate-400 text-sm mt-4 leading-relaxed">
            Nudo implementa un patrón Ports & Adapters. El dominio del proyecto reside en un núcleo independiente que no depende directamente del framework web ni de la base de datos.
          </p>

          <div class="mt-6 space-y-3 font-mono text-xs">
            <div class="p-3 bg-black/50 rounded-xl border border-white/10">
              <span class="text-rose-400 font-bold">routes/</span> <span class="text-slate-400">→ SvelteKit 2 Endpoints & Pages</span>
            </div>
            <div class="p-3 bg-black/50 rounded-xl border border-white/10">
              <span class="text-amber-400 font-bold">use-cases/</span> <span class="text-slate-400">→ Lógica pura de aplicación</span>
            </div>
            <div class="p-3 bg-black/50 rounded-xl border border-white/10">
              <span class="text-emerald-400 font-bold">ports/ & infrastructure/</span> <span class="text-slate-400">→ Repositorios, Drizzle ORM, SQLite</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 rounded-3xl">
          <h3 class="text-xl font-bold text-white mb-6">Stack Tecnológico Moderno</h3>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-white/5 rounded-xl border border-white/5">
              <span class="text-white font-bold block">SvelteKit 2 + Svelte 5</span>
              <span class="text-slate-500">Runes & Reatividade</span>
            </div>
            <div class="p-3 bg-white/5 rounded-xl border border-white/5">
              <span class="text-white font-bold block">TypeScript 6 + Vite 8</span>
              <span class="text-slate-500">Tipado estricto y bundling</span>
            </div>
            <div class="p-3 bg-white/5 rounded-xl border border-white/5">
              <span class="text-white font-bold block">Tailwind CSS v4</span>
              <span class="text-slate-500">Diseño at-mos configurado</span>
            </div>
            <div class="p-3 bg-white/5 rounded-xl border border-white/5">
              <span class="text-white font-bold block">Drizzle ORM + SQLite</span>
              <span class="text-slate-500">Persistencia veloz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 7: Visión Futura / Roadmap (Future Features) -->
  <section class="py-20 border-t border-white/10 bg-black/60">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">Future Roadmap</span>
        <h2 class="text-3xl font-black text-white mt-3">Hacia dónde evoluciona Nudo</h2>
        <p class="text-slate-400 text-xs mt-2">Funcionalidades planificadas para las siguientes iteraciones.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div class="p-6 rounded-2xl glass-card opacity-75 border-dashed border-white/20">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-white text-base">Gantt & Timeline</h4>
            <span class="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Coming Soon</span>
          </div>
          <p class="text-slate-400 text-xs mt-2">Líneas de tiempo interactivas para visualizar la evolución temporal de proyectos complejos.</p>
        </div>

        <div class="p-6 rounded-2xl glass-card opacity-75 border-dashed border-white/20">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-white text-base">Project Memory & AI Layer</h4>
            <span class="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Coming Soon</span>
          </div>
          <p class="text-slate-400 text-xs mt-2">Capa de inteligencia artificial para búsqueda semántica, resúmenes automáticos y consultas sobre el contexto del proyecto.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 8, 9 & 10: Open Source, Nudo Online & Donaciones -->
  <section id="donaciones" class="py-24 border-t border-white/10 bg-dot-pattern relative">
    <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
      <span class="text-xs font-bold uppercase tracking-widest text-rose-500">Comunidad & Desarrollo</span>
      <h2 class="text-4xl md:text-5xl font-black text-white mt-2">Nudo is open source and designed to grow</h2>
      <p class="text-slate-400 text-base max-w-2xl mx-auto mt-4 leading-relaxed">
        Puedes auto-hospedarlo libremente, contribuir al código o utilizar <strong>Nudo Online (Gratis)</strong>.
      </p>

      <div class="mt-12 glass-card p-8 md:p-12 rounded-3xl max-w-3xl mx-auto border-rose-500/20">
        <h3 class="text-2xl font-black text-white">Help keep Nudo alive</h3>
        <p class="text-slate-400 text-sm mt-3 leading-relaxed">
          Nudo es gratuito y de código abierto. Si te resulta útil en tu trabajo diario, puedes apoyar su desarrollo e infraestructura mediante donaciones voluntarias.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://github.com/sponsors" target="_blank" class="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl shadow-lg transition-all">
            Support Nudo (Sponsor)
          </a>
          <a href="https://github.com" target="_blank" class="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all">
            Contribuir en GitHub
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-white/10 py-12 bg-black/90">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
      <div class="flex items-center gap-3">
        <span class="text-white font-black text-lg">NUDO</span>
        <span>— Un proyecto. Un contexto.</span>
      </div>
      <p>© 2026 Nudo Workspace. Open Source Software.</p>
    </div>
  </footer>

</main>
