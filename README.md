# rivaas.dev

Official landing page for Rivaas - High-performance API framework for Go

🌐 **Live Site**: [rivaas.dev](https://rivaas.dev)

## Development

### Prerequisites

- Node.js 20+ (see `.nvmrc`)

### Setup

```bash
# Install dependencies
npm install

# Build once
npm run build

# Development with watch mode + local server
npm run dev
```

The site will be available at `http://localhost:8080`

### Build Commands

- `npm run build` - Build everything (CSS, JS, HTML, static files)
- `npm run build:tailwind` - Build Tailwind CSS
- `npm run build:scss` - Compile SCSS to CSS
- `npm run build:js` - Minify JavaScript with Terser
- `npm run build:html` - Copy HTML and favicon to dist
- `npm run build:static` - Copy SEO files (robots.txt, sitemaps) to dist
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run serve` - Serve `dist/` folder on port 8080 (uses http-server)
- `npm run dev` - Build + watch + serve (recommended for development)
- `npm run clean` - Clean build output

## Project Structure

```
rivaas.dev/
├── src/
│   ├── index.html           # Main HTML file
│   ├── favicon.svg          # Site favicon
│   ├── robots.txt           # Search engine directives
│   ├── sitemap.xml          # Sitemap index
│   ├── sitemap-main.xml     # Landing page sitemap
│   ├── scripts/
│   │   └── main.js          # JavaScript source
│   └── styles/
│       ├── main.scss        # Main SCSS entry point
│       ├── tailwind.css     # Tailwind configuration
│       ├── _variables.scss  # Color palette & config
│       ├── _base.scss       # Base styles
│       ├── _animations.scss # Animations & effects
│       └── _components.scss # Component styles
├── dist/                    # Build output (deployed to CF Pages)
├── package.json
├── .gitignore
├── .nvmrc
└── README.md
```

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.
