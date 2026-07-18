package simulation_scenarios

import "time"

type CreateSimulationScenarioRequest struct {
	Name        string                 `json:"name" binding:"required,min=1,max=120"`
	Description string                 `json:"description" binding:"omitempty"`
	Config      map[string]interface{} `json:"config" binding:"required"`
	Enabled     *bool                  `json:"enabled" binding:"omitempty"`
}

type SimulationScenarioResponse struct {
	ID           string                 `json:"id"`
	SimulationID string                 `json:"simulationId"`
	Name         string                 `json:"name"`
	Description  string                 `json:"description"`
	Config       map[string]interface{} `json:"config"`
	Enabled      bool                   `json:"enabled"`
	CreatedAt    time.Time              `json:"createdAt"`
	UpdatedAt    time.Time              `json:"updatedAt"`
}
