import type { LucideIcon } from "lucide-react";
import {
	appIconVariants,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";

interface InfoTileProps {
	icon: LucideIcon;
	title: string;
	text: string;
}

const InfoTile = ({ icon: Icon, title, text }: InfoTileProps) => {
	return (
		<div className={appSurfaceVariants({ variant: "card" })}>
			<div className={appSurfaceVariants({ variant: "iconTile" })}>
				<Icon className={appIconVariants()} aria-hidden={true} />
			</div>
			<h3 className={appTextVariants({ role: "cardTitle", spacing: "tight" })}>
				{title}
			</h3>
			<p className={appTextVariants({ role: "body" })}>{text}</p>
		</div>
	);
};

export default InfoTile;
