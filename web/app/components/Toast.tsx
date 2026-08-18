import { toastMessage } from '../services/toast'

export function Toast() {
	return (
		<div
			class="toast"
			classList={{ visible: toastMessage() !== null }}
			role="status"
			aria-live="polite"
		>
			{toastMessage()}
		</div>
	)
}
