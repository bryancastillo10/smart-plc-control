import type { AlertOperator, AlertSeverity } from "@/types/enum";
import type { Tag } from "@/types/tag";

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


export const operatorLabelKeys = {
	GT: "addAlertRule.operators.above",
	GTE: "addAlertRule.operators.atOrAbove",
	LT: "addAlertRule.operators.below",
	LTE: "addAlertRule.operators.atOrBelow",
	EQ: "addAlertRule.operators.equalTo",
	NEQ: "addAlertRule.operators.notEqualTo",
} as const satisfies Record<AlertOperator, string>;

export const severityLabelKeys = {
	LOW: "addAlertRule.severities.low",
	MEDIUM: "addAlertRule.severities.medium",
	HIGH: "addAlertRule.severities.high",
	CRITICAL: "addAlertRule.severities.critical",
} as const satisfies Record<AlertSeverity, string>;

export const tagDataTypeLabelKeys = {
	BOOL: "addTag.dataTypes.boolean",
	INT: "addTag.dataTypes.integer",
	FLOAT: "addTag.dataTypes.decimal",
	STRING: "addTag.dataTypes.text",
} as const satisfies Record<Tag["dataType"], string>;

export const severityClasses: Record<AlertSeverity, string> = {
	LOW: "bg-blue-100 text-blue-800",
	MEDIUM: "bg-amber-100 text-amber-800",
	HIGH: "bg-orange-100 text-orange-800",
	CRITICAL: "bg-red-100 text-red-800",
};
