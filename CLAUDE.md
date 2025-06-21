# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog website (stenyan.dev) built with Astro framework. It's a static site generator with React islands for interactive components, using TypeScript throughout and Tailwind CSS for styling.

## Essential Commands

```bash
# Development
pnpm dev          # Start dev server on http://localhost:1234
pnpm build        # Type check and build for production
pnpm preview      # Preview production build locally

# Code Quality
pnpm prettier     # Format all files with Prettier

# Direct Astro CLI access
pnpm astro        # Run any Astro CLI command
```

## Architecture Overview

### Technology Stack
- **Framework**: Astro 5.x with MDX support
- **UI**: Hybrid approach - Astro components for static content, React for interactive features
- **Styling**: Tailwind CSS v3 with custom design tokens
- **Language**: TypeScript with strict mode
- **Content**: Markdown/MDX files managed by Astro Content Collections

### Key Architectural Patterns

1. **Hybrid Rendering**: Static HTML generation with selective React hydration
2. **Content Collections**: Type-safe content management with Zod schema validation
3. **Component Architecture**:
   - Astro components (`*.astro`) for static/server-rendered content
   - React components (`*.tsx`) in `src/components/ui/` for interactive UI
4. **Design System**: CSS custom properties for theming with light/dark mode support

### Project Structure

```
src/
├── components/
│   ├── *.astro         # Static components (Header, Footer, BlogCard, etc.)
│   └── ui/             # React components (shadcn/ui based)
├── content/
│   └── posts/          # Blog posts organized by date (YYYY/MM/DD/)
├── layouts/
│   └── Layout.astro    # Main layout wrapper
├── pages/
│   ├── posts/          # Dynamic post routes
│   ├── tags/           # Tag-based filtering
│   └── *.astro         # Static pages
├── lib/
│   └── utils.ts        # Utility functions (cn, formatDate, readingTime)
└── styles/
    └── global.css      # Global styles and CSS variables
```

### Content Management

Blog posts use Astro Content Collections with this schema:
- `title`: string (max 60 chars for Open Graph)
- `description`: string (max 155 chars for Open Graph)  
- `date`: Date object
- `image`: optional string
- `tags`: optional string array
- `draft`: optional boolean

Posts are stored in `src/content/posts/YYYY/MM/DD/post-slug.mdx`

### Styling Guidelines

- Use Tailwind utility classes
- Follow existing component patterns in `src/components/ui/`
- Dark mode uses CSS custom properties defined in `src/styles/global.css`
- Japanese typography uses custom font (UD明朝)

### Important Configurations

**astro.config.mjs**: Contains all Astro integrations and markdown processing plugins
- Syntax highlighting with `rehype-pretty-code`
- Math support with KaTeX
- External link handling
- oEmbed support for Twitter/YouTube/Hatena

**tailwind.config.ts**: Custom theme extensions and plugins
- Dark mode with selector strategy
- Typography plugin for prose content
- Custom color system using CSS variables

### Japanese Language Considerations

- Reading time calculation uses 500 characters/minute
- Date formatting uses Japanese locale
- Hatena Star integration for social features
- Custom font stack optimized for Japanese text

### Development Notes

- No testing framework is currently set up
- No ESLint configuration (only Prettier for formatting)
- Renovate bot handles dependency updates with automerge for minor versions
- Dev server runs on port 1234 (not the default 4321)
- The Astro dev toolbar is disabled