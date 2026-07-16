import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { initialDeviceData, usePlantSetupFormStore } from "@/store/plantSetupForms";

export function useCreateDevice() {
	const { t } = useTranslation("toast");
	const deviceData = usePlantSetupFormStore((state) => state.deviceData);
	const setDeviceData = usePlantSetupFormStore((state) => state.setDeviceData);
	const devices = usePlantSetupStore((state) => state.workflowState.devices);
	const setDevices = usePlantSetupStore((state) => state.setDevices);
	const toast = useToast();
	const createDeviceMutation = useMutation({
		// mutationFn is called by the final plant setup submission workflow.
		onMutate: () => toast.loading(t("device.create.loading")),
		onError: (error) => toast.error(error, t("device.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});
	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = event.target;
		setDeviceData((current) => ({ ...current, [id]: id === "port" ? Number(value) : value }));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setDevices([...devices, { ...deviceData, id: `device-${crypto.randomUUID()}` }]);
		setDeviceData(initialDeviceData);
	};
	return { deviceData, createDeviceLoading: createDeviceMutation.isPending, createDeviceMutation, setDeviceData, onChange, handleSubmit };
}

export default useCreateDevice;
