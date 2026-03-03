// Rivaas: struct tags define sources + rules
type CreateUserRequest struct {
    ID    int    `path:"id"`
    Page  int    `query:"page"`
    Name  string `json:"name"  validate:"required"`
    Email string `json:"email" validate:"required,email"`
}

func CreateUser(c *app.Context) {
    req, err := app.Bind[CreateUserRequest](c)
    if err != nil { c.Fail(err); return }
    // id, body, page — all bound and validated
}
