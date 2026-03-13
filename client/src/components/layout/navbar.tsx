import { Link } from "@tanstack/react-router";
import { Factory } from "lucide-react";
import { useTranslation } from "react-i18next";
import SelectLanguage from "@/components/layout/select-language";
import { Button } from "@/components/ui/button";

import useGetUser from "@/hooks/use-get-user";
import useSignOut from "@/hooks/use-sign-out";

const Navbar = () => {
	const { isAuthenticated, isLoading } = useGetUser();
	const { handleSignout, loading: isSigningOut } = useSignOut();
	const { t } = useTranslation();

	const logoLink = isAuthenticated ? "/dashboard" : "/";

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<Link to={logoLink}>
						<div className="rounded-md bg-primary/10 p-2 text-primary">
							<Factory aria-hidden="true" className="size-5" />
						</div>
					</Link>
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							{t("smartPlcControl")}
						</span>
						<h1 className="text-base font-semibold leading-tight text-foreground">
							{t("dashboard")}
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{isLoading ? null : isAuthenticated ? (
						<Button
							disabled={isSigningOut}
							onClick={handleSignout}
							size="sm"
							variant="secondary"
						>
							{isSigningOut ? t("signingOut") : t("signOut")}
						</Button>
					) : (
						<Button asChild size="sm" variant="default">
							<Link to="/sign-in">{t("signIn")}</Link>
						</Button>
					)}

					<SelectLanguage />
				</div>
			</div>
		</header>
	);
};

export default Navbar;
