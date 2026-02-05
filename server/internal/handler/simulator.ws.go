package handler

import (
	"net/http"
	"plc-dashboard/internal/service"

	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader {
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func SensorStream(c *gin.Context) {
	conn,err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return;
	}

	defer conn.Close()

	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		data := service.GenerateSensorData();
		if err := conn.WriteJSON(data); err != nil {
			return;
		}
	}
}