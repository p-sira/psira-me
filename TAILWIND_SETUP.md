# Tailwind CSS v4 Setup for Hugo

This project is configured to use Tailwind CSS v4 with Hugo.

## Setup

The following files have been configured:

- `tailwind.config.js` - Tailwind configuration with custom colors and fonts
- `postcss.config.js` - PostCSS configuration
- `assets/css/main.css` - Main CSS file with Tailwind imports and custom variables
- `layouts/_partials/css.html` - Hugo template for CSS processing

## Build Process

The build process is automated through npm/yarn scripts:

```bash
# Build CSS only
yarn build:css

# Build complete site
yarn build

# Development server
yarn dev

# Watch CSS changes
yarn watch:css
```

## Custom Colors

The setup includes custom color variables based on Catppuccin color scheme:

- `--bg-primary`, `--bg-secondary`, `--bg-tertiary` - Background colors
- `--text-primary`, `--text-secondary`, `--text-tertiary` - Text colors
- `--accent-primary`, `--accent-secondary`, `--accent-tertiary` - Accent colors
- `--surface`, `--border`, `--shadow` - UI element colors

These are available in your Tailwind config as `primary.*` classes.

## Usage

Use the custom colors in your HTML with the utility classes:

```html
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-primary-secondary">Secondary background</div>
<div class="bg-primary-tertiary">Tertiary background</div>

<!-- Text colors -->
<div class="text-primary">Primary text</div>
<div class="text-primary-secondary">Secondary text</div>
<div class="text-primary-tertiary">Tertiary text</div>

<!-- Accent colors -->
<div class="text-accent">Accent text</div>
<div class="bg-accent">Accent background</div>

<!-- Surface and border -->
<div class="bg-surface border-primary">Surface with border</div>
```

## Available Utility Classes

- **Background**: `.bg-primary`, `.bg-primary-secondary`, `.bg-primary-tertiary`, `.bg-surface`
- **Text**: `.text-primary`, `.text-primary-secondary`, `.text-primary-tertiary`
- **Accent**: `.text-accent`, `.text-accent-secondary`, `.text-accent-tertiary`, `.bg-accent`, `.bg-accent-secondary`, `.bg-accent-tertiary`
- **Border**: `.border-primary`

## Dark Mode Support

The color scheme automatically switches between light (Catppuccin Latte) and dark (Catppuccin Mocha) themes based on the `.dark` class on the HTML element.

### Theme Toggle

Your site includes a theme toggle button that:
- Switches between light and dark modes
- Remembers user preference in localStorage
- Respects system preference (auto mode)
- Updates the `.dark` class on the `<html>` element

### Usage:

```html
<!-- Light mode (default) -->
<div class="bg-primary text-primary">Light theme content</div>

<!-- Dark mode (when .dark class is present on <html>) -->
<html class="dark">
  <div class="bg-primary text-primary">Dark theme content</div>
</html>
```

The same utility classes work in both light and dark modes - the colors automatically switch based on the theme.

### How it works:

1. **Light mode**: Uses Catppuccin Latte colors (warm, light theme)
2. **Dark mode**: Uses Catppuccin Mocha colors (cool, dark theme)
3. **Automatic switching**: CSS variables change based on the presence of `.dark` class
4. **Smooth transitions**: `transition-colors duration-500` provides smooth color transitions

## Development

For development, run:

```bash
yarn dev
```

This will build the CSS and start the Hugo development server.

For CSS-only changes, you can run:

```bash
yarn watch:css
```

This will watch for changes in your CSS files and rebuild automatically.
