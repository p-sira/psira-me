/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./static/**/*.html",
    "./public/**/*.html",
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Noto Sans', 'sans-serif'],
        'serif': ['Lora', 'serif'],
        'display': ['Alata', 'sans-serif'],
        'thai': ['Noto Sans Thai', 'sans-serif'],
      },
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
        'border-border': 'var(--border)',
        'primary-shadow': 'var(--shadow)',
      },
    }
  },
  plugins: []
}

