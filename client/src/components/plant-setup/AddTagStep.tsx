import { Cpu, Plus, Tags, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTag } from "@/features/tags/useCreateTag";
import { appButtonVariants } from "@/styles/recipes";
import type { Device } from "@/types/device";
import type { ProcessUnit } from "@/types/process-unit";
import type { Tag } from "@/types/tag";
import { tagDataTypes } from "@/constants/tagDataType";

export function AddTagStep() {
	const {
		devices,
		handleSubmit,
		onChange,
		plantExists,
		processUnits,
		removeTag,
		tagData,
		tags,
	} = useCreateTag();
	const canAddTags = plantExists && devices.length > 0;

	return (
		<div className="space-y-6">
			{devices.length === 0 ? (
				<div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
					Add at least one Device before defining its measurements and signals.
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="deviceId">Device</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						disabled={devices.length === 0}
						id="deviceId"
						onChange={onChange}
						required
						value={tagData.deviceId}
					>
						<option value="">Select a device</option>
						{devices.map((device) => (
							<option key={device.id} value={device.id}>
								{device.name} ({device.type.replaceAll("_", " ")})
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="processUnitId">Process Unit</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="processUnitId"
						onChange={onChange}
						value={tagData.processUnitId ?? ""}
					>
						<option value="">Not assigned to a process unit</option>
						{processUnits.map((unit) => (
							<option key={unit.id} value={unit.id}>
								{unit.name}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="name">Tag Name</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder="Aeration Tank Level"
						required
						value={tagData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="address">Device Address</Label>
					<Input
						id="address"
						onChange={onChange}
						placeholder="DB1.DBD0 or 40001"
						required
						value={tagData.address}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="dataType">Value Type</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="dataType"
						onChange={onChange}
						value={tagData.dataType}
					>
						{tagDataTypes.map((dataType) => (
							<option key={dataType.value} value={dataType.value}>
								{dataType.label}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="unit">Engineering Unit</Label>
					<Input
						id="unit"
						onChange={onChange}
						placeholder="m3/h, %, bar, degC"
						value={tagData.unit ?? ""}
					/>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder="Describe what this value represents and how it is used during operation."
						value={tagData.description ?? ""}
					/>
				</div>

				<label className="flex items-center gap-3 text-sm font-semibold text-brand-ink md:col-span-2">
					<input
						checked={tagData.enabled}
						className="size-4 rounded border-input"
						id="enabled"
						onChange={onChange}
						type="checkbox"
					/>
					Include this measurement or signal in plant operation
				</label>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!canAddTags}
						type="submit"
					>
						<Plus className="size-4" />
						Add Tag
					</Button>
				</div>
			</form>

			<SavedTags
				devices={devices}
				onRemove={removeTag}
				processUnits={processUnits}
				tags={tags}
			/>
		</div>
	);
}

function SavedTags({
	devices,
	onRemove,
	processUnits,
	tags,
}: {
	devices: Device[];
	onRemove: (id: string) => void;
	processUnits: ProcessUnit[];
	tags: Tag[];
}) {
	const deviceById = new Map(devices.map((device) => [device.id, device]));
	const processUnitById = new Map(
		processUnits.map((unit) => [unit.id, unit]),
	);

	if (tags.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				No tags have been added yet.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Tags className="size-4 text-brand-control" />
					Saved Measurements and Signals
				</div>
				<span className="rounded-full bg-chip px-2.5 py-1 text-xs font-bold text-brand-control">
					{tags.length}
				</span>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{tags.map((tag) => {
					const device = deviceById.get(tag.deviceId);
					const processUnit = tag.processUnitId
						? processUnitById.get(tag.processUnitId)
						: undefined;

					return (
						<article
							className="rounded-md border border-chip-line bg-chip p-4"
							key={tag.id}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 items-start gap-3">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-brand-control shadow-xs">
										<Cpu className="size-5" />
									</div>
									<div className="min-w-0">
										<h4 className="truncate font-bold text-brand-ink">
											{tag.name}
										</h4>
										<p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-kicker">
											{tag.dataType} {tag.unit ? `- ${tag.unit}` : ""}
										</p>
									</div>
								</div>
								<Button
									aria-label={`Remove ${tag.name}`}
									onClick={() => onRemove(tag.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<div className="mt-3 space-y-1 text-xs font-semibold text-brand-muted">
								<p>Device: {device?.name ?? "Unknown device"}</p>
								<p>Address: {tag.address}</p>
								<p>
									Process Unit: {processUnit?.name ?? "Not assigned"}
								</p>
							</div>
							{tag.description ? (
								<p className="mt-3 text-sm leading-5 text-brand-muted">
									{tag.description}
								</p>
							) : null}
						</article>
					);
				})}
			</div>
		</div>
	);
}
