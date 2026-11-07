<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { reveal } from '@ui/landingComponents/logic/reveal';

	interface DataPoint {
		icon: string;
		title: string;
		text: string;
		soon?: boolean;
	}

	const points: DataPoint[] = [
		{
			icon: 'ri-lock-line',
			title: 'Tus proyectos son privados',
			text: 'Cada proyecto pertenece a tu cuenta. Solo tú puedes verlo.'
		},
		{
			icon: 'ri-forbid-2-line',
			title: 'Tu información está protegida',
			text: 'Nunca vendemos tu información personal ni la usamos para publicidad.'
		},
		{
			icon: 'ri-history-line',
			title: 'Tus documentos conservan su historial',
			text: 'Cada edición de un documento Markdown guarda la versión anterior, para que no pierdas cambios.'
		},
		{
			icon: 'ri-download-2-line',
			title: 'Exporta tus datos',
			text: 'Estamos construyendo la opción de descargar tu información personal cuando quieras.',
			soon: true
		}
	];
</script>

<section id="datos" class="mx-auto max-w-[1140px] px-8 pt-5 pb-25 max-[960px]:px-[22px] max-[960px]:pb-18">
	<SectionHeader
		eyebrow="Tus datos"
		title="Tu información es tuya."
		sub="Lo que guardas en Nudo es tuyo, y así lo tratamos."
	/>

	<div class="mt-12 grid grid-cols-2 gap-5 max-[960px]:grid-cols-1">
		{#each points as p, i (p.title)}
			<article
				use:reveal={{ delay: (i % 2) * 100 }}
				class="flex items-start gap-[18px] rounded-[18px] border border-(--card-border) bg-(--card-bg) px-6 py-[26px]
				       shadow-(--card-shadow-soft) transition-[translate,box-shadow,border-color] duration-250
				       hover:-translate-y-[3px] hover:border-(--accent-border) hover:shadow-(--card-shadow-accent)"
			>
				<div class="grid size-11 flex-none place-items-center rounded-xl border border-accent-border bg-accent-light text-accent">
					<i class="{p.icon} text-[21px]"></i>
				</div>
				<div>
					<h3 class="flex flex-wrap items-center gap-2.5 text-[1.05rem] font-bold">
						{p.title}
						{#if p.soon}
							<span class="rounded-full border border-accent-border bg-accent-light px-[9px] py-[3px] text-[.66rem] font-bold text-accent">
								Próximamente
							</span>
						{/if}
					</h3>
					<p class="mt-1.5 text-[.93rem] leading-[1.55] text-muted">{p.text}</p>
				</div>
			</article>
		{/each}
	</div>

	<p use:reveal class="mt-[26px] text-[.95rem] text-muted">
		Más detalle en el
		<a href="/privacy" class="border-b border-current font-semibold text-accent">aviso de privacidad</a>.
	</p>
</section>