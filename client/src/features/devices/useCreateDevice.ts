import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createDevice } from "@/features/devices/queries";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import {
	initialDeviceData,
	usePlantSetupFormStore,
} from "@/store/plantSetupForms";
import type { DeviceType, Protocol } from "@/types/enum";

export function useCreateDevice() {
	const { t } = useTranslation("toast");
	const deviceData = usePlantSetupFormStore((state) => state.deviceData);
	const setDeviceData = usePlantSetupFormStore(
		(state) => state.setDeviceData,
	);
	const plant = usePlantSetupStore((state) => state.workflowState.plant);
	const devices = usePlantSetupStore((state) => state.workflowState.devices);
	const setDevices = usePlantSetupStore((state) => state.setDevices);
	const toast = useToast();

	const createDeviceMutation = useMutation({
		mutationFn: createDevice,
		onMutate: () => toast.loading(t("device.create.loading")),
		onError: (error) => toast.error(error, t("device.create.failed")),
		onSettled: (_data, _error, _variables, toastId) =>
			toast.dismiss(toastId),
	});

	const onChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { checked, id, type, value } = event.target as HTMLInputElement;

		setDeviceData((current) => {
			if (id === "type") {
				const deviceType = value as DeviceType;
				return {
					...current,
					type: deviceType,
					...(deviceType === "SIMULATOR"
						? { protocol: "SIMULATOR" as const, host: "", port: undefined }
						: current.protocol === "SIMULATOR"
							? { protocol: "MODBUS_TCP" as const }
							: {}),
				};
			}

			if (id === "protocol") {
				const protocol = value as Protocol;
				return {
					...current,
					protocol,
					...(protocol === "SIMULATOR"
						? { host: "", port: undefined }
						: {}),
				};
			}

			return {
				...current,
				[id]:
					type === "checkbox"
						? checked
						: id === "port"
							? value === ""
								? undefined
								: Number(value)
							: value,
			};
		});
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!plant || !deviceData.name.trim()) {
			toast.error(null, t("device.create.failed"));
			return;
		}

		setDevices([
			...devices,
			{
				...deviceData,
				id: `device-${crypto.randomUUID()}`,
				plantId: plant.id,
				position: {
					x: 32 + (devices.length % 4) * 180,
					y: 300 + Math.floor(devices.length / 4) * 96,
				},
				name: deviceData.name.trim(),
				description: deviceData.description?.trim(),
				host: deviceData.host?.trim(),
			},
		]);
		setDeviceData(initialDeviceData);
	};

	const removeDevice = (id: string) => {
		setDevices(devices.filter((device) => device.id !== id));
	};

	return {
		deviceData,
		devices,
		plantExists: plant !== null,
		createDeviceLoading: createDeviceMutation.isPending,
		createDevice: createDeviceMutation.mutate,
		createDeviceResponse: createDeviceMutation.data,
		createDeviceError: createDeviceMutation.error,
		createDeviceAsync: createDeviceMutation.mutateAsync,
		createDeviceMutation,
		setDeviceData,
		onChange,
		handleSubmit,
		removeDevice,
	};
}

export default useCreateDevice;
