// Use the full framework...
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

r.Serve(":8080")
