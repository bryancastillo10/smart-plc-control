import type { LucideIcon } from "lucide-react";

interface InfoTileProps {
	icon: LucideIcon;
	title: string;
	text: string;
}


const InfoTile = ({icon: Icon,
	title,
	text,}: InfoTileProps) => {
 return (
		<div className="feature-card rounded-md border border-(--line) p-4">
			<div className="mb-3 flex size-9 items-center justify-center rounded-md bg-white/75 text-(--palm)">
				<Icon className="size-4" aria-hidden={true} />
			</div>
			<h3 className="mb-2 text-sm font-bold text-(--sea-ink)">
				{title}
			</h3>
			<p className="text-sm leading-6 text-(--sea-ink-soft)">{text}</p>
		</div>
	)
}

export default InfoTile;
