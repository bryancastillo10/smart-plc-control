import LoginPage from "@/components/auth/LoginPage";
import { currentUser } from "@/features/auth/queries";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		let hasValidSession = false;

		try {
			await currentUser();
			hasValidSession = true;
		} catch {
			hasValidSession = false;
		}

		if (hasValidSession) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: HomePage,
});

function HomePage() {
	return <LoginPage />;
}
