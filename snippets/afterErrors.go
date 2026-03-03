// Rivaas: one option, RFC 9457 everywhere
app.WithErrorFormatter(
    errors.NewRFC9457("https://api.example.com"),
)

// Any c.Fail(err) now returns:
// {
//   "type":   "https://api.example.com/errors/not-found",
//   "title":  "Not Found",
//   "status": 404,
//   "detail": "user 42 not found"
// }
