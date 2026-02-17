// Minimal Rivaas app used only for recording the demo cast files.
// See README.md in this directory for how to regenerate write.cast, run.cast, and use.cast.
package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"rivaas.dev/app"
	"rivaas.dev/logging"
	"rivaas.dev/openapi"
	"rivaas.dev/openapi/example"
	"rivaas.dev/metrics"
	"rivaas.dev/tracing"
)

func main() {
	// Set up a context to handle graceful shutdown on interrupt or termination signals
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	// Create a new app with default settings and health endpoints and observability
	a := app.MustNew(
		app.WithServiceName("demo-api"),
		app.WithServiceVersion("v1.0.0"),
		app.WithObservability(
			app.WithMetrics(metrics.WithPrometheus(":9090", "/metrics")),
			app.WithTracing(tracing.WithOTLP("localhost:4317")),
			app.WithLogging(logging.WithConsoleHandler()),
		),
		app.WithOpenAPI(openapi.WithTitle("Demo API", "1.0")),
	)

	// Add a route to the API with OpenAPI documentation
	a.GET("/", func(c *app.Context) {
		c.JSON(http.StatusOK, map[string]string{"message": "Hello World"})
	},
	app.WithDoc(
		openapi.WithDescription("Hello World"),
		openapi.WithResponse(
			http.StatusOK, map[string]string{}, 
			example.New("success", map[string]string{"message": "Hello World"}),
		),
		openapi.WithTags("demo"),
	))

	// Start the API and wait for the context to be cancelled
	a.Start(ctx)
}
