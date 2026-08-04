import { z as attr_class, A as store_get, B as slot, C as unsubscribe_stores, E as getContext } from './root-DRplYBsU.js';
import 'clsx';
import './state.svelte-BCcvaBut.js';

const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="standalone-layout svelte-12qhfyh"><nav class="standalone-nav svelte-12qhfyh"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg></div> <div><div class="font-bold text-gray-900 text-sm">TaskMaster</div> <div class="text-xs text-gray-500">Form &amp; Workflow Management</div></div></div> <div class="nav-links svelte-12qhfyh"><a href="/"${attr_class("svelte-12qhfyh", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/"
      })}>Dashboard</a> <a href="/forms"${attr_class("svelte-12qhfyh", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/forms")
      })}>Forms</a> <a href="/workflows"${attr_class("svelte-12qhfyh", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/workflows")
      })}>Workflows</a> <a href="/settings"${attr_class("svelte-12qhfyh", void 0, {
        "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/settings"
      })}>Settings</a></div></nav> <main class="standalone-main svelte-12qhfyh"><!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]--></main></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-CgsFtNyg.js.map
