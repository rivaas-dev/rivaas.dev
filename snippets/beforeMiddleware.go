// Manual: wire each middleware separately
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
r.Use(panicRecoveryMiddleware)
