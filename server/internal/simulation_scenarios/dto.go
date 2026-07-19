package simulation_scenarios

import "time"

type CreateSimulationScenarioRequest struct {
	Name        string                 `json:"name" binding:"required,min=1,max=120"`
	Description string                 `json:"description" binding:"omitempty"`
	Config      map[string]interface{} `json:"config" binding:"required"`
	Enabled     *bool                  `json:"enabled" binding:"omitempty"`
}

type UpdateSimulationScenarioRequest struct {
	Name        string                 `json:"name" binding:"omitempty,min=1,max=120"`
	Description string                 `json:"description" binding:"omitempty"`
	Config      map[string]interface{} `json:"config" binding:"omitempty"`
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

type TriggerSimulationScenarioResponse struct {
	Message      string                 `json:"message"`
	SimulationID string                 `json:"simulationId"`
	ScenarioID   string                 `json:"scenarioId"`
	ScenarioName string                 `json:"scenarioName"`
	Config       map[string]interface{} `json:"config"`
	TriggeredAt  time.Time              `json:"triggeredAt"`
}
