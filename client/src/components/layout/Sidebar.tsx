import { Button } from "@/components/ui/button";
import { navigationItems, type SidebarNavItem } from "@/constants/navigation";
import { useLogout } from "@/features/auth/useLogout";
import { useUserStore } from "@/store/user";
import { appIconVariants, appSidebar } from "@/styles/recipes";
import { canAccessAuthenticatedPath } from "@/utils/authRoutes";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, LogOut, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Sidebar() {
	const { t } = useTranslation();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const user = useUserStore((state) => state.user);
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
					const isDisabled = user ? !canAccessAuthenticatedPath(user, item.href) : true;

					return (
						<SidebarNavLink
							key={item.href}
							item={item}
							label={t(item.labelKey)}
							description={t(item.descriptionKey)}
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
						<p className={appSidebar.userName}>{user?.userName ?? "User"}</p>
						<p className={appSidebar.userMeta}>{user?.role ?? "Authenticated session"}</p>
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
	label,
	description,
	isActive,
	isDisabled,
}: {
	item: SidebarNavItem;
	label: string;
	description: string;
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
				<span className={appSidebar.navLabel}>{label}</span>
				<span className={appSidebar.navDescription}>{description}</span>
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
