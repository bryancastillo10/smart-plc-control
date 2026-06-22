package models

type Role string

const (
	Admin    Role = "ADMIN"
	Operator Role = "OPERATOR"
	Viewer   Role = "VIEWER"
)

type Language string

const (
	English Language = "EN"
	Chinese Language = "ZH-TW"
)

type PlantStatus string

const (
	Active      PlantStatus = "ACTIVE"
	Inactive    PlantStatus = "INACTIVE"
	Maintenance PlantStatus = "MAINTENANCE"
)

type DeviceType string

const (
	PLC             DeviceType = "PLC"
	DeviceSimulator DeviceType = "SIMULATOR"
	Gateway         DeviceType = "GATEWAY"
	SensorGroup     DeviceType = "SENSOR_GROUP"
	ActuatorGroup   DeviceType = "ACTUATOR_GROUP"
)

type Protocol string

const (
	Simulator Protocol = "SIMULATOR"
	ModbusTCP Protocol = "MODBUS_TCP"
	OPCUA     Protocol = "OPC_UA"
)

type ConnectionStatus string

const (
	Connected    ConnectionStatus = "CONNECTED"
	Disconnected ConnectionStatus = "DISCONNECTED"
	Connecting   ConnectionStatus = "CONNECTING"
	Error        ConnectionStatus = "ERROR"
)

type TagDataType string

const (
	BoolDataType   TagDataType = "BOOL"
	IntDataType    TagDataType = "INT"
	FloatDataType  TagDataType = "FLOAT"
	StringDataType TagDataType = "STRING"
)

type ReadingQuality string

const (
	Good      ReadingQuality = "GOOD"
	Uncertain ReadingQuality = "UNCERTAIN"
	Bad       ReadingQuality = "BAD"
	Stale     ReadingQuality = "STALE"
)

type ReadingSource string

const (
	SimulationSource ReadingSource = "SIMULATION"
	ModbusSource     ReadingSource = "MODBUS"
	OPCUASource      ReadingSource = "OPC_UA"
	ManualSource     ReadingSource = "MANUAL"
)
