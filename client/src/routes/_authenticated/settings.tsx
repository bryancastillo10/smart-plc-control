import { createFileRoute } from "@tanstack/react-router";
import { appSurfaceVariants, appTextVariants } from "@/styles/recipes";

const settingsSummarySections = [
	"Profile",
	"Role",
	"Language",
	"Session",
] as const;

const settingsWorkspaceSections = [
	"Personal Profile",
	"Account Identity",
	"Language Preference",
	"Password and Security",
	"Active Session",
	"Notification Preferences",
	"Role Capabilities",
	"Default Workspace View",
	"Audit Visibility",
	"Danger Zone",
] as const;

export const Route = createFileRoute("/_authenticated/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<div className="space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>Settings</h2>
				<p className={appTextVariants({ role: "helper" })}>
					Personal account and workspace preferences. Sections are intentionally
					general so available controls can change by role later.
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{settingsSummarySections.map((section) => (
					<div
						key={section}
						className={appSurfaceVariants({ variant: "card" })}
					>
						<h3 className={appTextVariants({ role: "cardTitle" })}>
							{section}
						</h3>
						<div className="mt-4 min-h-16 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
					</div>
				))}
			</section>

			<section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
				<div className="space-y-4">
					{settingsWorkspaceSections.slice(0, 5).map((section) => (
						<div
							key={section}
							className={appSurfaceVariants({ variant: "card" })}
						>
							<h3 className={appTextVariants({ role: "cardTitle" })}>
								{section}
							</h3>
							<div className="mt-4 min-h-28 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
						</div>
					))}
				</div>

				<div className="space-y-4">
					{settingsWorkspaceSections.slice(5).map((section) => (
						<div
							key={section}
							className={appSurfaceVariants({ variant: "card" })}
						>
							<h3 className={appTextVariants({ role: "cardTitle" })}>
								{section}
							</h3>
							<div className="mt-4 min-h-28 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
