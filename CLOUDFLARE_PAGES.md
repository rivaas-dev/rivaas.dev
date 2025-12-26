# Cloudflare Pages Configuration

This file documents the Cloudflare Pages configuration for rivaas.dev

## Build Settings

Configure these in the Cloudflare Pages dashboard:

- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)

## Environment Variables

### Build Environment

- **NODE_VERSION**: `20`

No other environment variables are required for this static site.

## Custom Domain

Set up your custom domain in Cloudflare Pages:

1. Go to your project → Custom domains
2. Add `rivaas.dev` and/or `www.rivaas.dev`
3. Follow DNS configuration instructions

## Deployment

### Automatic Deployment

Every push to `main` triggers an automatic deployment.

### Manual Deployment

```bash
# Install Wrangler CLI (if not already installed)
npm install -g wrangler

# Build the site
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=rivaas-website
```

## Preview Deployments

Cloudflare Pages automatically creates preview deployments for:
- Every pull request
- Every branch push

Preview URLs: `https://<commit-hash>.rivaas-website.pages.dev`

## Build Time

Expected build time: ~10-15 seconds

## Cache Control

The build output in `dist/` includes:
- `index.html` (28KB) - HTML content
- `styles/main.css` (5.3KB) - Minified CSS

Cloudflare Pages automatically handles caching with appropriate headers.
