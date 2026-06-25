import { Link } from "@tanstack/react-router";


import { Activity, LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { appIconVariants, appSidebar } from "@/styles/recipes";
import { navigationItems, type SidebarNavItem } from "@/constants/navigation";


export function Sidebar() {
	return (
		<aside className={appSidebar.root}>
			<div className={appSidebar.brandBlock}>
				<div className={appSidebar.brandIcon}>
					<Activity className={appIconVariants({ tone: "inverse" })} />
				</div>
				<div className="min-w-0">
					<p className={appSidebar.brandTitle}>AD Monitoring</p>
					<p className={appSidebar.brandSubtitle}>PLC workspace</p>
				</div>
			</div>

			<nav className={appSidebar.nav} aria-label="Main navigation">
				{navigationItems.map((item) => (
					<SidebarNavItem key={item.label} item={item} />
				))}
			</nav>

			<div className={appSidebar.authPanel}>
				<div className={appSidebar.userRow}>
					<div className={appSidebar.userIcon}>
						<UserRound className={appIconVariants({ tone: "brand" })} />
					</div>
					<div className="min-w-0">
						<p className={appSidebar.userName}>Administrator</p>
						<p className={appSidebar.userMeta}>Authenticated session</p>
					</div>
				</div>
				<Button variant="outline" size="sm" className={appSidebar.logoutButton}>
					<LogOut className={appIconVariants({ tone: "muted" })} />
					Sign out
				</Button>
			</div>
		</aside>
	);
}

function SidebarNavItem({ item }: { item: SidebarNavItem }) {
	const Icon = item.icon;
	const content = (
		<>
			<Icon
				className={appIconVariants({ tone: item.isActive ? "brand" : "muted" })}
			/>
			<span className="min-w-0">
				<span className={appSidebar.navLabel}>{item.label}</span>
				<span className={appSidebar.navDescription}>{item.description}</span>
			</span>
		</>
	);

	if (!item.href) {
		return (
			<div
				className={appSidebar.navItem({ state: "disabled" })}
				aria-disabled="true"
			>
				{content}
			</div>
		);
	}

	return (
		<Link
			to={item.href}
			className={appSidebar.navItem({
				state: item.isActive ? "active" : "idle",
			})}
		>
			{content}
		</Link>
	);
}
