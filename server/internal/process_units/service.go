package process_units

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"

	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateProcessUnit(plantID string, req CreateProcessUnitRequest) (*ProcessUnitResponse, error) {
	if plantID == "" {
		return nil, appErr.NewBadRequest("Missing plant ID", nil)
	}

	if req.Name == "" || req.Type == "" {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	parsedPlantID, err := utils.ParseId(plantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	plant, err := s.repo.FindPlantByID(parsedPlantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find plant", err)
	}
	if plant == nil {
		return nil, appErr.NewNotFound("Plant not found", nil)
	}

	if req.Status == "" {
		req.Status = models.Active
	}

	if req.Status != models.Active && req.Status != models.Inactive && req.Status != models.Maintenance {
		return nil, appErr.NewBadRequest("Invalid process unit status", nil)
	}

	processUnit := &models.ProcessUnits{
		ID:          utils.GenerateUUID(),
		PlantID:     parsedPlantID,
		Name:        req.Name,
		Type:        req.Type,
		Description: req.Description,
		Status:      req.Status,
		Position:    getPosition(req.Position),
		Ports:       getPorts(req.Ports),
	}

	createdProcessUnit, err := s.repo.CreateProcessUnit(processUnit)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create process unit", err)
	}

	res := toProcessUnitResponse(*createdProcessUnit)
	return &res, nil
}

func (s *Service) GetProcessUnitsByPlantID(plantID string) ([]ProcessUnitResponse, error) {
	parsedPlantID, err := s.validatePlant(plantID)
	if err != nil {
		return nil, err
	}

	processUnits, err := s.repo.FindProcessUnitsByPlantID(parsedPlantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get process units", err)
	}

	res := make([]ProcessUnitResponse, 0, len(processUnits))
	for _, processUnit := range processUnits {
		res = append(res, toProcessUnitResponse(processUnit))
	}

	return res, nil
}

func (s *Service) GetProcessUnitByID(processUnitID string) (*ProcessUnitResponse, error) {
	processUnit, err := s.findProcessUnit(processUnitID)
	if err != nil {
		return nil, err
	}

	res := toProcessUnitResponse(*processUnit)
	return &res, nil
}

func (s *Service) UpdateProcessUnit(processUnitID string, req UpdateProcessUnitRequest) (*ProcessUnitResponse, error) {
	if processUnitID == "" {
		return nil, appErr.NewBadRequest("Missing process unit ID", nil)
	}

	if req.Name == "" && req.Type == "" && req.Description == "" && req.Status == "" && req.Position == nil && len(req.Ports) == 0 {
		return nil, appErr.NewBadRequest("Missing process unit fields to update", nil)
	}

	if req.Status != "" && req.Status != models.Active && req.Status != models.Inactive && req.Status != models.Maintenance {
		return nil, appErr.NewBadRequest("Invalid process unit status", nil)
	}

	processUnit, err := s.findProcessUnit(processUnitID)
	if err != nil {
		return nil, err
	}

	utils.PatchIfNotZero(&processUnit.Name, req.Name)
	utils.PatchIfNotZero(&processUnit.Type, req.Type)
	utils.PatchIfNotZero(&processUnit.Description, req.Description)
	utils.PatchIfNotZero(&processUnit.Status, req.Status)
	if req.Position != nil {
		processUnit.Position = *req.Position
	}
	if len(req.Ports) > 0 {
		processUnit.Ports = getPorts(req.Ports)
	}

	updatedProcessUnit, err := s.repo.UpdateProcessUnit(processUnit)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update process unit", err)
	}

	res := toProcessUnitResponse(*updatedProcessUnit)
	return &res, nil
}

func (s *Service) DeleteProcessUnit(processUnitID string, req DeleteProcessUnitRequest) error {
	if req.Action != "delete" {
		return appErr.NewBadRequest("Delete confirmation must be exactly 'delete'", nil)
	}

	processUnit, err := s.findProcessUnit(processUnitID)
	if err != nil {
		return err
	}

	if err := s.repo.DeleteProcessUnit(processUnit); err != nil {
		return appErr.NewInternal("Failed to delete process unit", err)
	}

	return nil
}

func (s *Service) CreateProcessUnitConnection(plantID string, req CreateProcessUnitConnectionRequest) (*ProcessUnitConnectionResponse, error) {
	parsedPlantID, err := s.validatePlant(plantID)
	if err != nil {
		return nil, err
	}

	if req.SourceUnitID == "" || req.SourcePortID == "" || req.TargetUnitID == "" || req.TargetPortID == "" {
		return nil, appErr.NewBadRequest("Missing required connection fields", nil)
	}

	if req.FlowType != "" && !isValidFlowType(req.FlowType) {
		return nil, appErr.NewBadRequest("Invalid flow type", nil)
	}

	sourceUnit, targetUnit, err := s.validateConnectionUnits(parsedPlantID, req.SourceUnitID, req.TargetUnitID)
	if err != nil {
		return nil, err
	}

	connection := &models.ProcessUnitConnections{
		ID:           utils.GenerateUUID(),
		PlantID:      parsedPlantID,
		SourceUnitID: sourceUnit.ID,
		SourcePortID: req.SourcePortID,
		TargetUnitID: targetUnit.ID,
		TargetPortID: req.TargetPortID,
		Label:        req.Label,
		FlowType:     req.FlowType,
	}

	createdConnection, err := s.repo.CreateProcessUnitConnection(connection)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create process unit connection", err)
	}

	res := toProcessUnitConnectionResponse(*createdConnection)
	return &res, nil
}

