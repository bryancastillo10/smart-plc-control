### Instructions

### Overview
This project is a PLC monitoring and simulation monorepository composed of two separate applications:

- `client/` TanStack Start Web Application

- `server/`  backend GoLang Gin API for real-time communication, PLC simulation, alarm processing, and data persistence

Refer to `server/API.md` for API endpoints guidelines while the `server/SCHEMA.md` for the data schema and their relationships

### Main Features
- Real-time Dashboard
- Device Monitoring
- PLC Tag Monitoring
- Historical Trends
- Alert Management
- PLC Simulation
- Role-based Access Control (ADMIN, OPERATOR, VIEWER)

### Do
 - use Recharts for charts. Do not supply html
 - default to small components

### Don'ts
 - do not hard code colors
 - do not use divs if components already exist
 - do not add new heavy dependencies without approval
