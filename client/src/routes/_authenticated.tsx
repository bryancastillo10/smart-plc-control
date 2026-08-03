import {
	createFileRoute,
	isRedirect,
	Outlet,
	redirect,
} from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";
import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { useUserStore } from "@/store/user";
import {
	canAccessAuthenticatedPath,
	getAuthenticatedRedirectPath,
} from "@/utils/authRoutes";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		if (typeof window === "undefined") return;

		const store = useUserStore.getState();

		try {
			const user = store.user ?? toUserProfile(await currentUser());
			if (!store.user) store.setUser(user);

			if (!canAccessAuthenticatedPath(user, location.pathname)) {
				throw redirect({
					to: getAuthenticatedRedirectPath(user),
					replace: true,
				});
			}
		} catch (error) {
			if (isRedirect(error)) throw error;
			throw redirect({ to: "/", replace: true });
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
