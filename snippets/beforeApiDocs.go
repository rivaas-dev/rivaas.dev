// Swaggo: magic comments + codegen step
//
//go:generate swag init -g main.go -o docs
//
// @Summary      Get user by ID
// @Tags         users
// @Produce      json
// @Param        id   path  int  true  "User ID"
// @Success      200  {object}  User
// @Failure      404  {object}  ErrorResponse
// @Router       /users/{id} [get]
func GetUser(w http.ResponseWriter, r *http.Request) {
    // ...
}
// Then: swag init, mount Swagger UI route
