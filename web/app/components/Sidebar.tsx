import { createMemo, createSignal, For } from 'solid-js'
import { tools } from '../registry'
import type { ToolManifest } from '../types'
import { ToolLink } from './ToolLink'

function SidebarItem(props: { tool: ToolManifest; current: boolean }) {
	return (
		<li>
			<ToolLink toolId={props.tool.id} class="tool-link" current={props.current}>
				{props.tool.short}
			</ToolLink>
		</li>
	)
}

export function Sidebar(props: { activeId: () => string | null }) {
	const [query, setQuery] = createSignal('')

	const matches = createMemo(() => {
		const needle = query().trim().toLowerCase()
		if (needle === '') return tools
		return tools.filter((tool) =>
			[tool.title, tool.short, tool.description, ...tool.keywords].some((field) =>
				field.toLowerCase().includes(needle),
			),
		)
	})

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
							<SidebarItem tool={tool} current={props.activeId() === tool.id} />
						)}
					</For>
				</ul>
			</nav>
		</aside>
	)
}
