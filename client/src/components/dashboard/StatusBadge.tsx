import { Activity, Wifi, WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import type { StatusTone } from "@/types/plc";

const StatusBadge = ({ tone }: { tone: StatusTone }) => {
	const { t } = useTranslation();

	if (tone === "live") {
		return (
			<Badge className="gap-1.5 border-emerald-400/30 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
				<Wifi className="size-3" />
				{t("dashboardStatusLive")}
			</Badge>
		);
	}

	if (tone === "warning") {
		return (
			<Badge className="gap-1.5 border-amber-400/30 bg-amber-400/15 text-amber-100 hover:bg-amber-400/15">
				<WifiOff className="size-3" />
				{t("dashboardStatusAttention")}
			</Badge>
		);
	}

	return (
		<Badge className="gap-1.5 border-white/15 bg-white/10 text-slate-100 hover:bg-white/10">
			<Activity className="size-3" />
			{t("dashboardStatusAwaiting")}
		</Badge>
	);
};

export default StatusBadge;
