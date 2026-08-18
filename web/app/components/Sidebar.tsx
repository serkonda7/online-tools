import { IconMoon, IconSun } from '@tabler/icons-solidjs'
import { createMemo, createSignal, For } from 'solid-js'
import { tools } from '../registry'
import { ToolLink } from './ToolLink'

export function Sidebar(props: { activeId: () => string | null }) {
	const [query, setQuery] = createSignal('')
	const [dark, setDark] = createSignal(document.documentElement.dataset.theme === 'dark')

	const matches = createMemo(() => {
		const needle = query().trim().toLowerCase()
		if (needle === '') return tools
		return tools.filter((tool) =>
			[tool.title, tool.short, tool.description, ...tool.keywords].some((field) =>
				field.toLowerCase().includes(needle),
			),
		)
	})

	const toggleTheme = () => {
		const next = !dark()
		setDark(next)
		document.documentElement.dataset.theme = next ? 'dark' : 'light'
		localStorage.setItem('theme', next ? 'dark' : 'light')
	}

	return (
		<aside class="sidebar">
			<ToolLink toolId={null} class="brand">
				Online tools
			</ToolLink>

			<button class="theme-toggle" type="button" onClick={toggleTheme}>
				{dark() ? <IconSun aria-hidden="true" /> : <IconMoon aria-hidden="true" />}
				<span>{dark() ? 'Light mode' : 'Dark mode'}</span>
			</button>

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
	)
}
