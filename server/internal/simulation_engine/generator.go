package simulation_engine

import (
	"math"
	"math/rand/v2"

	"smart-plc-control-server/internal/models"
)

const (
	defaultMinimum       = 0.0
	defaultMaximum       = 100.0
	meanReversionFactor  = 0.05
	defaultNoiseFactor   = 0.01
	booleanChangeFactor  = 0.02
	minimumBooleanChance = 0.001
)

type randomSource interface {
	Float64() float64
}

type runtimeRandomSource struct{}

func (runtimeRandomSource) Float64() float64 {
	return rand.Float64()
}

type Generator struct {
	random randomSource
}

func NewGenerator() *Generator {
	return &Generator{random: runtimeRandomSource{}}
}

func newGeneratorWithRandom(random randomSource) *Generator {
	return &Generator{random: random}
}

func (g *Generator) Generate(tag models.Tags, previous *models.TagReadings, noiseFactor float64) models.TagReadings {
	reading := models.TagReadings{
		TagID:   tag.ID,
		Quality: models.Good,
		Source:  models.SimulationSource,
	}

	switch tag.DataType {
	case models.BoolDataType:
		value := previousBoolean(previous)
		changeChance := math.Max(minimumBooleanChance, noiseFactor*booleanChangeFactor)
		if g.random.Float64() < changeChance {
			value = !value
		}
		reading.ValueBool = &value
	case models.StringDataType:
		reading.ValueText = "NORMAL"
	case models.IntDataType, models.FloatDataType:
		minimum, maximum := numericBounds(tag)
		target := minimum + (maximum-minimum)/2
		current := previousNumeric(previous, target)
		resolvedNoiseFactor := noiseFactor
		if resolvedNoiseFactor == 0 {
			resolvedNoiseFactor = defaultNoiseFactor
		}
		noise := (g.random.Float64()*2 - 1) * (maximum - minimum) * resolvedNoiseFactor
		next := clamp(
			current+meanReversionFactor*(target-current)+noise,
			minimum,
			maximum,
		)
		if tag.DataType == models.IntDataType {
			next = math.Round(next)
		}
		reading.ValueNumeric = &next
	}

	return reading
}

func numericBounds(tag models.Tags) (float64, float64) {
	minimum := defaultMinimum
	maximum := defaultMaximum
	if tag.MinValue != nil {
		minimum = *tag.MinValue
	}
	if tag.MaxValue != nil {
		maximum = *tag.MaxValue
	}
	if maximum <= minimum {
		maximum = minimum + 1
	}
	return minimum, maximum
}

func previousNumeric(previous *models.TagReadings, fallback float64) float64 {
	if previous == nil || previous.ValueNumeric == nil {
		return fallback
	}
	return *previous.ValueNumeric
}

func previousBoolean(previous *models.TagReadings) bool {
	return previous != nil && previous.ValueBool != nil && *previous.ValueBool
}

func clamp(value, minimum, maximum float64) float64 {
	return math.Max(minimum, math.Min(maximum, value))
}
