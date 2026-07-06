## API Endpoints

The backend exposes a versioned REST API under:

```text
/api/v1
```

Protected endpoints require an authenticated user. Authorization is enforced by the backend according to the user's `ADMIN`, `OPERATOR`, or `VIEWER` role.

### Authentication

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/register
GET    /api/v1/auth/me
```

| Endpoint                     | Description                                         | Access        |
| ---------------------------- | --------------------------------------------------- | ------------- |
| `POST /api/v1/auth/login`    | Authenticate a user           | Public        |
| `POST /api/v1/auth/logout`   | Log out the current user      | Authenticated |
| `POST /api/v1/auth/register` | Create a new user account     | `ADMIN`       |
| `GET /api/v1/auth/me`        | Return the authenticated user, including `hasOwnedPlant` | Authenticated |

Public self-registration is disabled. New users are created by an administrator.

`GET /api/v1/auth/me` includes `hasOwnedPlant`, which is `true` when the current user has at least one plant in a plant `accessibleBy` list.

Because authentication uses stateless JWT access tokens, logout is primarily handled by the client removing the stored token. The backend may still record a `LOGOUT` audit event.

### Current User

```text
GET     /api/v1/users/me
PUT   /api/v1/users/me
```

| Endpoint                 | Description                                        | Access        |
| ------------------------ | -------------------------------------------------- | ------------- |
| `GET /api/v1/users/me`   | Get the current user's profile                     | Authenticated |
| `PUT /api/v1/users/me` | Update the current user's permitted profile fields | Authenticated |

Users should not be allowed to change their own role through this endpoint.

### User Administration

```text
GET      /api/v1/users
GET      /api/v1/users/:userId
PUT    /api/v1/users/:userId
DELETE   /api/v1/users/:userId
```

| Endpoint                       | Description                                   | Access  |
| ------------------------------ | --------------------------------------------- | ------- |
| `GET /api/v1/users`            | List application users                        | `ADMIN` |
| `GET /api/v1/users/:userId`    | Get a user by ID                              | `ADMIN` |
| `PUT /api/v1/users/:userId`  | Update a user, including their role and language | `ADMIN` |
| `DELETE /api/v1/users/:userId` | Delete a user                                | `ADMIN` |

An immutable user ID should be used instead of an email address when identifying users in URLs.

For auditability, adding a future `is_active` field and deactivating users may be preferable to permanently deleting them.

### Plants

```text
POST     /api/v1/plants
GET      /api/v1/plants
GET      /api/v1/plants/:plantId
PUT    /api/v1/plants/:plantId
DELETE   /api/v1/plants/:plantId
```

| Endpoint                         | Description                                  | Access        |
| -------------------------------- | -------------------------------------------- | ------------- |
| `POST /api/v1/plants`            | Create a plant and assign initial admin access | `ADMIN`       |
| `GET /api/v1/plants`             | List accessible plants    | Authenticated |
| `GET /api/v1/plants/:plantId`    | Get plant details         | Authenticated |
| `PUT /api/v1/plants/:plantId`  | Update a plant            | `ADMIN`       |
| `DELETE /api/v1/plants/:plantId` | Delete a plant            | `ADMIN`       |

### Process Units

Process units represent physical or process areas inside a plant, such as tanks, reactors, clarifiers, membrane units, pump stations, or other treatment stages.

```text
POST     /api/v1/plants/:plantId/process-units
GET      /api/v1/plants/:plantId/process-units

