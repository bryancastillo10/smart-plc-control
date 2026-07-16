import {
	Cylinder,
	Factory,
	Gauge,
	Network,
	Plus,
	Trash2,
	Waves,
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
import { useCreateProcessUnit } from "@/features/process_units/useCreateProcessUnit";
import { appButtonVariants } from "@/styles/recipes";
import type { ProcessUnit } from "@/types/process-unit";

const processUnitTypes = [
	"Tank",
	"Reactor",
	"Clarifier",
	"Pump Station",
	"Filter",
	"Custom",
] as const;

const processUnitIconOptions = [
	{ value: "Factory", label: "Factory", Icon: Factory },
	{ value: "Cylinder", label: "Tank", Icon: Cylinder },
	{ value: "Waves", label: "Water Process", Icon: Waves },
	{ value: "Gauge", label: "Metered Unit", Icon: Gauge },
] as const satisfies readonly {
	value: string;
	label: string;
	Icon: LucideIcon;
}[];

function getProcessUnitIcon(iconName: string) {
	return (
		processUnitIconOptions.find((option) => option.value === iconName)?.Icon ??
		Factory
	);
}

export function ProcessUnitStep() {
	const {
		handleSubmit,
		onChange,
		plantExists,
		processUnitData,
		processUnits,
		removeProcessUnit,
		setProcessUnitData,
	} = useCreateProcessUnit();

	const onIconChange = (icon: string) => {
		setProcessUnitData((current) => ({ ...current, icon }));
	};

	return (
		<div className="space-y-6">
			{!plantExists ? (
				<div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
					Save the Plant Information step before adding process units.
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">Unit Name</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder="Aeration Tank 1"
						required
						value={processUnitData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="type">Unit Type</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="type"
						onChange={onChange}
						required
						value={processUnitData.type}
					>
						<option value="">Select a unit type</option>
						{processUnitTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">Initial Status</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="status"
						onChange={onChange}
						value={processUnitData.status}
					>
						<option value="ACTIVE">Active</option>
						<option value="INACTIVE">Inactive</option>
						<option value="MAINTENANCE">Maintenance</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="icon">Diagram Icon</Label>
					<Select onValueChange={onIconChange} value={processUnitData.icon}>
						<SelectTrigger className="w-full" id="icon">
							<SelectValue placeholder="Select a diagram icon" />
						</SelectTrigger>
						<SelectContent>
							{processUnitIconOptions.map(({ value, label, Icon }) => (
								<SelectItem key={value} value={value}>
									<Icon className="size-4" />
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder="Describe this unit's purpose in the plant process."
						value={processUnitData.description ?? ""}
					/>
				</div>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!plantExists}
						type="submit"
					>
						<Plus className="size-4" />
						Add Process Unit
					</Button>
				</div>
			</form>

			<SavedProcessUnits
				onRemove={removeProcessUnit}
				processUnits={processUnits}
			/>
		</div>
	);
}

function SavedProcessUnits({
	onRemove,
	processUnits,
}: {
	onRemove: (id: string) => void;
	processUnits: ProcessUnit[];
}) {
	if (processUnits.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				No process units have been added yet.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Network className="size-4 text-brand-control" />
					Saved Process Units
				</div>
				<span className="rounded-full bg-chip px-2.5 py-1 text-xs font-bold text-brand-control">
					{processUnits.length}
				</span>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{processUnits.map((unit) => {
					const UnitIcon = getProcessUnitIcon(unit.icon);

					return (
						<article
							className="rounded-md border border-chip-line bg-chip p-4"
							key={unit.id}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 items-start gap-3">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-control shadow-xs">
										<UnitIcon className="size-5" />
									</div>
									<div className="min-w-0">
										<h4 className="truncate font-bold text-brand-ink">
											{unit.name}
										</h4>
										<p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-kicker">
											{unit.type} &middot; {unit.status}
										</p>
									</div>
								</div>
								<Button
									aria-label={`Remove ${unit.name}`}
									onClick={() => onRemove(unit.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<p className="mt-3 text-sm leading-5 text-brand-muted">
								{unit.description || "No description provided."}
							</p>
							<p className="mt-3 text-xs font-semibold text-brand-muted">
								{unit.ports.length} connection ports &middot; {unit.icon} icon
							</p>
						</article>
					);
				})}
			</div>
		</div>
	);
}
