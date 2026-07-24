import { useQuery } from "@tanstack/react-query";

import {
	alertRuleQueryKeys,
	getAlertRule,
	listAlertRules,
} from "@/features/alert_rules/queries";
import type { AlertRuleFilters } from "@/types/alert-rule";

export function useAlertRules(filters?: AlertRuleFilters) {
	return useQuery({
		queryKey: alertRuleQueryKeys.list(filters),
		queryFn: () => listAlertRules(filters),
	});
}

export function useAlertRule(ruleId?: string) {
	return useQuery({
		enabled: Boolean(ruleId),
		queryKey: alertRuleQueryKeys.detail(ruleId ?? ""),
		queryFn: () => getAlertRule(ruleId as string),
	});
}
