import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Activity } from "lucide-react";
import type { StatusTone } from "@/types/plc";

const StatusBadge = ({tone}:{ tone: StatusTone}) => {
 if (tone === "live") {
		return (
			<Badge className="gap-1.5 border-emerald-400/30 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/15">
				<Wifi className="size-3" />
				Live stream
			</Badge>
		);
	}

	if (tone === "warning") {
		return (
			<Badge className="gap-1.5 border-amber-400/30 bg-amber-400/15 text-amber-100 hover:bg-amber-400/15">
				<WifiOff className="size-3" />
				Attention needed
			</Badge>
		);
	}

	return (
		<Badge className="gap-1.5 border-white/15 bg-white/10 text-slate-100 hover:bg-white/10">
			<Activity className="size-3" />
			Awaiting packets
		</Badge>
	);
}

export default StatusBadge
