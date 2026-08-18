import type { JSX } from 'solid-js'
import { href, navigate } from '../router'

/** A real anchor, so middle-click, bookmarking and crawlers all work. */
export function ToolLink(props: {
	toolId: string | null
	class?: string
	current?: boolean
	children: JSX.Element
}) {
	return (
		<a
			class={props.class}
			href={href(props.toolId)}
			aria-current={props.current === true ? 'page' : undefined}
			onClick={(event) => {
				if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
				event.preventDefault()
				navigate(props.toolId)
			}}
		>
			{props.children}
		</a>
	)
}
