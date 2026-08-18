import type { ToolManifest } from './types';
import unixPermissions from '../tools/unix-permissions/manifest';

/**
 * Adding a tool: create `tools/<id>/` with a manifest, then add it here.
 * Only metadata is imported — implementations load on demand via `load()`.
 */
export const tools: ToolManifest[] = [unixPermissions];

export const toolsById = new Map(tools.map((tool) => [tool.id, tool]));
