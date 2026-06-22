package auth

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	authGroup := router.Group("/auth")
	authGroup.POST("/register", h.Register)
}

func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	user, err := h.service.Register(c.Request.Context(), req)
	if err != nil {
		switch {
		case errors.Is(err, ErrEmailAlreadyExists):
			c.JSON(http.StatusConflict, ErrorResponse{Error: err.Error()})
		case errors.Is(err, ErrInvalidRole), errors.Is(err, ErrInvalidLanguage):
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "failed to register user"})
		}
		return
	}

	c.JSON(http.StatusCreated, user)
}
