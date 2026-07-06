import { Button } from "@/components/ui/button";
import { navigationItems, type SidebarNavItem } from "@/constants/navigation";
import { useLogout } from "@/features/auth/useLogout";
import { useUserStore } from "@/store/user";
import { appIconVariants, appSidebar } from "@/styles/recipes";
import { plantSetUpPath } from "@/utils/authRoutes";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, LogOut, UserRound } from "lucide-react";

export function Sidebar() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const hasOwnedPlant = useUserStore((state) => state.user?.hasOwnedPlant ?? false);
	const { logout, logoutLoading } = useLogout();

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
				{navigationItems.map((item) => {
					const isDisabled = !hasOwnedPlant && item.href !== plantSetUpPath;

					return (
						<SidebarNavLink
							key={item.href}
							item={item}
							isActive={pathname === item.href}
							isDisabled={isDisabled}
						/>
					);
				})}
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
				<Button
					variant="outline"
					size="sm"
					className={appSidebar.logoutButton}
					disabled={logoutLoading}
					onClick={() => logout()}
				>
					<LogOut className={appIconVariants({ tone: "muted" })} />
					{logoutLoading ? "Signing out..." : "Sign out"}
				</Button>
			</div>
		</aside>
	);
}

function SidebarNavLink({
	item,
	isActive,
	isDisabled,
}: {
	item: SidebarNavItem;
	isActive: boolean;
	isDisabled: boolean;
}) {
	const Icon = item.icon;
	const content = (
		<>
			<Icon
				className={appIconVariants({ tone: isActive ? "brand" : "muted" })}
			/>
			<span className="min-w-0">
				<span className={appSidebar.navLabel}>{item.label}</span>
				<span className={appSidebar.navDescription}>{item.description}</span>
			</span>
		</>
	);

	if (isDisabled) {
		return (
			<div
				aria-disabled="true"
				className={appSidebar.navItem({ state: "disabled" })}
				role="link"
			>
				{content}
			</div>
		);
	}

	return (
		<Link
			to={item.href}
			className={appSidebar.navItem({ state: isActive ? "active" : "idle" })}
		>
			{content}
		</Link>
	);
}
