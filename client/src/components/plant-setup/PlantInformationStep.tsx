import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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

export function PlantInformationStep({ plant }: PlantInformationStepProps) {
	const { t } = useTranslation("plantSetup");
	const { plantData, onChange, handleSubmit } = useCreatePlant();

	return (
		<div className="space-y-5">
			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">{t("plantInformation.name.label")}</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder={t("plantInformation.name.placeholder")}
						value={plantData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="location">
						{t("plantInformation.location.label")}
					</Label>
					<Input
						id="location"
						onChange={onChange}
						placeholder={t("plantInformation.location.placeholder")}
						value={plantData.location}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">{t("plantInformation.status.label")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="status"
						onChange={onChange}
						value={plantData.status ?? "ACTIVE"}
					>
						<option value="ACTIVE">
							{t("plantInformation.status.options.active")}
						</option>
						<option value="INACTIVE">
							{t("plantInformation.status.options.inactive")}
						</option>
						<option value="MAINTENANCE">
							{t("plantInformation.status.options.maintenance")}
						</option>
					</select>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">
						{t("plantInformation.description.label")}
					</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder={t("plantInformation.description.placeholder")}
						value={plantData.description ?? ""}
					/>
				</div>
				<div className="flex justify-end md:col-span-2">
					<Button className={appButtonVariants({ size: "form" })} type="submit">
						{t("plantInformation.save")}
					</Button>
				</div>
			</form>

			{plant ? <SavedPlantPreview plant={plant} /> : null}
		</div>
	);
}

function SavedPlantPreview({ plant }: { plant: Plant }) {
	const { t } = useTranslation("plantSetup");

	return (
		<div className="rounded-md border border-chip-line bg-chip p-4">
			<div className="flex items-center gap-2 text-sm font-bold text-brand-control">
				<CheckCircle2 className="size-4" />
				{t("plantInformation.savedTitle")}
			</div>
			<div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
				<PreviewItem
					label={t("plantInformation.name.label")}
					value={plant.name}
				/>
				<PreviewItem
					label={t("plantInformation.location.label")}
					value={plant.location}
				/>
				<PreviewItem
					label={t("plantInformation.status.label")}
					value={t(
						`plantInformation.status.options.${plant.status.toLowerCase()}`,
					)}
				/>
				<PreviewItem
					label={t("plantInformation.description.label")}
					value={plant.description || t("plantInformation.notProvided")}
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
