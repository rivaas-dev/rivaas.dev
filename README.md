# rivaas.dev

Landing page for Rivaas - a fast web framework for Go.

🌐 **Live**: [rivaas.dev](https://rivaas.dev)

## Getting Started

You need Node.js 20 or newer.

```bash
# Install packages
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Tech Stack

- **Vite** - Fast build tool
- **Tailwind CSS v4** - Styling
- **SCSS** - Custom styles
- **Shiki** - Code syntax highlighting
- **Fontsource** - Self-hosted fonts (Inter, JetBrains Mono)

## Project Files

```
rivaas.dev/
├── src/
│   ├── index.html          # Main page
│   ├── favicon.svg         # Site icon
│   ├── robots.txt          # For search engines
│   ├── sitemap.xml         # Site map
│   ├── scripts/
│   │   └── main.js         # JavaScript
│   └── styles/
│       ├── main.scss       # Style entry
│       ├── tailwind.css    # Tailwind config
│       ├── _variables.scss # Colors and fonts
│       ├── _base.scss      # Base styles
│       ├── _animations.scss
│       └── _components.scss
├── dist/                   # Build output
├── vite.config.js          # Vite settings
└── package.json
```

## License

Apache License 2.0 - see [LICENSE](LICENSE).
