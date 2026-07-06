import { appSurfaceVariants, appTextVariants } from "@/styles/recipes";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/no-plant-access")({
	component: NoPlantAccessPage,
});

function NoPlantAccessPage() {
	const { t } = useTranslation();

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>
					{t("noPlantAccess.title")}
				</h2>
				<p className={appTextVariants({ role: "helper" })}>
					{t("noPlantAccess.description")}
				</p>
			</section>

			<section className={appSurfaceVariants({ variant: "card" })}>
				<div className="flex items-start gap-4">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white/75 text-brand-control">
						<ShieldAlert className="size-5" aria-hidden="true" />
					</div>
					<div className="space-y-2">
						<h3 className={appTextVariants({ role: "cardTitle" })}>
							{t("noPlantAccess.cardTitle")}
						</h3>
						<p className={appTextVariants({ role: "helper" })}>
							{t("noPlantAccess.cardDescription")}
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
