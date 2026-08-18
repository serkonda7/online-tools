/**
 * Post-build: give every tool a real, crawlable URL.
 *
 * Vite emits one `dist/index.html`. This copies it to `dist/<id>/index.html`
 * with that tool's title, description and canonical baked in. Same bundle, so
 * there is no dev/prod drift — only the metadata differs, which is exactly the
 * part search engines read without running JavaScript.
 *
 * Set SITE_URL=https://example.com to emit absolute canonical URLs.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tools } from '../web/app/registry'

const SITE_TITLE = 'Online Tools'
const siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, '')

const dist = new URL('../dist/', import.meta.url).pathname
const shell = await readFile(join(dist, 'index.html'), 'utf8')

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

function renderPage(options: { title: string; description: string; path: string }): string {
	const canonical = `<link rel="canonical" href="${siteUrl}${options.path}" />`
	return shell
		.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(options.title)}</title>`)
		.replace(
			/(<meta name="description" content=")[^"]*(")/,
			`$1${escapeHtml(options.description)}$2`,
		)
		.replace('</head>', `  ${canonical}\n  </head>`)
}

// The home page gets its canonical the same way.
await writeFile(
	join(dist, 'index.html'),
	renderPage({
		title: SITE_TITLE,
		description: 'Small, fast developer utilities that run entirely in your browser.',
		path: '/',
	}),
)

for (const tool of tools) {
	const page = renderPage({
		title: `${tool.title} — ${SITE_TITLE}`,
		description: tool.description,
		path: `/${tool.id}`,
	})

	await mkdir(join(dist, tool.id), { recursive: true })
	await writeFile(join(dist, tool.id, 'index.html'), page)
	console.log(`emitted dist/${tool.id}/index.html`)
}
