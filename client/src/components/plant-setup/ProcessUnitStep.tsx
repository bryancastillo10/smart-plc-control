import {
	Cylinder,
	Factory,
	Gauge,
	type LucideIcon,
	Network,
	Plus,
	Trash2,
	Waves,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
	{ value: "Tank", labelKey: "processUnit.types.tank" },
	{ value: "Reactor", labelKey: "processUnit.types.reactor" },
	{ value: "Clarifier", labelKey: "processUnit.types.clarifier" },
	{ value: "Pump Station", labelKey: "processUnit.types.pumpStation" },
	{ value: "Filter", labelKey: "processUnit.types.filter" },
	{ value: "Custom", labelKey: "processUnit.types.custom" },
] as const;

const processUnitStatusLabelKeys = {
	ACTIVE: "processUnit.status.options.active",
	INACTIVE: "processUnit.status.options.inactive",
	MAINTENANCE: "processUnit.status.options.maintenance",
} as const satisfies Record<ProcessUnit["status"], string>;

const processUnitIconOptions = [
	{ value: "Factory", labelKey: "processUnit.icons.factory", Icon: Factory },
	{ value: "Cylinder", labelKey: "processUnit.icons.tank", Icon: Cylinder },
	{ value: "Waves", labelKey: "processUnit.icons.waterProcess", Icon: Waves },
	{ value: "Gauge", labelKey: "processUnit.icons.meteredUnit", Icon: Gauge },
] as const satisfies readonly {
	value: string;
	labelKey: string;
	Icon: LucideIcon;
}[];

export function ProcessUnitStep() {
	const { t } = useTranslation("plantSetup");
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
					{t("processUnit.plantRequired")}
				</div>
			) : null}

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">{t("processUnit.name.label")}</Label>
					<Input
						id="name"
						onChange={onChange}
						placeholder={t("processUnit.name.placeholder")}
						required
						value={processUnitData.name}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="type">{t("processUnit.typeLabel")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="type"
						onChange={onChange}
						required
						value={processUnitData.type}
					>
						<option value="">{t("processUnit.typePlaceholder")}</option>
						{processUnitTypes.map(({ value, labelKey }) => (
							<option key={value} value={value}>
								{t(labelKey)}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">{t("processUnit.status.label")}</Label>
					<select
						className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
						id="status"
						onChange={onChange}
						value={processUnitData.status}
					>
						<option value="ACTIVE">
							{t("processUnit.status.options.active")}
						</option>
						<option value="INACTIVE">
							{t("processUnit.status.options.inactive")}
						</option>
						<option value="MAINTENANCE">
							{t("processUnit.status.options.maintenance")}
						</option>
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="icon">{t("processUnit.icon.label")}</Label>
					<Select onValueChange={onIconChange} value={processUnitData.icon}>
						<SelectTrigger className="w-full" id="icon">
							<SelectValue placeholder={t("processUnit.icon.placeholder")} />
						</SelectTrigger>
						<SelectContent>
							{processUnitIconOptions.map(({ value, labelKey, Icon }) => (
								<SelectItem key={value} value={value}>
									<Icon className="size-4" />
									{t(labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">
						{t("processUnit.description.label")}
					</Label>
					<Textarea
						id="description"
						onChange={onChange}
						placeholder={t("processUnit.description.placeholder")}
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
						{t("processUnit.add")}
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
	const { t } = useTranslation("plantSetup");

	if (processUnits.length === 0) {
		return (
			<div className="rounded-md border border-dashed border-line-subtle p-6 text-center text-sm text-brand-muted">
				{t("processUnit.empty")}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<Network className="size-4 text-brand-control" />
					{t("processUnit.saved")}
				</div>
				<span className="rounded-full bg-chip px-2.5 py-1 text-xs font-bold text-brand-control">
					{processUnits.length}
				</span>
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{processUnits.map((unit) => {
					const iconOption = processUnitIconOptions.find(
						(option) => option.value === unit.icon,
					);
					const UnitIcon = iconOption?.Icon ?? Factory;
					const typeOption = processUnitTypes.find(
						(option) => option.value === unit.type,
					);

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
											{typeOption ? t(typeOption.labelKey) : unit.type} &middot;{" "}
											{t(processUnitStatusLabelKeys[unit.status])}
										</p>
									</div>
								</div>
								<Button
									aria-label={t("processUnit.remove", { name: unit.name })}
									onClick={() => onRemove(unit.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
							<p className="mt-3 text-sm leading-5 text-brand-muted">
								{unit.description || t("processUnit.noDescription")}
							</p>
							<p className="mt-3 text-xs font-semibold text-brand-muted">
								{t("processUnit.connectionPorts", { count: unit.ports.length })}{" "}
								&middot;{" "}
								{t("processUnit.iconValue", {
									icon: iconOption ? t(iconOption.labelKey) : unit.icon,
								})}
							</p>
						</article>
					);
				})}
			</div>
		</div>
	);
}
