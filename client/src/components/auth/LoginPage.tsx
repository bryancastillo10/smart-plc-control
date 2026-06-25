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
import "@/integrations/i18n";
import {
	Activity,
	BadgeCheck,
	Building2,
	Globe2,
	LockKeyhole,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { i18nLanguageByApiLanguage, type Language } from "@/integrations/i18n";
import {
	appBadgeVariants,
	appButtonVariants,
	appControl,
	appFeedbackVariants,
	appIconVariants,
	homeLayout,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";
import InfoTile from "./InfoTile";

const API_BASE_PATH = "/api/v1";

const LoginPage = () => {
	const { i18n, t } = useTranslation();
	const [language, setLanguage] = useState<Language>("EN");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState<"error" | "success">("error");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		i18n.changeLanguage(i18nLanguageByApiLanguage[language]);
		if (typeof document !== "undefined") {
			document.documentElement.lang = language === "ZH-TW" ? "zh-TW" : "en";
		}
	}, [i18n, language]);

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!username.trim() || !password) {
			setMessageType("error");
			setMessage(t("required"));
			return;
		}

		setIsSubmitting(true);
		setMessage("");

		try {
			const response = await fetch(`${API_BASE_PATH}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept-Language": language,
				},
				body: JSON.stringify({
					username: username.trim(),
					password,
				}),
			});

			if (response.status === 404 || response.status === 405) {
				throw new Error("LOGIN_ENDPOINT_UNAVAILABLE");
			}

			const payload = await response.json().catch(() => null);

			if (!response.ok) {
				throw new Error(payload?.error ?? "LOGIN_FAILED");
			}

			setMessageType("success");
			setMessage(t("success"));
			setPassword("");
		} catch (error) {
			setMessageType("error");
			setMessage(
				error instanceof Error && error.message === "LOGIN_ENDPOINT_UNAVAILABLE"
					? t("unavailable")
					: t("failed"),
			);
		} finally {
			setIsSubmitting(false);
		}
	}

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
							<InfoTile
								icon={BadgeCheck}
								title={t("adminOnly")}
								text={t("notice")}
							/>
							<InfoTile
								icon={ShieldCheck}
								title={t("role")}
								text={t("roleText")}
							/>
							<InfoTile
								icon={Building2}
								title={t("control")}
								text={t("controlText")}
							/>
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
									<Label htmlFor="username">{t("username")}</Label>
									<div className={homeLayout.iconField}>
										<UserRound
											className={appIconVariants({
												tone: "muted",
												placement: "input",
											})}
											aria-hidden="true"
										/>
										<Input
											id="username"
											autoComplete="username"
											value={username}
											onChange={(event) => setUsername(event.target.value)}
											placeholder={t("usernamePlaceholder")}
											className={appControl.inputWithIcon}
										/>
									</div>
								</div>

								<div className={homeLayout.field}>
									<Label htmlFor="password">{t("password")}</Label>
									<div className={homeLayout.iconField}>
										<LockKeyhole
											className={appIconVariants({
												tone: "muted",
												placement: "input",
											})}
											aria-hidden="true"
										/>
										<Input
											id="password"
											type="password"
											autoComplete="current-password"
											value={password}
											onChange={(event) => setPassword(event.target.value)}
											placeholder={t("passwordPlaceholder")}
											className={appControl.inputWithIcon}
										/>
									</div>
								</div>

								<Button
									type="submit"
									size="lg"
									disabled={isSubmitting}
									className={appButtonVariants({ size: "form", width: "full" })}
								>
									<ShieldCheck className="size-4" aria-hidden="true" />
									{isSubmitting ? t("signingIn") : t("signIn")}
								</Button>

								{message ? (
									<p
										className={appFeedbackVariants({ tone: messageType })}
										role={messageType === "error" ? "alert" : "status"}
									>
										{message}
									</p>
								) : null}

								<p
									className={appTextVariants({
										role: "helper",
										align: "center",
									})}
								>
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
