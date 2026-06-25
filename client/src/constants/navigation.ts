import {
	BellRing,
	ChartNoAxesCombined,
	Gauge,
	Settings,
	SlidersHorizontal,
	Tags,

} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidebarNavItem = {
	label: string;
	description: string;
	icon: LucideIcon;
	href?: string;
	isActive?: boolean;
};

export const navigationItems: SidebarNavItem[] = [
	{
		label: "Dashboard",
		description: "System overview",
		icon: ChartNoAxesCombined,
		href: "/dashboard",
		isActive: true,
	},
	{
		label: "PLC Control",
		description: "Live operations",
		icon: SlidersHorizontal,
	},
	{
		label: "Equipment",
		description: "Devices and stations",
		icon: Gauge,
	},
	{
		label: "Tags",
		description: "Signals and readings",
		icon: Tags,
	},
	{
		label: "Alarms",
		description: "Active events",
		icon: BellRing,
	},
	{
		label: "Settings",
		description: "System preferences",
		icon: Settings,
	},
];