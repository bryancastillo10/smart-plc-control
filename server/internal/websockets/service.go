package websockets

import (
	"time"

	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const defaultSimulationStreamIntervalMS = 1000

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

func (s *Service) AuthorizeSimulationStream(userID string, query SimulationStreamQuery) error {
	if userID == "" {
		return appErr.NewUnauthorized("Missing authenticated user", nil)
	}
	if query.PlantID == "" {
		return appErr.NewBadRequest("Missing plant ID", nil)
	}

	parsedPlantID, err := utils.ParseId(query.PlantID)
	if err != nil {
		return appErr.NewBadRequest("Invalid plant ID", err)
	}

	var plant models.Plants
	if err := s.db.Where("id = ?", parsedPlantID).First(&plant).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return appErr.NewNotFound("Plant not found", nil)
		}
		return appErr.NewInternal("Failed to find plant", err)
	}

	for _, accessibleUserID := range plant.AccessibleBy {
		if accessibleUserID == userID {
			return nil
		}
	}

	return appErr.NewUnauthorized("Plant access denied", nil)
}

func (s *Service) GetSimulationSnapshots(query SimulationStreamQuery) ([]SimulationSnapshot, error) {
	dbQuery := s.db.Model(&models.Simulations{})

	if query.PlantID != "" {
		parsedPlantID, err := utils.ParseId(query.PlantID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid plant ID", err)
		}

		var plant models.Plants
		if err := s.db.Where("id = ?", parsedPlantID).First(&plant).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil, appErr.NewNotFound("Plant not found", nil)
			}
			return nil, appErr.NewInternal("Failed to find plant", err)
		}

		dbQuery = dbQuery.Where("plant_id = ?", parsedPlantID)
	}

	if query.Status != "" {
		if !isValidSimulationStatus(query.Status) {
			return nil, appErr.NewBadRequest("Invalid simulation status", nil)
		}
		dbQuery = dbQuery.Where("status = ?", query.Status)
	}

	var simulations []models.Simulations
	if err := dbQuery.Order("updated_at DESC, id DESC").Find(&simulations).Error; err != nil {
		return nil, appErr.NewInternal("Failed to get simulation snapshots", err)
	}

	return toSimulationSnapshots(simulations), nil
}

func (s *Service) ResolveSimulationStreamInterval(query SimulationStreamQuery) int {
	if query.IntervalMS == nil {
		return defaultSimulationStreamIntervalMS
	}

	return *query.IntervalMS
}

func toSimulationSnapshots(simulations []models.Simulations) []SimulationSnapshot {
	res := make([]SimulationSnapshot, 0, len(simulations))
	for _, simulation := range simulations {
		res = append(res, toSimulationSnapshot(simulation))
	}

	return res
}

func toSimulationSnapshot(simulation models.Simulations) SimulationSnapshot {
	return SimulationSnapshot{
		ID:               simulation.ID.String(),
		PlantID:          simulation.PlantID.String(),
		Name:             simulation.Name,
		Status:           simulation.Status,
		UpdateIntervalMS: simulation.UpdateIntervalMS,
		NoiseFactor:      simulation.NoiseFactor,
		StartedAt:        simulation.StartedAt,
		PausedAt:         simulation.PausedAt,
		StoppedAt:        simulation.StoppedAt,
		CreatedAt:        simulation.CreatedAt,
		UpdatedAt:        simulation.UpdatedAt,
	}
}

func isValidSimulationStatus(status models.SimulationStatus) bool {
	return status == models.SimulationIdle ||
		status == models.SimulationRunning ||
		status == models.SimulationPaused ||
		status == models.SimulationStopped
}

type telemetryReadingRow struct {
	ID            uint64
	PlantID       uuid.UUID
	TagID         uuid.UUID
	DeviceID      uuid.UUID
	ProcessUnitID *uuid.UUID
	TagName       string
	Unit          string
	ValueNumeric  *float64
	ValueText     string
	ValueBool     *bool
	Quality       models.ReadingQuality
	Source        models.ReadingSource
	RecordedAt    time.Time
}

type telemetryAlertRow struct {
	ID             uuid.UUID
	PlantID        uuid.UUID
	AlertRuleID    uuid.UUID
	AlertRuleName  string
	TagID          uuid.UUID
	TagName        string
	ProcessUnitID  *uuid.UUID
	Severity       models.AlertSeverity
	TriggerValue   string
	Status         models.AlertStatus
	Message        string
	TriggeredAt    time.Time
	AcknowledgedAt *time.Time
	ResolvedAt     *time.Time
}

