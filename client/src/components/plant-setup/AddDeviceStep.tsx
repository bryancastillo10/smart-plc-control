import {
	Cable,
	Cpu,
	Gauge,
	Plus,
	RadioTower,
	Server,
	Trash2,
	type LucideIcon,
} from "lucide-react";

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

const deviceTypes = [
	{ value: "PLC", label: "PLC" },
	{ value: "SIMULATOR", label: "Simulator" },
	{ value: "GATEWAY", label: "Gateway" },
	{ value: "SENSOR_GROUP", label: "Sensor Group" },
	{ value: "ACTUATOR_GROUP", label: "Actuator Group" },
] as const;

const protocols = [
	{ value: "MODBUS_TCP", label: "Modbus TCP" },
	{ value: "OPC_UA", label: "OPC UA" },
	{ value: "SIMULATOR", label: "Simulator" },
] as const;

const deviceIconOptions = [
	{ value: "Cpu", label: "Controller", Icon: Cpu },
	{ value: "Server", label: "Server", Icon: Server },
	{ value: "RadioTower", label: "Gateway", Icon: RadioTower },
	{ value: "Gauge", label: "Instrument Group", Icon: Gauge },
	{ value: "Cable", label: "Connected Equipment", Icon: Cable },
] as const satisfies readonly {
	value: string;
	label: string;
	Icon: LucideIcon;
}[];

function getDeviceIcon(iconName: string) {
	return (
		deviceIconOptions.find((option) => option.value === iconName)?.Icon ?? Cpu
	);
}

export function AddDeviceStep() {
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
					Save the Plant Information step before adding devices.
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">Device Name</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder="Main Process PLC"
						required
						value={deviceData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="type">Device Type</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="type"
						onChange={onChange}
						value={deviceData.type}
					>
						{deviceTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="protocol">Communication Method</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="protocol"
						onChange={onChange}
						value={deviceData.protocol}
					>
						{protocols.map((protocol) => (
							<option key={protocol.value} value={protocol.value}>
								{protocol.label}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="icon">Display Icon</Label>
					<Select
						onValueChange={(icon) =>
							setDeviceData((current) => ({ ...current, icon }))
						}
						value={deviceData.icon}
					>
						<SelectTrigger className="w-full" id="icon">
							<SelectValue placeholder="Select a device icon" />
						</SelectTrigger>
						<SelectContent>
							{deviceIconOptions.map(({ value, label, Icon }) => (
								<SelectItem key={value} value={value}>
									<Icon className="size-4" />
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="host">Host or Address</Label>
					<Input
						disabled={isSimulator}
						id="host"
						onChange={onChange}
						placeholder="192.168.1.10"
						value={deviceData.host ?? ""}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="port">Port</Label>
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
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder="Describe the device's responsibility and the process area it serves."
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
					Include this device in plant operation
				</label>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!plantExists}
						type="submit"
					>
						<Plus className="size-4" />
						Add Device
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
	if (devices.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				No devices have been added yet.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Cpu className="size-4 text-brand-control" />
					Saved Devices
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
							? "Internal simulation"
							: [device.host, device.port].filter(Boolean).join(":") ||
								"Address not provided";

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
											{device.type.replaceAll("_", " ")} &middot; {device.protocol.replaceAll("_", " ")}
										</p>
									</div>
								</div>
								<Button
									aria-label={`Remove ${device.name}`}
									onClick={() => onRemove(device.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<p className="mt-3 text-sm leading-5 text-brand-muted">
								{device.description || "No description provided."}
							</p>
							<div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-brand-muted">
								<span>{endpoint}</span>
								<span aria-hidden="true">&middot;</span>
								<span>{device.enabled ? "Included" : "Not included"}</span>
							</div>
						</article>
					);
				})}
			</div>
		</div>
	);
}
