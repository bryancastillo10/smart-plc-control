import { BellRing, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAlertRule } from "@/features/alert_rules/useCreateAlertRule";
import { appButtonVariants } from "@/styles/recipes";
import type { AlertRule } from "@/types/alert-rule";
import type { Device } from "@/types/device";
import type { AlertOperator, AlertSeverity } from "@/types/enum";
import type { ProcessUnit } from "@/types/process-unit";
import type { Tag } from "@/types/tag";

const alertOperators = [
	{ value: "GT", label: "Above" },
	{ value: "GTE", label: "At or above" },
	{ value: "LT", label: "Below" },
	{ value: "LTE", label: "At or below" },
	{ value: "EQ", label: "Equal to" },
	{ value: "NEQ", label: "Not equal to" },
] as const satisfies readonly { value: AlertOperator; label: string }[];

const alertSeverities = [
	{ value: "LOW", label: "Low" },
	{ value: "MEDIUM", label: "Medium" },
	{ value: "HIGH", label: "High" },
	{ value: "CRITICAL", label: "Critical" },
] as const satisfies readonly { value: AlertSeverity; label: string }[];

const operatorLabelByValue = Object.fromEntries(
	alertOperators.map(({ value, label }) => [value, label]),
) as Record<AlertOperator, string>;

const severityClasses: Record<AlertSeverity, string> = {
	LOW: "bg-blue-100 text-blue-800",
	MEDIUM: "bg-amber-100 text-amber-800",
	HIGH: "bg-orange-100 text-orange-800",
	CRITICAL: "bg-red-100 text-red-800",
};

export function AddAlertRuleStep() {
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
					Add at least one measurement or signal before defining operating alerts.
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="tagId">Measurement or Signal</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						disabled={tags.length === 0}
						id="tagId"
						onChange={onChange}
						required
						value={alertRuleData.tagId}
					>
						<option value="">Select a measurement or signal</option>
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
						<p>Device: {selectedDevice?.name ?? "Unknown"}</p>
						<p>
							Process Unit: {selectedProcessUnit?.name ?? "Not assigned"}
						</p>
						<p>
							Value: {selectedTag.dataType}
							{selectedTag.unit ? ` (${selectedTag.unit})` : ""}
						</p>
					</div>
				) : null}

				<div className="space-y-2">
					<Label htmlFor="name">Alert Name</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder="High tank level"
						required
						value={alertRuleData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="severity">Urgency</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="severity"
						onChange={onChange}
						value={alertRuleData.severity}
					>
						{alertSeverities.map((severity) => (
							<option key={severity.value} value={severity.value}>
								{severity.label}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="operator">Condition</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="operator"
						onChange={onChange}
						value={alertRuleData.operator}
					>
						{alertOperators.map((operator) => (
							<option key={operator.value} value={operator.value}>
								{operator.label}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="threshold">Operating Limit</Label>
					{selectedTag?.dataType === "BOOL" ? (
						<select
							className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
							id="threshold"
							onChange={onChange}
							value={String(alertRuleData.threshold)}
						>
							<option value="">Select a state</option>
							<option value="true">True</option>
							<option value="false">False</option>
						</select>
					) : (
						<Input
							id="threshold"
							onChange={onChange}
							placeholder={selectedTag?.unit || "Limit value"}
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
					<Label htmlFor="message">Operator Message</Label>
					<Textarea
						id="message"
						onChange={onChange}
						placeholder="Describe the condition and the response expected from the operator."
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
					Enable this operating alert
				</label>

				<div className="flex justify-end md:col-span-2">
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!canAddRules}
						type="submit"
					>
						<Plus className="size-4" />
						Add Alert Rule
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
	const tagById = new Map(tags.map((tag) => [tag.id, tag]));
	const deviceById = new Map(devices.map((device) => [device.id, device]));
	const processUnitById = new Map(
		processUnits.map((unit) => [unit.id, unit]),
	);

	if (alertRules.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				No operating alerts have been added yet.
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<BellRing className="size-4 text-brand-control" />
					Saved Operating Alerts
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
											{rule.severity}
										</span>
									</div>
									<p className="mt-2 text-sm font-semibold text-brand-control">
										{tag?.name ?? "Unknown tag"} {operatorLabelByValue[rule.operator].toLocaleLowerCase()} {String(rule.threshold)} {tag?.unit ?? ""}
									</p>
								</div>
								<Button
									aria-label={`Remove ${rule.name}`}
									onClick={() => onRemove(rule.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<div className="mt-3 space-y-1 text-xs font-semibold text-brand-muted">
								<p>Device: {device?.name ?? "Unknown"}</p>
								<p>Process Unit: {processUnit?.name ?? "Not assigned"}</p>
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
