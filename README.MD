# PLC Wastewater Monitoring and Alert Simulation App

A full-stack industrial monitoring application for visualizing simulated PLC data, monitoring equipment status, reviewing historical process values, and managing alerts in real time.

The project uses a **TanStack Start** frontend and a separate backend service. The initial version focuses on PLC simulation, while keeping the architecture ready for future integration with protocols such as Modbus TCP or OPC UA.

## Project Goals

* Display real-time PLC tag values
* Simulate industrial process data and equipment behavior
* Trigger alerts based on configurable conditions
* Review active, acknowledged, and resolved alerts
* Store and visualize historical process data
* Support multiple user roles and permissions
* Maintain a clear separation between the frontend, backend, and PLC communication layers

## Architecture Overview

```text
┌──────────────────────────────────────────────┐
│              TanStack Start Client           │
│                                              │
│  Dashboard       Alerts        Trends        │
│  Devices         Simulation    Settings      │
└───────────────────┬──────────────────────────┘
                    │
             REST API + WebSocket
                    │
┌───────────────────▼──────────────────────────┐
│                 Backend Server               │
│                                              │
│  Authentication                              │
│  Device and tag management                   │
│  PLC simulation                              │
│  Alert evaluation                            │
│  Historical data                             │
│  Real-time broadcasting                      │
│  Audit logging                               │
└───────────────┬─────────────────┬────────────┘
                │                 │
       ┌────────▼────────┐  ┌─────▼────────────┐
       │    Database     │  │ PLC Data Source  │
       │                 │  │                  │
       │ PostgreSQL      │  │ Simulator        │
       │ 		         │  │ Modbus TCP       │
       │                 │  │ OPC UA           │
       └─────────────────┘  └──────────────────┘
```

## Project Structure

```text
plc-monitoring-app/
├── client/                 # TanStack Start frontend
├── server/                 # Backend API and PLC services
├── docs/                   # Architecture and project documentation
├── scripts/                # Development and utility scripts
├── docker-compose.yml      # Local service orchestration
├── .env.example            # Example environment configuration
├── .gitignore
├── AGENTS.md                # Repository development guidelines
└── README.md
```

### Client

The `client` application is responsible for:

* Page routing and layouts
* Real-time dashboard visualization
* Historical trend charts
* Alert management interfaces
* Device and tag configuration interfaces
* Simulation controls
* Authentication state
* Role-based user interface permissions
* REST API and WebSocket communication

Suggested frontend technologies:

* TanStack Start
* TanStack Router
* TanStack Query
* TypeScript
* React
* WebSocket
* Zod
* Tailwind CSS
* A charting library such as Recharts or Apache ECharts

### Server

The `server` application is responsible for:

* Authentication and authorization
* Plant, device, and PLC tag management
* PLC data simulation
* Real PLC communication
* Alert rule evaluation
* Historical reading storage
* WebSocket event broadcasting
* User and role management
* Audit logging
* Database access

The server should expose both a REST API and a WebSocket endpoint.

## Core Data Flow

```text
PLC Simulator or Physical PLC
            ↓
      PLC Adapter Layer
            ↓
       Reading Service
            ↓
   Alert Engine and Database
            ↓
      REST API and WebSocket
            ↓
    TanStack Start Dashboard
```

The frontend should not communicate directly with a physical PLC. All PLC connections and control operations must pass through the backend.

## Main Features

### Real-Time Dashboard

The dashboard provides an overview of the monitored plant and process.

Planned dashboard information includes:

* Plant operating status
* PLC connection status
* Current process values
* Equipment running and fault states
* Active alert count
* Critical alert count
* Recent alert events
* Small real-time trend charts
* Last successful data update

### Device Monitoring

Users can view information about PLCs, simulated controllers, sensors, and other connected devices.

Planned device information includes:

* Device name
* Connection protocol
* Connection status
* Network address
* Last communication time
* Assigned PLC tags
* Tag values and quality
* Device fault state

### PLC Tag Monitoring

A PLC tag represents a process variable or equipment state.

Example tags:

```text
Inlet_Flow
Tank_Level
Tank_Temperature
Tank_pH
Pump_01_Running
Pump_01_Fault
Valve_01_Position
Outlet_Flow
System_Pressure
PLC_Heartbeat
```

Each tag may include:

* Name
* PLC address
* Data type
* Unit
* Current value
* Minimum and maximum values
* Scan interval
* Data quality
* Read-only status
* Last update time

### Historical Trends

Users can review historical readings for selected tags.

Planned features include:

* Tag selection
* Date and time filtering
* Live and historical modes
* Multiple data series
* Minimum, maximum, and average values
* CSV export
* Time-series charts

### Alert Management

Alerts are generated when process values satisfy configured alert conditions.

Example conditions:

```text
Tank level greater than 90%
Temperature greater than or equal to 45 °C
Pump status equal to FAULT
Flow rate below 2 m³/h for 30 seconds
PLC heartbeat unavailable
```

Alert lifecycle:

```text
ACTIVE → ACKNOWLEDGED → RESOLVED
```

Alert information may include:

* Alert severity
* Source device
* Source tag
* Trigger value
* Alert message
* Trigger time
* Acknowledged time
* Acknowledged user
* Resolution time

### PLC Simulation

The first version of the application will use a built-in PLC simulator.

Simulation controls may include:

* Start simulation
* Pause simulation
* Stop simulation
* Configure update interval
* Configure random noise
* Force a tag value
* Restore normal operation
* Trigger predefined fault scenarios

Example simulation scenarios:

