/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./content/**/*.html",
    "./static/**/*.html",
    "./assets/**/*.css",
    "./assets/**/*.js"
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        'primary-bg': 'var(--bg-primary)',
        'primary-bg-secondary': 'var(--bg-secondary)',
        'primary-bg-tertiary': 'var(--bg-tertiary)',
        'primary-text': 'var(--text-primary)',
        'primary-text-secondary': 'var(--text-secondary)',
        'primary-text-tertiary': 'var(--text-tertiary)',
        'primary-accent': 'var(--accent-primary)',
        'primary-accent-secondary': 'var(--accent-secondary)',
        'primary-accent-tertiary': 'var(--accent-tertiary)',
        'primary-surface': 'var(--surface)',
        'primary-border': 'var(--border)',
        'primary-shadow': 'var(--shadow)',
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
        serif: ['Lora', 'ui-serif', 'Georgia'],
        display: ['Alata', 'sans-serif'],
      },
    }
  },
  plugins: []
}

