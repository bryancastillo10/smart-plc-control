import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeroTitle = () => {
	const { t } = useTranslation();

	return (
		<div className="space-y-6">
			<Badge variant="secondary" className="bg-white/10 text-slate-100">
				{t("heroBadge")}
			</Badge>
			<h1 className="font-['Avenir_Next','Segoe_UI',sans-serif] text-4xl font-semibold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
				{t("heroTitle")}
			</h1>
			<p className="max-w-xl text-lg text-slate-300">{t("heroDescription")}</p>
			<div className="flex flex-wrap gap-3">
				<Button asChild size="lg">
					<Link to="/sign-in">{t("heroLaunchDashboard")}</Link>
				</Button>
				<Button
					asChild
					size="lg"
					variant="outline"
					className="border-slate-200/30 bg-white/5 text-slate-100 hover:bg-white/15"
				>
					<a href="#features">{t("heroExploreFeatures")}</a>
				</Button>
			</div>
		</div>
	);
};

export default HeroTitle;
