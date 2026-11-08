<script lang="ts">
  import Logo from '@ui/components/Logo.svelte';

  import Navbar from '@ui/landingComponents/Navbar.svelte';
  import FloatBtn from '@components/FloatBtn.svelte';
  import Hero from '@ui/landingComponents/Hero.svelte'
  import Marquee from '@ui/landingComponents/Marquee.svelte';

  import Problema from '@ui/landingComponents/Problema.svelte';
  import Funciones from '@ui/landingComponents/Funciones.svelte';
  import ParaQuien from '@ui/landingComponents/ParaQuien.svelte';

  import Datos from '@ui/landingComponents/Datos.svelte'

  import Roadmap from '@ui/landingComponents/Roadmap.svelte';
  import Beta from '@ui/landingComponents/Beta.svelte';
  import Faq from '@ui/landingComponents/Faq.svelte';
  import Footer from '@ui/landingComponents/Footer.svelte';

</script>

<main class="landing bg-nudo-bg text-nudo-text-primary font-sans antialiased ">
  <Navbar />
	<Hero />
	<Marquee />
	<Problema />
	<Funciones />
	<ParaQuien />
	<Datos />
	<Beta />
	<Roadmap />
	<Faq />
  <Footer />
  <FloatBtn />
</main>