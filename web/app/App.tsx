import { createEffect, Show } from 'solid-js'
import { Sidebar } from './components/Sidebar'
import { Toast } from './components/Toast'
import { ToolGrid } from './components/ToolGrid'
import { ToolHost } from './components/ToolHost'
import { toolsById } from './registry'
import { navigate, route, setParams } from './router'
import { copyValue } from './services/clipboard'
import { showToast } from './services/toast'
import type { ToolContext } from './types'

const SITE_TITLE = 'Online Tools'
const SITE_DESCRIPTION = 'Small, fast developer utilities that run entirely in your browser.'
const COMMIT = import.meta.env.VITE_COMMIT
const BUILD_DATE = import.meta.env.VITE_BUILD_DATE
const COMMIT_URL = `https://github.com/serkonda7/online-tools/commit/${COMMIT}`

function NotFound(props: { toolId: string }) {
	return (
		<div class="notice">
			<h1>Tool not found</h1>
			<p>
				Nothing is registered at <code>{props.toolId}</code>.
			</p>
			<button class="reset" type="button" onClick={() => navigate(null)}>
				Back to all tools
			</button>
		</div>
	)
}

export function App() {
	const active = () => {
		const id = route().toolId
		return id === null ? null : (toolsById.get(id) ?? null)
	}

	// Built once and shared by every tool — the shell's whole public surface.
	const ctx: ToolContext = {
		toast: showToast,
		copy: copyValue,
		params: () => route().params,
		setParams,
		navigate,
	}

	createEffect(() => {
		const tool = active()
		document.title = tool === null ? SITE_TITLE : `${tool.title} — ${SITE_TITLE}`
		document
			.querySelector('meta[name="description"]')
			?.setAttribute('content', tool === null ? SITE_DESCRIPTION : tool.description)
	})

	return (
		<div class="layout">
			<Sidebar activeId={() => active()?.id ?? null} />
			<main class="content">
				<Show
					when={active()}
					keyed
					fallback={
						<Show when={route().toolId} keyed fallback={<ToolGrid />}>
							{(toolId) => <NotFound toolId={toolId} />}
						</Show>
					}
				>
					{(tool) => <ToolHost manifest={tool} ctx={ctx} />}
				</Show>
				<footer class="build-info">
					<span>Last updated: {BUILD_DATE}, Commit: </span>
					<a href={COMMIT_URL}>{COMMIT}</a>
				</footer>
			</main>
			<Toast />
		</div>
	)
}
