import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { appLayout } from "@/styles/recipes";

type appLayoutProps = {
	children: ReactNode;
	pageTitle?: string;
	pageDescription?: string;
};

export function AppLayout({
	children,
	pageTitle = "Dashboard",
	pageDescription = "Monitor controls, equipment state, and operational activity.",
}: appLayoutProps) {
	return (
		<div className={appLayout.root}>
			<Sidebar />

			<div className={appLayout.contentColumn}>
				<header className={appLayout.navbar}>
					<div>
						<p className={appLayout.navbarKicker}>Smart PLC Control</p>
						<h1 className={appLayout.navbarTitle}>{pageTitle}</h1>
					</div>
					<p className={appLayout.navbarDescription}>{pageDescription}</p>
				</header>

				<main className={appLayout.main}>{children}</main>
			</div>
		</div>
	);
}
