// Manual: decode body, extract params, validate
func CreateUser(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(chi.URLParam(r, "id"))
    if err != nil {
        http.Error(w, "invalid id", 400)
        return
    }
    var body CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
        http.Error(w, "invalid JSON", 400)
        return
    }
    if body.Name == "" {
        http.Error(w, "name is required", 422)
        return
    }
    if !strings.Contains(body.Email, "@") {
        http.Error(w, "invalid email", 422)
        return
    }
    page, _ := strconv.Atoi(r.URL.Query().Get("page"))
    // Finally use id, body, page...
}
