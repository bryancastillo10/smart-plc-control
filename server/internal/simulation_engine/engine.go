package simulation_engine

import (
	"context"
	"log"
	"time"

	"smart-plc-control-server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

const enginePollInterval = 100 * time.Millisecond

type readingKey struct {
	simulationID uuid.UUID
	tagID        uuid.UUID
}

type Engine struct {
	repository         *Repository
	generator          *Generator
	lastSimulationTick map[uuid.UUID]time.Time
	lastTagTick        map[readingKey]time.Time
	previousReadings   map[readingKey]models.TagReadings
}

func NewEngine(db *gorm.DB) *Engine {
	return &Engine{
		repository:         NewRepository(db),
		generator:          NewGenerator(),
		lastSimulationTick: make(map[uuid.UUID]time.Time),
		lastTagTick:        make(map[readingKey]time.Time),
		previousReadings:   make(map[readingKey]models.TagReadings),
	}
}

func (e *Engine) Run(ctx context.Context) {
	ticker := time.NewTicker(enginePollInterval)
	defer ticker.Stop()

	log.Println("Simulation reading engine started")
	e.tick(time.Now().UTC())
	for {
		select {
		case <-ctx.Done():
			log.Println("Simulation reading engine stopped")
			return
		case now := <-ticker.C:
			e.tick(now.UTC())
		}
	}
}

func (e *Engine) tick(now time.Time) {
	simulations, err := e.repository.FindRunningSimulations()
	if err != nil {
		log.Printf("Simulation engine failed to load running simulations: %v", err)
		return
	}

	active := make(map[uuid.UUID]struct{}, len(simulations))
	activePlants := make(map[uuid.UUID]struct{}, len(simulations))
	for _, simulation := range simulations {
		// Tag readings are plant-scoped and do not carry a simulation ID. If more
		// than one simulation is RUNNING for a plant, use the most recently
		// updated one to avoid duplicate writers for the same tags.
		if _, exists := activePlants[simulation.PlantID]; exists {
			continue
		}

		hasSimulatorDevice, err := e.repository.HasEnabledSimulatorDevice(simulation.PlantID)
		if err != nil {
			log.Printf(
				"Simulation engine failed to validate simulator device for plant %s: %v",
				simulation.PlantID,
				err,
			)
			continue
		}
		if !hasSimulatorDevice {
			continue
		}

		activePlants[simulation.PlantID] = struct{}{}
		active[simulation.ID] = struct{}{}
		if !e.simulationIsDue(simulation, now) {
			continue
		}
		if err := e.generateSimulationReadings(simulation, now); err != nil {
			log.Printf("Simulation engine failed for simulation %s: %v", simulation.ID, err)
			continue
		}
		e.lastSimulationTick[simulation.ID] = now
	}
	e.removeInactiveState(active)
}

func (e *Engine) simulationIsDue(simulation models.Simulations, now time.Time) bool {
	lastTick, exists := e.lastSimulationTick[simulation.ID]
	if !exists {
		return true
	}
	interval := time.Duration(max(simulation.UpdateIntervalMS, 1)) * time.Millisecond
	return now.Sub(lastTick) >= interval
}

func (e *Engine) generateSimulationReadings(simulation models.Simulations, now time.Time) error {
	tags, err := e.repository.FindSimulatedTags(simulation.PlantID)
	if err != nil {
		return err
	}

	readings := make([]models.TagReadings, 0, len(tags))
	keys := make([]readingKey, 0, len(tags))
	for _, tag := range tags {
		key := readingKey{simulationID: simulation.ID, tagID: tag.ID}
		if !e.tagIsDue(key, tag, now) {
			continue
		}

		previous, err := e.previousReading(key, tag.ID)
		if err != nil {
			return err
		}
		reading := e.generator.Generate(tag, previous, simulation.NoiseFactor)
		reading.RecordedAt = now
		readings = append(readings, reading)
		keys = append(keys, key)
	}

	if err := e.repository.CreateReadings(readings); err != nil {
		return err
	}
	for index, key := range keys {
		e.lastTagTick[key] = now
		e.previousReadings[key] = readings[index]
	}
	return nil
}

func (e *Engine) tagIsDue(key readingKey, tag models.Tags, now time.Time) bool {
	lastTick, exists := e.lastTagTick[key]
	if !exists {
		return true
	}
	interval := time.Duration(max(tag.ScanIntervalMS, 1)) * time.Millisecond
	return now.Sub(lastTick) >= interval
}

func (e *Engine) previousReading(key readingKey, tagID uuid.UUID) (*models.TagReadings, error) {
	if reading, exists := e.previousReadings[key]; exists {
		return &reading, nil
	}
	return e.repository.FindLatestReading(tagID)
}

func (e *Engine) removeInactiveState(active map[uuid.UUID]struct{}) {
	for simulationID := range e.lastSimulationTick {
		if _, exists := active[simulationID]; !exists {
			delete(e.lastSimulationTick, simulationID)
		}
	}
	for key := range e.lastTagTick {
		if _, exists := active[key.simulationID]; !exists {
			delete(e.lastTagTick, key)
			delete(e.previousReadings, key)
		}
	}
}
