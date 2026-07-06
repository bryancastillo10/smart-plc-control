import type { LucideIcon } from "lucide-react";
import {
	BellRing,
	Building2,
	ChartNoAxesCombined,
	Gauge,
	Settings,
	ShieldAlert,
	SlidersHorizontal,
	Tags,
} from "lucide-react";

export type SidebarNavItem = {
	labelKey: string;
	descriptionKey: string;
	icon: LucideIcon;
	href: string;
};

export const navigationItems = [
	{
		labelKey: "navigation.plantSetup.label",
		descriptionKey: "navigation.plantSetup.description",
		icon: Building2,
		href: "/plant-setup",
	},
	{
		labelKey: "navigation.noPlantAccess.label",
		descriptionKey: "navigation.noPlantAccess.description",
		icon: ShieldAlert,
		href: "/no-plant-access",
	},
	{
		labelKey: "navigation.dashboard.label",
		descriptionKey: "navigation.dashboard.description",
		icon: ChartNoAxesCombined,
		href: "/dashboard",
	},
	{
		labelKey: "navigation.plc.label",
		descriptionKey: "navigation.plc.description",
		icon: SlidersHorizontal,
		href: "/plc",
	},
	{
		labelKey: "navigation.equipment.label",
		descriptionKey: "navigation.equipment.description",
		icon: Gauge,
		href: "/equipment",
	},
	{
		labelKey: "navigation.tags.label",
		descriptionKey: "navigation.tags.description",
		icon: Tags,
		href: "/tags",
	},
	{
		labelKey: "navigation.alarms.label",
		descriptionKey: "navigation.alarms.description",
		icon: BellRing,
		href: "/alarms",
	},
	{
		labelKey: "navigation.settings.label",
		descriptionKey: "navigation.settings.description",
		icon: Settings,
		href: "/settings",
	},
] as const satisfies readonly SidebarNavItem[];
