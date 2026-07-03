package devices

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type CreateDeviceRequest struct {
	PlantID          string                  `json:"plantId" binding:"required"`
	Name             string                  `json:"name" binding:"required,min=1,max=120"`
	Type             models.DeviceType       `json:"type" binding:"required,oneof=PLC SIMULATOR"`
	Description      string                  `json:"description" binding:"omitempty"`
	Protocol         models.Protocol         `json:"protocol" binding:"required,oneof=SIMULATOR MODBUS_TCP OPC_UA"`
	Host             string                  `json:"host" binding:"omitempty,max=100"`
	Port             *int                    `json:"port" binding:"omitempty,min=1,max=65535"`
	ConnectionStatus models.ConnectionStatus `json:"connectionStatus" binding:"omitempty,oneof=CONNECTED DISCONNECTED CONNECTING ERROR"`
	Enabled          *bool                   `json:"enabled" binding:"omitempty"`
	Position         *models.Position        `json:"position" binding:"omitempty"`
}

type UpdateDeviceRequest struct {
	Name             string                  `json:"name" binding:"omitempty,min=1,max=120"`
	Type             models.DeviceType       `json:"type" binding:"omitempty,oneof=PLC SIMULATOR"`
	Description      string                  `json:"description" binding:"omitempty"`
	Protocol         models.Protocol         `json:"protocol" binding:"omitempty,oneof=SIMULATOR MODBUS_TCP OPC_UA"`
	Host             string                  `json:"host" binding:"omitempty,max=100"`
	Port             *int                    `json:"port" binding:"omitempty,min=1,max=65535"`
	ConnectionStatus models.ConnectionStatus `json:"connectionStatus" binding:"omitempty,oneof=CONNECTED DISCONNECTED CONNECTING ERROR"`
	Enabled          *bool                   `json:"enabled" binding:"omitempty"`
	Position         *models.Position        `json:"position" binding:"omitempty"`
}

type DeviceResponse struct {
	ID               string                  `json:"id"`
	PlantID          string                  `json:"plantId"`
	Name             string                  `json:"name"`
	Type             models.DeviceType       `json:"type"`
	Description      string                  `json:"description"`
	Protocol         models.Protocol         `json:"protocol"`
	Host             string                  `json:"host"`
	Port             *int                    `json:"port"`
	ConnectionStatus models.ConnectionStatus `json:"connectionStatus"`
	Enabled          bool                    `json:"enabled"`
	LastConnectedAt  *time.Time              `json:"lastConnectedAt"`
	Position         models.Position         `json:"position"`
	CreatedAt        time.Time               `json:"createdAt"`
	UpdatedAt        time.Time               `json:"updatedAt"`
}
