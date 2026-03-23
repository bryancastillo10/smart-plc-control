import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUserQueryOptions } from "@/hooks/use-get-user";

import HeroTitle from "@/components/home/hero-title";
import HeroPreview from "@/components/home/hero-preview";
import Features from "@/components/home/features";

export const Route = createFileRoute("/")({
	beforeLoad: async ({ context }) => {
		const authUser = await context.queryClient
			.ensureQueryData(getCurrentUserQueryOptions())
			.catch(() => null);

		if (authUser) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: App,
});

function App() {
	return (
		<main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br from-zinc-950 via-slate-900 to-cyan-950 text-slate-100">
			<div className="pointer-events-none absolute -left-36 top-10 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
			<div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />

			<section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
				<HeroTitle />
				<HeroPreview />
			</section>
			<Features />
		</main>
	);
}
