import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import entryShakingPlugin from 'vite-plugin-entry-shaking'
import solid from 'vite-plugin-solid'

const tablerIconsEntry = resolve(
	import.meta.dirname,
	'node_modules/@tabler/icons-solidjs/dist/source/icons/index.js',
)

const commit =
	process.env.COMMIT_SHA?.slice(0, 7) ??
	process.env.GITHUB_SHA?.slice(0, 7) ??
	execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim()
const buildDate = process.env.BUILD_DATE ?? new Date().toISOString()

export default defineConfig({
	root: 'web',
	base: process.env.BASE_PATH ?? '/',
	define: {
		'import.meta.env.VITE_COMMIT': JSON.stringify(commit),
		'import.meta.env.VITE_BUILD_DATE': JSON.stringify(buildDate),
	},
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