func (s *Service) GetSimulationTelemetrySnapshot(query SimulationStreamQuery) (*SimulationTelemetrySnapshot, error) {
	if query.PlantID == "" {
		return nil, appErr.NewBadRequest("Missing plant ID", nil)
	}

	parsedPlantID, err := utils.ParseId(query.PlantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	devices, err := s.getTelemetryDevices(parsedPlantID)
	if err != nil {
		return nil, err
	}

	readings, err := s.getLatestTelemetryReadings(parsedPlantID)
	if err != nil {
		return nil, err
	}

	alerts, err := s.getActiveTelemetryAlerts(parsedPlantID)
	if err != nil {
		return nil, err
	}

	return &SimulationTelemetrySnapshot{
		PlantID:  query.PlantID,
		Devices:  devices,
		Readings: readings,
		Alerts:   alerts,
	}, nil
}

func (s *Service) getTelemetryDevices(plantID uuid.UUID) ([]DeviceTelemetrySnapshot, error) {
	dbQuery := s.db.Model(&models.Devices{}).Where("plant_id = ?", plantID)

	var devices []models.Devices
	if err := dbQuery.Order("name ASC, id ASC").Find(&devices).Error; err != nil {
		return nil, appErr.NewInternal("Failed to get telemetry devices", err)
	}

	res := make([]DeviceTelemetrySnapshot, 0, len(devices))
	for _, device := range devices {
		res = append(res, DeviceTelemetrySnapshot{
			ID:               device.ID.String(),
			PlantID:          device.PlantID.String(),
			Name:             device.Name,
			ConnectionStatus: device.ConnectionStatus,
			Enabled:          device.Enabled,
			LastConnectedAt:  device.LastConnectedAt,
			UpdatedAt:        device.UpdatedAt,
		})
	}

	return res, nil
}

func (s *Service) getLatestTelemetryReadings(plantID uuid.UUID) ([]TagReadingTelemetrySnapshot, error) {
	dbQuery := s.db.Table("tag_readings").
		Select(`DISTINCT ON (tag_readings.tag_id)
			tag_readings.id AS id,
			devices.plant_id AS plant_id,
			tag_readings.tag_id AS tag_id,
			tags.device_id AS device_id,
			tags.process_unit_id AS process_unit_id,
			tags.name AS tag_name,
			tags.unit AS unit,
			tag_readings.value_numeric AS value_numeric,
			tag_readings.value_text AS value_text,
			tag_readings.value_bool AS value_bool,
			tag_readings.quality AS quality,
			tag_readings.source AS source,
			tag_readings.recorded_at AS recorded_at`).
		Joins("JOIN tags ON tags.id = tag_readings.tag_id").
		Joins("JOIN devices ON devices.id = tags.device_id").
		Where("devices.plant_id = ?", plantID)

	var rows []telemetryReadingRow
	if err := dbQuery.
		Order("tag_readings.tag_id, tag_readings.recorded_at DESC, tag_readings.id DESC").
		Scan(&rows).Error; err != nil {
		return nil, appErr.NewInternal("Failed to get latest telemetry readings", err)
	}

	res := make([]TagReadingTelemetrySnapshot, 0, len(rows))
	for _, row := range rows {
		res = append(res, toTagReadingTelemetrySnapshot(row))
	}

	return res, nil
}

func (s *Service) getActiveTelemetryAlerts(plantID uuid.UUID) ([]AlertTelemetrySnapshot, error) {
	dbQuery := s.db.Table("alerts").
		Select(`alerts.id AS id,
			devices.plant_id AS plant_id,
			alerts.alert_rule_id AS alert_rule_id,
			alert_rules.name AS alert_rule_name,
			alert_rules.tag_id AS tag_id,
			tags.name AS tag_name,
			tags.process_unit_id AS process_unit_id,
			alert_rules.severity AS severity,
			alerts.trigger_value AS trigger_value,
			alerts.status AS status,
			alerts.message AS message,
			alerts.triggered_at AS triggered_at,
			alerts.acknowledged_at AS acknowledged_at,
			alerts.resolved_at AS resolved_at`).
		Joins("JOIN alert_rules ON alert_rules.id = alerts.alert_rule_id").
		Joins("JOIN tags ON tags.id = alert_rules.tag_id").
		Joins("JOIN devices ON devices.id = tags.device_id").
		Where("alerts.status IN ?", []models.AlertStatus{
			models.AlertActive,
			models.AlertAcknowledged,
		}).
		Where("devices.plant_id = ?", plantID)

	var rows []telemetryAlertRow
	if err := dbQuery.Order("alerts.triggered_at DESC, alerts.id DESC").Scan(&rows).Error; err != nil {
		return nil, appErr.NewInternal("Failed to get active telemetry alerts", err)
	}

	res := make([]AlertTelemetrySnapshot, 0, len(rows))
	for _, row := range rows {
		res = append(res, toAlertTelemetrySnapshot(row))
	}

	return res, nil
}

func toTagReadingTelemetrySnapshot(row telemetryReadingRow) TagReadingTelemetrySnapshot {
	return TagReadingTelemetrySnapshot{
		ID:            row.ID,
		PlantID:       row.PlantID.String(),
		TagID:         row.TagID.String(),
		DeviceID:      row.DeviceID.String(),
		ProcessUnitID: uuidStringPointer(row.ProcessUnitID),
		TagName:       row.TagName,
		Unit:          row.Unit,
		ValueNumeric:  row.ValueNumeric,
		ValueText:     row.ValueText,
		ValueBool:     row.ValueBool,
		Quality:       row.Quality,
		Source:        row.Source,
		RecordedAt:    row.RecordedAt,
	}
}

func toAlertTelemetrySnapshot(row telemetryAlertRow) AlertTelemetrySnapshot {
	return AlertTelemetrySnapshot{
		ID:             row.ID.String(),
		PlantID:        row.PlantID.String(),
		AlertRuleID:    row.AlertRuleID.String(),
		AlertRuleName:  row.AlertRuleName,
		TagID:          row.TagID.String(),
		TagName:        row.TagName,
		ProcessUnitID:  uuidStringPointer(row.ProcessUnitID),
		Severity:       row.Severity,
		TriggerValue:   row.TriggerValue,
		Status:         row.Status,
		Message:        row.Message,
		TriggeredAt:    row.TriggeredAt,
		AcknowledgedAt: row.AcknowledgedAt,
		ResolvedAt:     row.ResolvedAt,
	}
}

func uuidStringPointer(value *uuid.UUID) *string {
	if value == nil {
		return nil
	}

	result := value.String()
	return &result
}
