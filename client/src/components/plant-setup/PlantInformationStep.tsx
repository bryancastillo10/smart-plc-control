import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Plant, PlantSetupPlantInput } from "@/features/plant/type";
import { useCreatePlant } from "@/features/plant/useCreatePlant";
import { appButtonVariants } from "@/styles/recipes";

interface PlantInformationStepProps {
	plant: Plant | null;
	onSavePlant: (plant: PlantSetupPlantInput) => void;
}

export function PlantInformationStep({
	plant,
}: PlantInformationStepProps) {
	const { plantData, onChange, handleSubmit } = useCreatePlant();


	return (
		<div className="space-y-5">
			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">Plant Name</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder="Main Production Plant"
						value={plantData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="location">Location</Label>
					<Input
						id="location"
						onChange={onChange}
						placeholder="Hsinchu, Taiwan"
						value={plantData.location}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">Initial Status</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="status"
						onChange={onChange}
						value={plantData.status ?? "ACTIVE"}
					>
						<option value="ACTIVE">Active</option>
						<option value="INACTIVE">Inactive</option>
						<option value="MAINTENANCE">Maintenance</option>
					</select>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder="Describe the plant scope, equipment area, or operating context."
						value={plantData.description ?? ""}
					/>
				</div>
				<div className="flex justify-end md:col-span-2">
					<Button className={appButtonVariants({ size: "form" })} type="submit">
						Save Plant Information
					</Button>
				</div>
			</form>

			{plant ? <SavedPlantPreview plant={plant} /> : null}
		</div>
	);
}

function SavedPlantPreview({ plant }: { plant: Plant }) {
	return (
		<div className="rounded-md border border-chip-line bg-chip p-4">
			<div className="flex items-center gap-2 text-sm font-bold text-brand-control">
				<CheckCircle2 className="size-4" />
				Saved Plant Information
			</div>
			<div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
				<PreviewItem label="Name" value={plant.name} />
				<PreviewItem label="Location" value={plant.location} />
				<PreviewItem label="Status" value={plant.status} />
				<PreviewItem
					label="Description"
					value={plant.description || "Not provided"}
				/>
			</div>
		</div>
	);
}

function PreviewItem({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-kicker">
				{label}
			</p>
			<p className="mt-1 font-semibold text-brand-ink">{value}</p>
		</div>
	);
}