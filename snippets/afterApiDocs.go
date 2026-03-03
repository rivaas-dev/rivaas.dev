// Rivaas: route-level docs, no codegen
a.GET("/users/:id", handlers.GetUser,
    app.WithDoc(
        openapi.WithSummary("Get user"),
        openapi.WithResponse(
            http.StatusOK, User{}),
        openapi.WithTags("users"),
    ),
).WhereInt("id")
