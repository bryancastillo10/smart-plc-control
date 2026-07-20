import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import {
	initialAlertRuleData,
	usePlantSetupFormStore,
} from "@/store/plantSetupForms";
import type { AlertOperator, AlertSeverity } from "@/types/enum";

export function useCreateAlertRule() {
	const { t } = useTranslation("toast");
	const alertRuleData = usePlantSetupFormStore(
		(state) => state.alertRuleData,
	);
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
		// mutationFn is called by the final plant setup submission workflow.
		onMutate: () => toast.loading(t("alertRule.create.loading")),
		onError: (error) => toast.error(error, t("alertRule.create.failed")),
		onSettled: (_data, _error, _variables, toastId) =>
			toast.dismiss(toastId),
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

export default useCreateAlertRule;
