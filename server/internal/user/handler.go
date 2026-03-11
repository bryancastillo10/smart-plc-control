package user

import (
	"log"
	http_helper "plc-dashboard/pkg/http"

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

func (h *Handler) GetUser(c *gin.Context) {
	userId, err := http_helper.ExtractUserIDFromContext(c)
	if err != nil {
		c.Error(err)
		return
	}

	log.Println(userId)

	c.JSON(200, userId)
}