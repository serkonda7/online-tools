import { IconCopy } from '@tabler/icons-solidjs'
import { createSignal, onCleanup } from 'solid-js'
import type { ToolContext } from '../app/types'

/** Shared across tools: copy a value, confirm it, fall back gracefully. */
export function CopyButton(props: {
	ctx: ToolContext
	value: string
	/** Used in the accessible name, e.g. "octal mode". */
	label: string
	/** Called when copying failed, so the tool can select the text instead. */
	onFailed?: () => void
}) {
	const [copied, setCopied] = createSignal(false)
	const [busy, setBusy] = createSignal(false)
	let timer: ReturnType<typeof setTimeout> | undefined

	onCleanup(() => clearTimeout(timer))

	async function handleClick() {
		const value = props.value
		setBusy(true)
		const ok = await props.ctx.copy(value)
		setBusy(false)

		if (!ok) {
			props.ctx.toast('Copy unavailable. Select the value to copy it manually.')
			props.onFailed?.()
			return
		}

		setCopied(true)
		props.ctx.toast(`Copied ${value}`)
		clearTimeout(timer)
		timer = setTimeout(() => setCopied(false), 1500)
	}

	return (
		<button
			class="copy"
			classList={{ copied: copied() }}
			type="button"
			disabled={busy()}
			aria-busy={busy()}
			title={`Copy ${props.label}`}
			aria-label={`${copied() ? 'Copied' : 'Copy'} ${props.label}`}
			onClick={handleClick}
		>
			<IconCopy class="copy-icon" aria-hidden="true" />
			<span>{copied() ? 'copied' : 'copy'}</span>
		</button>
	)
}
