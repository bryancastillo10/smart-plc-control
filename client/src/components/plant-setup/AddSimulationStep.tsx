import { Cpu, Gauge, Plus, Trash2, Waves } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSimulation } from "@/features/simulations/useCreateSimulation";
import { appButtonVariants } from "@/styles/recipes";
import type { Simulation } from "@/types/simulation";

const simulationStatusLabelKeys = {
	IDLE: "addSimulation.statuses.idle",
	RUNNING: "addSimulation.statuses.running",
	PAUSED: "addSimulation.statuses.paused",
	STOPPED: "addSimulation.statuses.stopped",
} as const satisfies Record<Simulation["status"], string>;
export function AddSimulationStep() {
	const { t } = useTranslation("plantSetup");
	const {
		handleSubmit,
		hasSimulatorDevice,
		onChange,
		plantExists,
		removeSimulation,
		simulationData,
		simulations,
		simulatorDevices,
	} = useCreateSimulation();

	if (!hasSimulatorDevice) {
		return (
			<div className="rounded-md border border-blue-200 bg-blue-50 p-5 text-blue-950">
				<div className="flex items-start gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-blue-700 shadow-xs">
						<Gauge className="size-5" />
					</div>
					<div>
						<h4 className="font-bold">{t("addSimulation.optional.title")}</h4>
						<p className="mt-1 text-sm leading-6 text-blue-800">
							{t("addSimulation.optional.description")}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="rounded-md border border-chip-line bg-chip p-4">
				<p className="text-sm font-bold text-brand-ink">
					{t("addSimulation.availableDevices")}
				</p>
				<div className="mt-3 flex flex-wrap gap-2">
					{simulatorDevices.map((device) => (
						<span
							className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-control shadow-xs"
							key={device.id}
						>
							<Cpu className="size-3.5" />
							{device.name}
						</span>
					))}
				</div>
				<p className="mt-3 text-xs leading-5 text-brand-muted">
					{t("addSimulation.deviceDescription")}
				</p>
			</div>

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="name">{t("addSimulation.name.label")}</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder={t("addSimulation.name.placeholder")}
						required
						value={simulationData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="updateIntervalMs">
						{t("addSimulation.updateInterval.label")}
					</Label>
					<Input
						id="updateIntervalMs"
						min={100}
						onChange={onChange}
						required
						step={100}
						type="number"
						value={simulationData.updateIntervalMs ?? ""}
					/>
					<p className="text-xs leading-5 text-brand-muted">
						{t("addSimulation.updateInterval.help")}
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="noiseFactor">
						{t("addSimulation.variation.label")}
					</Label>
					<Input
						id="noiseFactor"
						max={1}
						min={0}
						onChange={onChange}
						required
						step={0.01}
						type="number"
						value={simulationData.noiseFactor ?? ""}
					/>
					<p className="text-xs leading-5 text-brand-muted">
						{t("addSimulation.variation.help")}
					</p>
				</div>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!plantExists}
						type="submit"
					>
						<Plus className="size-4" />
						{t("addSimulation.add")}
					</Button>
				</div>
			</form>

			<SavedSimulations onRemove={removeSimulation} simulations={simulations} />
		</div>
	);
}

function SavedSimulations({
	onRemove,
	simulations,
}: {
	onRemove: (id: string) => void;
	simulations: Simulation[];
}) {
	const { t } = useTranslation("plantSetup");

	if (simulations.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				{t("addSimulation.empty")}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Waves className="size-4 text-brand-control" />
					{t("addSimulation.saved")}
				</div>
				<span className="rounded-full bg-chip px-2.5 py-1 text-xs font-bold text-brand-control">
					{simulations.length}
				</span>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{simulations.map((simulation) => (
					<article
						className="rounded-md border border-chip-line bg-chip p-4"
						key={simulation.id}
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<h4 className="font-bold text-brand-ink">{simulation.name}</h4>
								<p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-kicker">
									{t(simulationStatusLabelKeys[simulation.status])}
								</p>
							</div>
							<Button
								aria-label={t("addSimulation.remove", {
									name: simulation.name,
								})}
								onClick={() => onRemove(simulation.id)}
								size="icon-sm"
								type="button"
								variant="ghost"
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
						<div className="mt-3 space-y-1 text-xs font-semibold text-brand-muted">
							<p>
								{t("addSimulation.savedDetails.updateInterval", {
									value: simulation.updateIntervalMs,
								})}
							</p>
							<p>
								{t("addSimulation.savedDetails.variation", {
									value: simulation.noiseFactor,
								})}
							</p>
						</div>
					</article>
				))}
			</div>
		</div>
	);
}
