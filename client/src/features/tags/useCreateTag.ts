import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import type { CreateTagLocalRequest } from "@/types/tag";

const initialTagData: CreateTagLocalRequest = {
	deviceId: "",
	processUnitId: "",
	name: "",
	address: "",
	dataType: "FLOAT",
	unit: "",
	description: "",
	enabled: true,
};

export function useCreateTag() {
	const { t } = useTranslation("toast");
	const [tagData, setTagData] = useState(initialTagData);
	const [createTagLoading, setCreateTagLoading] = useState<boolean>(false);
	const toast = useToast();

	const createTagMutation = useMutation({
		// mutationFn: () => {},
		onMutate: () => toast.loading(t("tag.create.loading")),
		onSuccess: async () => {
			setCreateTagLoading(false);
		},
		onError: (error) => {
			setCreateTagLoading(false);
			toast.error(error, t("tag.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});


	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id , value } = event.target;

		setTagData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		// API call would be here
	};

	return {
		tagData,
		createTagLoading,
		createTagMutation,
		setTagData,
		onChange,
		handleSubmit,
	};
}

export default useCreateTag;