import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/integrations/sonner";
import type { CreateProcessUnitLocalRequest } from "@/types/process-unit";

const initialProcessUnitData: CreateProcessUnitLocalRequest = {
	name: "",
	type: "",
	description: "",
	status: "ACTIVE",
	position: { x: 120, y: 120 },
	ports: [
		{ id: "in", label: "In", direction: "IN" },
		{ id: "out", label: "Out", direction: "OUT" },
	],
	icon: "Factory",
};

export function useCreateProcessUnit() {
	const { t } = useTranslation("toast");
	const [processUnitData, setProcessUnitData] = useState(
		initialProcessUnitData,
	);
	const [createProcessUnitLoading, setCreateProcessUnitLoading] =
		useState<boolean>(false);
	const toast = useToast();

	const createProcessUnitMutation = useMutation({
		// mutationFn: () => {},
		onMutate: () => toast.loading(t("processUnit.create.loading")),
		onSuccess: async () => {
			setCreateProcessUnitLoading(false);
		},
		onError: (error) => {
			setCreateProcessUnitLoading(false);
			toast.error(error, t("processUnit.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id , value } = event.target;

		setProcessUnitData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		// API call would be here
	};

	return {
		processUnitData,
		createProcessUnitLoading,
		createProcessUnitMutation,
		setProcessUnitData,
		onChange,
		handleSubmit,
	};
}

export default useCreateProcessUnit;