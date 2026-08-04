import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// Use node adapter for Fly.io deployment
		adapter: adapter({
			// Set output port via environment variable
			port: process.env.PORT || 3177
		}),
		// Deploy under /forms subpath
		paths: {
			base: '/forms'
		},
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
