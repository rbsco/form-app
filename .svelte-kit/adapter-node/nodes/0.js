import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CjDuvXCe.js","_app/immutable/chunks/BDplMUi2.js","_app/immutable/chunks/DYgkZZK-.js","_app/immutable/chunks/DaX2u9ql.js","_app/immutable/chunks/DING6XBg.js","_app/immutable/chunks/BYiKvl1F.js","_app/immutable/chunks/BBIWXDAu.js","_app/immutable/chunks/C6AZXytl.js"];
export const stylesheets = ["_app/immutable/assets/0.DehN7MuX.css"];
export const fonts = [];
