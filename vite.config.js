import { defineConfig } from 'vite'
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import tailwindcss from '@tailwindcss/vite'
import { codeToHtml } from 'shiki'

// Code snippets for syntax highlighting (loaded from snippets/*.go)
const snippetsDir = join(process.cwd(), 'snippets')
const snippets = Object.fromEntries(
  readdirSync(snippetsDir)
    .filter((f) => f.endsWith('.go'))
    .map((f) => {
      const name = f.slice(0, -3)
      return [name, readFileSync(join(snippetsDir, f), 'utf-8')]
    })
)

// Vite plugin to update sitemap lastmod dates on build
// Replaces <!-- LASTMOD --> placeholder with current date in YYYY-MM-DD format
function updateSitemapPlugin() {
  return {
    name: 'vite-plugin-update-sitemap',
    writeBundle(options, bundle) {
      const today = new Date().toISOString().split('T')[0]
      const outDir = options.dir || 'dist'
      const sitemapFiles = ['sitemap.xml']

      sitemapFiles.forEach(file => {
        const filePath = `${outDir}/${file}`
        try {
          const content = readFileSync(filePath, 'utf8')
          if (!content.includes('<!-- LASTMOD -->')) {
            return // No placeholder to replace
          }
          const updated = content.replace(/<!-- LASTMOD -->/g, today)
          writeFileSync(filePath, updated)
          console.log(`[sitemap] Updated ${file} with lastmod: ${today}`)
        } catch (err) {
          console.warn(`[sitemap] Could not update ${file}:`, err.message)
        }
      })
    }
  }
}

// Vite plugin for Shiki syntax highlighting
function shikiPlugin() {
  // Cache highlighted code to avoid re-highlighting on every request
  const cache = new Map()

  return {
    name: 'vite-plugin-shiki',
    async transformIndexHtml(html) {
      for (const [name, code] of Object.entries(snippets)) {
        const placeholder = `<!-- SHIKI:${name} -->`
        if (html.includes(placeholder)) {
          // Use cached version if available
          if (!cache.has(name)) {
            const lineCount = code.split('\n').filter((l) => l.trim().length > 0).length
            const highlighted = await codeToHtml(code, {
              lang: 'go',
              theme: 'everforest-dark',
              transformers: [
                {
                  pre(node) {
                    delete node.properties.style
                    node.properties['data-lines'] = String(lineCount)
                  },
                  code(node) { delete node.properties.style }
                }
              ]
            })
            cache.set(name, highlighted)
          }
          html = html.replace(placeholder, cache.get(name))
        }
      }
      return html
    }
  }
}

export default defineConfig({
  plugins: [
    updateSitemapPlugin(),
    shikiPlugin(),
    tailwindcss()
  ],
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' }
    }
  }
})
