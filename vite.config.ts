import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			alias: {
				'@core': './src/lib/core',
				'@entities': './src/lib/core/entities',
				'@use-cases': './src/lib/core/use-cases',
				'@ports': './src/lib/core/ports',
				'@infrastructure': './src/lib/infrastructure',
				'@db': './src/lib/infrastructure/db',
				'@auth': './src/lib/infrastructure/auth',
				'@ui': './src/lib/ui',
				'@components': './src/lib/ui/components',
				'@layouts': './src/lib/ui/layouts',
				'@stores': './src/lib/ui/stores',
				'@config': './src/lib/config'
			},
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			typescript: {
				config: (config) => {
					config.include.push('../drizzle.config.ts');
				}
			}
		})
	]
});
