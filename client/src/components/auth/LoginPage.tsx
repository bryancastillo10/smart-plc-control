import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import "@/integrations/i18n"
import InfoTile from "./InfoTile"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
	i18nLanguageByApiLanguage,
	type Language,
} from "@/integrations/i18n"

import {
	Activity,
	BadgeCheck,
	Building2,
	Globe2,
	LockKeyhole,
	ShieldCheck,
	UserRound,
} from "lucide-react"


import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx"


const API_BASE_PATH = "/api/v1"

const LoginPage = () => {
	const { i18n, t } = useTranslation()
	const [language, setLanguage] = useState<Language>("EN")
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [message, setMessage] = useState("")
	const [messageType, setMessageType] = useState<"error" | "success">(
		"error",
	)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		i18n.changeLanguage(i18nLanguageByApiLanguage[language])
		if (typeof document !== "undefined") {
			document.documentElement.lang = language === "ZH-TW" ? "zh-TW" : "en"
		}
	}, [i18n, language])

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault()

		if (!username.trim() || !password) {
			setMessageType("error")
			setMessage(t("required"))
			return
		}

		setIsSubmitting(true)
		setMessage("")

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
			})

			if (response.status === 404 || response.status === 405) {
				throw new Error("LOGIN_ENDPOINT_UNAVAILABLE")
			}

			const payload = await response.json().catch(() => null)

			if (!response.ok) {
				throw new Error(payload?.error ?? "LOGIN_FAILED")
			}


			setMessageType("success")
			setMessage(t("success"))
			setPassword("")
		} catch (error) {
			setMessageType("error")
			setMessage(
				error instanceof Error && error.message === "LOGIN_ENDPOINT_UNAVAILABLE"
					? t("unavailable")
					: t("failed"),
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen px-4 py-6 text-(--sea-ink) sm:px-6 lg:px-8">
			<div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center">
				<section className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
					<div className="order-2 space-y-6 lg:order-1">
						<div className="space-y-5">
							<div className="inline-flex items-center gap-2 rounded-md border border-(--chip-line) bg-(--chip-bg) px-3 py-2 text-sm font-semibold text-(--palm) shadow-sm">
								<Activity className="size-4" aria-hidden="true" />
								{t("kicker")}
							</div>
							<div className="space-y-4">
								<h1 className="display-title max-w-2xl text-5xl font-bold leading-[1.02] tracking-normal text-(--sea-ink) sm:text-6xl">
									{t("appName")}
								</h1>
								<p className="max-w-2xl text-lg leading-8 text-(--sea-ink-soft)">
									{t("subtitle")}
								</p>
							</div>
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
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

						<div className="rounded-md border border-(--line) bg-white/55 p-4 text-sm font-semibold text-(--sea-ink-soft) shadow-sm backdrop-blur">
							{t("processes")}
						</div>
					</div>

					<div className="order-1 lg:order-2">
						<div className="island-shell mx-auto w-full max-w-md rounded-lg p-6 sm:p-8">
							<div className="mb-7 flex items-start justify-between gap-4">
								<div>
									<p className="island-kicker mb-2">{t("language")}</p>
									<h2 className="text-2xl font-bold text-(--sea-ink)">
										{t("title")}
									</h2>
								</div>
								<Select
									value={language}
									onValueChange={(value) => setLanguage(value as Language)}
								>
									<SelectTrigger
										aria-label={t("language")}
										className="w-28 bg-white/70"
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

							<form className="space-y-5" onSubmit={handleSubmit}>
								<div className="space-y-2">
									<Label htmlFor="username">{t("username")}</Label>
									<div className="relative">
										<UserRound
											className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--sea-ink-soft)"
											aria-hidden="true"
										/>
										<Input
											id="username"
											autoComplete="username"
											value={username}
											onChange={(event) => setUsername(event.target.value)}
											placeholder={t("usernamePlaceholder")}
											className="h-11 bg-white/80 pl-10 text-(--sea-ink)"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password">{t("password")}</Label>
									<div className="relative">
										<LockKeyhole
											className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--sea-ink-soft)"
											aria-hidden="true"
										/>
										<Input
											id="password"
											type="password"
											autoComplete="current-password"
											value={password}
											onChange={(event) => setPassword(event.target.value)}
											placeholder={t("passwordPlaceholder")}
											className="h-11 bg-white/80 pl-10 text-(--sea-ink)"
										/>
									</div>
								</div>

								<Button
									type="submit"
									size="lg"
									disabled={isSubmitting}
									className="h-11 w-full bg-(--palm) text-white hover:bg-(--sea-ink)"
								>
									<ShieldCheck className="size-4" aria-hidden="true" />
									{isSubmitting ? t("signingIn") : t("signIn")}
								</Button>

								{message ? (
									<p
										className={
											messageType === "success"
												? "rounded-md border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
												: "rounded-md border border-red-500/25 bg-red-50 px-3 py-2 text-sm font-medium text-red-800"
										}
										role={messageType === "error" ? "alert" : "status"}
									>
										{message}
									</p>
								) : null}

								<p className="text-center text-sm leading-6 text-(--sea-ink-soft)">
									{t("notice")}
								</p>
							</form>
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}

export default LoginPage


