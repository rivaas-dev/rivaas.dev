// Rivaas: one block, all three pillars
app.WithObservability(
    app.WithMetrics(),
    app.WithTracing(
        tracing.WithOTLP("localhost:4317")),
    app.WithLogging(
        logging.WithJSONHandler()),
)
