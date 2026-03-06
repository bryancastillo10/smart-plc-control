import {
	Activity,
	BadgeCheck,
	Gauge,
	Layers3,
	ShieldCheck,
	Sparkles,
} from "lucide-react";

export const featureList = [
	{
		icon: Gauge,
		titleKey: "featureRealtimeValveMonitoringTitle",
		descriptionKey: "featureRealtimeValveMonitoringDescription",
	},
	{
		icon: Activity,
		titleKey: "featureSensorTrendVisibilityTitle",
		descriptionKey: "featureSensorTrendVisibilityDescription",
	},
	{
		icon: ShieldCheck,
		titleKey: "featureSafeControlGuardrailsTitle",
		descriptionKey: "featureSafeControlGuardrailsDescription",
	},
	{
		icon: Layers3,
		titleKey: "featurePlantLevelConfigurationTitle",
		descriptionKey: "featurePlantLevelConfigurationDescription",
	},
	{
		icon: BadgeCheck,
		titleKey: "featureSimulatorReadyWorkflowTitle",
		descriptionKey: "featureSimulatorReadyWorkflowDescription",
	},
	{
		icon: Sparkles,
		titleKey: "featureOperatorFriendlyUiTitle",
		descriptionKey: "featureOperatorFriendlyUiDescription",
	},
];