GET      /api/v1/process-units/:processUnitId
PUT      /api/v1/process-units/:processUnitId
DELETE   /api/v1/process-units/:processUnitId
```

| Endpoint                                      | Description                                   | Access        |
| --------------------------------------------- | --------------------------------------------- | ------------- |
| `POST /api/v1/plants/:plantId/process-units`  | Create a process unit for a plant             | `ADMIN`       |
| `GET /api/v1/plants/:plantId/process-units`   | List process units for a plant                | Authenticated |
| `GET /api/v1/process-units/:processUnitId`    | Get process unit details                      | Authenticated |
| `PUT /api/v1/process-units/:processUnitId`    | Update a process unit                         | `ADMIN`       |
| `DELETE /api/v1/process-units/:processUnitId` | Delete a process unit and related connections | `ADMIN`       |

Create and update requests may include `position` and `ports`:

```json
{
  "name": "Methane Reactor",
  "type": "Anaerobic Digestion",
  "description": "Methanogenesis process unit",
  "status": "ACTIVE",
  "position": { "x": 320, "y": 120 },
  "ports": [
    { "id": "in", "label": "In", "direction": "IN" },
    { "id": "out", "label": "Out", "direction": "OUT" }
  ]
}
```

When `ports` is omitted, the backend assigns default `in` and `out` ports. `position` is stored as JSON with `x` and `y` values for UI diagram placement.

Process unit create, update, and delete return a mutation response so the client can refresh its diagram state in one step:

```json
{
  "processUnit": {},
  "deletedProcessUnitId": "only-present-on-delete",
  "connections": []
}
```

`processUnit` includes the unit `ports` and `position`. Delete responses omit `processUnit`, include `deletedProcessUnitId`, and return remaining plant connections after connections involving the deleted unit are removed.

Process unit `type` should be treated as a flexible string so the app can support different treatment systems, such as AD, AO, A2O, SBR, MBR, MBBR, or custom pilot processes.

### Process Unit Connections

Process unit connections represent diagram arrows between source and target process-unit ports.

```text
POST     /api/v1/plants/:plantId/process-unit-connections
GET      /api/v1/plants/:plantId/process-unit-connections

GET      /api/v1/process-unit-connections/:connectionId
PUT      /api/v1/process-unit-connections/:connectionId
DELETE   /api/v1/process-unit-connections/:connectionId
```

| Endpoint                                                | Description                               | Access        |
| ------------------------------------------------------- | ----------------------------------------- | ------------- |
| `POST /api/v1/plants/:plantId/process-unit-connections` | Create a connection between process units | `ADMIN`       |
| `GET /api/v1/plants/:plantId/process-unit-connections`  | List process-unit connections for a plant | Authenticated |
| `GET /api/v1/process-unit-connections/:connectionId`    | Get process-unit connection details       | Authenticated |
| `PUT /api/v1/process-unit-connections/:connectionId`    | Update a process-unit connection          | `ADMIN`       |
| `DELETE /api/v1/process-unit-connections/:connectionId` | Delete a process-unit connection          | `ADMIN`       |

Connection create requests require both unit IDs and both port IDs:

```json
{
  "sourceUnitId": "source-process-unit-id",
  "sourcePortId": "out",
  "targetUnitId": "target-process-unit-id",
  "targetPortId": "in",
  "label": "Acid Tank to Methane Reactor",
  "flowType": "WASTEWATER"
}
```

Allowed `flowType` values are `WATER`, `WASTEWATER`, `SLUDGE`, `GAS`, `CHEMICAL`, `RAW_MATERIAL`, and `OTHERS`.

### Devices

```text
POST     /api/v1/devices
GET      /api/v1/devices
GET      /api/v1/devices/:deviceId
PUT    /api/v1/devices/:deviceId
DELETE   /api/v1/devices/:deviceId

POST     /api/v1/devices/:deviceId/connect
POST     /api/v1/devices/:deviceId/disconnect
```

| Endpoint                                    | Description                      | Access              |
| ------------------------------------------- | -------------------------------- | ------------------- |
| `POST /api/v1/devices`                      | Create a PLC or simulated device | `ADMIN`             |
| `GET /api/v1/devices`                       | List devices                     | Authenticated       |
| `GET /api/v1/devices/:deviceId`             | Get device details               | Authenticated       |
| `PUT /api/v1/devices/:deviceId`           | Update device configuration      | `ADMIN`             |
| `DELETE /api/v1/devices/:deviceId`          | Delete a device                  | `ADMIN`             |
| `POST /api/v1/devices/:deviceId/connect`    | Connect a device                 | `ADMIN`, `OPERATOR` |
| `POST /api/v1/devices/:deviceId/disconnect` | Disconnect a device              | `ADMIN`, `OPERATOR` |

Devices include a JSON `position` field with `x` and `y` values for UI placement.

Device connection actions are modeled as explicit commands because they cause operational state changes rather than ordinary resource updates.

The device list may support filters:

```text
GET /api/v1/devices?plantId=:plantId&status=:status&type=:type&protocol=:protocol
```

### Tags

```text
POST     /api/v1/devices/:deviceId/tags
GET      /api/v1/devices/:deviceId/tags
GET      /api/v1/process-units/:processUnitId/tags
GET      /api/v1/tags

