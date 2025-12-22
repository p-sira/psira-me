# Psira.me - Personal Website

A modern, responsive personal website built with Hugo and Tailwind CSS, featuring a dark/light theme toggle and interactive elements.

## Features

- **Modern Design**: Clean, responsive layout with Tailwind CSS and Catppuccin colors
- **Dark/Light Theme**: Toggle between Catppuccin Latte (light) and Mocha (dark) themes
- **Interactive Elements**: Animated popup cards and smooth transitions
- **Mobile-First**: Fully responsive design that works on all devices
- **Fast Loading**: Static site generation with Hugo
- **SEO Optimized**: Proper meta tags and structured data
- **Beautiful Colors**: Catppuccin color palette for consistent, modern aesthetics

## Technology Stack

- **Hugo**: Static site generator
- **Tailwind CSS**: Utility-first CSS framework with custom Catppuccin color integration
- **Catppuccin**: Beautiful color palette with Latte (light) and Mocha (dark) variants
- **JavaScript**: Vanilla JS for interactions and theme toggle
- **Responsive Design**: Mobile-first approach

## Project Structure

```
layouts/
├── _default/
│   ├── baseof.html      # Main layout template
│   ├── list.html        # List pages (posts, tags, etc.)
│   └── single.html      # Individual post pages
├── _partials/
│   ├── header.html      # Navigation and theme toggle
│   ├── footer.html      # Site footer
│   ├── home.html        # Home page content
│   ├── pagination.html  # Pagination controls
│   └── 404.html         # 404 error page
static/
├── js/
│   └── theme.js         # Theme toggle and interactions
└── images/              # Static assets
```

## Development

### Prerequisites

- Hugo (extended version recommended)
- Node.js (for Tailwind CSS if using local build)

### Running Locally

1. Clone the repository
2. Install Hugo (if not already installed)
3. Run the development server:
   ```bash
   hugo server --buildDrafts
   ```
4. Open http://localhost:1313 in your browser

### Building for Production

```bash
hugo --buildDrafts
```

## Customization

### Theme Colors

The site uses a semantic color system based on Catppuccin colors. The color scheme is defined in `static/css/color.css` and mapped to semantic variables:

**Light Theme (Latte)**:
- `--bg-primary`: Base background
- `--text-primary`: Primary text color  
- `--accent-primary`: Maroon accent color
- `--accent-secondary`: Lavender secondary accent
- `--accent-tertiary`: Blue tertiary accent

**Dark Theme (Mocha)**:
- `--bg-primary`: Dark base background
- `--text-primary`: Light text color
- `--accent-primary`: Red accent color
- `--accent-secondary`: Mauve secondary accent
- `--accent-tertiary`: Blue tertiary accent

**Tailwind Classes**:
- `bg-primary-bg`, `text-primary-text`, `text-primary-text-secondary`
- `bg-primary-accent`, `text-primary-accent`, `border-primary-border`
- `bg-primary-surface`, `hover:bg-primary-accent/10`

You can customize the color scheme by modifying the CSS variables in `static/css/color.css`.

### Content

- **Posts**: Add new posts in the `content/posts/` directory
- **Pages**: Add new pages in the `content/` directory
- **Navigation**: Update the menu in `hugo.toml`

## Features Implemented

✅ **Tailwind CSS Integration**: Replaced custom CSS with Tailwind utility classes
✅ **Semantic Color System**: Catppuccin-based color scheme with semantic variables
✅ **Theme Toggle**: Dark/light mode with persistent storage and smooth transitions
✅ **Header Component**: Responsive navigation with mobile menu
✅ **Footer Component**: Comprehensive site footer with links
✅ **JavaScript Organization**: Separated theme and interaction logic
✅ **Responsive Design**: Mobile-first approach with Tailwind
✅ **Modern UI**: Clean, professional design with smooth animations
✅ **Color Consistency**: Unified semantic color scheme across all components
✅ **Custom Color Scheme**: Site-specific color mapping in `color.css`
✅ **Picture Card Component**: Reusable card template for projects with images, tags, and links

## Picture Card Component

A reusable template for displaying project cards with images, titles, descriptions, tags, and link icons.

### Usage as Partial

In Hugo templates:

```go
{{ partial "picture_card" (dict 
  "image" "images/project-logo.svg"
  "title" "Project Title"
  "description" "Project description text"
  "tags" (slice "Tag1" "Tag2" "Tag3")
  "links" (dict 
    "github" "https://github.com/user/repo"
    "docs" "https://docs.example.com"
    "website" "https://example.com"
    "rust" "https://crates.io/crates/example"
  )
) }}
```

### Usage as Shortcode

In Markdown files:

```markdown
{{< picture_card 
  image="images/project-logo.svg"
  title="Project Title"
  description="Project description text"
  tags="Tag1,Tag2,Tag3"
  github="https://github.com/user/repo"
  docs="https://docs.example.com"
  website="https://example.com"
  rust="https://crates.io/crates/example"
>}}
```

### Supported Links

- `github`: GitHub repository link (displays GitHub icon)
- `docs`: Documentation link (displays "Docs" button)
- `website`: Website link (displays external link icon)
- `rust`: Rust crate link (displays Rust logo icon)

### Features

- **Responsive Design**: Adapts to mobile and desktop screens
- **Theme Support**: Works with both light and dark themes
- **Hover Effects**: Smooth transitions and elevation on hover
- **Flexible Tags**: Support for multiple tags with automatic wrapping
- **Icon Links**: Built-in icons for common platforms (GitHub, Rust, Docs, Website)
- **Customizable**: Easy to extend with additional link types

See `layouts/_partials/picture_card_example.html` for more usage examples.

## Research Data

This directory contains static research data that will appear in the research card after ORCID data.
The template reads from `data/research.toml`. This is a clean, structured approach for managing static research.

### File Structure

```toml
[[publications]]
title = "Publication Title"
subtitle = "Journal Name, Year"
description = "Description text"
borderColor = "accent-primary"
url = "https://example.com"  # Optional
index = 100  # Optional: lower = higher priority

[[conferences]]
title = "Conference Title"
# ... same fields as publications

[[services]]
title = "Service Title"
# ... same fields as publications
```

### Alternative: Markdown Files with Front Matter

If you prefer individual Markdown files for each work, you can create files in `content/research/` with front matter:

**Example: `content/research/my-publication.md`**

```yaml
---
type: publication  # or "conference" or "service"
title: "My Publication Title"
subtitle: "Journal Name, 2024"
description: "Publication description"
borderColor: "accent-primary"
url: "https://example.com"
index: 100
---
```

Then update the template to read from `content/research/` instead of `data/research.toml`.

## License

This project is open source and available under the [MIT License](LICENSE).
