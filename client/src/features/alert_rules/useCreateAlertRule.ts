import { useMutation } from "@tanstack/react-query";
import type { ChangeEvent, SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createAlertRule } from "@/features/alert_rules/queries";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import {
	initialAlertRuleData,
	usePlantSetupFormStore,
} from "@/store/plantSetupForms";
import type { AlertRule, CreateAlertRuleVariables } from "@/types/alert-rule";
import type { AlertOperator, AlertSeverity, TagDataType } from "@/types/enum";

export function useCreateAlertRule() {
	const { t } = useTranslation("toast");
	const alertRuleData = usePlantSetupFormStore((state) => state.alertRuleData);
	const setAlertRuleData = usePlantSetupFormStore(
		(state) => state.setAlertRuleData,
	);
	const plant = usePlantSetupStore((state) => state.workflowState.plant);
	const devices = usePlantSetupStore((state) => state.workflowState.devices);
	const processUnits = usePlantSetupStore(
		(state) => state.workflowState.processUnits,
	);
	const tags = usePlantSetupStore((state) => state.workflowState.tags);
	const alertRules = usePlantSetupStore(
		(state) => state.workflowState.alertRules,
	);
	const setAlertRules = usePlantSetupStore((state) => state.setAlertRules);
	const toast = useToast();

	const createAlertRuleMutation = useMutation({
		mutationFn: createAlertRule,
		onMutate: () => toast.loading(t("alertRule.create.loading")),
		onError: (error) => toast.error(error, t("alertRule.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});

	const onChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { checked, id, type, value } = event.target as HTMLInputElement;
		setAlertRuleData((current) => ({
			...current,
			[id]:
				type === "checkbox"
					? checked
					: id === "operator"
						? (value as AlertOperator)
						: id === "severity"
							? (value as AlertSeverity)
							: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const selectedTag = tags.find((tag) => tag.id === alertRuleData.tagId);
		const name = alertRuleData.name.trim();
		const thresholdText = String(alertRuleData.threshold).trim();
		const duplicateRule = alertRules.some(
			(rule) =>
				rule.tagId === alertRuleData.tagId &&
				rule.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
		);

		if (!plant || !selectedTag || !name || !thresholdText || duplicateRule) {
			toast.error(null, t("alertRule.create.failed"));
			return;
		}

		const threshold =
			selectedTag.dataType === "INT" || selectedTag.dataType === "FLOAT"
				? Number(thresholdText)
				: thresholdText;
		if (typeof threshold === "number" && !Number.isFinite(threshold)) {
			toast.error(null, t("alertRule.create.failed"));
			return;
		}

		setAlertRules([
			...alertRules,
			{
				...alertRuleData,
				id: `alert-rule-${crypto.randomUUID()}`,
				plantId: plant.id,
				name,
				threshold,
				message: alertRuleData.message?.trim(),
			},
		]);
		setAlertRuleData({
			...initialAlertRuleData,
			tagId: alertRuleData.tagId,
		});
	};

	const removeAlertRule = (id: string) => {
		setAlertRules(alertRules.filter((rule) => rule.id !== id));
	};

	return {
		alertRuleData,
		alertRules,
		createAlertRuleLoading: createAlertRuleMutation.isPending,
		createAlertRule: createAlertRuleMutation.mutate,
		createAlertRuleResponse: createAlertRuleMutation.data,
		createAlertRuleError: createAlertRuleMutation.error,
		createAlertRuleAsync: createAlertRuleMutation.mutateAsync,
		createAlertRuleMutation,
		devices,
		handleSubmit,
		onChange,
		plantExists: plant !== null,
		processUnits,
		removeAlertRule,
		setAlertRuleData,
		tags,
	};
}

export function createAlertRuleRequest(
	rule: AlertRule,
	tagId: string,
	dataType: TagDataType,
): CreateAlertRuleVariables {
	const request = {
		tagId,
		name: rule.name,
		operator: rule.operator,
		severity: rule.severity,
		message: rule.message,
		enabled: rule.enabled,
	};

	if (dataType === "BOOL") {
		if (
			(rule.threshold !== "true" && rule.threshold !== "false") ||
			(rule.operator !== "EQ" && rule.operator !== "NEQ")
		) {
			throw new Error(
				"BOOL alert rules require a true/false threshold and EQ or NEQ operator.",
			);
		}
		return { ...request, thresholdBool: rule.threshold === "true" };
	}

	if (dataType === "STRING") {
		if (rule.operator !== "EQ" && rule.operator !== "NEQ") {
			throw new Error("STRING alert rules only support EQ or NEQ operators.");
		}
		return { ...request, thresholdText: String(rule.threshold) };
	}

	const thresholdNumeric = Number(rule.threshold);
	if (!Number.isFinite(thresholdNumeric)) {
		throw new Error("Numeric alert rules require a valid numeric threshold.");
	}
	return { ...request, thresholdNumeric };
}
export default useCreateAlertRule;
