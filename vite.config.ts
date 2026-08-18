import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import entryShakingPlugin from 'vite-plugin-entry-shaking'
import solid from 'vite-plugin-solid'

const tablerIconsEntry = resolve(
	import.meta.dirname,
	'node_modules/@tabler/icons-solidjs/dist/source/icons/index.js',
)

export default defineConfig({
	root: 'web',
	base: process.env.BASE_PATH ?? '/',
	plugins: [entryShakingPlugin({ targets: [tablerIconsEntry] }), solid()],
	resolve: {
		alias: {
			'@tabler/icons-solidjs': tablerIconsEntry,
		},
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		target: 'esnext',
		modulePreload: { polyfill: false },
	},
})
