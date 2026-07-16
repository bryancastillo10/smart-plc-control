import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { initialTagData, usePlantSetupFormStore } from "@/store/plantSetupForms";

export function useCreateTag() {
	const { t } = useTranslation("toast");
	const tagData = usePlantSetupFormStore((state) => state.tagData);
	const setTagData = usePlantSetupFormStore((state) => state.setTagData);
	const tags = usePlantSetupStore((state) => state.workflowState.tags);
	const setTags = usePlantSetupStore((state) => state.setTags);
	const toast = useToast();
	const createTagMutation = useMutation({
		// mutationFn is called by the final plant setup submission workflow.
		onMutate: () => toast.loading(t("tag.create.loading")),
		onError: (error) => toast.error(error, t("tag.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});
	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = event.target;
		setTagData((current) => ({ ...current, [id]: value }));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setTags([...tags, { ...tagData, id: `tag-${crypto.randomUUID()}` }]);
		setTagData(initialTagData);
	};
	return { tagData, createTagLoading: createTagMutation.isPending, createTagMutation, setTagData, onChange, handleSubmit };
}

export default useCreateTag;
