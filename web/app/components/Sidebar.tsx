import { IconMoon, IconSun } from '@tabler/icons-solidjs'
import { createMemo, createSignal, For, onCleanup, onMount } from 'solid-js'
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
	const [dark, setDark] = createSignal(document.documentElement.dataset.theme === 'dark')
	let searchInput: HTMLInputElement | undefined

	onMount(() => {
		const handleShortcut = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key.toLowerCase() === 'k') {
				event.preventDefault()
				searchInput?.focus()
				searchInput?.select()
			}
		}

		document.addEventListener('keydown', handleShortcut)
		onCleanup(() => document.removeEventListener('keydown', handleShortcut))
	})

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

			<div class="search-control">
				<input
					ref={searchInput}
					class="search"
					type="search"
					placeholder="Search"
					aria-label="Search tools"
					aria-keyshortcuts="Control+K"
					spellcheck={false}
					autocomplete="off"
					value={query()}
					onInput={(event) => setQuery(event.currentTarget.value)}
				/>
				<kbd>Ctrl K</kbd>
			</div>

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
