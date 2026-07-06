import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { useUserStore } from "@/store/user";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function useAuthenticatedRouteGuard() {
	const navigate = useNavigate();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const store = useUserStore.getState();

		async function verifyAuthenticatedUser() {
			try {
				const user = await currentUser();

				if (!isMounted) {
					return;
				}

				store.setUser(toUserProfile(user));
				setIsCheckingAuth(false);
			} catch {
				store.clearUser();

				if (isMounted) {
					void navigate({ to: "/", replace: true });
				}
			}
		}

		void verifyAuthenticatedUser();

		return () => {
			isMounted = false;
		};
	}, [navigate]);

	return { isCheckingAuth };
}