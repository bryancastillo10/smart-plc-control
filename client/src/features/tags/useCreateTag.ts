import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createTag } from "@/features/tags/queries";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import {
	initialTagData,
	usePlantSetupFormStore,
} from "@/store/plantSetupForms";
import type { TagDataType } from "@/types/enum";

export function useCreateTag() {
	const { t } = useTranslation("toast");
	const tagData = usePlantSetupFormStore((state) => state.tagData);
	const setTagData = usePlantSetupFormStore((state) => state.setTagData);
	const plant = usePlantSetupStore((state) => state.workflowState.plant);
	const devices = usePlantSetupStore((state) => state.workflowState.devices);
	const processUnits = usePlantSetupStore(
		(state) => state.workflowState.processUnits,
	);
	const tags = usePlantSetupStore((state) => state.workflowState.tags);
	const setTags = usePlantSetupStore((state) => state.setTags);
	const toast = useToast();

	const createTagMutation = useMutation({
		mutationFn: createTag,
		onMutate: () => toast.loading(t("tag.create.loading")),
		onError: (error) => toast.error(error, t("tag.create.failed")),
		onSettled: (_data, _error, _variables, toastId) =>
			toast.dismiss(toastId),
	});

	const onChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { checked, id, type, value } = event.target as HTMLInputElement;
		setTagData((current) => ({
			...current,
			[id]:
				type === "checkbox"
					? checked
					: id === "dataType"
						? (value as TagDataType)
						: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const name = tagData.name.trim();
		const address = tagData.address.trim();
		const deviceExists = devices.some(
			(device) => device.id === tagData.deviceId,
		);
		const duplicateTag = tags.some(
			(tag) =>
				tag.deviceId === tagData.deviceId &&
				tag.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
		);

		if (!plant || !deviceExists || !name || !address || duplicateTag) {
			toast.error(null, t("tag.create.failed"));
			return;
		}

		setTags([
			...tags,
			{
				...tagData,
				id: `tag-${crypto.randomUUID()}`,
				plantId: plant.id,
				name,
				address,
				unit: tagData.unit?.trim(),
				description: tagData.description?.trim(),
				processUnitId: tagData.processUnitId || undefined,
			},
		]);
		setTagData({
			...initialTagData,
			deviceId: tagData.deviceId,
			processUnitId: tagData.processUnitId,
		});
	};

	const removeTag = (id: string) => {
		setTags(tags.filter((tag) => tag.id !== id));
	};

	return {
		createTagLoading: createTagMutation.isPending,
		createTag: createTagMutation.mutate,
		createTagResponse: createTagMutation.data,
		createTagError: createTagMutation.error,
		createTagAsync: createTagMutation.mutateAsync,
		createTagMutation,
		devices,
		handleSubmit,
		onChange,
		plantExists: plant !== null,
		processUnits,
		removeTag,
		setTagData,
		tagData,
		tags,
	};
}

export default useCreateTag;
