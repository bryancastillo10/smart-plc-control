package websockets

import "github.com/gorilla/websocket"

type Hub struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
}

type Client struct {
	conn *websocket.Conn
	send chan Message
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		}
	}
}

func (h *Hub) RegisterClient(conn *websocket.Conn) *Client {
	client := &Client{
		conn: conn,
		send: make(chan Message, 8),
	}

	h.register <- client
	go client.writePump()

	return client
}

func (h *Hub) UnregisterClient(client *Client) {
	h.unregister <- client
}

func (h *Hub) Send(client *Client, message Message) bool {
	select {
	case client.send <- message:
		return true
	default:
		return false
	}
}

func (c *Client) writePump() {
	defer c.conn.Close()

	for message := range c.send {
		if err := c.conn.WriteJSON(message); err != nil {
			return
		}
	}
}
