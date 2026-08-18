import { render } from 'solid-js/web';
import type { ToolContext } from '../../app/types';
import { Permissions } from './Permissions';
import './styles.css';

/** Solid's `render` already returns the dispose function the contract wants. */
export function mount(root: HTMLElement, ctx: ToolContext) {
  return render(() => <Permissions ctx={ctx} />, root);
}
