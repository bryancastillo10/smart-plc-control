import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import "@/lib/i18n/init";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "PLC Dashboard",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: RootNotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Navbar />
				{children}
				<Toaster />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function RootNotFound() {
	return (
		<main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-16 text-slate-100">
			<div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur">
				<p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
					404
				</p>
				<h1 className="mt-4 text-3xl font-semibold tracking-tight">
					Page not found
				</h1>
				<p className="mt-3 text-sm text-slate-300">
					The route you requested does not exist or is no longer available.
				</p>
				<div className="mt-6 flex justify-center">
					<Button asChild variant="secondary">
						<Link to="/">Back to dashboard</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
