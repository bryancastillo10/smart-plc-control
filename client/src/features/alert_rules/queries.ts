import type {
	AlertRule,
	AlertRuleFilters,
	CreateAlertRuleVariables,
	UpdateAlertRuleVariables,
} from "@/types/alert-rule";
import { apiFetch } from "@/utils/fetch";

export const alertRuleQueryKeys = {
	all: ["alert-rules"] as const,
	detail: (ruleId: string) => [...alertRuleQueryKeys.all, ruleId] as const,
	list: (filters?: AlertRuleFilters) =>
		[...alertRuleQueryKeys.all, filters] as const,
};

export function listAlertRules(filters?: AlertRuleFilters) {
	return apiFetch<AlertRule[]>(createAlertRuleListPath(filters), {
		credentials: "include",
	});
}

export function getAlertRule(ruleId: string) {
	return apiFetch<AlertRule>(`/alert-rules/${ruleId}`, {
		credentials: "include",
	});
}

export function createAlertRule(body: CreateAlertRuleVariables) {
	return apiFetch<AlertRule, CreateAlertRuleVariables>("/alert-rules", {
		method: "POST",
		body,
		credentials: "include",
	});
}

export function updateAlertRule({ body, ruleId }: UpdateAlertRuleVariables) {
	return apiFetch<AlertRule, UpdateAlertRuleVariables["body"]>(
		`/alert-rules/${ruleId}`,
		{
			method: "PUT",
			body,
			credentials: "include",
		},
	);
}

export function deleteAlertRule(ruleId: string) {
	return apiFetch<void>(`/alert-rules/${ruleId}`, {
		method: "DELETE",
		credentials: "include",
	});
}

function createAlertRuleListPath(filters?: AlertRuleFilters) {
	const params = new URLSearchParams();

	if (filters?.plantId) params.set("plantId", filters.plantId);
	if (filters?.tagId) params.set("tagId", filters.tagId);
	if (filters?.enabled !== undefined) params.set("enabled", String(filters.enabled));
	if (filters?.severity) params.set("severity", filters.severity);

	const queryString = params.toString();
	return queryString ? `/alert-rules?${queryString}` : "/alert-rules";
}
