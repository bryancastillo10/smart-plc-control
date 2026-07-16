import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { initialAlertRuleData, usePlantSetupFormStore } from "@/store/plantSetupForms";

export function useCreateAlertRule() {
	const { t } = useTranslation("toast");
	const alertRuleData = usePlantSetupFormStore((state) => state.alertRuleData);
	const setAlertRuleData = usePlantSetupFormStore((state) => state.setAlertRuleData);
	const alertRules = usePlantSetupStore((state) => state.workflowState.alertRules);
	const setAlertRules = usePlantSetupStore((state) => state.setAlertRules);
	const toast = useToast();

	const createAlertRuleMutation = useMutation({
		// mutationFn is called by the final plant setup submission workflow.
		onMutate: () => toast.loading(t("alertRule.create.loading")),
		onError: (error) => toast.error(error, t("alertRule.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = event.target;
		setAlertRuleData((current) => ({ ...current, [id]: value }));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAlertRules([...alertRules, { ...alertRuleData, id: `alert-rule-${crypto.randomUUID()}` }]);
		setAlertRuleData(initialAlertRuleData);
	};

	return { alertRuleData, createAlertRuleLoading: createAlertRuleMutation.isPending, createAlertRuleMutation, setAlertRuleData, onChange, handleSubmit };
}

export default useCreateAlertRule;
