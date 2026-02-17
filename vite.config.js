import { defineConfig } from 'vite'
import { readFileSync, writeFileSync } from 'fs'
import tailwindcss from '@tailwindcss/vite'
import { codeToHtml } from 'shiki'

// Code snippets for syntax highlighting
const snippets = {
  mainConfig: `// Use the full framework...
import "rivaas.dev/app"

// ...or just the packages you need
import "rivaas.dev/router"
import "rivaas.dev/binding"
import "rivaas.dev/validation"

// Every package has its own go.mod — no lock-in
// Same functional options everywhere

r, _ := router.New()
r.Use(cors.New(), compression.New(), recovery.New())

r.GET("/users/:id", getUser).WhereInt("id")
r.POST("/users", createUser)

r.Serve(":8080")`,

  beforeObservability: `// Typical setup: wire each SDK separately
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/sdk/resource"
    "go.opentelemetry.io/otel/sdk/trace"
    "github.com/prometheus/client_golang/prometheus"
    "log/slog"
    "os"
)
func setupObservability(ctx context.Context) {
    res, _ := resource.New(ctx,
        resource.WithAttributes(
            semconv.ServiceName("my-api"),
        ),
    )
    exp, _ := otlptracegrpc.New(ctx,
        otlptracegrpc.WithEndpoint("localhost:4317"),
    )
    tp := trace.NewTracerProvider(
        trace.WithBatcher(exp),
        trace.WithResource(res),
    )
    otel.SetTracerProvider(tp)
    reg := prometheus.NewRegistry()
    reg.MustRegister(collectors.NewGoCollector())
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    slog.SetDefault(logger)
    // Then wrap every handler with middleware...
}`,

  afterObservability: `// Rivaas: one block, all three pillars
app.WithObservability(
    app.WithMetrics(),
    app.WithTracing(
        tracing.WithOTLP("localhost:4317")),
    app.WithLogging(
        logging.WithJSONHandler()),
)`,

  beforeApiDocs: `// Swaggo: magic comments + codegen step
//
//go:generate swag init -g main.go -o docs
//
// @Summary      Get user by ID
// @Tags         users
// @Produce      json
// @Param        id   path  int  true  "User ID"
// @Success      200  {object}  User
// @Failure      404  {object}  ErrorResponse
// @Router       /users/{id} [get]
func GetUser(w http.ResponseWriter, r *http.Request) {
    // ...
}
// Then: swag init, mount Swagger UI route`,

  afterApiDocs: `// Rivaas: route-level docs, no codegen
a.GET("/users/:id", handlers.GetUser,
    app.WithDoc(
        openapi.WithSummary("Get user"),
        openapi.WithResponse(
            http.StatusOK, User{}),
        openapi.WithTags("users"),
    ),
).WhereInt("id")`,

  beforeHealth: `// Manual: signal handling
go func() {
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, syscall.SIGHUP)
    for range sigCh {
        if err := cfg.Reload(); err != nil {
            log.Printf("reload failed: %v", err)
        }
    }
}()

// Manual: health endpoint
http.HandleFunc("/health", func(
    w http.ResponseWriter,
    r *http.Request,
) {
    if db.Ping() != nil {
        w.WriteHeader(503)
        return
    }
    w.WriteHeader(200)
})`,

  afterHealth: `// Rivaas: /livez + /readyz endpoints
app.WithHealthEndpoints(
    app.WithReadinessCheck("db", dbPing),
),

// Rivaas: SIGHUP config reload
a.OnReload(func(ctx context.Context) error {
    return cfg.Load(ctx)
})`,

  beforeBinding: `// Manual: decode body, extract params, validate
func CreateUser(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(chi.URLParam(r, "id"))
    if err != nil {
        http.Error(w, "invalid id", 400)
        return
    }
    var body CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, "invalid JSON", 400)
        return
    }
    if body.Name == "" {
        http.Error(w, "name is required", 422)
        return
    }
    if !strings.Contains(body.Email, "@") {
        http.Error(w, "invalid email", 422)
        return
    }
    page, _ := strconv.Atoi(r.URL.Query().Get("page"))
    // Finally use id, body, page...
}`,

  afterBinding: `// Rivaas: struct tags define sources + rules
type CreateUserRequest struct {
    ID    int    \`path:"id"\`
    Page  int    \`query:"page"\`
    Name  string \`json:"name"  validate:"required"\`
    Email string \`json:"email" validate:"required,email"\`
}

func CreateUser(c *app.Context) {
    req, err := app.Bind[CreateUserRequest](c)
    if err != nil { c.Fail(err); return }
    // id, body, page — all bound and validated
}`,

  beforeErrors: `// Manual: format RFC 9457 problem details
func writeError(w http.ResponseWriter, r *http.Request,
    status int, title, detail string,
) {
    w.Header().Set("Content-Type",
        "application/problem+json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(map[string]any{
        "type":     "/errors/" + strings.ToLower(title),
        "title":    title,
        "status":   status,
        "detail":   detail,
        "instance": r.URL.Path,
    })
}
// Call for every error, in every handler...`,

  afterErrors: `// Rivaas: one option, RFC 9457 everywhere
app.WithErrorFormatter(
    errors.NewRFC9457("https://api.example.com"),
)

// Any c.Fail(err) now returns:
// {
//   "type":   "https://api.example.com/errors/not-found",
//   "title":  "Not Found",
//   "status": 404,
//   "detail": "user 42 not found"
// }`,

  beforeMiddleware: `// Manual: wire each middleware separately
import (
    "github.com/rs/cors"
    "github.com/klauspost/compress/gzhttp"
    "github.com/ulule/limiter/v3"
    "github.com/google/uuid"
)
r.Use(cors.New(cors.Options{
    AllowedOrigins:   []string{"*"},
    AllowedMethods:   []string{"GET", "POST", "PUT"},
    AllowCredentials: true,
}).Handler)
r.Use(gzhttp.GzipHandler)
r.Use(rateLimiterMiddleware)
r.Use(requestIDMiddleware)
r.Use(panicRecoveryMiddleware)`,

  afterMiddleware: `// Rivaas: built-in, same import path
app.WithMiddleware(
    cors.New(cors.WithOrigins("*")),
    compression.New(),
    ratelimit.New(ratelimit.WithRate(100)),
    requestid.New(),
    recovery.New(),
)`,

}

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
