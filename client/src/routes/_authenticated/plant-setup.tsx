import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import {
	appButtonVariants,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/plant-setup")({
	component: PlantSetupPage,
});

function PlantSetupPage() {
	const { isAllowed } = useRoleGuard(["ADMIN"]);

	if (!isAllowed) {
		return null;
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>
					Plant Setup
				</h2>
				<p className={appTextVariants({ role: "helper" })}>
					First-run workspace for administrators when no plants exist yet.
					Create the first plant to unlock the rest of the authenticated workspace.
				</p>
			</section>

			<AdminPlantForm />
		</div>
	);
}

function AdminPlantForm() {
	return (
		<section className={appSurfaceVariants({ variant: "card" })}>
			<div className="mb-5 space-y-2">
				<h3 className={appTextVariants({ role: "cardTitle" })}>
					Create First Plant
				</h3>
				<p className={appTextVariants({ role: "helper" })}>
					Scaffold form for the Plants model: name, location, description, and
					initial status.
				</p>
			</div>

			<form className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="plant-name">Plant Name</Label>
					<Input id="plant-name" placeholder="Main Production Plant" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="plant-location">Location</Label>
					<Input id="plant-location" placeholder="Hsinchu, Taiwan" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="plant-status">Initial Status</Label>
					<Input id="plant-status" placeholder="ACTIVE" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="plant-owner">Plant Owner</Label>
					<Input id="plant-owner" placeholder="Administrator" />
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="plant-description">Description</Label>
					<Textarea
						id="plant-description"
						placeholder="Describe the plant scope, equipment area, or operating context."
					/>
				</div>

				<div className="flex justify-end md:col-span-2">
					<Button type="button" className={appButtonVariants({ size: "form" })}>
						Create Plant
					</Button>
				</div>
			</form>
		</section>
	);
}
