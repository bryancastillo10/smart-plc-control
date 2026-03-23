import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
	accentClassName: string;
	description: string;
	icon: LucideIcon;
	label: string;
	value: string;
}

const MetricCard = ({accentClassName, description, icon: Icon, label, value}: MetricCardProps) => {
  return (
	<Card className="border-white/10 bg-slate-950/75 shadow-lg shadow-slate-950/10 backdrop-blur">
			<CardContent className="flex items-start justify-between gap-4 p-6">
				<div>
					<p className="text-xs font-medium tracking-[0.24em] text-slate-400 uppercase">
						{label}
					</p>
					<p className="mt-3 text-3xl font-semibold tracking-tight text-white">
						{value}
					</p>
					<p className="mt-2 text-sm text-slate-400">{description}</p>
				</div>
				<div
					className={`flex size-12 items-center justify-center rounded-2xl border border-white/10 ${accentClassName}`}
				>
					<Icon className="size-5" />
				</div>
			</CardContent>
		</Card>
  )
}

export default MetricCard;
