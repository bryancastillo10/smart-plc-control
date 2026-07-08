import type { AlertOperator, AlertSeverity } from "@/types/enum";

export interface AlertRule {
	id: string;
	plantId?: string;
	tagId: string;
	name: string;
	operator: AlertOperator;
	threshold: number | string;
	severity: AlertSeverity;
	message?: string;
	enabled: boolean;
}

export interface CreateAlertRuleRequest {
	plantId?: string;
	tagId: string;
	name: string;
	operator: AlertOperator;
	threshold: number | string;
	severity: AlertSeverity;
	message?: string;
	enabled: boolean;
}