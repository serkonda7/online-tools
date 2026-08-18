export async function copyValue(value: string): Promise<boolean> {
	if (navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(value)
			return true
		} catch {
			// Use the legacy path below when clipboard permissions are unavailable.
		}
	}

	const fallback = document.createElement('textarea')
	fallback.value = value
	fallback.setAttribute('readonly', '')
	fallback.style.position = 'fixed'
	fallback.style.opacity = '0'
	document.body.appendChild(fallback)
	fallback.select()
	const copied = document.execCommand('copy')
	fallback.remove()
	return copied
}
