import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	appButtonVariants,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";
import type { UserRole } from "@/types/enum";

const currentUserRole: UserRole = "ADMIN";

export const Route = createFileRoute("/_authenticated/plant-setup")({
	component: PlantSetupPage,
});

function PlantSetupPage() {
	const canCreatePlant = currentUserRole === "ADMIN";

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>
					Plant Setup
				</h2>
				<p className={appTextVariants({ role: "helper" })}>
					First-run workspace for authenticated users when no plants exist yet.
					Admins can create the first plant; operators and viewers can request
					access from an administrator.
				</p>
			</section>

			{canCreatePlant ? <AdminPlantForm /> : <AccessRequestForm />}
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

function AccessRequestForm() {
	return (
		<section className={appSurfaceVariants({ variant: "card" })}>
			<div className="mb-5 space-y-2">
				<h3 className={appTextVariants({ role: "cardTitle" })}>
					Request Plant Access
				</h3>
				<p className={appTextVariants({ role: "helper" })}>
					Scaffold request flow for operators and viewers when no plant is
					available to their account.
				</p>
			</div>

			<form className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="request-reason">Reason for Access</Label>
					<Textarea
						id="request-reason"
						placeholder="Tell an administrator which plant, line, or operating area you need access to."
					/>
				</div>

				<div className="flex justify-end">
					<Button type="button" className={appButtonVariants({ size: "form" })}>
						Request Access
					</Button>
				</div>
			</form>
		</section>
	);
}
