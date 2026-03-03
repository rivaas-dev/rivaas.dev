// Rivaas: /livez + /readyz endpoints
app.WithHealthEndpoints(
    app.WithReadinessCheck("db", dbPing),
),

// Rivaas: SIGHUP config reload
a.OnReload(func(ctx context.Context) error {
    return cfg.Load(ctx)
})
