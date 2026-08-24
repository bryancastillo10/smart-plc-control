import type { ArchitectureData } from './components/ArchitectureMap'
import { deriveArchetype, deriveHeight, deriveSize, packLayout } from './core/layout'
import type { ArchEdge, ArchFlow, ArchNode, Group } from './core/types'
import { MEASURED, UNCLAIMED } from './measured.generated'

export const GROUPS = [
  { id: 'entry', label: 'Entry & control' },
  { id: 'identity', label: 'Identity & access' },
  { id: 'plant', label: 'Plant model' },
  { id: 'telemetry', label: 'Telemetry & alarms' },
  { id: 'simulation', label: 'Simulation loop' },
  { id: 'contracts', label: 'Contracts & storage' },
  { id: 'outside', label: 'Outside world' },
] as const satisfies readonly Group[]

type AuthoredNode = Omit<ArchNode, 'archetype' | 'params' | 'footprint' | 'height' | 'count' | 'loc'>

const AUTHORED_NODES: readonly AuthoredNode[] = [
  {
    id: 'runtime', code: 'RT', name: 'API runtime', role: 'the process launcher', group: 'entry',
    whatItDoes: 'Starts the service: loads environment settings, optionally migrates the database, connects storage, and opens the [[Gin]] listener.',
    howItsBuilt: 'Startup is deliberately linear in one small entrypoint. A migration flag exits before HTTP starts, while the normal path hands CORS and the shared database handle to bootstrap.',
    files: ['cmd/api/main.go', 'bootstrap/run_gin.go'], stack: ['Go', 'Gin'],
  },
  {
    id: 'routes', code: 'RO', name: 'Route registry', role: 'the request switchboard', group: 'entry',
    whatItDoes: 'Defines the complete `/api/v1` surface and constructs the handler stack for every domain. It also starts the background simulation engine when WebSocket routes are registered.',
    howItsBuilt: 'Routes are grouped by resource and attach authentication and role guards at the narrowest useful level, so access policy is visible beside each endpoint.',
    files: ['bootstrap/routes.go'], stack: ['Gin router groups'],
  },
  {
    id: 'middleware', code: 'MW', name: 'Request gates', role: 'the session and role gate', group: 'entry',
    whatItDoes: 'Authenticates bearer headers or cookies, exposes the user and claims to handlers, enforces roles, and turns application errors into consistent JSON.',
    howItsBuilt: 'JWT validation and role authorization are separate middleware. That lets read routes require only a valid session while mutations add explicit ADMIN or OPERATOR checks.',
    files: ['internal/middleware/jwt_auth.go', 'internal/middleware/role.go', 'internal/middleware/error_handler.go'], stack: ['Gin', 'golang-jwt'],
  },
  {
    id: 'http-foundation', code: 'HF', name: 'HTTP foundation', role: 'the boundary toolkit', group: 'entry',
    whatItDoes: 'Provides typed request binding, user-ID extraction, structured application errors, password hashing, cookies, JWT creation, UUID parsing, and patch helpers.',
    howItsBuilt: 'Generic bind helpers keep handlers short, while domain-neutral errors carry status codes up to one global error middleware.',
    files: ['pkg/http/bindjson.go', 'pkg/http/extract_userid.go', 'pkg/errors/errors.go', 'pkg/utils/jwt.go', 'pkg/utils/patch.go'], stack: ['Gin', 'bcrypt', 'UUID'],
  },
  {
    id: 'identity', code: 'ID', name: 'Identity', role: 'the account authority', group: 'identity',
    whatItDoes: 'Registers users, verifies credentials, issues the JWT cookie, resolves the current profile, and lets administrators manage accounts.',
    howItsBuilt: 'Authentication and user administration use the same handler-service-repository layering, but password hashes never cross the response DTO boundary.',
    files: ['internal/auth/handler.go', 'internal/auth/service.go', 'internal/auth/repo.go', 'internal/users/service.go', 'internal/users/repo.go'], stack: ['GORM', 'bcrypt', 'JWT'],
  },
  {
    id: 'plants', code: 'PL', name: 'Plants', role: 'the site catalog', group: 'plant',
    whatItDoes: 'Creates and maintains industrial plants, including the users allowed to see each site.',
    howItsBuilt: 'Accessible user IDs live on the plant record, making plant visibility an explicit part of the aggregate rather than a separate join service.',
    files: ['internal/plants/handler.go', 'internal/plants/service.go', 'internal/plants/repo.go', 'internal/plants/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'process-units', code: 'PU', name: 'Process layout', role: 'the topology editor', group: 'plant',
    whatItDoes: 'Builds the plant topology from process units, ports, positions, and directed connections between units.',
    howItsBuilt: 'Connection validation lives in the service, including same-plant and duplicate checks. Deleting a unit clears its connections first to preserve topology integrity.',
    files: ['internal/process_units/handler.go', 'internal/process_units/service.go', 'internal/process_units/repo.go', 'internal/process_units/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'devices', code: 'DV', name: 'Devices', role: 'the equipment registry', group: 'plant',
    whatItDoes: 'Registers PLC, sensor, actuator, and simulator devices and tracks whether each is enabled or connected.',
    howItsBuilt: 'Connect and disconnect are state transitions on the persisted device record; the current implementation models connectivity without a protocol driver layer.',
    files: ['internal/devices/handler.go', 'internal/devices/service.go', 'internal/devices/repo.go', 'internal/devices/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'tags', code: 'TG', name: 'Tags', role: 'the signal catalog', group: 'plant',
    whatItDoes: 'Defines named signals on devices, optionally associates them with a process unit, and returns each tag with its latest reading.',
    howItsBuilt: 'Type-specific limits and process-unit membership are validated before persistence; latest values are joined at read time instead of copied onto tag rows.',
    files: ['internal/tags/handler.go', 'internal/tags/service.go', 'internal/tags/repo.go', 'internal/tags/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'models', code: 'MO', name: 'Data model', role: 'the shared schema vocabulary', group: 'plant',
    whatItDoes: 'Names the persistent records and enums shared across plants, equipment, signals, alerts, simulations, and audit history.',
    howItsBuilt: 'Small files keep each table legible, while UUID relations and typed enums make cross-domain state explicit to GORM and API DTOs.',
    files: ['internal/models/plants.go', 'internal/models/process_units.go', 'internal/models/devices.go', 'internal/models/tags.go', 'internal/models/simulations.go', 'internal/models/enum.go'], stack: ['GORM', 'PostgreSQL', 'UUID'],
  },
  {
    id: 'tag-readings', code: 'TR', name: 'Tag readings', role: 'the telemetry query layer', group: 'telemetry',
    whatItDoes: 'Returns latest and historical signal values, filtered by tags, devices, process units, and time windows.',
    howItsBuilt: 'Latest-value queries use PostgreSQL ordering over the append-only reading table, keeping ingestion separate from read projections.',
    files: ['internal/tag_readings/handler.go', 'internal/tag_readings/service.go', 'internal/tag_readings/repo.go', 'internal/tag_readings/dto.go'], stack: ['GORM', 'PostgreSQL'],
  },
  {
    id: 'alert-rules', code: 'AR', name: 'Alert rules', role: 'the threshold policy', group: 'telemetry',
    whatItDoes: 'Defines enabled thresholds for a tag, including comparison operator, severity, message, and timing behavior.',
    howItsBuilt: 'Rule validation is data-type aware: numeric, text, and boolean tags accept different conditions before a rule is written.',
    files: ['internal/alert_rules/handler.go', 'internal/alert_rules/service.go', 'internal/alert_rules/repo.go', 'internal/alert_rules/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'alerts', code: 'AL', name: 'Alerts', role: 'the incident ledger', group: 'telemetry',
    whatItDoes: 'Lists triggered alarms and moves them through active, acknowledged, and resolved states.',
    howItsBuilt: 'Acknowledgement records the acting user and timestamp, while resolution is a separate transition; both reload the related rule for complete responses.',
    files: ['internal/alerts/handler.go', 'internal/alerts/service.go', 'internal/alerts/repo.go', 'internal/alerts/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'audit-logs', code: 'AU', name: 'Audit history', role: 'the administrative record', group: 'telemetry',
    whatItDoes: 'Lets administrators filter and inspect recorded user actions by actor, action, entity, and time range.',
    howItsBuilt: 'Audit reads preload optional user details and cap list responses by default, preserving historical rows even when an actor is absent.',
    files: ['internal/audit_logs/handler.go', 'internal/audit_logs/service.go', 'internal/audit_logs/repo.go', 'internal/audit_logs/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'simulations', code: 'SI', name: 'Simulations', role: 'the run controller', group: 'simulation',
    whatItDoes: 'Creates simulation definitions and controls their idle, running, paused, and stopped lifecycle.',
    howItsBuilt: 'Lifecycle timestamps and status transitions are persisted by the service, while the background engine independently discovers rows marked RUNNING.',
    files: ['internal/simulations/handler.go', 'internal/simulations/service.go', 'internal/simulations/repo.go', 'internal/simulations/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'scenarios', code: 'SC', name: 'Scenarios', role: 'the disturbance presets', group: 'simulation',
    whatItDoes: 'Stores reusable simulation scenarios and triggers a scenario only against the simulation that owns it.',
    howItsBuilt: 'The trigger path validates both identifiers together before updating trigger metadata, preventing a scenario from leaking across simulations.',
    files: ['internal/simulation_scenarios/handler.go', 'internal/simulation_scenarios/service.go', 'internal/simulation_scenarios/repo.go', 'internal/simulation_scenarios/dto.go'], stack: ['Gin', 'GORM'],
  },
  {
    id: 'simulation-engine', code: 'SE', name: 'Simulation engine', role: 'the reading generator', group: 'simulation',
    whatItDoes: 'Polls running simulations, finds eligible simulator tags, generates plausible next values, and appends [[tag readings]].',
    howItsBuilt: 'One ticker drives a cancellable loop. Numeric values combine mean reversion with bounded noise; boolean and text tags use type-specific generators.',
    files: ['internal/simulation_engine/engine.go', 'internal/simulation_engine/generator.go', 'internal/simulation_engine/repo.go'], stack: ['Go goroutines', 'GORM'],
  },
  {
    id: 'websockets', code: 'WS', name: 'Live stream', role: 'the telemetry broadcaster', group: 'simulation',
    whatItDoes: 'Upgrades authenticated requests and repeatedly sends simulation state plus live device, reading, and alert snapshots.',
    howItsBuilt: 'Each client owns a bounded send queue and writer goroutine. A slow client is dropped instead of blocking the hub or other streams.',
    files: ['internal/websockets/handler.go', 'internal/websockets/service.go', 'internal/websockets/hub.go', 'internal/websockets/dto.go'], stack: ['Gorilla WebSocket', 'Gin', 'GORM'],
  },
  {
    id: 'database', code: 'DB', name: 'Database wiring', role: 'the storage adapter', group: 'contracts',
    whatItDoes: 'Loads runtime configuration, opens the PostgreSQL connection, and applies the declared GORM schema when migration mode is requested.',
    howItsBuilt: 'The shared connection is established once at startup. Auto-migration is opt-in through `--migrate`, keeping schema work out of normal server boot.',
    files: ['platforms/database/connect_db.go', 'platforms/database/sync_db.go', 'platforms/config/load_env.go', 'platforms/config/migration.go'], stack: ['GORM', 'PostgreSQL', 'godotenv'],
  },
  {
    id: 'api-contracts', code: 'AP', name: 'API contracts', role: 'the human-facing contract', group: 'contracts',
    whatItDoes: 'Documents REST and WebSocket endpoints alongside the persistent schema expected by the service.',
    howItsBuilt: 'The contracts are checked-in Markdown kept beside the Go module, making review possible without running a documentation generator.',
    files: ['API.MD', 'SCHEMA.MD'], stack: ['Markdown'],
  },
  {
    id: 'api-tests', code: 'AT', name: 'HTTP probes', role: 'the executable request catalog', group: 'contracts',
    whatItDoes: 'Provides runnable HTTP examples for authentication and every resource area, including simulation and telemetry paths.',
    howItsBuilt: 'One request file per resource keeps environment variables and example payloads close to the endpoint being exercised.',
    files: ['api_tests/auth.http', 'api_tests/plants.http', 'api_tests/simulations.http', 'api_tests/tag_readings.http', 'api_tests/alerts.http'], stack: ['HTTP client files'],
  },
  {
    id: 'tooling', code: 'TL', name: 'Build tooling', role: 'the developer loop', group: 'contracts',
    whatItDoes: 'Pins Go dependencies and defines the run, migration, test, formatting, hot-reload, and WebSocket commands used during development.',
    howItsBuilt: 'The Makefile stays a thin command index; Air owns hot reload and Go modules remain the dependency source of truth.',
    files: ['go.mod', 'go.sum', 'Makefile', 'air.toml'], stack: ['Go modules', 'Make', 'Air'],
  },
  {
    id: 'api-clients', code: 'UI', name: 'API clients', role: 'the caller and live viewer', group: 'outside',
    whatItDoes: 'Represents browsers and tools that send REST requests and consume the simulation WebSocket stream.',
    howItsBuilt: 'This is an outside-world landmark, not code measured in the server package. The checked-in client and HTTP probes are concrete consumers of the contract.',
    files: [], stack: ['HTTP', 'WebSocket'],
  },
  {
    id: 'postgres', code: 'PG', name: 'PostgreSQL', role: 'the system of record', group: 'outside',
    whatItDoes: 'Stores accounts, plant topology, telemetry, alert state, simulations, scenarios, and audit history.',
    howItsBuilt: 'Repositories issue GORM queries against one shared PostgreSQL connection; several telemetry reads intentionally use PostgreSQL-specific query shapes.',
    files: [], stack: ['PostgreSQL'],
  },
]

const layoutInputs = AUTHORED_NODES.map((node) => {
  const measure = MEASURED[node.id] ?? { count: 0, loc: 0 }
  const { archetype, params } = deriveArchetype(measure)
  return { item: node.id, group: node.group, size: deriveSize(archetype, params, measure) }
})

const footprints = packLayout(layoutInputs, GROUPS.map((group) => group.id))

export const NODES: readonly ArchNode[] = AUTHORED_NODES.map((node) => {
  const measure = MEASURED[node.id] ?? { count: 0, loc: 0 }
  const { archetype, params } = deriveArchetype(measure)
  return {
    ...node,
    archetype,
    params,
    footprint: footprints.get(node.id)!,
    height: deriveHeight(measure),
    count: measure.count,
    loc: measure.loc,
  }
})

export const EDGES = [
  { id: 'client-routes', from: 'api-clients', to: 'routes', kind: 'call', label: 'HTTP or WebSocket request', flowIds: ['sign-in', 'plant-layout', 'live-telemetry', 'triage-alert'] },
  { id: 'runtime-database', from: 'runtime', to: 'database', kind: 'call', label: 'environment and DB startup', flowIds: [] },
  { id: 'database-postgres', from: 'database', to: 'postgres', kind: 'call', label: 'connection or migration', flowIds: [] },
  { id: 'runtime-routes', from: 'runtime', to: 'routes', kind: 'call', label: 'router registration', flowIds: ['generate-readings'] },
  { id: 'routes-middleware', from: 'routes', to: 'middleware', kind: 'call', label: 'JWT and role guard', flowIds: ['plant-layout', 'live-telemetry', 'triage-alert'] },
  { id: 'routes-identity', from: 'routes', to: 'identity', kind: 'call', label: 'login handler dispatch', flowIds: ['sign-in'] },
  { id: 'middleware-process', from: 'middleware', to: 'process-units', kind: 'call', label: 'authorized topology request', flowIds: ['plant-layout'] },
  { id: 'middleware-alerts', from: 'middleware', to: 'alerts', kind: 'call', label: 'authorized alert action', flowIds: ['triage-alert'] },
  { id: 'middleware-websocket', from: 'middleware', to: 'websockets', kind: 'call', label: 'authorized stream upgrade', flowIds: ['live-telemetry'] },
  { id: 'routes-engine', from: 'routes', to: 'simulation-engine', kind: 'call', label: 'background Run goroutine', flowIds: ['generate-readings'] },
  { id: 'identity-postgres', from: 'identity', to: 'postgres', kind: 'data', label: 'account lookup', flowIds: ['sign-in'] },
  { id: 'process-postgres', from: 'process-units', to: 'postgres', kind: 'data', label: 'unit and connection rows', flowIds: ['plant-layout'] },
  { id: 'alerts-postgres', from: 'alerts', to: 'postgres', kind: 'data', label: 'alert state transition', flowIds: ['triage-alert'] },
  { id: 'engine-postgres', from: 'simulation-engine', to: 'postgres', kind: 'data', label: 'generated tag readings', flowIds: ['generate-readings'] },
  { id: 'websocket-postgres', from: 'websockets', to: 'postgres', kind: 'call', label: 'snapshot queries', flowIds: ['live-telemetry'] },
  { id: 'postgres-websocket', from: 'postgres', to: 'websockets', kind: 'data', label: 'telemetry snapshot', flowIds: ['live-telemetry'] },
  { id: 'websocket-client', from: 'websockets', to: 'api-clients', kind: 'data', label: 'JSON WebSocket events', flowIds: ['live-telemetry'] },
  { id: 'middleware-plants', from: 'middleware', to: 'plants', kind: 'call', label: 'plant request', flowIds: [] },
  { id: 'middleware-devices', from: 'middleware', to: 'devices', kind: 'call', label: 'device request', flowIds: [] },
  { id: 'middleware-tags', from: 'middleware', to: 'tags', kind: 'call', label: 'tag request', flowIds: [] },
  { id: 'middleware-readings', from: 'middleware', to: 'tag-readings', kind: 'call', label: 'reading query', flowIds: [] },
  { id: 'middleware-rules', from: 'middleware', to: 'alert-rules', kind: 'call', label: 'rule request', flowIds: [] },
  { id: 'middleware-audit', from: 'middleware', to: 'audit-logs', kind: 'call', label: 'admin audit query', flowIds: [] },
  { id: 'middleware-simulations', from: 'middleware', to: 'simulations', kind: 'call', label: 'simulation command', flowIds: [] },
  { id: 'middleware-scenarios', from: 'middleware', to: 'scenarios', kind: 'call', label: 'scenario command', flowIds: [] },
  { id: 'database-models', from: 'database', to: 'models', kind: 'support', label: 'AutoMigrate declarations', flowIds: [] },
  { id: 'tests-routes', from: 'api-tests', to: 'routes', kind: 'call', label: 'example HTTP requests', flowIds: [] },
  { id: 'tooling-runtime', from: 'tooling', to: 'runtime', kind: 'support', label: 'run and migrate commands', flowIds: [] },
] as const satisfies readonly ArchEdge[]

export const FLOWS = [
  { id: 'sign-in', name: 'Sign in', payload: 'credentials', summary: 'Verify an account and establish the authenticated session.', route: ['client-routes', 'routes-identity', 'identity-postgres'] },
  { id: 'plant-layout', name: 'Build plant layout', payload: 'topology change', summary: 'Authorize an administrator and persist a process unit or connection.', route: ['client-routes', 'routes-middleware', 'middleware-process', 'process-postgres'] },
  { id: 'generate-readings', name: 'Generate readings', payload: 'simulated tag readings', summary: 'Start the background engine and append generated values for running simulations.', route: ['runtime-routes', 'routes-engine', 'engine-postgres'] },
  { id: 'live-telemetry', name: 'Stream telemetry', payload: 'telemetry snapshot', summary: 'Authorize a socket, query the current plant snapshot, and push JSON events to the client.', route: ['client-routes', 'routes-middleware', 'middleware-websocket', 'websocket-postgres', 'postgres-websocket', 'websocket-client'] },
  { id: 'triage-alert', name: 'Triage alert', payload: 'alert transition', summary: 'Authorize an operator and persist an acknowledgement or resolution.', route: ['client-routes', 'routes-middleware', 'middleware-alerts', 'alerts-postgres'] },
] as const satisfies readonly ArchFlow[]

export const INTRO = {
  title: 'Smart PLC Control server',
  lede: 'A Gin API that models industrial plants, generates simulated PLC telemetry, and streams live operational snapshots.',
  whatItDoes: 'The server owns authentication, plant topology, devices and tags, telemetry queries, alert state, and simulation control. A background engine writes synthetic readings while an authenticated WebSocket endpoint reads the latest system state back to clients.',
  howItsBuilt: 'Most domains follow the same handler → service → repository seam. Gin owns transport, services enforce business rules, GORM repositories own persistence, and shared model types keep the PostgreSQL schema consistent across domains.',
}

export const ARCHITECTURE: ArchitectureData = {
  groups: GROUPS,
  nodes: NODES,
  edges: EDGES,
  flows: FLOWS,
  intro: INTRO,
  unmapped: UNCLAIMED,
  repo: 'smart-plc-control/server',
}
