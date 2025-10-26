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
        'secondary-bg': 'var(--bg-secondary)',
        'tertiary-bg': 'var(--bg-tertiary)',
        'primary-text': 'var(--text-primary)',
        'secondary-text': 'var(--text-secondary)',
        'tertiary-text': 'var(--text-tertiary)',
        'primary-accent': 'var(--accent-primary)',
        'secondary-accent': 'var(--accent-secondary)',
        'tertiary-accent': 'var(--accent-tertiary)',
        'primary-surface': 'var(--surface)',
        'primary-border': 'var(--border)',
        'primary-shadow': 'var(--shadow)',
      },
    }
  },
  plugins: []
}

