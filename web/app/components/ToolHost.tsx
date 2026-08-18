import { createEffect, onCleanup } from 'solid-js';
import type { ToolContext, ToolManifest } from '../types';

/**
 * The single place the shell touches a tool: load the chunk, hand it a root
 * element plus the context, and dispose it on the way out. `data-tool` is what
 * each tool's stylesheet scopes itself under.
 */
export function ToolHost(props: { manifest: ToolManifest; ctx: ToolContext }) {
  let root!: HTMLDivElement;

  createEffect(() => {
    const manifest = props.manifest;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    void manifest.load().then((module) => {
      if (cancelled) return;
      dispose = module.mount(root, props.ctx);
    });

    onCleanup(() => {
      cancelled = true;
      dispose?.();
      root.replaceChildren();
    });
  });

  return <div class="tool-root" data-tool={props.manifest.id} ref={root} />;
}