GET      /api/v1/tags/:tagId
PUT    /api/v1/tags/:tagId
DELETE   /api/v1/tags/:tagId
```

| Endpoint                                            | Description                          | Access        |
| --------------------------------------------------- | ------------------------------------ | ------------- |
| `POST /api/v1/devices/:deviceId/tags`               | Create a tag for a device            | `ADMIN`       |
| `GET /api/v1/devices/:deviceId/tags`                | List tags assigned to a device       | Authenticated |
| `GET /api/v1/process-units/:processUnitId/tags`     | List tags grouped under a process unit | Authenticated |
| `GET /api/v1/tags`                                  | List tags with optional filters      | Authenticated |
| `GET /api/v1/tags/:tagId`                           | Get tag details and its latest value | Authenticated |
| `PUT /api/v1/tags/:tagId`                           | Update tag configuration             | `ADMIN`       |
| `DELETE /api/v1/tags/:tagId`                        | Delete a tag                         | `ADMIN`       |

The tag list may support filters:

```text
GET /api/v1/tags?plantId=:plantId&deviceId=:deviceId&processUnitId=:processUnitId&enabled=:enabled
```

When creating or updating a tag, `deviceId` is required and `processUnitId` is optional.

Tag writes should use a separate endpoint if control operations are added later:

```text
POST /api/v1/tags/:tagId/write
```

PLC write operations should require elevated authorization, validation, confirmation, and audit logging.

### Readings and Historical Data

```text
GET   /api/v1/readings/latest
GET   /api/v1/readings/history
```

Example requests:

```text
GET /api/v1/readings/latest?deviceId=:deviceId
GET /api/v1/readings/latest?processUnitId=:processUnitId
GET /api/v1/readings/latest?tagIds=:tagId1,:tagId2
```

```text
GET /api/v1/readings/history
    ?tagIds=:tagId1,:tagId2
    &from=:startTimestamp
    &to=:endTimestamp
    &interval=:aggregationInterval
```

| Endpoint                       | Description                                           | Access        |
| ------------------------------ | ----------------------------------------------------- | ------------- |
| `GET /api/v1/readings/latest`  | Return the latest values for selected tags or devices | Authenticated |
| `GET /api/v1/readings/history` | Return historical readings for a time range           | Authenticated |

The history endpoint should require a bounded time range and enforce a maximum response size.

### Alert Rules

Alert rules define the conditions that produce alert events.

```text
POST     /api/v1/alert-rules
GET      /api/v1/alert-rules
GET      /api/v1/alert-rules/:ruleId
PUT    /api/v1/alert-rules/:ruleId
DELETE   /api/v1/alert-rules/:ruleId
```

| Endpoint                             | Description                 | Access        |
| ------------------------------------ | --------------------------- | ------------- |
| `POST /api/v1/alert-rules`           | Create an alert rule        | `ADMIN`       |
| `GET /api/v1/alert-rules`            | List configured alert rules | Authenticated |
| `GET /api/v1/alert-rules/:ruleId`    | Get an alert rule           | Authenticated |
| `PUT /api/v1/alert-rules/:ruleId`  | Update an alert rule        | `ADMIN`       |
| `DELETE /api/v1/alert-rules/:ruleId` | Delete an alert rule        | `ADMIN`       |

### Alert Events

Alerts represent actual events generated by the alert engine.

```text
GET    /api/v1/alerts
GET    /api/v1/alerts/:alertId
POST   /api/v1/alerts/:alertId/acknowledge
POST   /api/v1/alerts/:alertId/resolve
```

| Endpoint                                   | Description                       | Access              |
| ------------------------------------------ | --------------------------------- | ------------------- |
| `GET /api/v1/alerts`                       | List active and historical alerts | Authenticated       |
| `GET /api/v1/alerts/:alertId`              | Get alert details                 | Authenticated       |
| `POST /api/v1/alerts/:alertId/acknowledge` | Acknowledge an active alert       | `ADMIN`, `OPERATOR` |
| `POST /api/v1/alerts/:alertId/resolve`     | Manually resolve an alert         | `ADMIN`, `OPERATOR` |

Example filters:

```text
GET /api/v1/alerts?status=ACTIVE
GET /api/v1/alerts?severity=CRITICAL
GET /api/v1/alerts?plantId=:plantId
GET /api/v1/alerts?from=:startTimestamp&to=:endTimestamp
```

Alert resolution should normally be performed automatically by the alert engine when the triggering condition returns to a normal state. The manual resolve endpoint is useful for simulated workflows or administrative correction.

### Simulations

```text
POST   /api/v1/simulations
GET    /api/v1/simulations
GET    /api/v1/simulations/:simulationId
PUT    /api/v1/simulations/:simulationId
DELETE /api/v1/simulations/:simulationId

