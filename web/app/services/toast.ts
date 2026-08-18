import { createSignal } from 'solid-js'

const [toastMessage, setToastMessage] = createSignal<string | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

export { toastMessage }

export function showToast(message: string, duration = 1500): void {
	setToastMessage(message)
	clearTimeout(timer)
	timer = setTimeout(() => setToastMessage(null), duration)
}
