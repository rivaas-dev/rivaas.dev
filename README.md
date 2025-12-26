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

- `npm run build` - Build SCSS and copy HTML to `dist/`
- `npm run build:scss` - Compile SCSS to CSS
- `npm run build:html` - Copy HTML to dist
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run serve` - Serve `dist/` folder on port 8080 (uses http-server)
- `npm run dev` - Build + watch + serve (recommended for development)
- `npm run clean` - Clean build output

## Project Structure

```
rivaas.dev/
├── src/
│   ├── index.html          # Main HTML file
│   └── styles/
│       ├── main.scss       # Main SCSS entry point
│       ├── _variables.scss # Color palette & config
│       ├── _base.scss      # Base styles
│       ├── _animations.scss # Animations & effects
│       └── _components.scss # Component styles
├── dist/                   # Build output (deployed to CF Pages)
│   ├── index.html
│   └── styles/
│       └── main.css        # Compiled & minified CSS (5.3KB)
├── package.json
├── .gitignore
├── .nvmrc
└── README.md
```

## Deployment

### Cloudflare Pages

This site is automatically deployed to Cloudflare Pages on every push to `main`.

**Build Configuration:**
- **Framework preset**: None
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)
- **Node version**: `20`

#### Manual Deployment

```bash
# Build the site
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=rivaas-website
```

### Environment Variables

No environment variables needed - this is a static site.

## Technology Stack

- **HTML5** - Semantic markup
- **SCSS** - Modular styling with variables and modern @use syntax
- **Tailwind CSS** (CDN) - Utility-first CSS framework
- **Google Fonts** - Inter (UI) & JetBrains Mono (code)
- **Vanilla JavaScript** - No framework dependencies

## Performance

- ✅ Minimal dependencies (CDN links only)
- ✅ Compressed CSS (5.3KB)
- ✅ Optimized for Core Web Vitals
- ✅ Mobile-responsive design
- ✅ Fast loading times

## Design System

### Colors (Alpine Mountains Theme)

The color palette is inspired by the Iranian mountain landscapes where wild rhubarb grows:

- **Night**: `#0F1413` - Deep mountain night
- **Alpine**: `#1E6F5C` - Mountain green (primary)
- **Alpine Light**: `#3FAF98` - Fresh mountain air
- **Basalt**: `#2E3B39` - Mountain stone
- **Fog**: `#8A9A95` - Mountain mist

### Typography

- **Display/Body**: Inter (300, 400, 500, 600, 700)
- **Code**: JetBrains Mono (400, 500)

## Local Development Tips

### Quick Preview

```bash
# Just want to see the site quickly?
npm run build && npm run serve
```

### Watch Mode

```bash
# Auto-rebuild on changes
npm run dev
```

This will:
1. Build the site once
2. Watch for file changes
3. Rebuild automatically
4. Serve on `http://localhost:8080`

## Contributing

Contributions are welcome! Please see the [main repository](https://github.com/rivaas-dev/rivaas) for contribution guidelines.

### Making Changes

1. Edit files in `src/`
2. Run `npm run dev` to see changes live
3. Commit your changes
4. Push to GitHub (CF Pages will auto-deploy)

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

---

Part of the [Rivaas](https://github.com/rivaas-dev/rivaas) web framework ecosystem.

- **Framework**: [github.com/rivaas-dev/rivaas](https://github.com/rivaas-dev/rivaas)
- **Documentation**: [github.com/rivaas-dev/docs](https://github.com/rivaas-dev/docs)
- **Website**: [github.com/rivaas-dev/rivaas.dev](https://github.com/rivaas-dev/rivaas.dev)
