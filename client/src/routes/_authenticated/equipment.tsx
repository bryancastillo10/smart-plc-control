import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/equipment")({
	component: EquipmentPage,
});

function EquipmentPage() {
	return <div>Equipment</div>;
}
