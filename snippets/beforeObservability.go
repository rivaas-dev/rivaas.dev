// Typical setup: wire each SDK separately
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
}
