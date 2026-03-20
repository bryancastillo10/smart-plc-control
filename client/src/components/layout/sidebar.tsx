import { Link } from "@tanstack/react-router";
import Profile from "@/components/layout/profile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sidebarItems } from "@/constants/sidebar-items";

export default function Sidebar() {
	return (
		<aside className="flex w-full flex-col border-b border-border bg-card md:min-h-screen md:w-64 md:border-r md:border-b-0">
			<div>
				<div className="p-4">
					<h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
						Navigation
					</h2>
				</div>
				<Separator />
				<nav className="space-y-1 p-3">
					{sidebarItems.map((item) => (
						<Button
							key={item.to}
							asChild
							variant="ghost"
							className="w-full justify-start"
						>
							<Link
								to={item.to}
								activeProps={{
									className:
										"bg-accent text-accent-foreground hover:bg-accent/90 w-full justify-start",
								}}
							>
								<item.icon className="size-4" aria-hidden="true" />
								{item.label}
							</Link>
						</Button>
					))}
				</nav>
			</div>

			<div className="mt-auto p-3 pt-0">
				<Profile />
			</div>
		</aside>
	);
}
