import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal";
import { usePlantSetupFormStore } from "@/store/plantSetupForms";
import { appButtonVariants } from "@/styles/recipes";
import PlantFinalStep from "./PlantFinalStep";

export function PlantOverviewStep() {
	const {
		alertRuleData,
		connectionData,
		deviceData,
		plantData,
		processUnitData,
		simulationData,
		tagData,
	} = usePlantSetupFormStore();
	const openModal = useModalStore((state) => state.openModal);

	const handleSubmit = () => {
		openModal({
			cancelLabel: "Keep Editing",
			confirmLabel: "Open Plant Overview",
			content: <PlantFinalStep/>,
			description:
				"Your local plant setup draft is ready to view in the plant overview step.",
			title: "Plant setup draft ready",
		});
	};

	return (
		<div className="space-y-4">
			<div className="rounded-md border border-line-subtle bg-white/70 p-4">
				<h4 className="text-sm font-bold text-brand-ink">Open Plant Overview</h4>
				<p className="mt-1 text-sm leading-6 text-brand-muted">
					View the current local draft values before opening the plant overview.
					These values are read from the plant setup form store only.
				</p>
			</div>

			<div className="grid gap-3 lg:grid-cols-2">
				<OverviewCard title="Plant Information">
					<OverviewItem label="Name" value={plantData.name} />
					<OverviewItem label="Location" value={plantData.location} />
					<OverviewItem label="Status" value={plantData.status} />
					<OverviewItem label="Description" value={plantData.description} />
				</OverviewCard>

				<OverviewCard title="Process Unit">
					<OverviewItem label="Name" value={processUnitData.name} />
					<OverviewItem label="Type" value={processUnitData.type} />
					<OverviewItem label="Status" value={processUnitData.status} />
					<OverviewItem label="Description" value={processUnitData.description} />
					<OverviewItem
						label="Position"
						value={formatPosition(processUnitData.position)}
					/>
					<OverviewItem label="Ports" value={formatPorts(processUnitData.ports)} />
					<OverviewItem label="Icon" value={processUnitData.icon} />
				</OverviewCard>

				<OverviewCard title="Process Connection">
					<OverviewItem label="Source Unit" value={connectionData.sourceUnitId} />
					<OverviewItem label="Source Port" value={connectionData.sourcePortId} />
					<OverviewItem label="Target Unit" value={connectionData.targetUnitId} />
					<OverviewItem label="Target Port" value={connectionData.targetPortId} />
					<OverviewItem label="Flow Type" value={connectionData.flowType} />
					<OverviewItem label="Label" value={connectionData.label} />
				</OverviewCard>

				<OverviewCard title="Device">
					<OverviewItem label="Name" value={deviceData.name} />
					<OverviewItem label="Type" value={deviceData.type} />
					<OverviewItem label="Protocol" value={deviceData.protocol} />
					<OverviewItem label="Host" value={deviceData.host} />
					<OverviewItem label="Port" value={deviceData.port} />
					<OverviewItem label="Status" value={deviceData.connectionStatus} />
					<OverviewItem label="Enabled" value={deviceData.enabled} />
					<OverviewItem label="Position" value={formatPosition(deviceData.position)} />
					<OverviewItem label="Icon" value={deviceData.icon} />
					<OverviewItem label="Description" value={deviceData.description} />
				</OverviewCard>

				<OverviewCard title="Tag">
					<OverviewItem label="Name" value={tagData.name} />
					<OverviewItem label="Device" value={tagData.deviceId} />
					<OverviewItem label="Process Unit" value={tagData.processUnitId} />
					<OverviewItem label="Address" value={tagData.address} />
					<OverviewItem label="Data Type" value={tagData.dataType} />
					<OverviewItem label="Unit" value={tagData.unit} />
					<OverviewItem label="Enabled" value={tagData.enabled} />
					<OverviewItem label="Description" value={tagData.description} />
				</OverviewCard>

				<OverviewCard title="Alert Rule">
					<OverviewItem label="Name" value={alertRuleData.name} />
					<OverviewItem label="Tag" value={alertRuleData.tagId} />
					<OverviewItem
						label="Condition"
						value={`${alertRuleData.operator} ${alertRuleData.threshold}`}
					/>
					<OverviewItem label="Severity" value={alertRuleData.severity} />
					<OverviewItem label="Enabled" value={alertRuleData.enabled} />
					<OverviewItem label="Message" value={alertRuleData.message} />
				</OverviewCard>

				<OverviewCard title="Simulation">
					<OverviewItem label="Name" value={simulationData.name} />
					<OverviewItem label="Plant" value={simulationData.plantId} />
					<OverviewItem label="Status" value={simulationData.status} />
					<OverviewItem
						label="Update Interval"
						value={`${simulationData.updateIntervalMs} ms`}
					/>
					<OverviewItem label="Noise Factor" value={simulationData.noiseFactor} />
				</OverviewCard>
			</div>

			<div className="flex justify-end">
				<Button
					className={appButtonVariants({ size: "form" })}
					onClick={handleSubmit}
					type="button"
				>
					Submit
				</Button>
			</div>
		</div>
	);
}

function OverviewCard({
	children,
	title,
}: {
	children: ReactNode;
	title: string;
}) {
	return (
		<div className="rounded-md border border-line-subtle bg-white/60 p-4">
			<h4 className="text-sm font-bold text-brand-ink">{title}</h4>
			<div className="mt-3 grid gap-2">{children}</div>
		</div>
	);
}

function OverviewItem({
	label,
	value,
}: {
	label: string;
	value: boolean | number | string | null | undefined;
}) {
	return (
		<div className="grid grid-cols-[8rem_1fr] gap-3 text-sm">
			<span className="font-semibold text-brand-muted">{label}</span>
			<span className="wrap-break-word text-brand-ink">{formatValue(value)}</span>
		</div>
	);
}

function formatPosition(position: { x: number; y: number } | undefined) {
	if (!position) {
		return "Not set";
	}

	return `x: ${position.x}, y: ${position.y}`;
}

function formatPorts(
	ports: readonly { direction: string; id: string; label: string }[] | undefined,
) {
	if (!ports || ports.length === 0) {
		return "Not set";
	}

	return ports
		.map((port) => `${port.label} (${port.direction.toLowerCase()})`)
		.join(", ");
}

function formatValue(value: boolean | number | string | null | undefined) {
	if (typeof value === "boolean") {
		return value ? "Yes" : "No";
	}

	if (value === null || value === undefined || value === "") {
		return "Not set";
	}

	return String(value);
}
