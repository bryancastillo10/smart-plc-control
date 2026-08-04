import type { AlertOperator, AlertSeverity } from "@/types/enum";

export const alertOperators = [
	{ value: "GT", label: "Above" },
	{ value: "GTE", label: "At or above" },
	{ value: "LT", label: "Below" },
	{ value: "LTE", label: "At or below" },
	{ value: "EQ", label: "Equal to" },
	{ value: "NEQ", label: "Not equal to" },
] as const satisfies readonly { value: AlertOperator; label: string }[];

export const alertSeverities = [
	{ value: "LOW", label: "Low" },
	{ value: "MEDIUM", label: "Medium" },
	{ value: "HIGH", label: "High" },
	{ value: "CRITICAL", label: "Critical" },
] as const satisfies readonly { value: AlertSeverity; label: string }[];
