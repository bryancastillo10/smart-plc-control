import { createFileRoute } from "@tanstack/react-router";
import { appSurfaceVariants, appTextVariants } from "@/styles/recipes";

const tagSummarySections = [
	"Enabled Tags",
	"Writable Tags",
	"Stale Readings",
	"Bad Quality Readings",
] as const;

const tagWorkspaceSections = [
	"Tag Directory",
	"Tag Detail Settings",
	"Device and Process Unit Mapping",
	"Data Type and Unit Configuration",
	"Scan Interval Settings",
	"Value Range Limits",
	"Latest Readings",
	"Reading Quality Timeline",
	"Reading Source Breakdown",
	"Manual Value Entry",
] as const;

export const Route = createFileRoute("/_authenticated/tags")({
	component: TagsPage,
});

function TagsPage() {
	return (
		<div className="space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>Tags</h2>
				<p className={appTextVariants({ role: "helper" })}>
					Signal inventory and readings workspace for tag configuration, device
					mapping, scan intervals, value limits, reading quality, and manual
					entry.
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{tagSummarySections.map((section) => (
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
					{tagWorkspaceSections.slice(0, 5).map((section) => (
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
					{tagWorkspaceSections.slice(5).map((section) => (
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
