import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal";
import { usePlantSetupFormStore } from "@/store/plantSetupForms";
import { appButtonVariants } from "@/styles/recipes";
import PlantFinalStep from "./PlantFinalStep";

export function PlantOverviewStep() {
	const { t } = useTranslation("plantSetup");
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
			cancelLabel: t("plantOverview.modal.close"),
			confirmLabel: t("plantOverview.modal.done"),
			content: <PlantFinalStep />,
			description: t("plantOverview.modal.description"),
			title: t("plantOverview.modal.title"),
		});
	};

	return (
		<div className="space-y-4">
			<div className="rounded-md border border-line-subtle bg-white/70 p-4">
				<h4 className="text-sm font-bold text-brand-ink">
					{t("plantOverview.introduction.title")}
				</h4>
				<p className="mt-1 text-sm leading-6 text-brand-muted">
					{t("plantOverview.introduction.description")}
				</p>
			</div>

			<div className="grid gap-3 lg:grid-cols-2">
				<OverviewCard title={t("plantOverview.sections.plantInformation")}>
					<OverviewItem
						label={t("plantOverview.labels.name")}
						value={plantData.name}
					/>
					<OverviewItem
						label={t("plantOverview.labels.location")}
						value={plantData.location}
					/>
					<OverviewItem
						label={t("plantOverview.labels.status")}
						value={plantData.status}
					/>
					<OverviewItem
						label={t("plantOverview.labels.description")}
						value={plantData.description}
					/>
				</OverviewCard>

				<OverviewCard title={t("plantOverview.sections.processUnit")}>
					<OverviewItem
						label={t("plantOverview.labels.name")}
						value={processUnitData.name}
					/>
					<OverviewItem
						label={t("plantOverview.labels.type")}
						value={processUnitData.type}
					/>
					<OverviewItem
						label={t("plantOverview.labels.status")}
						value={processUnitData.status}
					/>
					<OverviewItem
						label={t("plantOverview.labels.description")}
						value={processUnitData.description}
					/>
					<OverviewItem
						label={t("plantOverview.labels.position")}
						value={formatPosition(
							processUnitData.position,
							t("plantOverview.values.notSet"),
						)}
					/>
					<OverviewItem
						label={t("plantOverview.labels.ports")}
						value={formatPorts(
							processUnitData.ports,
							t("plantOverview.values.notSet"),
						)}
					/>
					<OverviewItem
						label={t("plantOverview.labels.icon")}
						value={processUnitData.icon}
					/>
				</OverviewCard>

				<OverviewCard title={t("plantOverview.sections.processConnection")}>
					<OverviewItem
						label={t("plantOverview.labels.sourceUnit")}
						value={connectionData.sourceUnitId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.sourcePort")}
						value={connectionData.sourcePortId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.targetUnit")}
						value={connectionData.targetUnitId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.targetPort")}
						value={connectionData.targetPortId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.flowType")}
						value={connectionData.flowType}
					/>
					<OverviewItem
						label={t("plantOverview.labels.label")}
						value={connectionData.label}
					/>
				</OverviewCard>

				<OverviewCard title={t("plantOverview.sections.device")}>
					<OverviewItem
						label={t("plantOverview.labels.name")}
						value={deviceData.name}
					/>
					<OverviewItem
						label={t("plantOverview.labels.type")}
						value={deviceData.type}
					/>
					<OverviewItem
						label={t("plantOverview.labels.protocol")}
						value={deviceData.protocol}
					/>
					<OverviewItem
						label={t("plantOverview.labels.host")}
						value={deviceData.host}
					/>
					<OverviewItem
						label={t("plantOverview.labels.port")}
						value={deviceData.port}
					/>
					<OverviewItem
						label={t("plantOverview.labels.status")}
						value={deviceData.connectionStatus}
					/>
					<OverviewItem
						label={t("plantOverview.labels.enabled")}
						value={deviceData.enabled}
					/>
					<OverviewItem
						label={t("plantOverview.labels.position")}
						value={formatPosition(
							deviceData.position,
							t("plantOverview.values.notSet"),
						)}
					/>
					<OverviewItem
						label={t("plantOverview.labels.icon")}
						value={deviceData.icon}
					/>
					<OverviewItem
						label={t("plantOverview.labels.description")}
						value={deviceData.description}
					/>
				</OverviewCard>

				<OverviewCard title={t("plantOverview.sections.tag")}>
					<OverviewItem
						label={t("plantOverview.labels.name")}
						value={tagData.name}
					/>
					<OverviewItem
						label={t("plantOverview.labels.device")}
						value={tagData.deviceId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.processUnit")}
						value={tagData.processUnitId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.address")}
						value={tagData.address}
					/>
					<OverviewItem
						label={t("plantOverview.labels.dataType")}
						value={tagData.dataType}
					/>
					<OverviewItem
						label={t("plantOverview.labels.unit")}
						value={tagData.unit}
					/>
					<OverviewItem
						label={t("plantOverview.labels.enabled")}
						value={tagData.enabled}
					/>
					<OverviewItem
						label={t("plantOverview.labels.description")}
						value={tagData.description}
					/>
				</OverviewCard>

				<OverviewCard title={t("plantOverview.sections.alertRule")}>
					<OverviewItem
						label={t("plantOverview.labels.name")}
						value={alertRuleData.name}
					/>
					<OverviewItem
						label={t("plantOverview.labels.tag")}
						value={alertRuleData.tagId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.condition")}
						value={`${alertRuleData.operator} ${alertRuleData.threshold}`}
					/>
					<OverviewItem
						label={t("plantOverview.labels.severity")}
						value={alertRuleData.severity}
					/>
					<OverviewItem
						label={t("plantOverview.labels.enabled")}
						value={alertRuleData.enabled}
					/>
					<OverviewItem
						label={t("plantOverview.labels.message")}
						value={alertRuleData.message}
					/>
				</OverviewCard>

				<OverviewCard title={t("plantOverview.sections.simulation")}>
					<OverviewItem
						label={t("plantOverview.labels.name")}
						value={simulationData.name}
					/>
					<OverviewItem
						label={t("plantOverview.labels.plant")}
						value={simulationData.plantId}
					/>
					<OverviewItem
						label={t("plantOverview.labels.status")}
						value={simulationData.status}
					/>
					<OverviewItem
						label={t("plantOverview.labels.updateInterval")}
						value={`${simulationData.updateIntervalMs} ms`}
					/>
					<OverviewItem
						label={t("plantOverview.labels.noiseFactor")}
						value={simulationData.noiseFactor}
					/>
				</OverviewCard>
			</div>

			<div className="flex w-full justify-center pt-2">
				<Button
					className={appButtonVariants({ className: "w-full", size: "form" })}
					disabled={!plantData.name.trim() || !plantData.location.trim()}
					onClick={handleSubmit}
					type="button"
				>
					{t("plantOverview.submit")}
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
	const { t } = useTranslation("plantSetup");
	return (
		<div className="grid grid-cols-[8rem_1fr] gap-3 text-sm">
			<span className="font-semibold text-brand-muted">{label}</span>
			<span className="wrap-break-word text-brand-ink">
				{formatValue(
					value,
					t("plantOverview.values.yes"),
					t("plantOverview.values.no"),
					t("plantOverview.values.notSet"),
				)}
			</span>
		</div>
	);
}

function formatPosition(
	position: { x: number; y: number } | undefined,
	notSet: string,
) {
	if (!position) {
		return notSet;
	}

	return `x: ${position.x}, y: ${position.y}`;
}

function formatPorts(
	ports:
		| readonly { direction: string; id: string; label: string }[]
		| undefined,
	notSet: string,
) {
	if (!ports || ports.length === 0) {
		return notSet;
	}

	return ports
		.map((port) => `${port.label} (${port.direction.toLowerCase()})`)
		.join(", ");
}

function formatValue(
	value: boolean | number | string | null | undefined,
	yes: string,
	no: string,
	notSet: string,
) {
	if (typeof value === "boolean") {
		return value ? yes : no;
	}

	if (value === null || value === undefined || value === "") {
		return notSet;
	}

	return String(value);
}
