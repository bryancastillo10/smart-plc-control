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

export interface CreateAlertRuleVariables {
	tagId: string;
	name: string;
	operator: AlertOperator;
	thresholdNumeric?: number;
	thresholdText?: string;
	thresholdBool?: boolean;
	severity: AlertSeverity;
	delaySeconds?: number;
	message?: string;
	enabled?: boolean;
}
export type UpdateAlertRuleRequest = Partial<CreateAlertRuleVariables>;

export interface UpdateAlertRuleVariables {
	ruleId: string;
	body: UpdateAlertRuleRequest;
}

export interface AlertRuleFilters {
	plantId?: string;
	tagId?: string;
	enabled?: boolean;
	severity?: AlertSeverity;
}
