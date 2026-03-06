import { useTranslation } from "react-i18next";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { featureList } from "@/constants/feature-list";

const Features = () => {
	const { t } = useTranslation();

	return (
		<section
			id="features"
			className="mx-auto w-full max-w-7xl px-6 pb-16 md:pb-24"
		>
			<div className="mb-8 space-y-2">
				<h2 className="font-primary text-3xl font-semibold tracking-tight text-slate-100">
					{t("featureSectionTitle")}
				</h2>
				<p className="text-slate-300">{t("featureSectionDescription")}</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{featureList.map((feature) => (
					<Card
						key={feature.titleKey}
						className="border-slate-200/15 bg-slate-900/55 backdrop-blur-sm"
					>
						<CardHeader className="gap-3">
							<div className="w-fit rounded-lg border border-cyan-200/30 bg-cyan-500/15 p-2 text-cyan-200">
								<feature.icon className="size-5" aria-hidden="true" />
							</div>
							<CardTitle className="text-base text-slate-100">
								{t(feature.titleKey)}
							</CardTitle>
							<CardDescription className="text-sm text-slate-300">
								{t(feature.descriptionKey)}
							</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</section>
	);
};

export default Features;
