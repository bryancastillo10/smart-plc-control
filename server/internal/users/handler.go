package users

import (
	"smart-plc-control-server/pkg/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	service *Service
}

func NewHandler(db *gorm.DB) *Handler {
	repo := NewRepository(db)
	service := NewService(repo)
	return &Handler{service: service}
}

func (h *Handler) GetAllUsers(c *gin.Context) {
	users, err := h.service.GetAllUsers()
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, users)
}

func (h *Handler) UpdateUser(c *gin.Context) {
	userID, err := http.ExtractUserIDFromContext(c)
	if err != nil {
		c.Error(err)
		return
	}

	req, err := http.BindJSON[UpdateUserRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	user, err := h.service.UpdateUser(userID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, user)
}

func (h *Handler) DeleteUser(c *gin.Context) {
	userID, err := http.ExtractUserIDFromContext(c)
	if err != nil {
		c.Error(err)
		return
	}

	req, err := http.BindQuery[DeleteUserRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	if err := h.service.DeleteUser(userID, *req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{"message": "User deleted successfully"})
}
