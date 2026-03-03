// Rivaas: each middleware is its own module
// go get rivaas.dev/router/middleware/cors
app.WithMiddleware(
    cors.New(cors.WithAllowedOrigins("*")),
    compression.New(),
    ratelimit.New(ratelimit.WithRate(100)),
    requestid.New(),
    recovery.New(),
)
