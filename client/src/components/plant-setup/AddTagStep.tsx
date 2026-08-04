import { Cpu, Plus, Tags, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tagDataTypes } from "@/constants/tagDataType";
import { useCreateTag } from "@/features/tags/useCreateTag";
import { appButtonVariants } from "@/styles/recipes";
import type { Device } from "@/types/device";
import type { ProcessUnit } from "@/types/process-unit";
import type { Tag } from "@/types/tag";
import { deviceTypeLabelKeys, tagDataTypeLabelKeys } from "@/constants/tagLabelKeys";

export function AddTagStep() {
	const { t } = useTranslation("plantSetup");
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
					{t("addTag.deviceRequired")}
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="deviceId">{t("addTag.device.label")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						disabled={devices.length === 0}
						id="deviceId"
						onChange={onChange}
						required
						value={tagData.deviceId}
					>
						<option value="">{t("addTag.device.placeholder")}</option>
						{devices.map((device) => (
							<option key={device.id} value={device.id}>
								{device.name} ({t(deviceTypeLabelKeys[device.type])})
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="processUnitId">{t("addTag.processUnit.label")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="processUnitId"
						onChange={onChange}
						value={tagData.processUnitId ?? ""}
					>
						<option value="">{t("addTag.processUnit.unassigned")}</option>
						{processUnits.map((unit) => (
							<option key={unit.id} value={unit.id}>
								{unit.name}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="name">{t("addTag.name.label")}</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder={t("addTag.name.placeholder")}
						required
						value={tagData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="address">{t("addTag.address")}</Label>
					<Input
						id="address"
						onChange={onChange}
						placeholder="DB1.DBD0 or 40001"
						required
						value={tagData.address}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="dataType">{t("addTag.dataTypeLabel")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="dataType"
						onChange={onChange}
						value={tagData.dataType}
					>
						{tagDataTypes.map((dataType) => (
							<option key={dataType.value} value={dataType.value}>
								{t(tagDataTypeLabelKeys[dataType.value])}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="unit">{t("addTag.engineeringUnit")}</Label>
					<Input
						id="unit"
						onChange={onChange}
						placeholder="m3/h, %, bar, degC"
						value={tagData.unit ?? ""}
					/>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">{t("addTag.description.label")}</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder={t("addTag.description.placeholder")}
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
					{t("addTag.enabled")}
				</label>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!canAddTags}
						type="submit"
					>
						<Plus className="size-4" />
						{t("addTag.add")}
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
	const { t } = useTranslation("plantSetup");
	const deviceById = new Map(devices.map((device) => [device.id, device]));
	const processUnitById = new Map(processUnits.map((unit) => [unit.id, unit]));

	if (tags.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				{t("addTag.empty")}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Tags className="size-4 text-brand-control" />
					{t("addTag.saved")}
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
											{t(tagDataTypeLabelKeys[tag.dataType])}{" "}
											{tag.unit ? `- ${tag.unit}` : ""}
										</p>
									</div>
								</div>
								<Button
									aria-label={t("addTag.remove", { name: tag.name })}
									onClick={() => onRemove(tag.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<div className="mt-3 space-y-1 text-xs font-semibold text-brand-muted">
								<p>
									{t("addTag.savedDetails.device", {
										name: device?.name ?? t("addTag.unknownDevice"),
									})}
								</p>
								<p>
									{t("addTag.savedDetails.address", { address: tag.address })}
								</p>
								<p>
									{t("addTag.savedDetails.processUnit", {
										name: processUnit?.name ?? t("addTag.notAssigned"),
									})}
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
