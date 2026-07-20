import { Cpu, Gauge, Plus, Trash2, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSimulation } from "@/features/simulations/useCreateSimulation";
import { appButtonVariants } from "@/styles/recipes";
import type { Simulation } from "@/types/simulation";

export function AddSimulationStep() {
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
						<h4 className="font-bold">Simulation setup is optional</h4>
						<p className="mt-1 text-sm leading-6 text-blue-800">
							No Simulator device was added during Device setup. You may skip
							this step and continue, or return to Devices and add a Simulator
							if representative process behavior is needed.
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
					Available Simulator Devices
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
					Simulation profiles apply to the Plant as a whole. Simulator Devices
					enable representative values to be supplied during testing.
				</p>
			</div>

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="name">Simulation Name</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder="Normal operation profile"
						required
						value={simulationData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="updateIntervalMs">Update Interval (milliseconds)</Label>
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
						How often representative process values are refreshed. Minimum 100
						milliseconds.
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="noiseFactor">Variation Factor</Label>
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
						Adds natural variation to generated values, from 0 for steady values
						to 1 for maximum variation.
					</p>
				</div>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!plantExists}
						type="submit"
					>
						<Plus className="size-4" />
						Add Simulation Profile
					</Button>
				</div>
			</form>

			<SavedSimulations
				onRemove={removeSimulation}
				simulations={simulations}
			/>
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
	if (simulations.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				No simulation profiles have been added yet.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Waves className="size-4 text-brand-control" />
					Saved Simulation Profiles
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
								<h4 className="font-bold text-brand-ink">
									{simulation.name}
								</h4>
								<p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-kicker">
									{simulation.status}
								</p>
							</div>
							<Button
								aria-label={`Remove ${simulation.name}`}
								onClick={() => onRemove(simulation.id)}
								size="icon-sm"
								type="button"
								variant="ghost"
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
						<div className="mt-3 space-y-1 text-xs font-semibold text-brand-muted">
							<p>Update interval: {simulation.updateIntervalMs} ms</p>
							<p>Variation factor: {simulation.noiseFactor}</p>
						</div>
					</article>
				))}
			</div>
		</div>
	);
}
