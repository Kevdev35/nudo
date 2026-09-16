<!-- src/lib/components/Logo.svelte -->
<script lang="ts">
	interface Props {
		showBadge?: boolean;
		class?: string;
	}

	let { showBadge = true, class: className = '' }: Props = $props();
</script>

<a
	href="/"
	class="inline-flex items-center gap-3.5 select-none group focus:outline-none {className}"
>
	<!-- Isotipo NUDO Ampliado -->
	<div
		class="flex items-center justify-center w-11 h-11 rounded-xl bg-[#16161A] border border-white/10 group-hover:border-white/20 transition-colors shadow-sm"
	>
		<svg
			width="28"
			height="28"
			viewBox="0 0 64 64"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- Columna Izquierda (Grosor aumentado a 5px) -->
			<path d="M 19 46 V 18" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" />

			<!-- Diagonal de Conexión en Ángulo Preciso -->
			<path
				d="M 19 18 L 45 46"
				stroke="#FFFFFF"
				stroke-opacity="0.4"
				stroke-width="10"
				stroke-linecap="round"
			/>

			<!-- Columna Derecha con Acento Crimson Rose -->
			<path d="M 45 46 V 18" stroke="#E11D48" stroke-width="10" stroke-linecap="round" />

			<!-- Nodo Central Ampliado (Radio aumentado a 4.5px) -->
			<circle cx="32" cy="32" r="6" fill="#FFFFFF" />
		</svg>
	</div>

	<!-- Identidad Tipográfica -->
	<div class="flex items-center gap-3">
		<span class="text-3xl font-black tracking-[0.22em] text-black uppercase ">
			NUDO
		</span>

		{#if showBadge}
			<span class="h-4 w-[1px] bg-white/15"></span>
			<span class="text-[10px] font-medium tracking-widest text-slate-400 uppercase font-mono">
				WORKSPACE
			</span>
		{/if}
	</div>
</a>