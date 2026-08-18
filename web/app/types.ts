import type { Accessor } from 'solid-js';

export type ToolCategory = 'unix' | 'text' | 'encoding';

/**
 * Everything the shell hands a tool. Tools talk to the outside world only
 * through this object — never through globals or DOM outside their own root.
 */
export interface ToolContext {
  toast(message: string): void;
  copy(value: string): Promise<boolean>;
  /** Current query string, for tools that keep shareable state in the URL. */
  params: Accessor<URLSearchParams>;
  /** Merge into the query string. A `null` value removes the key. */
  setParams(patch: Record<string, string | null>): void;
  navigate(toolId: string | null): void;
}

/**
 * The tool contract. `mount` renders into `root` and returns a cleanup
 * function that must tear down every listener, timer and effect it created.
 * Solid's `render()` already returns exactly this, so a Solid tool is a
 * one-liner — but a tool is free to be plain DOM, or use another framework.
 */
export interface ToolModule {
  mount(root: HTMLElement, ctx: ToolContext): () => void;
}

/**
 * Static metadata for a tool. This is the single source of truth behind the
 * sidebar, the grid, search, routing and per-page <title>/description, so it
 * is imported eagerly. The implementation behind `load` stays lazy.
 */
export interface ToolManifest {
  id: string;
  title: string;
  short: string;
  description: string;
  keywords: string[];
  category: ToolCategory;
  load(): Promise<ToolModule>;
}
