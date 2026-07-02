import { useMutation } from "@tanstack/react-query";

import { logout } from "@/features/auth/queries";
import { useToast } from "@/integrations/sonner";
import { useUserStore } from "@/store/user";

const logoutSuccessMessage = "Signed out successfully.";
const logoutErrorMessage = "Unable to sign out. Please try again.";

export function useLogout() {
	const toast = useToast();
	const clearUser = useUserStore((state) => state.clearUser);

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: (response) => {
			clearUser();
			toast.success(response.message || logoutSuccessMessage);
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
