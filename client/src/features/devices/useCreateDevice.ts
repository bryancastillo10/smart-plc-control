import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/integrations/sonner";
import type { CreateDeviceLocalRequest } from "@/types/device";

const initialDeviceData: CreateDeviceLocalRequest = {
	name: "",
	type: "PLC",
	description: "",
	protocol: "MODBUS_TCP",
	host: "",
	port: undefined,
	connectionStatus: "DISCONNECTED",
	enabled: true,
	position: { x: 160, y: 160 },
	icon: "Cpu",
};

export function useCreateDevice() {
	const { t } = useTranslation("toast");
	const [deviceData, setDeviceData] = useState(initialDeviceData);
	const [createDeviceLoading, setCreateDeviceLoading] = useState<boolean>(false);
	const toast = useToast();

	const createDeviceMutation = useMutation({
		// mutationFn: () => {},
		onMutate: () => toast.loading(t("device.create.loading")),
		onSuccess: async () => {
			setCreateDeviceLoading(false);
		},
		onError: (error) => {
			setCreateDeviceLoading(false);
			toast.error(error, t("device.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id , value } = event.target;

		setDeviceData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		// API call would be here
	};

	return {
		deviceData,
		createDeviceLoading,
		createDeviceMutation,
		setDeviceData,
		onChange,
		handleSubmit,
	};
}

export default useCreateDevice;