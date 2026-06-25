import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/alarms")({
	component: AlarmsPage,
});

function AlarmsPage() {
	return <div>Alarms</div>;
}