POST   /api/v1/simulations/:simulationId/start
POST   /api/v1/simulations/:simulationId/pause
POST   /api/v1/simulations/:simulationId/stop
```

| Endpoint                                       | Description                         | Access              |
| ---------------------------------------------- | ----------------------------------- | ------------------- |
| `POST /api/v1/simulations`                     | Create a simulation instance        | `ADMIN`             |
| `GET /api/v1/simulations`                      | List simulations and their statuses | Authenticated       |
| `GET /api/v1/simulations/:simulationId`        | Get simulation details              | Authenticated       |
| `PUT /api/v1/simulations/:simulationId`        | Update simulation configuration     | `ADMIN`             |
| `DELETE /api/v1/simulations/:simulationId`     | Delete a simulation                 | `ADMIN`             |
| `POST /api/v1/simulations/:simulationId/start` | Start a simulation                  | `ADMIN`, `OPERATOR` |
| `POST /api/v1/simulations/:simulationId/pause` | Pause a simulation                  | `ADMIN`, `OPERATOR` |
| `POST /api/v1/simulations/:simulationId/stop`  | Stop a simulation                   | `ADMIN`, `OPERATOR` |

Using `simulationId` allows the application to support multiple plants or simulation instances later.

For an MVP that only permits one global simulation, the simpler endpoints may initially be used:

```text
POST   /api/v1/simulations/start
POST   /api/v1/simulations/pause
POST   /api/v1/simulations/stop
GET    /api/v1/simulations
POST   /api/v1/simulations/scenarios/:scenarioId/trigger
```

### Simulation Scenarios

```text
GET    /api/v1/simulation-scenarios
POST   /api/v1/simulations/:simulationId/scenarios
GET    /api/v1/simulation-scenarios/:scenarioId
PUT    /api/v1/simulation-scenarios/:scenarioId
DELETE /api/v1/simulation-scenarios/:scenarioId
POST   /api/v1/simulations/:simulationId/scenarios/:scenarioId/trigger
```

| Endpoint                                                               | Description                        | Access              |
| ---------------------------------------------------------------------- | ---------------------------------- | ------------------- |
| `GET /api/v1/simulation-scenarios`                                     | List available fault scenarios     | Authenticated       |
| `POST /api/v1/simulations/:simulationId/scenarios`                     | Create a scenario for a simulation | `ADMIN`             |
| `GET /api/v1/simulation-scenarios/:scenarioId`                         | Get scenario details               | Authenticated       |
| `PUT /api/v1/simulation-scenarios/:scenarioId`                         | Update a scenario                  | `ADMIN`             |
| `DELETE /api/v1/simulation-scenarios/:scenarioId`                      | Delete a scenario                  | `ADMIN`             |
| `POST /api/v1/simulations/:simulationId/scenarios/:scenarioId/trigger` | Trigger a scenario                 | `ADMIN`, `OPERATOR` |

### Audit Logs

```text
GET   /api/v1/audit-logs
GET   /api/v1/audit-logs/:auditLogId
```

| Endpoint                             | Description                           | Access  |
| ------------------------------------ | ------------------------------------- | ------- |
| `GET /api/v1/audit-logs`             | List recorded user and system actions | `ADMIN` |
| `GET /api/v1/audit-logs/:auditLogId` | Get an audit log entry                | `ADMIN` |

Example filters:

```text
GET /api/v1/audit-logs?userId=:userId
GET /api/v1/audit-logs?action=:action
GET /api/v1/audit-logs?from=:startTimestamp&to=:endTimestamp
```

Audit logs should be append-only and should not expose update or deletion endpoints through the application API.

### WebSocket

```text
GET /api/v1/ws/simulation
```

The simulation WebSocket broadcasts real-time events such as:

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

The client should retrieve initial state through the REST API and then use the WebSocket connection for incremental real-time updates.

If the application later broadcasts events from both simulated and physical PLCs, the endpoint can be generalized to:

```text
GET /api/v1/ws
```

or:

```text
GET /api/v1/ws/realtime
```

This avoids tying the frontend real-time architecture exclusively to simulated data.
