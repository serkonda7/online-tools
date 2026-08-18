import { render } from 'solid-js/web'
import { App } from './App'
import '../styles/tokens.css'
import '../styles/base.css'
import '../styles/shell.css'

const savedTheme = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
document.documentElement.dataset.theme = savedTheme ?? (prefersDark ? 'dark' : 'light')

const root = document.querySelector<HTMLElement>('#app')
if (root === null) throw new Error('Missing #app root element.')

render(() => <App />, root)
