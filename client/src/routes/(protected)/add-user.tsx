import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/add-user")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className=""><h1>Add User Page</h1></div>;
}
