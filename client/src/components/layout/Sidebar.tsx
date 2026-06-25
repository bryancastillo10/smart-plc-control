import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems, type SidebarNavItem } from "@/constants/navigation";
import { appIconVariants, appSidebar } from "@/styles/recipes";

export function Sidebar() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

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
					<SidebarNavLink
						key={item.href}
						item={item}
						isActive={pathname === item.href}
					/>
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

function SidebarNavLink({
	item,
	isActive,
}: {
	item: SidebarNavItem;
	isActive: boolean;
}) {
	const Icon = item.icon;

	return (
		<Link
			to={item.href}
			className={appSidebar.navItem({ state: isActive ? "active" : "idle" })}
		>
			<Icon
				className={appIconVariants({ tone: isActive ? "brand" : "muted" })}
			/>
			<span className="min-w-0">
				<span className={appSidebar.navLabel}>{item.label}</span>
				<span className={appSidebar.navDescription}>{item.description}</span>
			</span>
		</Link>
	);
}
