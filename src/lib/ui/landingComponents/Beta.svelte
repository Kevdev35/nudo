<script lang="ts">
	import { reveal } from '@ui/landingComponents/logic/reveal';
</script>

<section class="mx-auto max-w-[1140px] px-8 py-5 max-[960px]:px-[22px]">
	<div
		use:reveal={{ variant: 'scale' }}
		class="flex items-center justify-between gap-8 rounded-3xl border border-accent-border px-11 py-10
		       bg-(image:--panel-gradient)
		       max-[960px]:flex-col max-[960px]:items-start max-[960px]:px-[26px] max-[960px]:py-[30px]"
	>
		<div>
			<span class="mb-3 inline-flex items-center text-[.8rem] font-bold tracking-[.08em] text-accent uppercase">
				<span class="mr-2 inline-block size-2 rounded-full bg-[#10b981] shadow-[0_0_0_4px_rgba(16,185,129,.2)]"></span>
				Beta abierta
			</span>
			<h2 class="max-w-[22ch] text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
				Nudo se está puliendo con uso real.
			</h2>
			<p class="mt-3 max-w-[54ch] text-muted">
				Estamos mejorando el producto con los comentarios de las personas que ya lo usan en sus proyectos. Entra,
				pruébalo y cuéntanos qué falta.
			</p>
		</div>

		<a
			href="/register"
			class="flex-none rounded-full bg-(--cta-bg) px-[26px] py-3.5 font-bold text-(color:--cta-fg) transition-[translate,background-color,box-shadow] duration-200
			       hover:-translate-y-0.5 hover:bg-(--cta-bg-hover) hover:shadow-(--cta-shadow-hover)"
		>
			Probar NUDO
		</a>
	</div>
</section>