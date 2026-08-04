import { BellRing, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { alertOperators, alertSeverities } from "@/constants/alerts";
import { useCreateAlertRule } from "@/features/alert_rules/useCreateAlertRule";
import { appButtonVariants } from "@/styles/recipes";
import type { AlertRule } from "@/types/alert-rule";
import type { Device } from "@/types/device";
import type { ProcessUnit } from "@/types/process-unit";
import type { Tag } from "@/types/tag";

import { operatorLabelKeys, severityLabelKeys, tagDataTypeLabelKeys, severityClasses } from "@/constants/alerts";

export function AddAlertRuleStep() {
	const { t } = useTranslation("plantSetup");
	const {
		alertRuleData,
		alertRules,
		devices,
		handleSubmit,
		onChange,
		plantExists,
		processUnits,
		removeAlertRule,
		tags,
	} = useCreateAlertRule();
	const selectedTag = tags.find((tag) => tag.id === alertRuleData.tagId);
	const selectedDevice = selectedTag
		? devices.find((device) => device.id === selectedTag.deviceId)
		: undefined;
	const selectedProcessUnit = selectedTag?.processUnitId
		? processUnits.find((unit) => unit.id === selectedTag.processUnitId)
		: undefined;
	const canAddRules = plantExists && tags.length > 0;

	return (
		<div className="space-y-6">
			{tags.length === 0 ? (
				<div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
					{t("addAlertRule.tagRequired")}
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="tagId">{t("addAlertRule.tag.label")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						disabled={tags.length === 0}
						id="tagId"
						onChange={onChange}
						required
						value={alertRuleData.tagId}
					>
						<option value="">{t("addAlertRule.tag.placeholder")}</option>
						{devices.map((device) => {
							const deviceTags = tags.filter(
								(tag) => tag.deviceId === device.id,
							);
							if (deviceTags.length === 0) return null;
							return (
								<optgroup key={device.id} label={device.name}>
									{deviceTags.map((tag) => (
										<option key={tag.id} value={tag.id}>
											{tag.name} ({tag.address})
										</option>
									))}
								</optgroup>
							);
						})}
					</select>
				</div>

				{selectedTag ? (
					<div className="grid gap-2 rounded-md border border-chip-line bg-chip p-3 text-xs font-semibold text-brand-muted md:col-span-2 sm:grid-cols-3">
						<p>
							{t("addAlertRule.selected.device", {
								name: selectedDevice?.name ?? t("addAlertRule.unknown"),
							})}
						</p>
						<p>
							{t("addAlertRule.selected.processUnit", {
								name:
									selectedProcessUnit?.name ?? t("addAlertRule.notAssigned"),
							})}
						</p>
						<p>
							{t("addAlertRule.selected.value", {
								type: t(tagDataTypeLabelKeys[selectedTag.dataType]),
							})}
							{selectedTag.unit ? ` (${selectedTag.unit})` : ""}
						</p>
					</div>
				) : null}

				<div className="space-y-2">
					<Label htmlFor="name">{t("addAlertRule.name.label")}</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder={t("addAlertRule.name.placeholder")}
						required
						value={alertRuleData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="severity">{t("addAlertRule.severityLabel")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="severity"
						onChange={onChange}
						value={alertRuleData.severity}
					>
						{alertSeverities.map((severity) => (
							<option key={severity.value} value={severity.value}>
								{t(severityLabelKeys[severity.value])}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="operator">{t("addAlertRule.operatorLabel")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="operator"
						onChange={onChange}
						value={alertRuleData.operator}
					>
						{alertOperators.map((operator) => (
							<option key={operator.value} value={operator.value}>
								{t(operatorLabelKeys[operator.value])}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="threshold">{t("addAlertRule.threshold.label")}</Label>
					{selectedTag?.dataType === "BOOL" ? (
						<select
							className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
							id="threshold"
							onChange={onChange}
							value={String(alertRuleData.threshold)}
						>
							<option value="">
								{t("addAlertRule.threshold.statePlaceholder")}
							</option>
							<option value="true">{t("addAlertRule.threshold.true")}</option>
							<option value="false">{t("addAlertRule.threshold.false")}</option>
						</select>
					) : (
						<Input
							id="threshold"
							onChange={onChange}
							placeholder={
								selectedTag?.unit || t("addAlertRule.threshold.placeholder")
							}
							required
							step={selectedTag?.dataType === "FLOAT" ? "any" : undefined}
							type={
								selectedTag?.dataType === "INT" ||
								selectedTag?.dataType === "FLOAT"
									? "number"
									: "text"
							}
							value={alertRuleData.threshold}
						/>
					)}
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="message">{t("addAlertRule.message.label")}</Label>
					<Textarea
						id="message"
						onChange={onChange}
						placeholder={t("addAlertRule.message.placeholder")}
						value={alertRuleData.message ?? ""}
					/>
				</div>

				<label className="flex items-center gap-3 text-sm font-semibold text-brand-ink md:col-span-2">
					<input
						checked={alertRuleData.enabled}
						className="size-4 rounded border-input"
						id="enabled"
						onChange={onChange}
						type="checkbox"
					/>
					{t("addAlertRule.enabled")}
				</label>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!canAddRules}
						type="submit"
					>
						<Plus className="size-4" />
						{t("addAlertRule.add")}
					</Button>
				</div>
			</form>

			<SavedAlertRules
				alertRules={alertRules}
				devices={devices}
				onRemove={removeAlertRule}
				processUnits={processUnits}
				tags={tags}
			/>
		</div>
	);
}

function SavedAlertRules({
	alertRules,
	devices,
	onRemove,
	processUnits,
	tags,
}: {
	alertRules: AlertRule[];
	devices: Device[];
	onRemove: (id: string) => void;
	processUnits: ProcessUnit[];
	tags: Tag[];
}) {
	const { t } = useTranslation("plantSetup");
	const tagById = new Map(tags.map((tag) => [tag.id, tag]));
	const deviceById = new Map(devices.map((device) => [device.id, device]));
	const processUnitById = new Map(processUnits.map((unit) => [unit.id, unit]));

	if (alertRules.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				{t("addAlertRule.empty")}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<BellRing className="size-4 text-brand-control" />
					{t("addAlertRule.saved")}
				</div>
				<span className="rounded-full bg-chip px-2.5 py-1 text-xs font-bold text-brand-control">
					{alertRules.length}
				</span>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{alertRules.map((rule) => {
					const tag = tagById.get(rule.tagId);
					const device = tag ? deviceById.get(tag.deviceId) : undefined;
					const processUnit = tag?.processUnitId
						? processUnitById.get(tag.processUnitId)
						: undefined;

					return (
						<article
							className="rounded-md border border-chip-line bg-chip p-4"
							key={rule.id}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<h4 className="truncate font-bold text-brand-ink">
											{rule.name}
										</h4>
										<span
											className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${severityClasses[rule.severity]}`}
										>
											{t(severityLabelKeys[rule.severity])}
										</span>
									</div>
									<p className="mt-2 text-sm font-semibold text-brand-control">
										{tag?.name ?? t("addAlertRule.unknownTag")}{" "}
										{t(operatorLabelKeys[rule.operator])}{" "}
										{String(rule.threshold)} {tag?.unit ?? ""}
									</p>
								</div>
								<Button
									aria-label={t("addAlertRule.remove", { name: rule.name })}
									onClick={() => onRemove(rule.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<div className="mt-3 space-y-1 text-xs font-semibold text-brand-muted">
								<p>
									{t("addAlertRule.savedDetails.device", {
										name: device?.name ?? t("addAlertRule.unknown"),
									})}
								</p>
								<p>
									{t("addAlertRule.savedDetails.processUnit", {
										name: processUnit?.name ?? t("addAlertRule.notAssigned"),
									})}
								</p>
							</div>
							{rule.message ? (
								<p className="mt-3 text-sm leading-5 text-brand-muted">
									{rule.message}
								</p>
							) : null}
						</article>
					);
				})}
			</div>
		</div>
	);
}
