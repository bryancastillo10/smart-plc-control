import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { logout } from "@/features/auth/queries";
import { useToast } from "@/integrations/sonner";
import { useUserStore } from "@/store/user";

const logoutSuccessMessage = "Signed out successfully.";
const logoutErrorMessage = "Unable to sign out. Please try again.";

export function useLogout() {
	const navigate = useNavigate();
	const toast = useToast();
	const clearUser = useUserStore((state) => state.clearUser);

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: async (response) => {
			clearUser();
			toast.success(response.message || logoutSuccessMessage);
			await navigate({ to: "/" });
		},
		onError: (error) => {
			toast.error(error, logoutErrorMessage);
		},
	});

	return {
		logout: logoutMutation.mutate,
		logoutAsync: logoutMutation.mutateAsync,
		logoutLoading: logoutMutation.isPending,
		logoutResponse: logoutMutation.data,
		logoutError: logoutMutation.error,
	};
}
