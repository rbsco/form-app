export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "forms/_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.C5g31O3D.js",app:"_app/immutable/entry/app.DRkFfDD-.js",imports:["_app/immutable/entry/start.C5g31O3D.js","_app/immutable/chunks/C6AZXytl.js","_app/immutable/chunks/DYgkZZK-.js","_app/immutable/chunks/BYiKvl1F.js","_app/immutable/entry/app.DRkFfDD-.js","_app/immutable/chunks/DYgkZZK-.js","_app/immutable/chunks/VuGQe1gd.js","_app/immutable/chunks/BDplMUi2.js","_app/immutable/chunks/DING6XBg.js","_app/immutable/chunks/BYiKvl1F.js","_app/immutable/chunks/B1HfYd0D.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/submit",
				pattern: /^\/api\/submit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/submit/_server.ts.js'))
			},
			{
				id: "/[orgCode]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"orgCode","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
