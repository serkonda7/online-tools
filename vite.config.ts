import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
	root: 'web',
	base: process.env['BASE_PATH'] ?? '/',
	plugins: [solid()],
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		target: 'esnext',
	},
})
