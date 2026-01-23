import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { codeToHtml } from 'shiki'

// Code snippets for syntax highlighting
const snippets = {
  mainConfig: `package main

import (
    "context"

    "rivaas.dev/app"
    "rivaas.dev/logging"
    "rivaas.dev/openapi"
    "rivaas.dev/tracing"
)

func main() {
    a := app.New(
        // Service identity
        app.WithServiceName("my-api"),
        app.WithServiceVersion("v1.2.3"),

        // Observability: metrics + tracing + logging
        app.WithObservability(
            app.WithMetrics(),
            app.WithTracing(tracing.WithOTLP("localhost:4317")),
            app.WithLogging(logging.WithJSONHandler()),
        ),

        // OpenAPI documentation
        app.WithOpenAPI(openapi.WithTitle("My API")),

        // Health & readiness checks
        app.WithHealthEndpoints(
            app.WithReadinessCheck("database", dbPingCheck),
        ),
    )

    a.Start(context.Background(), ":8080")
}`
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
            const highlighted = await codeToHtml(code, {
              lang: 'go',
              theme: 'everforest-dark',
              transformers: [
                {
                  pre(node) { delete node.properties.style },
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
