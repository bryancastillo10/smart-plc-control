import type { LucideIcon } from "lucide-react";
import {
	BellRing,
	Building2,
	ChartNoAxesCombined,
	Gauge,
	Settings,
	SlidersHorizontal,
	Tags,
} from "lucide-react";

export type SidebarNavItem = {
	label: string;
	description: string;
	icon: LucideIcon;
	href: string;
};

export const navigationItems = [
	{
		label: "Plant Setup",
		description: "First-run access",
		icon: Building2,
		href: "/plant-setup",
	},
	{
		label: "Dashboard",
		description: "System overview",
		icon: ChartNoAxesCombined,
		href: "/dashboard",
	},
	{
		label: "PLC Control",
		description: "Live operations",
		icon: SlidersHorizontal,
		href: "/plc",
	},
	{
		label: "Equipment",
		description: "Devices and stations",
		icon: Gauge,
		href: "/equipment",
	},
	{
		label: "Tags",
		description: "Signals and readings",
		icon: Tags,
		href: "/tags",
	},
	{
		label: "Alarms",
		description: "Active events",
		icon: BellRing,
		href: "/alarms",
	},
	{
		label: "Settings",
		description: "System preferences",
		icon: Settings,
		href: "/settings",
	},
] as const satisfies readonly SidebarNavItem[];
