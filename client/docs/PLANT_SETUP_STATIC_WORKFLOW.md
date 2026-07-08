# Plant Setup Workflow

## Purpose

The `_authenticated/plant-setup` route is used for a newly logged-in `ADMIN` user who does not yet have a fully configured plant.

This route is a multi-step onboarding workflow for creating and configuring a PLC monitoring plant.

This document describes the **first phase** of implementation.

The first phase should focus only on the **static frontend workflow**. Backend API integration will be handled later.

---

## Goal

Create the static frontend workflow only.

For this phase:

* Do not connect forms to the backend API.
* Do not call backend endpoints.
* Do not use real database data.
* Do not create server functions.
* Do not implement real authentication or redirect guards yet.
* Use local React state only.
* Use mock data or placeholder data where needed.

The goal is to let the `ADMIN` user move through the complete plant setup experience before backend integration is added.

---

## Reference Files

Use the following files as the source of truth for entity fields, relationships, and future request formats:

```txt
server/SCHEMA.MD
server/API.MD
```

Do not duplicate all schema fields in this document.

When creating forms, use the relevant entities from `server/SCHEMA.MD`.

When preparing future API integration points and React local states, refer to `server/API.MD`.

For this phase, all form submissions should update local React state only.

---

## Workflow Steps

The plant setup workflow should include these steps:

1. Create Plant Information
2. Create Process Units
3. Arrange Process Diagram and Create Process Unit Connections
4. Create Devices
5. Create Tags and Assign Tags
6. Create Alert Rules
7. Create Simulation and Simulation Scenarios if a Simulator Device was created
8. Create or Invite Users to Operate
9. Review Setup
10. Go to Dashboard

The final dashboard destination is:

```txt
/dashboard
```

For this phase, the dashboard action may be a placeholder.

---

## Workflow Behavior

The user should be able to:

* Move to the next step.
* Go back to the previous step.
* See the current active step.
* Fill forms using local React state.
* Add multiple process units.
* Add multiple devices.
* Add multiple tags.
* Add multiple alert rules.
* Review all entered setup data before finishing.

The setup state should be managed in a custom hook under the plant setup feature folder.

Suggested location:

```txt
src/features/plant-setup/hooks/usePlantSetupWorkflow.ts
```

---

## Local State Requirement

Use one local workflow state object to store all setup data during this static phase.

The state should include the main entities needed by the workflow, such as:

```ts
type PlantSetupWorkflowState = {
  plant: unknown | null;
  processUnits: unknown[];
  processUnitConnections: unknown[];
  devices: unknown[];
  tags: unknown[];
  alertRules: unknown[];
  simulations: unknown[];
  simulationScenarios: unknown[];
  users: unknown[];
};
```

Codex should replace `unknown` with the proper frontend types based on `server/SCHEMA.MD`.

The local state does not need to perfectly match backend models yet, but it should be close enough to make future API integration easy.

---

## Interactive Process Diagram Requirement

The process diagram should be implemented as a simple custom interactive diagram.

For this phase, do not use a full diagram library unless the project already has one installed.

Use:

* A relative `div` as the diagram canvas.
* `useRef<HTMLDivElement | null>` for the canvas container.
* Absolutely positioned process unit cards.
* Local React state for process unit positions.
* Mouse events for dragging cards.
* Optional touch events for mobile support.
* An SVG overlay for simple process unit connection lines.

Each process unit card should visually display:

* Process unit name
* Process unit type
* Lucide icon
* Optional status or metadata

When a process unit card is dragged:

* Update its local position in React state.
* Keep the card inside the diagram container bounds.
* Re-render any connection lines connected to that process unit.
* Do not send a backend request.

Process unit connections should be local only in this phase.

A connection should represent:

```ts
type ProcessUnitConnection = {
  sourceProcessUnitId: string;
  targetProcessUnitId: string;
  label?: string;
};
```

The connection line can be rendered using SVG from the center of the source card to the center of the target card.

The purpose of the diagram is to let the `ADMIN` arrange the visual plant process flow before backend persistence is added.

---

## Conditional Simulation Step

The simulation setup step should only be shown if a `Simulator Device` was created during the device setup step.

If no simulator device exists, the workflow can either:

* Skip the simulation step automatically, or
* Show the step as disabled with a message explaining that no simulator device was created.

For this phase, the simulation form should only update local React state.

Do not implement real simulation execution logic yet.

## Icon Requirement

Icons for devices and process units should use string values from Lucide Icons.

Store icon names as strings, not as React components.

Example:

```ts
icon: "Factory"
icon: "Waves"
icon: "Droplets"
icon: "Gauge"
icon: "Cpu"
```

The frontend can map icon strings to Lucide icon components.

---

## Do's

* Create a static frontend workflow first.
* Use local React state only.
* Use a custom hook under `/features`.
* Keep the route file simple.
* Keep components modular.
* Allow users to move forward and backward between steps.
* Allow multiple entities to be added where needed.
* Use `server/SCHEMA.MD` for entity fields.
* Use `server/API.MD` only as a future integration reference.
* Implement the process diagram using simple custom drag behavior.
* Make the workflow easy to connect to the backend later.

---

## Don'ts

* Do not call backend APIs.
* Do not use real database data.
* Do not create server functions.
* Do not modify backend code.
* Do not implement JWT logic yet.
* Do not implement final route guards yet.
* Do not send invitation emails yet.
* Do not create real simulation execution logic yet.
* Do not duplicate all schema fields from `SCHEMA.MD`.
* Do not place all workflow logic directly in the route file.

---
