import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	base: '/forms',
	server: {
		host: true,
		port: 5173
	},
	define: {
		global: 'globalThis'
	}
});
