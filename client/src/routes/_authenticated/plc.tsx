import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/plc")({
	component: PlcPage,
});

function PlcPage() {
	return <div>PLC Control</div>;
}
