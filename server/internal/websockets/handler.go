package websockets

import (
	"time"

	apiHttp "smart-plc-control-server/pkg/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"
)

type Handler struct {
	service  *Service
	hub      *Hub
	upgrader websocket.Upgrader
}

func NewHandler(db *gorm.DB) *Handler {
	hub := NewHub()
	go hub.Run()

	return &Handler{
		service:  NewService(db),
		hub:      hub,
		upgrader: websocket.Upgrader{},
	}
}

func (h *Handler) Simulation(c *gin.Context) {
	query, err := apiHttp.BindQuery[SimulationStreamQuery](c)
	if err != nil {
		c.Error(err)
		return
	}

	if _, err := h.service.GetSimulationSnapshots(*query); err != nil {
		c.Error(err)
		return
	}

	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.Error(err)
		return
	}

	client := h.hub.RegisterClient(conn)
	defer h.hub.UnregisterClient(client)

	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			if _, _, err := conn.ReadMessage(); err != nil {
				return
			}
		}
	}()

	h.sendSimulationSnapshot(client, *query)

	ticker := time.NewTicker(time.Duration(h.service.ResolveSimulationStreamInterval(*query)) * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-c.Request.Context().Done():
			return
		case <-done:
			return
		case <-ticker.C:
			if !h.sendSimulationSnapshot(client, *query) {
				return
			}
		}
	}
}

func (h *Handler) sendSimulationSnapshot(client *Client, query SimulationStreamQuery) bool {
	snapshots, err := h.service.GetSimulationSnapshots(query)
	if err != nil {
		return h.hub.Send(client, Message{
			Type:   SimulationSnapshotEvent,
			Error:  err.Error(),
			SentAt: time.Now().UTC(),
		})
	}

	return h.hub.Send(client, Message{
		Type:   SimulationSnapshotEvent,
		Data:   snapshots,
		SentAt: time.Now().UTC(),
	})
}
