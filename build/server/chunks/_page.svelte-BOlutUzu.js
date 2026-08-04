import { G as head, H as attr, I as ssr_context, J as sanitize_props, K as spread_props, L as rest_props, M as fallback, N as attributes, O as clsx, P as ensure_array_like, Q as element, B as slot, R as bind_props, F as escape_html } from './root-DRplYBsU.js';
import 'clsx';
import './state.svelte-BCcvaBut.js';
import { a as generateSessionId } from './utils2-2igNjV2x.js';
import { w as writable, d as derived } from './index-DNLACmyX.js';
import '@supabase/supabase-js';
import 'zod';

function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
const formState = writable({
  config: null,
  data: {},
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  sessionId: generateSessionId(),
  lastSaved: null
});
const sessionStartTime = writable(Date.now());
derived(
  sessionStartTime,
  ($startTime) => Date.now() - $startTime
);
derived(
  formState,
  ($formState) => Object.keys($formState.errors).length === 0
);
derived(
  formState,
  ($formState) => {
    if (!$formState.config) return 0;
    const requiredFields = $formState.config.fields.filter((field) => field.required);
    const filledRequiredFields = requiredFields.filter((field) => {
      const value = $formState.data[field.name];
      return value && value.toString().trim() !== "";
    });
    return requiredFields.length > 0 ? filledRequiredFields.length / requiredFields.length * 100 : 0;
  }
);
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...!hasA11yProp($$restProps) ? { "aria-hidden": "true" } : void 0,
        ...$$restProps,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
function Bug($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 20v-9" }],
    [
      "path",
      {
        "d": "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"
      }
    ],
    ["path", { "d": "M14.12 3.88 16 2" }],
    ["path", { "d": "M21 21a4 4 0 0 0-3.81-4" }],
    ["path", { "d": "M21 5a4 4 0 0 1-3.55 3.97" }],
    ["path", { "d": "M22 13h-4" }],
    ["path", { "d": "M3 21a4 4 0 0 1 3.81-4" }],
    ["path", { "d": "M3 5a4 4 0 0 0 3.55 3.97" }],
    ["path", { "d": "M6 13H2" }],
    ["path", { "d": "m8 2 1.88 1.88" }],
    ["path", { "d": "M9 7.13V6a3 3 0 1 1 6 0v1.13" }]
  ];
  Icon($$renderer, spread_props([
    { name: "bug" },
    $$sanitized_props,
    {
      /**
       * @component @name Bug
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMjB2LTkiIC8+CiAgPHBhdGggZD0iTTE0IDdhNCA0IDAgMCAxIDQgNHYzYTYgNiAwIDAgMS0xMiAwdi0zYTQgNCAwIDAgMSA0LTR6IiAvPgogIDxwYXRoIGQ9Ik0xNC4xMiAzLjg4IDE2IDIiIC8+CiAgPHBhdGggZD0iTTIxIDIxYTQgNCAwIDAgMC0zLjgxLTQiIC8+CiAgPHBhdGggZD0iTTIxIDVhNCA0IDAgMCAxLTMuNTUgMy45NyIgLz4KICA8cGF0aCBkPSJNMjIgMTNoLTQiIC8+CiAgPHBhdGggZD0iTTMgMjFhNCA0IDAgMCAxIDMuODEtNCIgLz4KICA8cGF0aCBkPSJNMyA1YTQgNCAwIDAgMCAzLjU1IDMuOTciIC8+CiAgPHBhdGggZD0iTTYgMTNIMiIgLz4KICA8cGF0aCBkPSJtOCAyIDEuODggMS44OCIgLz4KICA8cGF0aCBkPSJNOSA3LjEzVjZhMyAzIDAgMSAxIDYgMHYxLjEzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/bug
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Loader_circle($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]];
  Icon($$renderer, spread_props([
    { name: "loader-circle" },
    $$sanitized_props,
    {
      /**
       * @component @name LoaderCircle
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJhOSA5IDAgMSAxLTYuMjE5LTguNTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/loader-circle
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let debugLoading = false;
    onDestroy(() => {
    });
    head("1gbfdvg", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>
    ${escape_html("Loading...")}
  </title>`);
      });
      $$renderer3.push(`<meta name="description" content="Submit a work order request"/>`);
    });
    $$renderer2.push(`<div class="min-h-screen" style="background-color: var(--color-background, #ffffff);">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="min-h-screen flex items-center justify-center"><div class="text-center">`);
      Loader_circle($$renderer2, {
        class: "w-12 h-12 animate-spin mx-auto mb-4",
        style: "color: var(--color-primary, #3b82f6);"
      });
      $$renderer2.push(`<!----> <p class="text-lg font-medium" style="color: var(--color-text, #1f2937);">Loading form...</p> <button${attr("disabled", debugLoading, true)} class="fixed bottom-4 right-4 text-white p-3 rounded-full shadow-lg transition-colors disabled:opacity-50 z-50" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background-color: #ef4444; color: white; border: none; cursor: pointer; padding: 12px; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" title="Debug Form Issues">`);
      {
        $$renderer2.push("<!--[!-->");
        Bug($$renderer2, { class: "w-5 h-5" });
      }
      $$renderer2.push(`<!--]--></button></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BOlutUzu.js.map
