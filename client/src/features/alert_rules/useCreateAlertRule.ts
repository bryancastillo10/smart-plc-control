import { useState, type ChangeEvent, type SubmitEvent } from "react";

import type {
	CreateAlertRuleRequest,
} from "@/types/alert-rule";
import { useToast } from "@/integrations/sonner";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const initialAlertRuleData: CreateAlertRuleRequest = {
	tagId: "",
	name: "",
	operator: "GT",
	threshold: "",
	severity: "MEDIUM",
	message: "",
	enabled: true,
};

export function useCreateAlertRule() {
	const { t } = useTranslation("toast")
	const [alertRuleData, setAlertRuleData] = useState(initialAlertRuleData);
	const [createAlertRuleLoading, setCreateAlertRuleLoading] = useState<boolean>(false);
	const toast = useToast();

	const createAlertRuleMutation = useMutation({
		// mutationFn: () => {},
		onMutate: () => toast.loading(t("alertRule.create.loading")),
		onSuccess: async () => {
				setCreateAlertRuleLoading(false);
		},
		onError: (error) => {
				setCreateAlertRuleLoading(false);
				toast.error(error, t("alertRule.create.failed"))
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId)
		}
	})

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id , value } = event.target;

		setAlertRuleData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};


	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		// API call would be here

	};

	return {
		alertRuleData,
		createAlertRuleLoading,
		createAlertRuleMutation,
		setAlertRuleData,
		onChange,
		handleSubmit,
	};
}

export default useCreateAlertRule;
