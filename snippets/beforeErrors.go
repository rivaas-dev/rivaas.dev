// Manual: format RFC 9457 problem details
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
// Call for every error, in every handler...
