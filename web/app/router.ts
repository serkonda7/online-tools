import { createSignal } from 'solid-js';

const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export interface Route {
  /** `null` is the home grid. */
  toolId: string | null;
  params: URLSearchParams;
}

function readRoute(): Route {
  const path = window.location.pathname.slice(base.length).replace(/^\/+|\/+$/g, '');
  return {
    toolId: path === '' ? null : path,
    params: new URLSearchParams(window.location.search),
  };
}

// `equals: false` so query-string edits notify subscribers even though the
// route object shape is unchanged.
const [route, setRoute] = createSignal<Route>(readRoute(), { equals: false });

window.addEventListener('popstate', () => setRoute(readRoute()));

export { route };

export function href(toolId: string | null): string {
  return `${base}/${toolId ?? ''}`;
}

export function navigate(toolId: string | null): void {
  const target = href(toolId);
  if (target === window.location.pathname && window.location.search === '') return;
  // Switching tools drops the previous tool's query state.
  window.history.pushState({}, '', target);
  setRoute(readRoute());
}

export function setParams(patch: Record<string, string | null>): void {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }

  const search = params.toString();
  window.history.replaceState({}, '', `${window.location.pathname}${search === '' ? '' : `?${search}`}`);
  setRoute(readRoute());
}
