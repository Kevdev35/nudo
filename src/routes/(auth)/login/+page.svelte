<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Button from '@components/Button.svelte';

	let { form }: { form: ActionData } = $props();

	// Estado reactivo de Svelte 5 para el submit
	let loading = $state(false);
</script>

<svelte:head>
	<title>Iniciar sesión — Nudo</title>
</svelte:head>

<section class="min-h-screen grid grid-cols-1 md:grid-cols-2 relative">
  <div
    class="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
  ></div>
	<!-- Logo NUDO en la esquina superior izquierda -->
	<div class="absolute top-6 left-8 z-10">
		<p class="text-4xl font-extrabold tracking-tight">NUDO</p>
	</div>

	<!-- Columna Formulario -->
	<div class="relative w-full flex flex-col justify-center items-center px-4 py-8">
		<div class="w-full bg-white max-w-md bg-surface border border-border-default rounded-3xl shadow-tokens-shadows-card p-8">
			<div class="text-center mb-8">
				<h1 class="text-4xl font-bold">Iniciar sesión</h1>
				<p class="text-lg text-[#767676] mt-2">Bienvenido de vuelta a NUDO</p>
			</div>

			{#if form?.error}
				<div class="mb-6 p-3 rounded-tokens-border-radius-md bg-status-error-bg text-white bg-[#830c1f] text-md rounded-3xl">
					<i class="ri-error-warning-line text-xl items-center"></i> {form.error}
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="flex flex-col gap-5"
			>
				<div class="flex flex-col gap-1.5">
					<label for="email" class="text-lg font-bold text-content-secondary">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						value=""
						placeholder="tu@email.com"
						class="w-full px-5 py-4 bg-surface-container border border-border-default rounded-3xl text-content-primary placeholder:text-content-muted focus:outline-none focus:shadow-tokens-shadows-input-focus transition-shadow"
					/>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="password" class="text-lg font-bold text-content-secondary">
						Contraseña
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						placeholder="••••••••"
						class="w-full px-5 py-4 bg-surface-container border border-border-default rounded-3xl text-content-primary placeholder:text-content-muted focus:outline-none focus:shadow-tokens-shadows-input-focus transition-shadow"
					/>
				</div>

				<Button type="submit" icon="ri-login-box-line" disabled={loading} class="text-center">
					{loading ? 'Ingresando...' : 'Iniciar sesión'}
				</Button>
			</form>

			<p class="text-center text-sm text-content-muted mt-6">
				¿No tienes una cuenta?
				<a href="/register" class="text-brand-primary hover:text-brand-primary-hover transition-colors hover:text-[#767676]">
					Regístrate
				</a>
			</p>
		</div>
	</div>

	<!-- Columna Background -->
	<div class="hidden md:flex items-center justify-center bg-surface-container border-l border-border-default">
		<!-- From Uiverse.io by SelfMadeSystem --> 
        <div class="container"></div>

	</div>
</section>

<style>
  /*
  More comprehensive version at shenanigans.shoghisimon.ca/collection/css-rain-bg/
   */

  .container::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image: radial-gradient(
      circle at 50% 50%,
      #0000 0,
      #0000 2px,
      hsl(0 0 4%) 2px
    );
    background-size: 8px 8px;
    --f: blur(1em) brightness(6);
    animation: hii 10s linear infinite;
  }

  @keyframes hii {
    0% {
      backdrop-filter: var(--f) hue-rotate(0deg);
    }
    to {
      backdrop-filter: var(--f) hue-rotate(360deg);
    }
  }

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    --c: #09f;
    background-color: #000;
    background-image: radial-gradient(4px 100px at 0px 235px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 235px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 117.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 252px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 252px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 126px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 150px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 150px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 75px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 253px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 253px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 126.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 204px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 204px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 102px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 134px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 134px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 67px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 179px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 179px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 89.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 299px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 299px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 149.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 215px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 215px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 107.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 281px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 281px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 140.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 158px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 158px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 79px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 210px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 210px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 105px, var(--c) 100%, #0000 150%);
    background-size:
      300px 235px,
      300px 235px,
      300px 235px,
      300px 252px,
      300px 252px,
      300px 252px,
      300px 150px,
      300px 150px,
      300px 150px,
      300px 253px,
      300px 253px,
      300px 253px,
      300px 204px,
      300px 204px,
      300px 204px,
      300px 134px,
      300px 134px,
      300px 134px,
      300px 179px,
      300px 179px,
      300px 179px,
      300px 299px,
      300px 299px,
      300px 299px,
      300px 215px,
      300px 215px,
      300px 215px,
      300px 281px,
      300px 281px,
      300px 281px,
      300px 158px,
      300px 158px,
      300px 158px,
      300px 210px,
      300px 210px,
      300px 210px;
    animation: hi 150s linear infinite;
  }

  @keyframes hi {
    0% {
      background-position:
        0px 220px,
        3px 220px,
        151.5px 337.5px,
        25px 24px,
        28px 24px,
        176.5px 150px,
        50px 16px,
        53px 16px,
        201.5px 91px,
        75px 224px,
        78px 224px,
        226.5px 350.5px,
        100px 19px,
        103px 19px,
        251.5px 121px,
        125px 120px,
        128px 120px,
        276.5px 187px,
        150px 31px,
        153px 31px,
        301.5px 120.5px,
        175px 235px,
        178px 235px,
        326.5px 384.5px,
        200px 121px,
        203px 121px,
        351.5px 228.5px,
        225px 224px,
        228px 224px,
        376.5px 364.5px,
        250px 26px,
        253px 26px,
        401.5px 105px,
        275px 75px,
        278px 75px,
        426.5px 180px;
    }

    to {
      background-position:
        0px 6800px,
        3px 6800px,
        151.5px 6917.5px,
        25px 13632px,
        28px 13632px,
        176.5px 13758px,
        50px 5416px,
        53px 5416px,
        201.5px 5491px,
        75px 17175px,
        78px 17175px,
        226.5px 17301.5px,
        100px 5119px,
        103px 5119px,
        251.5px 5221px,
        125px 8428px,
        128px 8428px,
        276.5px 8495px,
        150px 9876px,
        153px 9876px,
        301.5px 9965.5px,
        175px 13391px,
        178px 13391px,
        326.5px 13540.5px,
        200px 14741px,
        203px 14741px,
        351.5px 14848.5px,
        225px 18770px,
        228px 18770px,
        376.5px 18910.5px,
        250px 5082px,
        253px 5082px,
        401.5px 5161px,
        275px 6375px,
        278px 6375px,
        426.5px 6480px;
    }
  }
</style>
