import { For } from 'solid-js';
import { tools } from '../registry';
import { ToolLink } from './ToolLink';

export function ToolGrid() {
  return (
    <div class="home">
      <header class="intro">
        <h1>Online tools</h1>
        <p>Small, fast utilities that run entirely in your browser.</p>
      </header>

      <ul class="tool-grid">
        <For each={tools}>
          {(tool) => (
            <li>
              <ToolLink toolId={tool.id} class="tool-card">
                <span class="tool-card-category">{tool.category}</span>
                <span class="tool-card-title">{tool.title}</span>
                <span class="tool-card-description">{tool.description}</span>
              </ToolLink>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
