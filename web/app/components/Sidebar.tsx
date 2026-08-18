import { For, createMemo, createSignal } from 'solid-js';
import { tools } from '../registry';
import { ToolLink } from './ToolLink';

export function Sidebar(props: { activeId: () => string | null }) {
  const [query, setQuery] = createSignal('');

  const matches = createMemo(() => {
    const needle = query().trim().toLowerCase();
    if (needle === '') return tools;
    return tools.filter((tool) =>
      [tool.title, tool.short, tool.description, ...tool.keywords].some((field) =>
        field.toLowerCase().includes(needle),
      ),
    );
  });

  return (
    <aside class="sidebar">
      <ToolLink toolId={null} class="brand">
        Online tools
      </ToolLink>

      <input
        class="search"
        type="search"
        placeholder="Search"
        aria-label="Search tools"
        spellcheck={false}
        autocomplete="off"
        value={query()}
        onInput={(event) => setQuery(event.currentTarget.value)}
      />

      <nav aria-label="Tools">
        <ul class="tool-list">
          <For each={matches()} fallback={<li class="tool-list-empty">No matches</li>}>
            {(tool) => (
              <li>
                <ToolLink
                  toolId={tool.id}
                  class="tool-link"
                  current={props.activeId() === tool.id}
                >
                  {tool.short}
                </ToolLink>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </aside>
  );
}
