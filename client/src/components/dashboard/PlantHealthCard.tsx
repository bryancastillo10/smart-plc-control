import type { LucideIcon } from "lucide-react";

interface PlantHealthCardProps {
	detail: string;
	icon: LucideIcon;
	label: string;
	progress?: number;
	tone?: "brand" | "critical";
	total?: number;
	value: number;
};


const PlantHealthCard = ({detail,
	icon: Icon,
	label,
	progress,
	tone = "brand",
	total,
	value}: PlantHealthCardProps) => {
  return (
		<article className="feature-card rounded-lg border border-line-subtle p-4 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-kicker">
						{label}
					</p>
					<p className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
						{value}
						{total === undefined ? null : (
							<span className="ml-1 text-base font-semibold text-brand-muted">
								/ {total}
							</span>
						)}
					</p>
				</div>
				<div
					className={`flex size-10 shrink-0 items-center justify-center rounded-md ${
						tone === "critical"
							? "bg-destructive/10 text-destructive"
							: "bg-chip text-brand-control"
					}`}
				>
					<Icon aria-hidden="true" className="size-5" />
				</div>
			</div>

			{progress === undefined ? null : (
				<div
					aria-label={`${label}: ${progress}%`}
					aria-valuemax={100}
					aria-valuemin={0}
					aria-valuenow={progress}
					className="mt-4 h-1.5 overflow-hidden rounded-full bg-line-subtle"
					role="progressbar"
				>
					<div
						className="h-full rounded-full bg-brand-control"
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}

			<p className="mt-3 text-xs leading-5 text-brand-muted">{detail}</p>
		</article>
  )
}

export default PlantHealthCard;