* Normal operation
* High tank level
* Low inlet flow
* Pump failure
* Temperature increase
* Pressure increase
* Sensor communication failure
* PLC disconnection
* Poor data quality

### User Roles

The application uses three main roles.

#### ADMIN

Administrators can:

* Manage users
* Configure plants
* Configure devices
* Configure PLC tags
* Configure alert rules
* Start and stop simulations
* Trigger fault scenarios
* Acknowledge alerts
* Change system settings
* View audit logs

#### OPERATOR

Operators can:

* Monitor the plant
* View devices and PLC tags
* View historical trends
* Acknowledge alerts
* Run permitted simulations
* Perform approved control actions

#### VIEWER

Viewers can:

* View dashboards
* View device status
* View PLC tag values
* View trends
* View alert history

All permissions must be enforced by the backend. Frontend visibility rules must not be treated as application security.

## Planned API

The backend API will use a versioned base path:

```text
/api/v1
```

Example endpoints:

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

GET    /api/v1/plants
POST   /api/v1/plants
GET    /api/v1/plants/:plantId
PATCH  /api/v1/plants/:plantId

GET    /api/v1/devices
POST   /api/v1/devices
GET    /api/v1/devices/:deviceId
PATCH  /api/v1/devices/:deviceId

POST   /api/v1/devices/:deviceId/connect
POST   /api/v1/devices/:deviceId/disconnect

GET    /api/v1/devices/:deviceId/tags
POST   /api/v1/devices/:deviceId/tags
GET    /api/v1/tags/:tagId
PATCH  /api/v1/tags/:tagId

GET    /api/v1/readings/latest
GET    /api/v1/readings/history

GET    /api/v1/alerts
GET    /api/v1/alerts/:alertId
POST   /api/v1/alerts/:alertId/acknowledge

GET    /api/v1/alert-rules
POST   /api/v1/alert-rules
PATCH  /api/v1/alert-rules/:ruleId

GET    /api/v1/simulations
POST   /api/v1/simulations/start
POST   /api/v1/simulations/pause
POST   /api/v1/simulations/stop
POST   /api/v1/simulations/scenarios/:scenarioId/trigger

GET    /api/v1/audit-logs
```

Planned WebSocket endpoint:

```text
/api/v1/ws
```

## WebSocket Events

The backend will publish real-time events to connected clients.

Example event types:

```text
tag.reading.updated
device.status.changed
alert.triggered
alert.acknowledged
alert.resolved
simulation.started
simulation.paused
simulation.stopped
```

Example tag update:

```json
{
  "type": "tag.reading.updated",
  "timestamp": "2026-06-16T10:30:00Z",
  "data": {
    "tagId": "tag-123",
    "name": "Tank_Level",
    "value": 83.4,
    "unit": "%",
    "quality": "GOOD"
  }
}
```

## PLC Adapter Design

PLC communication should be implemented through a common adapter interface.

```text
PLCAdapter
├── SimulatorAdapter
├── ModbusAdapter
└── OPCUAAdapter
```

The simulation engine and physical PLC integrations should produce the same normalized reading format. This allows the rest of the backend to process readings without depending on a specific PLC protocol.

## Minimum Viable Product

The initial MVP should include:

* User authentication
* `ADMIN`, `OPERATOR`, and `VIEWER` roles
* One configurable plant
* One simulated PLC device
* Five to ten simulated PLC tags
* Real-time WebSocket updates
* Dashboard status indicators
* Historical tag readings
* Threshold-based alert rules
* Active, acknowledged, and resolved alerts
* Alert acknowledgement
* Simulation start and stop controls
* At least three fault scenarios
* Basic audit logging

## Future Features

Possible future improvements include:

* Multiple plants
* Multiple PLC devices
* Modbus TCP integration
* OPC UA integration
* PLC tag write commands
* Command confirmation workflows
* Alert delays and hysteresis
* Alert escalation
* Email or messaging notifications
* User-configurable dashboards
* Custom dashboard widgets
* Scheduled reports
* Maintenance mode
* Equipment runtime tracking
* Predictive maintenance
* Digital twin visualization
* Multilingual support
* High-availability deployment

## Development Status

This project is currently in the architecture and initial setup stage.

Implementation details, commands, dependencies, and environment variables will be added as the `client` and `server` applications are initialized.

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd plc-monitoring-app
```

The frontend and backend will be managed separately:

```bash
cd client
```

```bash
cd server
```

Refer to the README file inside each application folder for application-specific installation and development commands once those applications have been initialized.

## Environment Configuration

Environment variables should be documented in:

```text
.env.example
```

Expected configuration categories include:

```text
Client API URL
Client WebSocket URL
Server port
Database connection
Authentication secret
Allowed frontend origins
PLC simulation settings
Logging configuration
```

Do not commit real credentials or production secrets.

## Development Principles

* Keep the frontend and backend independently deployable.
* Keep PLC communication inside the backend.
* Use typed and validated API contracts.
* Enforce permissions on the server.
* Treat PLC values as untrusted external input.
* Keep simulation logic separate from alert logic.
* Use a common interface for simulated and physical PLC sources.
* Record important configuration and control actions in audit logs.
* Avoid premature support for multiple PLC protocols.
* Build and test the simulator before connecting physical equipment.

## Safety Notice

This application is initially intended for monitoring, simulation, learning, and demonstration purposes.

It must not be used to control production equipment or safety-critical industrial processes without appropriate engineering review, authentication, authorization, fail-safe mechanisms, network security, operational testing, and compliance with applicable industrial standards.

## License

A license has not yet been selected.
