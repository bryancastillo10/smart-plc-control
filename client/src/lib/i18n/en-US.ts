const enUS = {
	smartPlcControl: "Smart PLC Control",
	dashboard: "Dashboard",
	dashboardStatusReconnecting: "Reconnecting",
	dashboardStatusConnecting: "Connecting",
	dashboardStatusError: "Stream error",
	dashboardStatusLive: "Live stream",
	dashboardStatusAttention: "Attention needed",
	dashboardStatusAwaiting: "Awaiting packets",
	dashboardSimulatorCadence: "Simulator cadence: 2s",
	dashboardHeroEyebrow: "Plant telemetry desk",
	dashboardHeroTitle: "Live PLC dashboard for {{operatorName}}",
	dashboardHeroDescription:
		"The dashboard is now driven by websocket packets from {{endpoint}}, giving you a rolling view of water quality changes instead of a static placeholder.",
	dashboardStreamState: "Stream state",
	dashboardEndpointValue: "Endpoint: {{endpoint}}",
	dashboardPacketsReceived: "Packets received",
	dashboardPacketsReceivedDescription:
		"Rolling buffer keeps the latest 12 readings.",
	dashboardLastUpdate: "Last update",
	dashboardWaitingForData: "Waiting for data",
	dashboardNewestSampleDescription:
		"Newest PLC sample received by the browser.",
	dashboardAlertTitle: "Websocket status requires attention",
	dashboardAlertDescription:
		"The client will keep retrying the connection every 3 seconds.",
	dashboardMetricFlowRate: "Flow rate",
	dashboardMetricFlowRateDescription:
		"Main line throughput in cubic meters per second.",
	dashboardMetricPhBalance: "pH balance",
	dashboardMetricPhBalanceDescription:
		"Acidity window from the live PLC telemetry stream.",
	dashboardMetricTurbidity: "Turbidity",
	dashboardMetricTurbidityDescription:
		"Current turbidity reading expressed in NTU.",
	dashboardMetricTemperature: "Temperature",
	dashboardMetricTemperatureDescription:
		"Tank temperature sampled from the simulator feed.",
	dashboardTrendTitle: "Trend monitor",
	dashboardTrendDescription:
		"Rolling view of the last 12 websocket messages received from the PLC simulator.",
	dashboardTrendEmpty: "Waiting for the first PLC websocket packet.",
	dashboardOperatingWindowsTitle: "Operating windows",
	dashboardOperatingWindowsDescription:
		"Quick readouts derived from the most recent PLC message.",
	dashboardWindowPhStability: "pH stability",
	dashboardWindowPhStable: "Within expected band",
	dashboardWindowPhWatch: "Watch adjustment",
	dashboardWindowTurbidity: "Turbidity",
	dashboardWindowTurbidityStable: "Stable for simulator",
	dashboardWindowTurbidityHigh: "Above current simulation band",
	dashboardWindowDissolvedOxygen: "Dissolved oxygen",
	dashboardWindowDissolvedOxygenStable: "Aeration healthy",
	dashboardWindowDissolvedOxygenLow: "Below target",
	dashboardRecentPacketsTitle: "Recent packets",
	dashboardRecentPacketsDescription:
		"Latest websocket samples received by the browser.",
	dashboardRecentPacketsEmpty: "No websocket packets yet.",
	dashboardRecentPacketPh: "pH {{value}}",
	dashboardRecentPacketTurbidity: "Turbidity {{value}} NTU",
	dashboardRecentPacketDissolvedOxygen: "Dissolved O2 {{value}} mg/L",
	dashboardRecentPacketTemperature: "Temperature {{value}} C",
	dashboardSeriesPh: "pH",
	dashboardSeriesDissolvedOxygen: "Dissolved O2",
	dashboardSeriesTemperature: "Temperature",
	dashboardOperatorFallback: "operator",
	signIn: "Sign in",
	signingIn: "Signing in",
	signInTitle: "Welcome back",
	signInDescription: "Sign in with your email and password",
	signInSuccess: "You are logged in.",
	signInError: "Invalid sign in",
	signOut: "Sign out",
	signingOut: "Signing out",
	signOutSuccess: "You have signed out",
	signOutError: "Invalid sign out",
	email: "Email",
	password: "Password",
	language: "Language",
	heroBadge: "Industrial Monitoring Platform",
	heroTitle: "Operate your PLC systems with confidence and clarity.",
	heroDescription:
		"Smart PLC Control gives your team one dashboard for live plant telemetry, valve behavior, and safer control decisions.",
	heroLaunchDashboard: "Launch Dashboard",
	heroExploreFeatures: "Explore Features",
	featureSectionTitle: "Core Features",
	featureSectionDescription:
		"Focused capabilities to monitor, analyze, and control your PLC environment.",
	featureRealtimeValveMonitoringTitle: "Real-Time Valve Monitoring",
	featureRealtimeValveMonitoringDescription:
		"Watch valve position, pressure, and response state in one live control surface.",
	featureSensorTrendVisibilityTitle: "Sensor Trend Visibility",
	featureSensorTrendVisibilityDescription:
		"Track key plant signals over time to spot drift before it turns into downtime.",
	featureSafeControlGuardrailsTitle: "Safe Control Guardrails",
	featureSafeControlGuardrailsDescription:
		"Role-based access and clear action states reduce accidental operator mistakes.",
	featurePlantLevelConfigurationTitle: "Plant-Level Configuration",
	featurePlantLevelConfigurationDescription:
		"Manage plant settings and sensor profiles from a single structured workspace.",
	featureSimulatorReadyWorkflowTitle: "Simulator-Ready Workflow",
	featureSimulatorReadyWorkflowDescription:
		"Test logic with simulator endpoints before applying changes to live equipment.",
	featureOperatorFriendlyUiTitle: "Operator-Friendly UI",
	featureOperatorFriendlyUiDescription:
		"Readable layouts and concise controls help teams react faster under pressure.",
	now: "Current date and time are {{currentDateTime, datetime}}",
};

export default enUS;
