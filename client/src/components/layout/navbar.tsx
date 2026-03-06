import { Link } from "@tanstack/react-router";
import { Factory } from "lucide-react";

import { Button } from "../ui/button";

const Navbar = () => {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<Link to="/">
					<div className="rounded-md bg-primary/10 p-2 text-primary">
						<Factory aria-hidden="true" className="size-5" />
					</div>
					</Link>
					<div className="flex flex-col">
						<span className="text-sm text-muted-foreground">
							Smart PLC Control
						</span>
						<h1 className="text-base font-semibold leading-tight text-foreground">
							Dashboard
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button asChild size="sm" variant="default">
						<Link to="/sign-in">Sign in</Link>
					</Button>				
				</div>
			</div>
		</header>
	);
};

export default Navbar;
