import * as server from '../entries/pages/_orgCode_/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_orgCode_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[orgCode]/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.Cdj0KZFA.js","_app/immutable/chunks/BDplMUi2.js","_app/immutable/chunks/DYgkZZK-.js","_app/immutable/chunks/DaX2u9ql.js","_app/immutable/chunks/VuGQe1gd.js","_app/immutable/chunks/DING6XBg.js","_app/immutable/chunks/BYiKvl1F.js","_app/immutable/chunks/BBIWXDAu.js","_app/immutable/chunks/C6AZXytl.js","_app/immutable/chunks/B1HfYd0D.js"];
export const stylesheets = [];
export const fonts = [];
