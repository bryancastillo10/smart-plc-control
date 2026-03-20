import { createFileRoute } from "@tanstack/react-router";
import useGetUser from "@/hooks/use-get-user";

export const Route = createFileRoute("/(protected)/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { authUser } = useGetUser();

	return (
		<div>
			<h1>Dashboard Page</h1>
			<p>Welcome {authUser?.email} </p>
		</div>
	);
}