func (s *Service) GetProcessUnitConnectionsByPlantID(plantID string) ([]ProcessUnitConnectionResponse, error) {
	parsedPlantID, err := s.validatePlant(plantID)
	if err != nil {
		return nil, err
	}

	connections, err := s.repo.FindProcessUnitConnectionsByPlantID(parsedPlantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get process unit connections", err)
	}

	res := make([]ProcessUnitConnectionResponse, 0, len(connections))
	for _, connection := range connections {
		res = append(res, toProcessUnitConnectionResponse(connection))
	}

	return res, nil
}

func (s *Service) GetProcessUnitConnectionByID(connectionID string) (*ProcessUnitConnectionResponse, error) {
	connection, err := s.findProcessUnitConnection(connectionID)
	if err != nil {
		return nil, err
	}

	res := toProcessUnitConnectionResponse(*connection)
	return &res, nil
}

func (s *Service) UpdateProcessUnitConnection(connectionID string, req UpdateProcessUnitConnectionRequest) (*ProcessUnitConnectionResponse, error) {
	if req.SourceUnitID == "" && req.SourcePortID == "" && req.TargetUnitID == "" && req.TargetPortID == "" && req.Label == "" && req.FlowType == "" {
		return nil, appErr.NewBadRequest("Missing connection fields to update", nil)
	}

	if req.FlowType != "" && !isValidFlowType(req.FlowType) {
		return nil, appErr.NewBadRequest("Invalid flow type", nil)
	}

	connection, err := s.findProcessUnitConnection(connectionID)
	if err != nil {
		return nil, err
	}

	sourceUnitID := connection.SourceUnitID
	targetUnitID := connection.TargetUnitID
	if req.SourceUnitID != "" {
		parsedSourceUnitID, err := utils.ParseId(req.SourceUnitID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid source process unit ID", err)
		}
		sourceUnitID = parsedSourceUnitID
	}
	if req.TargetUnitID != "" {
		parsedTargetUnitID, err := utils.ParseId(req.TargetUnitID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid target process unit ID", err)
		}
		targetUnitID = parsedTargetUnitID
	}

	sourceUnit, targetUnit, err := s.validateConnectionUnitIDs(connection.PlantID, sourceUnitID, targetUnitID)
	if err != nil {
		return nil, err
	}

	connection.SourceUnitID = sourceUnit.ID
	connection.TargetUnitID = targetUnit.ID
	utils.PatchIfNotZero(&connection.SourcePortID, req.SourcePortID)
	utils.PatchIfNotZero(&connection.TargetPortID, req.TargetPortID)
	utils.PatchIfNotZero(&connection.Label, req.Label)
	utils.PatchIfNotZero(&connection.FlowType, req.FlowType)

	updatedConnection, err := s.repo.UpdateProcessUnitConnection(connection)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update process unit connection", err)
	}

	res := toProcessUnitConnectionResponse(*updatedConnection)
	return &res, nil
}

func (s *Service) DeleteProcessUnitConnection(connectionID string, req DeleteProcessUnitConnectionRequest) error {
	if req.Action != "delete" {
		return appErr.NewBadRequest("Delete confirmation must be exactly 'delete'", nil)
	}

	connection, err := s.findProcessUnitConnection(connectionID)
	if err != nil {
		return err
	}

	if err := s.repo.DeleteProcessUnitConnection(connection); err != nil {
		return appErr.NewInternal("Failed to delete process unit connection", err)
	}

	return nil
}

func (s *Service) validatePlant(plantID string) (uuid.UUID, error) {
	if plantID == "" {
		return uuid.UUID{}, appErr.NewBadRequest("Missing plant ID", nil)
	}

	parsedPlantID, err := utils.ParseId(plantID)
	if err != nil {
		return uuid.UUID{}, appErr.NewBadRequest("Invalid plant ID", err)
	}

	plant, err := s.repo.FindPlantByID(parsedPlantID)
	if err != nil {
		return uuid.UUID{}, appErr.NewInternal("Failed to find plant", err)
	}
	if plant == nil {
		return uuid.UUID{}, appErr.NewNotFound("Plant not found", nil)
	}

	return parsedPlantID, nil
}

