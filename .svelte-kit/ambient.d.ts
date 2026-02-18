
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const STARSHIP_SHELL: string;
	export const MANPATH: string;
	export const GHOSTTY_RESOURCES_DIR: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const ANDROID_HOME: string;
	export const SHELL: string;
	export const TERM: string;
	export const PROTO_HOME: string;
	export const HOMEBREW_REPOSITORY: string;
	export const CPPFLAGS: string;
	export const TMPDIR: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_config_local_prefix: string;
	export const NDK_HOME: string;
	export const ZVM_INSTALL: string;
	export const USER: string;
	export const COMMAND_MODE: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const PATH: string;
	export const npm_package_json: string;
	export const _: string;
	export const GHOSTTY_SHELL_FEATURES: string;
	export const __CFBundleIdentifier: string;
	export const npm_command: string;
	export const PWD: string;
	export const npm_lifecycle_event: string;
	export const npm_package_name: string;
	export const LANG: string;
	export const XPC_FLAGS: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const HOME: string;
	export const SHLVL: string;
	export const TERMINFO: string;
	export const HOMEBREW_PREFIX: string;
	export const STARSHIP_SESSION_KEY: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const XDG_DATA_DIRS: string;
	export const GHOSTTY_BIN_DIR: string;
	export const GOPATH: string;
	export const BUN_INSTALL: string;
	export const npm_config_user_agent: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const OSLogRateLimit: string;
	export const HF_TOKEN: string;
	export const FLYCTL_INSTALL: string;
	export const npm_node_execpath: string;
	export const COLORTERM: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_ANON_KEY: string;
	export const PUBLIC_APP_URL: string;
	export const PUBLIC_APP_NAME: string;
	export const PUBLIC_ANALYTICS_ENABLED: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		STARSHIP_SHELL: string;
		MANPATH: string;
		GHOSTTY_RESOURCES_DIR: string;
		TERM_PROGRAM: string;
		NODE: string;
		ANDROID_HOME: string;
		SHELL: string;
		TERM: string;
		PROTO_HOME: string;
		HOMEBREW_REPOSITORY: string;
		CPPFLAGS: string;
		TMPDIR: string;
		TERM_PROGRAM_VERSION: string;
		npm_config_local_prefix: string;
		NDK_HOME: string;
		ZVM_INSTALL: string;
		USER: string;
		COMMAND_MODE: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		PATH: string;
		npm_package_json: string;
		_: string;
		GHOSTTY_SHELL_FEATURES: string;
		__CFBundleIdentifier: string;
		npm_command: string;
		PWD: string;
		npm_lifecycle_event: string;
		npm_package_name: string;
		LANG: string;
		XPC_FLAGS: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		HOME: string;
		SHLVL: string;
		TERMINFO: string;
		HOMEBREW_PREFIX: string;
		STARSHIP_SESSION_KEY: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		XDG_DATA_DIRS: string;
		GHOSTTY_BIN_DIR: string;
		GOPATH: string;
		BUN_INSTALL: string;
		npm_config_user_agent: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		OSLogRateLimit: string;
		HF_TOKEN: string;
		FLYCTL_INSTALL: string;
		npm_node_execpath: string;
		COLORTERM: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_SUPABASE_URL: string;
		PUBLIC_SUPABASE_ANON_KEY: string;
		PUBLIC_APP_URL: string;
		PUBLIC_APP_NAME: string;
		PUBLIC_ANALYTICS_ENABLED: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
