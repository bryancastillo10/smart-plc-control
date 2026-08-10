# Simulator WebSocket Pipeline

## Purpose

Use this document as implementation context for synchronizing simulator state between the Go server and React frontend.

## Current Server Behavior

```text
GET /api/v1/ws/simulation
server/internal/websockets/
```

The socket currently streams **simulation metadata only**. It does not generate or stream tag readings, device changes, or alerts.

The handler validates the query, upgrades the connection, sends one snapshot immediately, then polls the `simulations` table and sends snapshots at `intervalMs`. JWT middleware is temporarily disabled for this route.

| Query | Values | Default |
| --- | --- | --- |
| `plantId` | Plant UUID | All plants |
| `status` | `IDLE`, `RUNNING`, `PAUSED`, `STOPPED` | All statuses |
| `intervalMs` | `250`–`10000` | `1000` |

```ts
type SimulationSnapshotMessage = {
  type: "simulation.snapshot";
  data?: Simulation[];
  error?: string;
  sentAt: string;
};
```

`Simulation` matches `client/src/types/simulation.ts`. When `error` exists, preserve the last valid cache.

## Current Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant Cache as TanStack Query
    participant REST as REST API
    participant WS as WebSocket
    participant DB as Database

    UI->>REST: GET /simulations?plantId=...
    REST-->>Cache: Initial Simulation[]
    UI->>WS: Connect /ws/simulation?plantId=...
    WS->>DB: Poll simulations
    WS-->>UI: simulation.snapshot
    UI->>Cache: Replace matching list and details
    Cache-->>UI: Re-render
```

Start, pause, stop, and scenario commands remain REST operations:

```text
POST /simulations/:simulationId/start
POST /simulations/:simulationId/pause
POST /simulations/:simulationId/stop
POST /simulations/:simulationId/scenarios/:scenarioId/trigger
```

Update the cache from each REST response immediately. The next socket snapshot reconciles server state.

## Frontend Implementation

Suggested files:

```text
client/src/features/simulations/websocketTypes.ts
client/src/features/simulations/createSimulationSocketUrl.ts
client/src/features/simulations/useSimulationStream.ts
```

Enable WebSocket proxying in `client/vite.config.ts`:

```ts
"/api": {
  target: "http://localhost:8080",
  changeOrigin: true,
  ws: true,
}
```

Build a same-origin URL inside a client-only effect:

```ts
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const url = new URL(
  "/api/v1/ws/simulation",
  `${protocol}//${window.location.host}`,
);
```

`useSimulationStream` must:

- Open one socket for the selected plant.
- Validate messages and ignore unknown event types.
- Replace only the TanStack Query list matching the socket filters.
- Update `simulationQueryKeys.detail(id)` for every snapshot item.
- Preserve cached data on envelope errors.
- Recreate the socket when filters change and close it on unmount.
- Reconnect unexpected closures with exponential backoff capped at 30 seconds.
- Expose `connecting`, `open`, `reconnecting`, `closed`, or `error` state.

```ts
queryClient.setQueryData(
  simulationQueryKeys.list({ plantId, status }),
  message.data,
);
```

Treat the stream as stale after `max(intervalMs * 3, 5000 ms)` without a valid message. Keep the last data visible while reconnecting.

## Authentication

Browser WebSockets cannot set an `Authorization` header. Before restoring `JWTAuthMiddleware()`:

1. Authenticate with the same-origin HttpOnly cookie used by REST.
2. Verify access to the requested `plantId`.
3. Restrict origins and use `wss://` in production.
4. Configure the production proxy for WebSocket upgrade headers.

Avoid long-lived tokens in query parameters.

## Missing Live Telemetry

The server has no simulation tick that creates `TagReadings`, and the current hub has no shared broadcast API.

```mermaid
flowchart LR
    Tick[Simulation tick] --> Generate[Generate tag values]
    Generate --> Persist[Persist TagReadings]
    Persist --> Alerts[Evaluate alert rules]
    Persist --> Publish[Publish events]
    Alerts --> Publish
    Publish --> Hub[Shared plant-aware hub]
    Hub --> Cache[TanStack Query cache]
```

Required server work:

1. Create one shared hub or publisher during bootstrap.
2. Inject a publisher into simulation, reading, device, and alert services.
3. Add plant-scoped subscriptions.
4. Generate and persist readings while a simulation is `RUNNING`.
5. Evaluate alerts after persistence and publish only successful changes.
6. Add event IDs or sequence numbers for deduplication.
7. Recover through REST snapshots after reconnecting.

Proposed events:

```text
simulation.snapshot
simulation.started
simulation.paused
simulation.stopped
tag.reading.updated
device.status.changed
alert.triggered
alert.acknowledged
alert.resolved
```

REST and the database remain the source of truth. WebSockets deliver changes.

## Implementation Order

1. Add the proxy, message types, URL builder, and `useSimulationStream`.
2. Synchronize simulation list/detail caches and display connection state.
3. Add the server simulation tick and reading persistence.
4. Add the shared publisher, plant subscriptions, and telemetry events.
5. Update reading, alert, health, and process-overview caches from events.
6. Resynchronize through REST after reconnecting.

## Completion Checks

- Only one socket exists for the selected plant.
- The first snapshot renders immediately.
- REST commands update the UI before the next snapshot.
- Errors do not erase cached data.
- Plant changes close the previous socket.
- Unexpected closure reconnects with bounded backoff.
- Production uses authenticated `wss://` connections.
- Users cannot subscribe to inaccessible plants.

