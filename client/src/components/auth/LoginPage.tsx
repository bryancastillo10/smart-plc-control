import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import useSignin from "@/features/auth/useSignin";
import "@/integrations/i18n";
import type { Language } from "@/types/enum";
import { cn } from "@/utils/utils";
import {
	Activity,
	BadgeCheck,
	Building2,
	Eye,
	EyeOff,
	Globe2,
	LockKeyhole,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	appBadgeVariants,
	appButtonVariants,
	appControl,
	appIconVariants,
	homeLayout,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";
import InfoTile from "./InfoTile";

const LoginPage = () => {
	const { t } = useTranslation();
	const {
		language,
		setLanguage,
		signInData,
		showPassword,
		onChange,
		handleRevealPassword,
		handleSubmit,
		signInLoading,
	} = useSignin();

	return (
		<main className={homeLayout.page}>
			<div className={homeLayout.viewport}>
				<section className={homeLayout.splitGrid}>
					<div className={homeLayout.primaryColumn}>
						<div className={homeLayout.stackLg}>
							<div className={appBadgeVariants()}>
								<Activity className="size-4" aria-hidden="true" />
								{t("kicker")}
							</div>
							<div className={homeLayout.stackMd}>
								<h1 className={appTextVariants({ role: "pageTitle" })}>
									{t("appName")}
								</h1>
								<p className={appTextVariants({ role: "subtitle" })}>
									{t("subtitle")}
								</p>
							</div>
						</div>

						<div className={homeLayout.responsiveGrid3}>
							<InfoTile icon={BadgeCheck} title={t("adminOnly")} text={t("notice")} />
							<InfoTile icon={ShieldCheck} title={t("role")} text={t("roleText")} />
							<InfoTile icon={Building2} title={t("control")} text={t("controlText")} />
						</div>

						<div className={appSurfaceVariants({ variant: "notice" })}>
							{t("processes")}
						</div>
					</div>

					<div className={homeLayout.secondaryColumn}>
						<div className={appSurfaceVariants({ variant: "panel" })}>
							<div className={homeLayout.headerRow}>
								<div>
									<p className="island-kicker mb-2">{t("language")}</p>
									<h2 className={appTextVariants({ role: "sectionTitle" })}>
										{t("title")}
									</h2>
								</div>
								<Select
									value={language}
									onValueChange={(value) => setLanguage(value as Language)}
								>
									<SelectTrigger
										aria-label={t("language")}
										className={appControl.selectCompact}
									>
										<Globe2 className="size-4" aria-hidden="true" />
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="EN">EN</SelectItem>
										<SelectItem value="ZH-TW">ZH-TW</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<form className={homeLayout.form} onSubmit={handleSubmit}>
								<div className={homeLayout.field}>
									<Label htmlFor="email">{t("email")}</Label>
									<div className={homeLayout.iconField}>
										<UserRound
											className={appIconVariants({ tone: "muted", placement: "input" })}
											aria-hidden="true"
										/>
										<Input
											id="email"
											type="email"
											autoComplete="email"
											value={signInData.email}
											onChange={onChange}
											placeholder={t("emailPlaceholder")}
											className={appControl.inputWithIcon}
										/>
									</div>
								</div>

								<div className={homeLayout.field}>
									<Label htmlFor="password">{t("password")}</Label>
									<div className={homeLayout.iconField}>
										<LockKeyhole
											className={appIconVariants({ tone: "muted", placement: "input" })}
											aria-hidden="true"
										/>
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											autoComplete="current-password"
											value={signInData.password}
											onChange={onChange}
											placeholder={t("passwordPlaceholder")}
											className={cn(appControl.inputWithIcon, "pr-11")}
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-brand-muted transition-colors hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
											aria-label={showPassword ? "Hide password" : "Show password"}
											aria-pressed={showPassword}
											onClick={handleRevealPassword}
										>
											{showPassword ? (
												<EyeOff className="size-4" aria-hidden="true" />
											) : (
												<Eye className="size-4" aria-hidden="true" />
											)}
										</button>
									</div>
								</div>

								<Button
									type="submit"
									size="lg"
									disabled={signInLoading}
									className={appButtonVariants({ size: "form", width: "full" })}
								>
									<ShieldCheck className="size-4" aria-hidden="true" />
									{signInLoading ? t("toast:auth.signIn.loading") : t("signIn")}
								</Button>

								<p className={appTextVariants({ role: "helper", align: "center" })}>
									{t("notice")}
								</p>
							</form>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};

export default LoginPage;