func (s *Service) findProcessUnit(processUnitID string) (*models.ProcessUnits, error) {
	if processUnitID == "" {
		return nil, appErr.NewBadRequest("Missing process unit ID", nil)
	}

	parsedProcessUnitID, err := utils.ParseId(processUnitID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid process unit ID", err)
	}

	processUnit, err := s.repo.FindProcessUnitByID(parsedProcessUnitID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find process unit", err)
	}
	if processUnit == nil {
		return nil, appErr.NewNotFound("Process unit not found", nil)
	}

	return processUnit, nil
}

func (s *Service) findProcessUnitConnection(connectionID string) (*models.ProcessUnitConnections, error) {
	if connectionID == "" {
		return nil, appErr.NewBadRequest("Missing process unit connection ID", nil)
	}

	parsedConnectionID, err := utils.ParseId(connectionID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid process unit connection ID", err)
	}

	connection, err := s.repo.FindProcessUnitConnectionByID(parsedConnectionID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find process unit connection", err)
	}
	if connection == nil {
		return nil, appErr.NewNotFound("Process unit connection not found", nil)
	}

	return connection, nil
}

func (s *Service) validateConnectionUnits(plantID uuid.UUID, sourceUnitID string, targetUnitID string) (*models.ProcessUnits, *models.ProcessUnits, error) {
	parsedSourceUnitID, err := utils.ParseId(sourceUnitID)
	if err != nil {
		return nil, nil, appErr.NewBadRequest("Invalid source process unit ID", err)
	}
	parsedTargetUnitID, err := utils.ParseId(targetUnitID)
	if err != nil {
		return nil, nil, appErr.NewBadRequest("Invalid target process unit ID", err)
	}

	return s.validateConnectionUnitIDs(plantID, parsedSourceUnitID, parsedTargetUnitID)
}

func (s *Service) validateConnectionUnitIDs(plantID uuid.UUID, sourceUnitID uuid.UUID, targetUnitID uuid.UUID) (*models.ProcessUnits, *models.ProcessUnits, error) {
	sourceUnit, err := s.repo.FindProcessUnitByID(sourceUnitID)
	if err != nil {
		return nil, nil, appErr.NewInternal("Failed to find source process unit", err)
	}
	if sourceUnit == nil {
		return nil, nil, appErr.NewNotFound("Source process unit not found", nil)
	}

	targetUnit, err := s.repo.FindProcessUnitByID(targetUnitID)
	if err != nil {
		return nil, nil, appErr.NewInternal("Failed to find target process unit", err)
	}
	if targetUnit == nil {
		return nil, nil, appErr.NewNotFound("Target process unit not found", nil)
	}

	if sourceUnit.PlantID != plantID || targetUnit.PlantID != plantID {
		return nil, nil, appErr.NewBadRequest("Connected process units must belong to the same plant", nil)
	}

	return sourceUnit, targetUnit, nil
}

func toProcessUnitResponse(processUnit models.ProcessUnits) ProcessUnitResponse {
	return ProcessUnitResponse{
		ID:          processUnit.ID.String(),
		PlantID:     processUnit.PlantID.String(),
		Name:        processUnit.Name,
		Type:        processUnit.Type,
		Description: processUnit.Description,
		Status:      processUnit.Status,
		Position:    processUnit.Position,
		Ports:       getPorts(processUnit.Ports),
		CreatedAt:   processUnit.CreatedAt,
		UpdatedAt:   processUnit.UpdatedAt,
	}
}

func toProcessUnitConnectionResponse(connection models.ProcessUnitConnections) ProcessUnitConnectionResponse {
	return ProcessUnitConnectionResponse{
		ID:           connection.ID.String(),
		PlantID:      connection.PlantID.String(),
		SourceUnitID: connection.SourceUnitID.String(),
		SourcePortID: connection.SourcePortID,
		TargetUnitID: connection.TargetUnitID.String(),
		TargetPortID: connection.TargetPortID,
		Label:        connection.Label,
		FlowType:     connection.FlowType,
		CreatedAt:    connection.CreatedAt,
		UpdatedAt:    connection.UpdatedAt,
	}
}

func getPosition(position *models.Position) models.Position {
	if position == nil {
		return models.Position{}
	}

	return *position
}

func getPorts(ports []models.ProcessUnitPort) []models.ProcessUnitPort {
	if len(ports) == 0 {
		return []models.ProcessUnitPort{
			{ID: "in", Label: "In", Direction: "IN"},
			{ID: "out", Label: "Out", Direction: "OUT"},
		}
	}

	return ports
}

func isValidFlowType(flowType models.FlowType) bool {
	switch flowType {
	case models.WaterFlow,
		models.WastewaterFlow,
		models.SludgeFlow,
		models.GasFlow,
		models.ChemicalFlow,
		models.RawMaterialFlow,
		models.OthersFlow:
		return true
	default:
		return false
	}
}
