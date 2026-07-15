import { CheckCircle2 } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appButtonVariants, appFeedbackVariants } from "@/styles/recipes";
import type { PlantStatus } from "@/types/enum";
import type { Plant, PlantSetupPlantInput } from "@/features/plant/type";

type PlantInformationDraft = {
	name: string;
	location: string;
	description: string;
	status: PlantStatus;
};

interface PlantInformationStepProps {
	plant: Plant | null;
	onSavePlant: (plant: PlantSetupPlantInput) => void;
}

const initialPlantDraft: PlantInformationDraft = {
	name: "",
	location: "",
	description: "",
	status: "ACTIVE",
};

export function PlantInformationStep({
	plant,
	onSavePlant,
}: PlantInformationStepProps) {
	const [draft, setDraft] = useState<PlantInformationDraft>(initialPlantDraft);
	const [validationMessage, setValidationMessage] = useState<string | null>(null);

	useEffect(() => {
		if (plant) {
			setDraft({
				name: plant.name,
				location: plant.location,
				description: plant.description ?? "",
				status: plant.status,
			});
		}
	}, [plant]);

	const onChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	) => {
		const { id, value } = event.target;

		setDraft((currentDraft) => ({
			...currentDraft,
			[id]: id === "status" ? (value as PlantStatus) : value,
		}));
		setValidationMessage(null);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const name = draft.name.trim();
		const location = draft.location.trim();

		if (!name || !location) {
			setValidationMessage("Plant name and location are required.");
			return;
		}

		onSavePlant({
			id: plant?.id,
			name,
			location,
			description: draft.description.trim(),
			status: draft.status,
			accessibleBy: plant?.accessibleBy ?? [],
		});
		setValidationMessage(null);
	};

	return (
		<div className="space-y-5">
			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">Plant Name</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder="Main Production Plant"
						value={draft.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="location">Location</Label>
					<Input
						id="location"
						onChange={onChange}
						placeholder="Hsinchu, Taiwan"
						value={draft.location}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">Initial Status</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="status"
						onChange={onChange}
						value={draft.status}
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
						value={draft.description}
					/>
				</div>

				{validationMessage ? (
					<div className={appFeedbackVariants({ tone: "error" })}>
						{validationMessage}
					</div>
				) : null}

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
				<PreviewItem label="Description" value={plant.description || "Not provided"} />
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
