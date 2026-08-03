import {
	Cable,
	Cpu,
	Gauge,
	type LucideIcon,
	Plus,
	RadioTower,
	Server,
	Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDevice } from "@/features/devices/useCreateDevice";
import { appButtonVariants } from "@/styles/recipes";
import type { Device } from "@/types/device";

const deviceTypeLabelKeys = {
	PLC: "addDevice.types.plc",
	SIMULATOR: "addDevice.types.simulator",
	GATEWAY: "addDevice.types.gateway",
	SENSOR_GROUP: "addDevice.types.sensorGroup",
	ACTUATOR_GROUP: "addDevice.types.actuatorGroup",
} as const satisfies Record<Device["type"], string>;

const protocolLabelKeys = {
	MODBUS_TCP: "addDevice.protocols.modbusTcp",
	OPC_UA: "addDevice.protocols.opcUa",
	SIMULATOR: "addDevice.protocols.simulator",
} as const satisfies Record<Device["protocol"], string>;

const deviceIconOptions = [
	{ value: "Cpu", labelKey: "addDevice.icons.controller", Icon: Cpu },
	{ value: "Server", labelKey: "addDevice.icons.server", Icon: Server },
	{
		value: "RadioTower",
		labelKey: "addDevice.icons.gateway",
		Icon: RadioTower,
	},
	{ value: "Gauge", labelKey: "addDevice.icons.instrumentGroup", Icon: Gauge },
	{
		value: "Cable",
		labelKey: "addDevice.icons.connectedEquipment",
		Icon: Cable,
	},
] as const satisfies readonly {
	value: string;
	labelKey: string;
	Icon: LucideIcon;
}[];

function getDeviceIcon(iconName: string) {
	return (
		deviceIconOptions.find((option) => option.value === iconName)?.Icon ?? Cpu
	);
}

export function AddDeviceStep() {
	const { t } = useTranslation("plantSetup");
	const {
		deviceData,
		devices,
		handleSubmit,
		onChange,
		plantExists,
		removeDevice,
		setDeviceData,
	} = useCreateDevice();

	const isSimulator = deviceData.protocol === "SIMULATOR";

	return (
		<div className="space-y-6">
			{!plantExists ? (
				<div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
					{t("addDevice.plantRequired")}
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">{t("addDevice.name.label")}</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder={t("addDevice.name.placeholder")}
						required
						value={deviceData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="type">{t("addDevice.typeLabel")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="type"
						onChange={onChange}
						value={deviceData.type}
					>
						{Object.entries(deviceTypeLabelKeys).map(([value, labelKey]) => (
							<option key={value} value={value}>
								{t(labelKey)}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="protocol">{t("addDevice.protocolLabel")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="protocol"
						onChange={onChange}
						value={deviceData.protocol}
					>
						{Object.entries(protocolLabelKeys).map(([value, labelKey]) => (
							<option key={value} value={value}>
								{t(labelKey)}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="icon">{t("addDevice.icon.label")}</Label>
					<Select
						onValueChange={(icon) =>
							setDeviceData((current) => ({ ...current, icon }))
						}
						value={deviceData.icon}
					>
						<SelectTrigger className="w-full" id="icon">
							<SelectValue placeholder={t("addDevice.icon.placeholder")} />
						</SelectTrigger>
						<SelectContent>
							{deviceIconOptions.map(({ value, labelKey, Icon }) => (
								<SelectItem key={value} value={value}>
									<Icon className="size-4" />
									{t(labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="host">{t("addDevice.host")}</Label>
					<Input
						disabled={isSimulator}
						id="host"
						onChange={onChange}
						placeholder="192.168.1.10"
						value={deviceData.host ?? ""}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="port">{t("addDevice.port")}</Label>
					<Input
						disabled={isSimulator}
						id="port"
						min={1}
						onChange={onChange}
						placeholder="502"
						type="number"
						value={deviceData.port ?? ""}
					/>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">
						{t("addDevice.description.label")}
					</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder={t("addDevice.description.placeholder")}
						value={deviceData.description ?? ""}
					/>
				</div>

				<label className="flex items-center gap-3 text-sm font-semibold text-brand-ink md:col-span-2">
					<input
						checked={deviceData.enabled}
						className="size-4 rounded border-input"
						id="enabled"
						onChange={onChange}
						type="checkbox"
					/>
					{t("addDevice.enabled")}
				</label>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!plantExists}
						type="submit"
					>
						<Plus className="size-4" />
						{t("addDevice.add")}
					</Button>
				</div>
			</form>

			<SavedDevices devices={devices} onRemove={removeDevice} />
		</div>
	);
}

function SavedDevices({
	devices,
	onRemove,
}: {
	devices: Device[];
	onRemove: (id: string) => void;
}) {
	const { t } = useTranslation("plantSetup");

	if (devices.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				{t("addDevice.empty")}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Cpu className="size-4 text-brand-control" />
					{t("addDevice.saved")}
				</div>
				<span className="rounded-full bg-chip px-2.5 py-1 text-xs font-bold text-brand-control">
					{devices.length}
				</span>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{devices.map((device) => {
					const DeviceIcon = getDeviceIcon(device.icon);
					const endpoint =
						device.protocol === "SIMULATOR"
							? t("addDevice.internalSimulation")
							: [device.host, device.port].filter(Boolean).join(":") ||
								t("addDevice.addressNotProvided");

					return (
						<article
							className="rounded-md border border-chip-line bg-chip p-4"
							key={device.id}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 items-start gap-3">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-control shadow-xs">
										<DeviceIcon className="size-5" />
									</div>
									<div className="min-w-0">
										<h4 className="truncate font-bold text-brand-ink">
											{device.name}
										</h4>
										<p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-kicker">
											{t(deviceTypeLabelKeys[device.type])} &middot;{" "}
											{t(protocolLabelKeys[device.protocol])}
										</p>
									</div>
								</div>
								<Button
									aria-label={t("addDevice.remove", { name: device.name })}
									onClick={() => onRemove(device.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<p className="mt-3 text-sm leading-5 text-brand-muted">
								{device.description || t("addDevice.noDescription")}
							</p>
							<div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-brand-muted">
								<span>{endpoint}</span>
								<span aria-hidden="true">&middot;</span>
								<span>
									{device.enabled
										? t("addDevice.included")
										: t("addDevice.notIncluded")}
								</span>
							</div>
						</article>
					);
				})}
			</div>
		</div>
	);
}
