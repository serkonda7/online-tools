import type { ToolManifest } from '../../app/types'

const manifest: ToolManifest = {
	id: 'unix-permissions',
	title: 'Unix Permissions Calculator',
	short: 'Permissions',
	description: 'Convert between octal and symbolic Unix file modes.',
	keywords: ['chmod', 'octal', 'symbolic', 'file mode', 'permissions', '644', '755'],
	category: 'unix',
	load: () => import('./index'),
}

export default manifest
