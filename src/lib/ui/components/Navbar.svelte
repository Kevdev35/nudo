<script lang="ts">
    let { data }: { data: { user?: { name?: string | null } | null } } = $props()
</script>

<section>
    <div class="flex justify-between py-4 px-10 border-b-[.5px] border-[#e6e6e6] mb-2 items-center">

        <div class="flex items-center gap-3">
            <p class="text-3xl font-extrabold">NUDO</p>
            <h1 class="text-3xl font-bold text-[#767676]">Hola, {data.user?.name ?? 'de nuevo'}!</h1>
        </div>


        <div>
            <input class="py-3 px-6 rounded-3xl border-[.5px]" type="search" name="" id="" placeholder="buscar proyectos">
        </div>

        <div>
            <form action="?/logout" method="post">
                <button class="cursor-pointer items-center gap-2 flex">Cerrar session<i class="ri-login-box-line text-2xl"></i></button>
            </form>
        </div>
    </div>
</section>